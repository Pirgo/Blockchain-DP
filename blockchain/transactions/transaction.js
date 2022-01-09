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
                const publicKey = crypto.createPublicKey({
                    key : keyString,
                    type: 'spki',
                    format: 'pem'
                })
                const decrypted = crypto.publicDecrypt(publicKey, Buffer.from(this.verification, 'base64'))
                const decryptedString = decrypted.toString('base64');
                if("verified" === decryptedString.split('/')[0]){
                    return true;
                }
                return false;
            }
        }
        return false;
    }
}
module.exports = Transaction;