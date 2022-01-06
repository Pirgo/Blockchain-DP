const express = require('express');
const Blockchain = require('../blockchain/blockchain');
const bodyParser = require('body-parser');
const P2pServer = require('./p2p-server.js');
const TransactionPool = require('../blockchain/transactionPool');
const Transaction = require('../blockchain/transactions/transaction');
const Miner = require('./miner');

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
app.post('/transact', (req, res) => {
    const {data} = req.body;
    const transaction = new Transaction(data);
    transactionPool.add(transaction);
    p2pserver.broadcastTransaction(transaction);
    res.redirect('/transactions');
})

// app server configurations
app.listen(HTTP_PORT,()=>{
    console.log(`listening on port ${HTTP_PORT}`);
})