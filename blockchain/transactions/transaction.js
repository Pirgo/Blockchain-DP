const ChainUtil = require('../../chain-util');

class Transaction{
    id = ChainUtil.id();
    type;
    date;
    signature;
    masterSignature;
    lecturerID;
    constructor(){
        
    }

    //TODO: w tym miejscu moznaby sprawdzic czy transakcja jest poprwna tj. czy dodala ją uprawniona osoba
}
module.exports = Transaction;