const Transaction = require("./transaction");
const {TypeEnum} = require('./transactionEnums');

class CertificateTransaction extends Transaction{
    certifier;
    dateOfAward;
    info;
    nameOfCertificate;
    constructor(){
        super();
        this.type = TypeEnum.certificate;
    }

    visit(visitor){
        return visitor.visitCertificateTransaction(this);
    }

    checkTransaction(){
        
    }
}

module.exports = CertificateTransaction;