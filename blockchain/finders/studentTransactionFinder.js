const crypto = require('crypto');
const ChainUtil = require('../../chain-util');

class StudentTransactionFinder{
    constructor(id, keyDecryptString, iterator, filter){
        this.id = id;
        this.keyDecrypt = ChainUtil.createPrivateKey('Student', id, keyDecryptString);
        this.iterator = iterator;
    }


    getTransactions(){
        let res = [];
        for(let t of this.iterator){
            //TODO: ten if chyba nie jest potrzebny bo jak sprawdza sie nie swoje signature to wywala error, dlatego try catch, syf no ale coz taka libka
            try{
                const decryptedSignature = crypto.privateDecrypt(this.keyDecrypt, Buffer.from(t.signature, 'base64'));
                const decryptedSignatureString = decryptedSignature.toString('base64');
                if(this.id == decryptedSignatureString.split('/')[0]){
                    res.push(t);
                }
            //mutuje errora, jest rzucany kiedy niewlasciwym kluczem deszyfrujemy, o to chodzi
            }catch(e){
                
            }
            
        }
        return res;
    }
}

module.exports = StudentTransactionFinder;