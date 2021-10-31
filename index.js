const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000 ;

// Middleware 
app.use(cors());
app.use(express.json());

// MongoDB Connection 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h80zj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.get('/', (req, res)=>{
    res.send('Travels Server Is Running')
})


async function run (){
    try{
        await client.connect();
        console.log('DB connected Successfully');
        const database = client.db('booking');
        const packageCollection = database.collection('packages')
        const bookingCollection = database.collection('bookings')


        // GET Packages Data API 
        app.get('/packages', async(req, res)=>{
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        })


        // GET Bookings Data API 
        app.get('/bookings', async(req, res)=>{
            const cursor = bookingCollection.find({});
            const bookings = await cursor.toArray();
            res.send(bookings);
        })

         // Data Insert With POST  API for booking

         app.post('/bookings', async(req, res)=>{
            const newBooking = req.body;
            const result = await bookingCollection.insertOne(newBooking);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            console.log(result); 
            console.log(req.body);
            res.json(result);
  
          })

          // Data Insert With POST  API for Add Package

         app.post('/packages', async(req, res)=>{
            const newPackage = req.body;
            const result = await packageCollection.insertOne(newPackage);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            console.log(result); 
            console.log(req.body);
            res.json(result);
  
          })

          // DELETE API 

        app.delete('/bookings/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await bookingCollection.deleteOne(query);
            res.json(result);
          })
    }
    finally{
        // await client.close(); 
    }
}
run().catch(console.dir)


app.listen(port, ()=>{
    console.log('Server Is Running at Port', port);
})