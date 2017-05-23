const VendorMapper = require('./vendor_mapper.js');

module.exports = function (db) {

    this.db = db;
    this.vendors = null;

    this.vendorMapper = new VendorMapper(this.db);

    this.processItems = function(items)
    {

        return new Promise( (resolve, reject) => {

            this.vendorMapper.getAll().then(vendors => {

                items.forEach(item => {
                    _processItem(vendors, item);
                });

                resolve(items);

            });

        });

    }

    this.report = function (items) {

        var report = [];

        return new Promise( (resolve, reject) => {

            this.db.collection('budgets').find().toArray(function (err, budgets) {

                budgets.forEach(budget => {

                    report.push({
                        id : budget._id,
                        name : budget.name,
                        expected : budget.amount,
                        actual: 0
                    });

                });

                items.forEach(item => {

                    if (item.budgetId == null) return;

                    var currentReportItem = report.find(reportItem => {
                        return reportItem.id.equals(item.budgetId);
                    });

                    currentReportItem.actual += item.debit;

                });

                resolve(report);

            });
            
        });

    }

};

function _processItem(vendors, item) {

    item.budgetId = null;

    _vendorDefaultBudget(vendors, item);

    _default(item);

}

function _default(item)
{
    if (item.budgetId !== null) return;
    if (item.credit > 0) return;
    if (item.debit === 0) return;
    if (item.type !== "charge") return;


    item.budgetId = "592253d826bad827247e2baa";
}

function _vendorDefaultBudget(vendors, item)
{
    if (item.budgetId !== null) return;
    if (item.vendorId === null) return;

    var currentVendor = vendors.find(vendor => {
        return vendor._id.equals(item.vendorId);
    });

    item.budgetId = currentVendor.defaultBudgetId;

}