const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;


const budgetApp = require('./modules/budget_app.js');

var app = express();
app.use(bodyParser.json())


MongoClient.connect('mongodb://localhost:27017/money', function (err, db) {

    if (err) throw err

    app.locals.db = db;
    app.use('/budgets',budgetApp);

    app.listen(8080, function () {
        console.log('Example app listening on port 3000!');
    });

});


app.get('/records/import',function(req,res){

    res.send("bla");

});