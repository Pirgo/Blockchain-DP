const SHA256 = require('crypto-js/sha256');
const DIFFICULTY = 4;

class Block{
    constructor(timestamp,lastHash,hash,data, nonce){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
    }

    toString(){
        return `Block - 
        Timestamp : ${this.timestamp}
        Last Hash : ${this.lastHash.substring(0,10)}
        Hash      : ${this.hash.substring(0,10)}
        Data      : ${this.data}
        Nonce     : ${this.nonce}`;
    }

    
    static genesis(){
        return new this('Genesis time','----','genesis-hash',[], 0);
    }

    static hash(timestamp,lastHash,data,nonce){
        return SHA256(`${timestamp}${lastHash}${data}${nonce}`).toString();
}

static blockHash(block){
    //destructuring
    const { timestamp, lastHash, data, nonce} = block;
    return Block.hash(timestamp,lastHash,data,nonce);
}

    static mineBlock(lastBlock,data){

        
        let timestamp = Date.now();
        const lastHash = lastBlock.hash;
        let hash = this.hash(timestamp, lastHash, data)
        let nonce = 0;
        hash = Block.hash(timestamp, lastHash, data, nonce);
        while(hash.substr(0,DIFFICULTY) !== '0'.repeat(DIFFICULTY)){
            nonce+=1;
            timestamp = Date.now();
            hash = Block.hash(timestamp, lastHash, data, nonce);
        }
        return new this(timestamp,lastHash,hash,data,nonce);
    }

}

module.exports = Block;