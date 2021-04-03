const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId; 
require('dotenv').config()
const dbName = process.env.DB_NAME
const port = 5000;

app.use(cors())
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kzwlr.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(error => {
  const collection = client.db(dbName).collection("books");
  app.post('/addBook', (req, res) => {
      const newBook = req.body;
      console.log(newBook)
      collection.insertOne(newBook)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })
  app.get('/getBooks', (req, res) => {
    collection.find()
    .toArray((err, books) => {
        res.send(books)
        })
    })

  app.get('/checkout/:id', (req, res) => {
    collection.find({"_id":ObjectId(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents[0])
    })
  });
  app.delete('/deleteBook/:id', (req, res) => {
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => res.send(result.deletedCount > 0))
  })
})




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)