const TransactionBuilder = require('./transactions/builders/transactionBuilder')

class TransactionPool {
  constructor(genesis) {
    this.transactions = [];
    this.genesis = genesis;
  }

  add(transaction) {
    
    
      this.transactions.push(transaction);
      return true;
    
    
  }

  addHack(transaction){
    this.transactions.push(transaction);
  }

  clear() {
    this.transactions = [];
  }
}

module.exports = TransactionPool;
