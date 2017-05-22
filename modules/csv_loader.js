const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');
const moment = require('moment');

module.exports = { 

    loadFromDirectory : function (dir) {

        var results = [];
        var waitAll = [];

        return new Promise( (resolve, reject) => {

            fs.readdir(dir, {}, (err, files) => {

                files.forEach(file => {
                
                    var filePath = path.join(dir,file);

                    waitAll.push(_getItemsFromCsv(filePath).then(items => {
                        results = results.concat(items);
                    }));

                });

                Promise.all(waitAll).then(() => {
                    resolve(results);
                },
                err => {
                    reject(err);
                });
                
            });
        });
    }

};


function _createRecordFromCsvRow(csvRow)
{
    if (!csvRow.credit) csvRow.credit = 0;
    if (!csvRow.debit) csvRow.debit = 0;
    
    return {
        accountName : 'unknown',
        createdOn : moment(csvRow.createdOn),
        note : csvRow.note,
        debit : parseFloat(csvRow.debit),
        credit : parseFloat(csvRow.credit)
    };
}


function _getItemsFromCsv(filePath)
{
    var results = [];

    return new Promise( function(resolve, reject) {

        csv({
            ignoreEmpty : true,
            trim: true,
            noheader: true,
            headers: ['createdOn','note','debit','credit']}
        )
        .fromFile(filePath)
        .on('json',(jsonObj)=>{

            if (jsonObj.note === undefined) return;

            results.push(_createRecordFromCsvRow(jsonObj));

        })
        .on('done',(error)=>{
        
            if (error){
                reject(error);
                return;
            }

            resolve(results);
        })        

     });
}