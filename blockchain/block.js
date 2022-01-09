const SHA256 = require('crypto-js/sha256');
const fs = require('fs');
const crypto = require("crypto");
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

    //TODO: wpisac do genesisa dane wykladowcó i studentów
    static genesis(){
        return new this('Genesis', '----', 'GENESIS-HASH', 0, {lecturers: {0:"deszyfr"}})
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

    static makeKeys(keyLength, passphrase){
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { //Generating pair of keys
            modulusLength: keyLength,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: passphrase
            }});
        return { publicKey, privateKey }
    }
    
    static createRecord(role,ID,keyLength){ //Creating record of our student or teacher
        if(role == 'Lecturer')
            secondPair = makeKeys(keyLength,ID);
        else
            secondPair = null;
        
        firstPair = makeKeys(keyLength,ID);
        var record = { //Record of teacher/student
            role : role,
            ID : ID,
            key : firstPair.publicKey
        }

        return [record,firstPair.privateKey,secondPair]
    }
    
    static readWholeData(filename){ //Reading every record from .json file
        let data = fs.readFileSync(filename);
        return JSON.parse(data)
    }

    static addWholeData(records,filename){ //Sending every record to .json file
        let data = JSON.stringify(records);
        fs.writeFileSync(filename,data);
    }
    
    static generateData(lecturersAmount,studentAmount){ //Generating some records. For example to tests
        var records = [];
        var keys = [];
        for(let i = 1; i <= lecturersAmount; i++){
            let res = createRecord("Lecturer",i,4096);
            records.push(res[0]);
            keys.push({
                ID : i,
                firstPrivateKey : res[1],
                secondPublicKey : res[2].publicKey,
                secondPrivateKey : res[2].privateKey
            });
        }

        for(let i = 1; i <= studentAmount; i++){
            let res = createRecord("Student",i+3000,4096);
            records.push(res[0]);
            keys.push({
                ID : i+3000,
                firstPrivateKey : res[1]
            });
        }
        addWholeData(records,'records.json');
        addWholeData(keys,"keys.json");
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
