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
        const bookingCollection = client.db('doctor-portal').collection('bookings');


        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });


        //warning.....
        // this the not the proper way to query
        //After learning more about mongoDB, use aggrigate lookup, pipeline, match, group

        app.get('/available', async (req, res) => {
            const date = req.query.date;

            //step 1: get all services
            const services = await serviceCollection.find().toArray();

            //step 2: get the booking of that day
            const query = { date: date };
            const bookings = await bookingCollection.find(query).toArray();

            //stpe 3: for each service, find booking slots for that service
            services.forEach(service => {
                const serviceBookings = bookings.filter(book => book.treatement === service.name);
                const bookedSlots = serviceBookings.map(book => book.slot);
                const available = service.slots.filter(slot => !bookedSlots.includes(slot));
                service.slots = available;
            });

            res.send(services);

        })

        /* 
            * Api naming convention
            * app.get('/booking') // get all bookkings in this collection. or get more than one or by filter
            * app.get('/booking:id') //got a specific booking
            * app.post('/booking') // add a new booking
            * app.patch('/booking:id') // update a specific booking
            * app.delete('/booking:id') // delete a specific booking
        */

        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const query = { treatement: booking.treatement, date: booking.date, patient: booking.patient };
            const exists = await bookingCollection.findOne(query);
            if (exists) {
                return res.send({ success: false, booking: exists })
            }
            const result = await bookingCollection.insertOne(booking);
            return res.send({ success: true, result });
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