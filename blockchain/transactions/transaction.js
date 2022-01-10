const ChainUtil = require('../../chain-util');
const crypto = require('crypto');

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
    checkVerification(genesisBlock){
        const lecturers = genesisBlock.data.lecturers;
        for(let i = 0; i < lecturers.length; i++){
            console.log(lecturers[i]);
            if(this.lecturerID === lecturers[i].ID){
                const keyString = lecturers[i].key;
                const publicKey = ChainUtil.createPublicKey(keyString);
                try{
                    var decryptedString = ChainUtil.decryptPublic(publicKey, this.verification);
                }catch(e){
                    return false;
                }
                
                if(ChainUtil.getVerificationString() === decryptedString){
                    return true;
                }
                return false;
            }
        }
        return false;
    }
}
module.exports = Transaction;