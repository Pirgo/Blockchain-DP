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
        if(this.certifier == undefined) throw new Error('Cerifier empty');
        if(this.dateOfAward == undefined) throw new Error('Date of award empty');
        if(this.info == undefined) throw new Error('Info empty');
        if(this.nameOfCertificate == undefined) throw new Error("name of cerificate empty");
    }
}

module.exports = CertificateTransaction;