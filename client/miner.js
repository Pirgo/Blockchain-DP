class Miner{
    constructor(blockchain, transactionPool, p2pserver){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.p2pserver = p2pserver;
    }

    mine(){
        const transactions = this.transactionPool.transactions;
        const block = this.blockchain.addBlock(transactions);   //synchronicznie
        this.p2pserver.broadcastBlock(block)    
        //this.p2pserver.syncChain();
        this.transactionPool.clear();
       // this.p2pserver.broadcastClearTransactions();
        return block;
    }
}

module.exports = Miner;