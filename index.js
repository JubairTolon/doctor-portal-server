//steps-1
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//steps-2
//from database > connect > connect your application > click checkbox > from that code

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.gbrle.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


/* 
******steps-3 connecton*******

From MongoDB Node Drive > usage example > find operaion > find muliple document code

    1. Make run function with async await.
    2. Call run from end of the function like that.
    3. Make try catch finally.
    4. await client.connect();
    5. Make collection - const serviceCollection = client.db('doctor-portal').collection('services');
    6. Make '/service' API
        {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        }
*/

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('doctor-portal').collection('services');

        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
    }
    finally { }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello from Doctor Portal')
})

app.listen(port, () => {
    console.log(`Doctor's App listening on port ${port}`)
})