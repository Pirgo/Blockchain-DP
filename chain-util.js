const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
// secp256k1 is the algorithm to generate key pair
const uuid = require('uuid');
// version 1 use timestamp to generate unique ids
class ChainUtil{
    static genKeyPair(){
        return ec.genKeyPair();
    }
    static id(){
        return uuid.v1();
    }
}

module.exports = ChainUtil;

// this.keyPair = ChainUtil.genKeyPair();
// this.publicKey = this.keyPair.getPublic().encode('hex');