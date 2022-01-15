const SHA256 = require('crypto-js/sha256');
const fs = require('fs');
const DIFFICULTY = 5;

//TODO: zmienic data na transakcje
class Block{
    constructor(timestamp,lastHash,hash,nonce,data){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.nonce = nonce;
        this.data = data;
    }

    //TODO: narazie jest wpisany gdzie powinien byc plik i jak ma sie nazywac, pewnie do zmiany
    static genesis(){
        const records = JSON.parse(fs.readFileSync('datagenerator/records.json'));
        let data = [];
        records.forEach(r => data.push(r))
        return new this('Genesis', '----', 'GENESIS-HASH', 0, data)
    }

    static hash(timestamp, lastHash, nonce, data){
        return SHA256(`${timestamp}${lastHash}${nonce}${data}`).toString();
    }

    static mineBlock(lastBlock, data){
        const lastHash = lastBlock.hash;
        
        let nonce = 0;
        let timestamp = Date.now();
        let hash = Block.hash(timestamp, lastHash, nonce, data);

        while(hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY)){
            nonce++;
            timestamp = Date.now();
            hash = Block.hash(timestamp, lastHash, nonce, data);
        }
        

        return new this(timestamp, lastHash, hash, nonce, data);
    }

    static blockHash(block){
        const { timestamp, lastHash, nonce, data } = block;
        return Block.hash(timestamp,lastHash,nonce,data);
    }

    toString(){
        return `Block - 
        Timestamp : ${this.timestamp}
        Last Hash : ${this.lastHash.substring(0,10)}
        Hash      : ${this.hash.substring(0,10)}
        Nonce     : ${this.nonce}
        Data      : ${this.data}`;
    }


}

module.exports = Block;
