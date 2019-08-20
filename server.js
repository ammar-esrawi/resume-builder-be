
//includes 
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient
const config = require("./config");
//init the app
app.use(bodyParser.urlencoded({ extended: true }))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

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

app.get('/avatar/:login', (req, res,next) => {
    var options = {
        root: __dirname+ '/public',
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
        }
      }
      var fileName="/assets/avatar/" + req.params.login + ".png";
    res.sendFile(
        fileName,
        options,
        function (err) {
            if (err) {
              next(err)
            } else {
              console.log('Sent:',fileName)
            }
          }
    );


})
app.get('/:login', (req, res) => {
    var cursor = db.collection('profiles').find(
        { login: req.params.login }
    )

        .toArray(function (err, results) {
            if (results.length > 0) {
                res.json(results[0])
            } else {
                res.json({
                    notfound: "Not Found!!"
                })
            }


        })
})
