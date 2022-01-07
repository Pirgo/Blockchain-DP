const Transaction = require("./transaction");
const {TypeEnum} = require('./transactionEnums');

class PresenceTransaction extends Transaction{
    presence;
    course;
    dateClass;
    constructor(){
        super();
        this.type = TypeEnum.presence;
    }
}

module.exports = PresenceTransaction;
