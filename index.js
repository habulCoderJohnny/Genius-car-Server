// const packageName = require('packageName');
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();
//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oxx0c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();
        const serviceCollection = client.db("GeniusCar").collection("Service");

       app.get('/service', async(req,res)=>{
        const query = {};
        const cursor =serviceCollection.find(query);
        const services = await cursor.toArray();
        res.send(services);
       });

     //FIND ONE (id) 
       app.get('/service/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const service = await serviceCollection.findOne(query);
        res.send(service);
       });

       //POST/ INSERT ONE (form) 
       app.post('/service', async(req,res)=>{
        const newService = req.body;
        const result = serviceCollection.insertOne(newService);
        res.send(result);
       });

       //DELETE a USER
       app.delete('/service/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await userCollection.deleteOne(query);
        res.send(result);
    });
       
    }
    finally{

    }
}

run().catch(console.dir);
console.log('GENIUS DB now CONNECTED');

//log 
app.get('/', (req,res)=>{
    res.send('Running genius server...');
});
//log 
app.listen(port,()=>{
    console.log('johnny Listening.....port', port );
})