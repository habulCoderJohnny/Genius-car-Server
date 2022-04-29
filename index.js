//const packageName = require('packageName');
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
require('dotenv').config();

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//verify token function 
function verifyJWT(req,res,next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        return res.status(401).send({message:'unauthorized Access!'});
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(error, decoded)=>{
        if (error) {
            return res.status(403).send({message: 'Forbidden Access!!'});
        }
        console.log('decoded:', decoded);
        req.decoded = decoded;
    })
    // console.log('inside verifyJWT:', authHeader);
    next();
    
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oxx0c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db("GeniusCar").collection("Service");
        const orderCollection = client.db("GeniusCar").collection("order");
        
        //AUTH related
        //json web token Issue
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            res.send({ accessToken });
        })


        //Services API
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        //FIND ONE (id) 
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        //POST/ INSERT ONE (form) 
        app.post('/service', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        });

        //DELETE a USER
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        });

        //ORDER COLLECTION API | post data from client
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })
        //Get individual user data from Db of client Order data based on email 
        app.get('/order', verifyJWT, async (req, res) => {
            const decodedEmail = req.decoded.email;
            const email = req.query.email;
            //console.log(email);
            if (email ===decodedEmail) {
                const query = { email: email };
                const cursor = orderCollection.find(query);
                const orders = await cursor.toArray();
                res.send(orders);
                
            }
            else{
                res.status(403).send({message:'Forbidden Access'})
            }

        })

    }
    finally {

    }
}

run().catch(console.dir);
console.log('GENIUS DB now CONNECTED');

//log 
app.get('/', (req, res) => {
    res.send('Running genius server...');
});
//log 
app.listen(port, () => {
    console.log('Backend Listening.....port', port);
})