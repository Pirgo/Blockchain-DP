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

    getResult(){
        return this.transaction;
    }
}

module.exports = CertificateTransactionBuilder;