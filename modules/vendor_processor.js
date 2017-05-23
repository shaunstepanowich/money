
module.exports = function(db) {

    this.db = db;
    
    this.processItems = function(items) {

        return new Promise( (resolve, reject) => {

            _loadVendors(this.db).then(vendors => {

                items.forEach(item => {
                    _processItem(vendors, item);
                });

                resolve(items);
                
            });

        });

    };

};

function _processItem(vendors, item)
{
    item.vendorId = null;

    _bank(item);
    _vendorTags(vendors, item);            
}

function _loadVendors(db) {
    return new Promise( (resolve, reject) => {
        db.collection('vendors').find().toArray(function (err, vendors) {
            resolve(vendors);
        });
    });
}

function _bank(item)
{
    if (item.vendorId !== null) return;

    if (item.type === "transfer") {
        item.vendorId = "59227aa6cb3c1831b2f2edf1";
    }

}

function _vendorTags(vendors, item)
{
    if (item.vendorId !== null) return;

    vendors.forEach(vendor => {

        vendor.tags.forEach(tag => {

            if (item.note.includes(tag)){
                item.vendorId = vendor._id;
            }    

        });
    });

}