const Transaction = require("./transaction");
const {TypeEnum} = require('./transactionEnums');

class CertificateTransaction extends Transaction{
    certfier;
    dateOfAward;
    info;
    nameOfCertificate;
    constructor(){
        super();
        this.type = TypeEnum.certificate;
    }
}

module.exports = CertificateTransaction;