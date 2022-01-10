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

    buildFromJSON(json){
        this.setID(json.id);
        this.setDate(json.date);
        this.setSignature(json.signature);
        this.setMasterSignature(json.masterSignature);
        this.setLecturerID(json.lecturerID);
        this.setVerification(json.verification);
        this.setPresence(json.presence);
        this.setCourse(json.course);
        this.setDateClass(json.dateClass);
    }

    getResult(){
        return this.transaction;
    }
}

module.exports = PresenceTransactionBuilder;