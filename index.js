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
        const UserCollection = database.collection("User");

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

        app.post("/user", async (req, res) => {
            const { email, password, name } = req.body;
            const User = { email, password, name };
            console.log(email, password, name)
            try {
                const existingUser = await UserCollection.findOne({ email });
                console.log(existingUser)
                if (existingUser) {
                    return res.status(200).send({ message: "user already register", inserted: false });
                }
                const result = await UserCollection.insertOne(User);
                res.status(200).send(result)
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        app.get("/user", async (req, res) => {
            const email = req.query.email;
            console.log(email)
            try {
                const premiumUser = await UserCollection.findOne({ email })
                res.status(200).send(premiumUser);
            } catch (error) {
                console.error("Error fetching users:", error);
                res.status(500).send("Failed to get users");
            }
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
