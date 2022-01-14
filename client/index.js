const express = require('express');
const Blockchain = require('../blockchain/blockchain');
const bodyParser = require('body-parser');
const P2pServer = require('./p2p-server.js');
const TransactionPool = require('../blockchain/transactionPool');
const Transaction = require('../blockchain/transactions/transaction');
const Miner = require('./miner');

const ChainUtil = require('../chain-util');

const {TypeEnum} = require('../blockchain/transactions/transactionEnums')

const PresenceTransactionBuilder = require('../blockchain/transactions/builders/presenceTransactionBuilder');
const CertificateTransactionBuilder = require('../blockchain/transactions/builders/certificateTransactionBuilder');
const PartialGradeTransactionBuilder = require('../blockchain/transactions/builders/partialGradeTransactionBuilder');
const FinalGradeTransactionBuilder = require('../blockchain/transactions/builders/finalGradeTransactionBuilder');

const BlockchainIterator = require('../blockchain/iterators/BlockchainIterator');

const StudentTransactionFinder = require('../blockchain/finders/studentTransactionFinder');
const StudentTransactionVisitor = require('../blockchain/transactions/visitors/studentTransactionVisitor');
const LecturerTransactionFinder = require('../blockchain/finders/lecturerTransactionFinder');
const LecturerTransactionVisitor = require('../blockchain/transactions/visitors/lecturerTransactionVisitor');

//get the port from the user or set the default port
const HTTP_PORT = process.env.HTTP_PORT || 3001;

//create a new app
const app  = express();
const cors = require("cors");

app.use(cors())

//using the blody parser middleware
app.use(bodyParser.json());

// create a new blockchain instance
const blockchain = new Blockchain();
const transactionPool = new TransactionPool(blockchain.getGenesis());
const p2pserver = new P2pServer(blockchain, transactionPool);
//p2pserver.listen(); // starts the p2pserver

const miner = new Miner(blockchain, transactionPool, p2pserver);

//EXPOSED APIs

//api to get the blocks
app.get('/blocks',(req,res)=>{

    res.json(blockchain.chain);

});

// api to view transaction in the transaction pool
app.get('/transactions',(req,res)=>{
    res.json(transactionPool.transactions);
    });

//api to view all certificates in chain
app.get('/transactions-certificate', (req, res) => {
    let certificateIterator = new BlockchainIterator(blockchain, TypeEnum.certificate);
    let tmp = new Array();
    for(t of certificateIterator){
        tmp.push(t);
    }
    res.json(tmp);
})

//
app.get('/transactions-presence', (req, res) => {
    let certificateIterator = new BlockchainIterator(blockchain, TypeEnum.presence);
    let tmp = new Array();
    for(t of certificateIterator){
        tmp.push(t);
    }
    res.json(tmp);
})

app.get('/transactions-finalGrade', (req, res) => {
    let certificateIterator = new BlockchainIterator(blockchain, TypeEnum.finalGrade);
    let tmp = new Array();
    for(t of certificateIterator){
        tmp.push(t);
    }
    res.json(tmp);
})

app.get('/transactions-partialGrade', (req, res) => {
    let certificateIterator = new BlockchainIterator(blockchain, TypeEnum.partialGrade);
    let tmp = new Array();
    for(t of certificateIterator){
        tmp.push(t);
    }
    res.json(tmp);
})

app.get('/mine-transactions', (req, res)=>{
    const block = miner.mine();
    console.log(`New block added ${block.toString}`);
    res.redirect('/blocks');
})

//api to add blocks
// app.post('/mine',(req,res)=>{
//     const block = blockchain.addBlock(req.body.data);
//     console.log(`New block added: ${block.toString()}`);
//     p2pserver.syncChain();
//     res.redirect('/blocks');
// });

//create transactions
// app.post('/transact', (req, res) => {
//     const {data} = req.body;
//     const transaction = new Transaction(data);
//     transactionPool.add(transaction);
//     p2pserver.broadcastTransaction(transaction);
//     res.redirect('/transactions');
// })

//TODO: sprawdzenie czy typ sie zgadza z mozliwymi
app.post('/find-transactions-student', (req, res)=>{
    let {id, keyDecryptString, type} = req.body;
    keyDecryptString = keyDecryptString.split('\\n').join('\n');
    const iterator = new BlockchainIterator(blockchain, type);
    const finder = new StudentTransactionFinder(id, keyDecryptString, iterator);
    const transactions = finder.getTransactions();
    const visitor = new StudentTransactionVisitor()
    let resArr = [];
    for(t of transactions){
        if(t.type != undefined)
        {
            let builder;
        
            switch(t.type){
                case TypeEnum.certificate:
                    builder = new CertificateTransactionBuilder();
                    break;
                case TypeEnum.presence:
                    builder = new PresenceTransactionBuilder();
                    break;
                case TypeEnum.partialGrade:
                    builder = new PartialGradeTransactionBuilder();
                    break;
                case TypeEnum.finalGrade:
                    builder = new FinalGradeTransactionBuilder();
                    break;
        }
        builder.buildFromJSON(t);
        const res = builder.getResult();
        resArr.push(res.visit(visitor));
        }
        
    }
    res.json(resArr);
})

app.post('/find-transactions-lecturer', (req, res)=>{
    const {id, keyDecryptString, type} = req.body;
    const iterator = new BlockchainIterator(blockchain, type);
    const finder = new LecturerTransactionFinder(id, iterator);
    const transactions = finder.getTransactions();
    const visitor = new LecturerTransactionVisitor(keyDecryptString);
    let resArr = [];
    for(t of transactions){
        let builder;
        switch(t.type){
            case TypeEnum.certificate:
                builder = new CertificateTransactionBuilder();
                break;
            case TypeEnum.presence:
                builder = new PresenceTransactionBuilder();
                break;
            case TypeEnum.partialGrade:
                builder = new PartialGradeTransactionBuilder();
                break;
            case TypeEnum.finalGrade:
                builder = new FinalGradeTransactionBuilder();
                break;
        }
        builder.buildFromJSON(t);
        const res = builder.getResult();
        resArr.push(res.visit(visitor));
    }
    res.json(resArr);
})

app.post('/transact-presence', (req, res) => {
    const {date, studentID, masterKeyString, lecturerID, verificationKeyString, presence, course, dateClass} = req.body;
    const masterSignatureKey = ChainUtil.createPrivateKey('Lecturer', lecturerID, masterKeyString);
    const verificationKey = ChainUtil.createPrivateKey('Lecturer', lecturerID, verificationKeyString);
    const signatureKey = ChainUtil.createPublicKey(ChainUtil.getSignatureKey(blockchain.getGenesis(),studentID))

    const signature = ChainUtil.encryptPublic(signatureKey, studentID.toString());
    const masterSignature = ChainUtil.encryptPrivate(masterSignatureKey, studentID.toString());
    const verification = ChainUtil.encryptPrivate(verificationKey, ChainUtil.getVerificationString());

    const builder = new PresenceTransactionBuilder();

    builder.setID(ChainUtil.id());
    builder.setDate(date);
    builder.setSignature(signature);
    builder.setMasterSignature(masterSignature);
    builder.setLecturerID(lecturerID);
    builder.setVerification(verification)
    builder.setPresence(presence);
    builder.setCourse(course);
    builder.setDateClass(dateClass);

    const presenceTransaction = builder.getResult();
    transactionPool.add(presenceTransaction);
    p2pserver.broadcastTransaction(presenceTransaction);
    res.redirect('/transactions');

})

app.post('/transact-certificate', (req, res) => {
    const {date, studentID, masterKeyString, lecturerID, verificationKeyString, certfier, dateOfAward, info, nameOfCertificate} = req.body;
    const masterSignatureKey = ChainUtil.createPrivateKey('Lecturer', lecturerID, masterKeyString);
    const verificationKey = ChainUtil.createPrivateKey('Lecturer', lecturerID, verificationKeyString);
    const signatureKey = ChainUtil.createPublicKey(ChainUtil.getSignatureKey(blockchain.getGenesis(),studentID))

    const signature = ChainUtil.encryptPublic(signatureKey, studentID.toString());
    const masterSignature = ChainUtil.encryptPrivate(masterSignatureKey, studentID.toString());
    const verification = ChainUtil.encryptPrivate(verificationKey, ChainUtil.getVerificationString());


    const builder = new CertificateTransactionBuilder();

    builder.setID(ChainUtil.id());
    builder.setDate(date);
    builder.setSignature(signature);
    builder.setMasterSignature(masterSignature);
    builder.setLecturerID(lecturerID);
    builder.setVerification(verification)
    builder.setCertifier(certfier);
    builder.setDateOfAward(dateOfAward);
    builder.setInfo(info);
    builder.setNameOfCertificate(nameOfCertificate);

    const certificateTransaction = builder.getResult();
    transactionPool.add(certificateTransaction);
    p2pserver.broadcastTransaction(certificateTransaction);
    res.redirect('/transactions');

})

app.post('/transact-partialGrade', (req, res) => {
    let {date, studentID, masterKeyString, lecturerID, verificationKeyString, course, grade, weight} = req.body;
    masterKeyString = masterKeyString.split('\\n').join('\n');
    verificationKeyString = verificationKeyString.split('\\n').join('\n');

    const masterSignatureKey = ChainUtil.createPrivateKey('Lecturer', lecturerID, masterKeyString);
    const verificationKey = ChainUtil.createPrivateKey('Lecturer', lecturerID, verificationKeyString);
    const signatureKey = ChainUtil.createPublicKey(ChainUtil.getSignatureKey(blockchain.getGenesis(),studentID))

    const signature = ChainUtil.encryptPublic(signatureKey, studentID.toString());
    const masterSignature = ChainUtil.encryptPrivate(masterSignatureKey, studentID.toString());
    const verification = ChainUtil.encryptPrivate(verificationKey, ChainUtil.getVerificationString());

    const builder = new PartialGradeTransactionBuilder();

    builder.setID(ChainUtil.id());
    builder.setDate(date);
    builder.setSignature(signature);
    builder.setMasterSignature(masterSignature);
    builder.setLecturerID(lecturerID);
    builder.setVerification(verification)
    builder.setCourse(course);
    builder.setGrade(grade);
    builder.setWeight(weight);

    const partialGradeTransaction = builder.getResult();
    transactionPool.add(partialGradeTransaction);
    p2pserver.broadcastTransaction(partialGradeTransaction);
    res.redirect('/transactions');

})

app.post('/transact-finalGrade', (req, res) => {
    const {date, studentID, masterKeyString, lecturerID, verificationKeyString, course, grade} = req.body;
    const masterSignatureKey = ChainUtil.createPrivateKey('Lecturer', lecturerID, masterKeyString);
    const verificationKey = ChainUtil.createPrivateKey('Lecturer', lecturerID, verificationKeyString);
    const signatureKey = ChainUtil.createPublicKey(ChainUtil.getSignatureKey(blockchain.getGenesis(),studentID))

    const signature = ChainUtil.encryptPublic(signatureKey, studentID.toString());
    const masterSignature = ChainUtil.encryptPrivate(masterSignatureKey, studentID.toString());
    const verification = ChainUtil.encryptPrivate(verificationKey, ChainUtil.getVerificationString());

    const builder = new FinalGradeTransactionBuilder();

    builder.setID(ChainUtil.id());
    builder.setDate(date);
    builder.setSignature(signature);
    builder.setMasterSignature(masterSignature);
    builder.setLecturerID(lecturerID);
    builder.setVerification(verification)
    builder.setCourse(course);
    builder.setGrade(grade);

    const finalGradeTransaction = builder.getResult();
    transactionPool.add(finalGradeTransaction);
    p2pserver.broadcastTransaction(finalGradeTransaction);
    res.redirect('/transactions');

})

// app server configurations
app.listen(HTTP_PORT,()=>{
    console.log(`listening on port ${HTTP_PORT}`);
})