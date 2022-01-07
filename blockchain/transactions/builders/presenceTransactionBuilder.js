const PresenceTransaction = require('../presenceTransaction');


class PresenceTransactionBuilder{
    transaction;

    constructor(){
        this.reset();
    }

    reset(){
        this.transaction = new PresenceTransaction();
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