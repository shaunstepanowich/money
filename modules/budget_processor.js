const vendors = require('../../money_data/vendors.json');

module.exports = function (db) {

    this.db = db;

    this.processItem = function(item) {

        item.budget = "unknown";

        _vendorDefaultBudget(item);

        _default(item);

    },

    this.report = function (items) {

        var report = [];

        return new Promise( (resolve, reject) => {

            this.db.collection('budgets').find().toArray(function (err, budgets) {

                budgets.forEach(budget => {

                    report.push({
                        name : budget.name,
                        expected : budget.amount,
                        actual: 0
                    });

                });

                items.forEach(item => {

                    if (item.budget == "unknown") return;

                    var currentReportItem = report.find(reportItem => {
                        return reportItem.name === item.budget;
                    });

                    currentReportItem.actual += item.debit;

                });

                resolve(report);

            });
            
        });

    }

};


function _default(item)
{
    if (item.budget !== "unknown") return;
    if (item.credit > 0) return;
    if (item.debit === 0) return;
    if (item.type !== "charge") return;


    item.budget = "general";
}

function _vendorDefaultBudget(item)
{
    if (item.budget !== "unknown") return;
    if (item.vendor === "unknown") return;


    var currentVendor = vendors.find(vendor => {
        return vendor.id == item.vendor;
    });

    if (currentVendor.defaultBudget === undefined) return;

    item.budget = currentVendor.defaultBudget;

}