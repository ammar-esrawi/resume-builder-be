
//includes 
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient
const config = require("./config");
//init the app
app.use(bodyParser.urlencoded({ extended: true }))


var db

MongoClient.connect(config.mongoURI, (err, client) => {
    if (err) return console.log(err)
    db = client.db(config.mongoDB) // whatever your database name is
    app.listen(config.serverPort, () => {
        console.log('Express Js Started on port: ' + config.serverPort)
    })
})

//add routes 
app.get('/', (req, res) => {
    var cursor = db.collection('profiles').find().toArray(function (err, results) {
        res.json(results)

    })
})
app.get('/:login', (req, res) => {
    var cursor = db.collection('profiles').find(
        { login: req.params.login }
    )

        .toArray(function (err, results) {
            res.json(results)

        })
})

app.post('/profiles', (req, res) => {
    db.collection('profiles').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('saved to database')
        res.redirect('/')
    })
})