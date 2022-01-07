class TransactionBuilder{
    transaction;
    constructor(){

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
}

module.exports = TransactionBuilder;