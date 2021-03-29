const express = require('express')
const app = express()
const port = process.env.PORT ||4300 
const cors = require('cors')
require('dotenv').config()
//mongodb connection
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: false}));
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@amazonwebcluster.i5q99.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
const productsCollection = client.db(`${process.env.DB_Name}`).collection("Amazonwebdata");

  //other

const ordersCollection = client.db(`${process.env.DB_Name}`).collection("productdata");
 
app.post("/addProduct",(req,res) => {
const product =req.body;


productsCollection.insertOne(product)
.then(result=>{
res.send(result.insertedCount)
});
});

app.get('/products' ,(req,res) => {
  productsCollection.find({})
  .toArray((err,docs)=>{
    res.send(docs)
  })
})
  
app.get('/product/:key' ,(req,res) => {
  productsCollection.find({key: req.params.key})
  .toArray((err,docs)=>{
    res.send(docs[0])
  })
});

app.post('/productsByKeys',(req,res) => {
  const productKeys=req.body;
  productsCollection.find({key: {$in:productKeys}})
  .toArray((err,docs) => {
    res.send(docs);
  })
})
//other methods
app.post("/addOrder",(req,res) => {
  const order =req.body;
  console.log(order);
ordersCollection.insertOne(order)
  .then(result=>{
  res.send(result.insertedCount >0)
  })
  })



});


//mongodb closed
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`${port}`,'server connected')
})