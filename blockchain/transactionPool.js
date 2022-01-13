const TransactionBuilder = require('./transactions/builders/transactionBuilder')

class TransactionPool {
  constructor(genesis) {
    this.transactions = [];
    this.genesis = genesis;
  }

  add(data) {
    const builder = new TransactionBuilder();
    builder.buildFromJSON(data);
    const transaction = builder.getResult();
    if (transaction.checkVerification(this.genesis)) {
      this.transactions.push(data);
      return true;
    }
    return false;
  }

  clear() {
    this.transactions = [];
  }
}

module.exports = TransactionPool;
