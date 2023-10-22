const express = require('express')
const app = express()
const port = 3000
// dotenv
require('dotenv').config()
// middle ware
const cors=require('cors')
app.use(cors())
app.use(express.json())

console.log();
console.log();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Mongo db

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.BUCKET_USER}:${process.env.BUCKET_KEY}@cluster0.krvg7ix.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})