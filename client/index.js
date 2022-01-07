const express = require('express');
const Blockchain = require('../blockchain/blockchain');
const bodyParser = require('body-parser');
const P2pServer = require('./p2p-server.js');
const TransactionPool = require('../blockchain/transactionPool');
const Transaction = require('../blockchain/transactions/transaction');
const Miner = require('./miner');

const {TypeEnum} = require('../blockchain/transactions/transactionEnums')

const PresenceTransactionBuilder = require('../blockchain/transactions/builders/presenceTransactionBuilder');
const CertificateTransactionBuilder = require('../blockchain/transactions/builders/certificateTransactionBuilder');
const PartialGradeTransactionBuilder = require('../blockchain/transactions/builders/partialGradeTransactionBuilder');
const FinalGradeTransactionBuilder = require('../blockchain/transactions/builders/finalGradeTransactionBuilder');

const BlockchainIterator = require('../blockchain/iterators/BlockchainIterator');

//get the port from the user or set the default port
const HTTP_PORT = process.env.HTTP_PORT || 3001;

//create a new app
const app  = express();

//using the blody parser middleware
app.use(bodyParser.json());

// create a new blockchain instance
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const p2pserver = new P2pServer(blockchain, transactionPool);
p2pserver.listen(); // starts the p2pserver

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

app.get('/transactions-certificate', (req, res) => {
    let certificateIterator = new BlockchainIterator(blockchain, TypeEnum.certificate);
    let tmp = new Array();
    for(t of certificateIterator){
        console.log(t);
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

app.post('/transact-presence', (req, res) => {
    const {date, signature, masterSignature, lecturerID, presence, course, dateClass} = req.body;
    const builder = new PresenceTransactionBuilder();

    builder.setDate(date);
    builder.setSignature(signature);
    builder.setMasterSignature(masterSignature);
    builder.setLecturerID(lecturerID);
    builder.setPresence(presence);
    builder.setCourse(course);
    builder.setDateClass(dateClass);

    const presenceTransaction = builder.getResult();
    transactionPool.add(presenceTransaction);
    p2pserver.broadcastTransaction(presenceTransaction);
    res.redirect('/transactions');

})

app.post('/transact-certificate', (req, res) => {
    const {date, signature, masterSignature, lecturerID, certfier, dateOfAward, info, nameOfCertificate} = req.body;
    const builder = new CertificateTransactionBuilder();

    builder.setDate(date);
    builder.setSignature(signature);
    builder.setMasterSignature(masterSignature);
    builder.setLecturerID(lecturerID);
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
    const {date, signature, masterSignature, lecturerID, course, grade, weight} = req.body;
    const builder = new PartialGradeTransactionBuilder();

    builder.setDate(date);
    builder.setSignature(signature);
    builder.setMasterSignature(masterSignature);
    builder.setLecturerID(lecturerID);
    builder.setCourse(course);
    builder.setGrade(grade);
    builder.setWeight(weight);

    const partialGradeTransaction = builder.getResult();
    transactionPool.add(partialGradeTransaction);
    p2pserver.broadcastTransaction(partialGradeTransaction);
    res.redirect('/transactions');

})

app.post('/transact-finalGrade', (req, res) => {
    const {date, signature, masterSignature, lecturerID, course, grade} = req.body;
    const builder = new FinalGradeTransactionBuilder();

    builder.setDate(date);
    builder.setSignature(signature);
    builder.setMasterSignature(masterSignature);
    builder.setLecturerID(lecturerID);
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