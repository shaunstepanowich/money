const express = require('express');
const ObjectID = require('mongodb').ObjectID;

var app = express();

module.exports = app;

app.on('mount', parent => {
    app.locals.db = parent.locals.db;
});

app.get('/',function(req,res){

    app.locals.db.collection('vendors').find().toArray(function (err, result) {
        if (err) throw err

        res.send(result);
    });

});

app.put('/new',function(req,res){

    var newItem = {
        name : req.body.name,
        defaultBudgetId : null,
        tags: req.body.tags
    };

    if (req.body.defaultBudgetId !== null) {
        newItem.defaultBudgetId  = new ObjectID(req.body.defaultBudgetId);
    }
    

    app.locals.db.collection('vendors').insertOne(newItem).then (result => {
        res.send(result);
    });

});