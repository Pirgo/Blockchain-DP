const CertificateTransaction = require('../certificateTransaction');

class CertificateTransactionBuilder{
    transaction;

    constructor(){
        this.reset();
    }

    reset(){
        this.transaction = new CertificateTransaction();
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

    setCertifier(certfier){
        this.transaction.certfier = certfier;
    }

    setDateOfAward(dateOfAward){
        this.transaction.dateOfAward = dateOfAward;
    }

    setInfo(info){
        this.transaction.info = info;
    }

    setNameOfCertificate(nameOfCertificate){
        this.transaction.nameOfCertificate = nameOfCertificate;
    }

    getResult(){
        return this.transaction;
    }
}

module.exports = CertificateTransactionBuilder;