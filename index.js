const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Brand shop server is running...");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tklaef2.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();
    const database = client.db("brandShopDB");
    const brandCollection = database.collection("brands");
    const productsCollection = database.collection("products");
    const cartCollection = database.collection("cart");
    const adCollection = database.collection("ads");
    const offersCollection = database.collection("offers");

    app.get("/brands", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/products/:brand", async (req, res) => {
      const brand = req.params.brand;
      const filter = { brand: brand };
      const cursor = productsCollection.find(filter);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const cursor = productsCollection.find(filter);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/cart/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const cursor = cartCollection.find(filter);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/ads", async (req, res) => {
      const cursor = adCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/offers", async (req, res) => {
      const cursor = offersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const product = req.body;
      const productNew = {
        name: product.name,
        brand: product.brand,
        price: product.price * 1,
        type: product.type,
        rating: product.rating * 1,
        photo: product.photo,
        description: product.description,
      };
      const result = await productsCollection.insertOne(productNew);
      res.send(result);
    });
    app.post("/cart", async (req, res) => {
      const product = req.body;
      const result = await cartCollection.insertOne(product);
      res.send(result);
    });
    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const product = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = {
        $set: {
          name: product.name,
          brand: product.brand,
          price: product.price * 1,
          type: product.type,
          rating: product.rating * 1,
          photo: product.photo,
          description: product.description,
        },
      };
      const result = await productsCollection.updateOne(
        filter,
        updatedProduct,
        options
      );
      res.send(result);
    });

    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

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
  console.log(`Brand shop server is running on port: ${port}`);
});
