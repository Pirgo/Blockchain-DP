const PresenceTransaction = require('../presenceTransaction');
const TransactionBuilder = require('./transactionBuilder');

class PresenceTransactionBuilder extends TransactionBuilder{

    constructor(){
        super();
        this.reset();
    }

    reset(){
        this.transaction = new PresenceTransaction();
    }

    setPresence(presence){
        this.transaction.presence = presence;
    }

    setCourse(course){
        this.transaction.course = course;
    }

    setDateClass(dateClass){
        this.transaction.dateClass = dateClass;
    }

    getResult(){
        return this.transaction;
    }
}

module.exports = PresenceTransactionBuilder;