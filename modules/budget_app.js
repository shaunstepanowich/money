const express = require('express');
const csvLoader = require('./csv_loader.js');
const typeProcessor = require('./type_processor.js');
const vendorProcessor = require('./vendor_processor.js');
const BudgetProcessor = require('./budget_processor.js');

var app = express();

module.exports = app;


app.on('mount', parent => {
    app.locals.db = parent.locals.db;
});

app.get('/',function(req,res){

    app.locals.db.collection('budgets').find().toArray(function (err, result) {
        if (err) throw err

        res.send(result);
    });

});

app.put('/new',function(req,res){

    var newBudget = {
        name : req.body.name,
        amount: req.body.amount
    };

    app.locals.db.collection('budgets').insertOne(newBudget).then (result => {
        res.send({win:true});
    });

});

app.get('/report', function (req, res) {
  
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
