const Transaction = require("../transaction");

class TransactionBuilder{
    transaction;
    constructor(){
        this.reset();
    }

    reset(){
        this.transaction = new Transaction();
    }

    setID(id){
        this.transaction.id = id;
    }

    setDate(date){
        this.transaction.date = date;
    }

    setSignature(signature){
        this.transaction.signature = signature;
    }

    setMasterSignature(masterSignature){
        this.transaction.masterSignature = masterSignature;
    }

    setLecturerID(lecturerID){
        this.transaction.lecturerID = lecturerID;
    }

    setVerification(verification){
        this.transaction.verification = verification;
    }

    buildFromJSON(json){
        this.setID(json.id);
        this.setDate(json.date);
        this.setSignature(json.signature);
        this.setMasterSignature(json.masterSignature);
        this.setLecturerID(json.lecturerID);
        this.setVerification(json.verification);
    }

    getResult(){
        return this.transaction;
    }
}

module.exports = TransactionBuilder;