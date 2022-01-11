const CertificateTransaction = require('../certificateTransaction');
const TransactionBuilder = require('./transactionBuilder');

class CertificateTransactionBuilder extends TransactionBuilder{
    
    constructor(){
        super();
        this.reset();
    }

    reset(){
        this.transaction = new CertificateTransaction();
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

    buildFromJSON(json){
        this.setID(json.id);
        this.setDate(json.date);
        this.setSignature(json.signature);
        this.setMasterSignature(json.masterSignature);
        this.setLecturerID(json.lecturerID);
        this.setVerification(json.verification);
        this.setCertifier(json.certfier);
        this.setDateOfAward(json.dateOfAward);
        this.setInfo(json.info);
        this.setNameOfCertificate(json.nameOfCertificate);
    }

    getResult(){
        return this.transaction;
    }
}

module.exports = CertificateTransactionBuilder;