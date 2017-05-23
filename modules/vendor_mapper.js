module.exports = function(db) {

    this.db = db;

    this.getAll = function() {

        return new Promise( (resolve, reject) => {

            this.db.collection('vendors').find().toArray(function (err, result) {
                resolve(result);
            });

        });

    };

};