const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
app.use(cors());
app.use(express.json())
const port = process.env.PORT || 5000

const client = new MongoClient(process.env.MONGODV_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const database = client.db("BuySell");
        const ProductColllection = database.collection("Product");

        app.post("/product", async (req, res) => {
            const data = req.body;
            const result = await ProductColllection.insertOne(data);
            res.send(result)
        });
        app.get("/product", async (req, res) => {
            const result = await ProductColllection.find().toArray();
            res.send(result)
        })
        app.get("/product/:id", async (req, res) => {
            const { id } = req.params;
            const product = await ProductColllection.findOne({ _id: new ObjectId(id) });

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.json(product);
        });

        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
