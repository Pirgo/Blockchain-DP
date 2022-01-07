const crypto = require('crypto');
const uuid = require('uuid');
// version 1 use timestamp to generate unique ids

class ChainUtil{
    static genKeyPair(){
        return crypto.generateKeyPairSync("rsa", {modulusLength: 2048});
    }
    static id(){
        return uuid.v1();
    }
}

module.exports = ChainUtil;

// this.keyPair = ChainUtil.genKeyPair();
// this.publicKey = this.keyPair.getPublic().encode('hex');


const { publicKey, privateKey } = ChainUtil.genKeyPair();
console.log(
	publicKey

)
