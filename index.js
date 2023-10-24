const express = require("express");
const app = express();
const port = 3000;
// dotenv
require("dotenv").config();
// middle ware
const cors = require("cors");
app.use(cors());
app.use(express.json());

console.log();
console.log();

app.get("/", (req, res) => {
  res.send("Hello Car wo!");
});

// Mongo db

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.BUCKET_USER}:${process.env.BUCKET_KEY}@cluster0.krvg7ix.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // create db
    const serviceDatabase = client.db("carWo--service").collection("service");
    const bookingDatabase = client.db("carWo--service").collection("booking");
    // ----service---
    app.get("/service", async (req, res) => {
      const cursor = serviceDatabase.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // ----service id----
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = {
        projection: { title: 1, price: 1, service_id: 1, img: 1 },
      };
      const result = await serviceDatabase.findOne(query, options);
      res.send(result);
    });
    // ----booking----
    app.post("/booking", async (req, res) => {
      const booking = req.body;
      console.log("the booking =>", booking);
      const result = await bookingDatabase.insertOne(booking);
      console.log("the result =>", result);
      res.send(result);
    });
    app.get("/booking", async (req, res) => {
      console.log("the query", req.query);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const cursor = bookingDatabase.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete('/booking/:id',async(req,res)=>{
      const id=req.body.id
      const query={id: new ObjectId(id)}
      const result= await bookingDatabase.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
