const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000

//Middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ack9d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("talukder-tour-travel");
        const packageCollection = database.collection("packages");
        const registeredTouristCollection = database.collection("registeredTourist");
        console.log("Database connected");

        //add package / insert data from add-package page
        app.post('/add-package', async (req, res) => {
            const newPackage = req.body;
            console.log(newPackage);
            const result = await packageCollection.insertOne(newPackage);
            res.json(result);
        })
        //Adding newRegistered Tourist for a package
        app.post('/registered-tourist', async (req, res) => {
            const registeredTourist = req.body;
            const result = await registeredTouristCollection.insertOne(registeredTourist)
            res.json(result);
        })

        //Get data from Database and render in Web app
        app.get('/packages', async (req, res) => {
            const allPackage = packageCollection.find({})
            const result = await allPackage.toArray()
            res.send(result);
        })
        //Get data from database finding by id
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await packageCollection.findOne(query);
            res.send(result)
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Talukder tour and Travel Server running')
})

app.listen(port, () => {
    console.log("Strating Port", port)
})