const crypto = require('crypto');

class StudentTransactionFinder{
    constructor(id, keyDecryptString, iterator){
        this.id = id;
        this.keyDecryptString = keyDecryptString;
        this.iterator = iterator;
    }


    getTransactions(){
        const passphrase = `Student${this.id}`
        let keyDecrypt = crypto.createPrivateKey({
            'key': this.keyDecryptString,
            'type': 'pkcs8',
            'format': 'pem',
            'cipher': 'aes-256-cbc',
            'passphrase': passphrase
        })
        let res = [];
        for(let t of this.iterator){
            //TODO: ten if chyba nie jest potrzebny bo jak sprawdza sie nie swoje signature to wywala error, dlatego try catch, syf no ale coz taka libka
            try{
                const decryptedSignature = crypto.privateDecrypt(keyDecrypt, Buffer.from(t.signature, 'base64'));
                const decryptedSignatureString = decryptedSignature.toString('base64');
                if(this.id == decryptedSignatureString.split('/')[0]){
                    res.push(t);
                }
            }catch(e){
                
            }
            
        }
        return res;
    }
}

module.exports = StudentTransactionFinder;