const csvLoader = require('./modules/csv_loader.js');
const typeProcessor = require('./modules/type_processor.js');
const vendorProcessor = require('./modules/vendor_processor.js');
const BudgetProcessor = require('./modules/budget_processor.js');
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;



var app = express();
app.use(bodyParser.json())



MongoClient.connect('mongodb://localhost:27017/money', function (err, db) {

    if (err) throw err

    app.locals.db = db;
    app.listen(8080, function () {
        console.log('Example app listening on port 3000!');
    });

});


app.get('/records/import',function(req,res){

    res.send("bla");

});

app.get('/budgets',function(req,res){

    app.locals.db.collection('budgets').find().toArray(function (err, result) {
        if (err) throw err

        res.send(result);
    });

});

app.put('/budgets/new',function(req,res){

    var newBudget = {
        name : req.body.name,
        amount: req.body.amount
    };

    app.locals.db.collection('budgets').insertOne(newBudget).then (result => {
        res.send({win:true});
    });

});


app.get('/', function (req, res) {
  

csvLoader.loadFromDirectory('../money_data').then(items => {

    var budgetProcessor = new BudgetProcessor(app.locals.db);
    
    console.log('csv items: ' + items.length);


    items.forEach(transaction => {

        typeProcessor.processItem(transaction);
        vendorProcessor.processItem(transaction);
        budgetProcessor.processItem(transaction);

        if (transaction.vendor == "unknown")
        {
            console.log(transaction);
        }

    });

    budgetProcessor.report(items).then(budgetReport => {
        res.send(budgetReport);
    });
    

});



})




