const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.sc93kvm.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run () {
    try {
        const serviceCollection = client.db('ruhiFitnessDB').collection('services');
        const reviewCollection = client.db('ruhiFitnessDB').collection('reviews');
    // read data from db for home (3 services)
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.sort({'_id':-1}).limit(3).toArray();
            res.send(services);
        });
    // read data from db for all services 
        app.get('/allservices', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.sort({'_id':-1}).toArray();
            res.send(services);
        });
        // read particular data from db 
        app.get("/services/:id", async(req,res) =>{
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service)
        })
        //add a service to db
        app.post('/addService', async(req,res) =>{
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result)
        })
        //add a review to db
        app.post('/addReview', async(req,res) =>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result)
        })
        // read review from db  
        app.get('/reviews', async (req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });
    }
    finally {}
}
run().catch(err =>console.log(err))

app.get('/', (req, res) => {
    res.send('Ruhi fitness care server is running')
})

app.listen(port, () => {
    console.log(`Ruhi fitness care server running on ${port}`);
})