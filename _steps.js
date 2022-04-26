/* 1. create folder using (mkdir)
2.npm init -y > npm i express/cors/mongodb/dotenv
4.create index.js file

---for secure---
4.1 .create .env file in main root and make sure added .gitgnore also add in index.js [ require('dotenv').config(); ]

5. --FOR NODEMON--
globally install done 1st day.
include in package.json
  "scripts": {
  "start": "node index.js",
  "start-dev": "nodemon index.js",}
include in index.js
app.listen(port,()=>{
    console.log('Listening.....port', port );
})

5.for project start in cmd (npm run start-dev)

----node server creation done---- step of store of data

#create db & collection in Atlas cluster 
--Connect to DBase--
Database Deployments>connect > click Connect to application
you can insert ur data/doc

---CRUD operation----
1.node mongodb Crud > fundamentals
2. for example get 
go to node mongodb Crud > fundamentals then
go find operation (load data) & added dotenv



 */




