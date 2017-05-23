module.exports = {

    processItems : function(items) {

        items.forEach(item => {
            _processItem(item);
        });

    }

};


function _processItem(item) {

    item.type = "unknown";

    _payment(item);
    _transfer(item);
    _refund(item);
    _charge(item);

}

function _refund(item) {

    if (item.type != "unknown") return;

    var terms = [
        "SERVICE CHARGE DISCOUNT",
    ]

    terms.forEach(term => {
        if (item.note.includes(term)){
            item.type = "refund";
        }    
    })

};

function _payment(item) {

    if (item.type != "unknown") return;
    if (item.debit > 0) return;
    if (item.credit <= 0) return;

    var terms = [
        "DEPOSIT CANADA",
    ]

    terms.forEach(term => {
        if (item.note.includes(term)){
            item.type = "payment";
        }    
    })

    if (item.credit == 8500) {
        item.type = "payment";
    }

};

function _transfer(item) {

    if (item.type != "unknown") return;

    var terms = [
        "INTERNET TRANSFER",
        "PAYMENT THANK YOU"
    ]

    terms.forEach(term => {
        if (item.note.includes(term)){
            item.type = "transfer";
        }    
    })

};

function _charge(item) {

    if (item.type != "unknown") return;
    if (item.debit <= 0) return;
    if (item.credit > 0) return;

    var terms = [
        "INTERAC RETAIL PURCHASE",
        "PREAUTHORIZED DEBIT",
        "SERVICE CHARGE",
        "E-TRANSFER NETWORK FEE",
        "TELEPHONE BILL PAY",
        "E-TRANSFER"
    ]

    terms.forEach(term => {
        if (item.note.includes(term)){
            item.type = "charge";
        }    
    })

    item.type = "charge";



};