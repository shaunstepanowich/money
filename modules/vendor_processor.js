const vendors = require('../../money_data/vendors.json');

module.exports = {

    processItem : function(item) {

        item.vendor = "unknown";

        _bank(item);
        _vendorTags(item);

    }


};


function _bank(item)
{
    if (item.vendor !== "unknown") return;

    if (item.type === "transfer") {
        item.vendor = "cibc";
    }

}

function _vendorTags(item)
{
    if (item.vendor !== "unknown") return;

    vendors.forEach(vendor => {

        vendor.tags.forEach(tag => {

            if (item.note.includes(tag)){
                item.vendor = vendor.id;
            }    

        });
    });

}