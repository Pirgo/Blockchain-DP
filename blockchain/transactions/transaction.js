const ChainUtil = require('../../chain-util');

class Transaction{
    id;
    type;
    date;
    signature;
    masterSignature;
    lecturerID;
    verification;
    constructor(){
        
    }

    //TODO: w tym miejscu moznaby sprawdzic czy transakcja jest poprwna tj. czy dodala ją uprawniona osoba
    checkMasterSignature(genesisBlock){
        const lecturers = genesisBlock.data.lecturers;
        if(this.lecturerID in lecturers){
            keyDecrypt = lecturers[this.lecturerID];
            
        }
        else{
            return false;
        }

    }
}
module.exports = Transaction;