class TransactionPool{
    constructor(){
        this.transactions = [];
    }

    add(transaction){
        this.transactions.push(transaction);
    }

    clear(){
        this.transactions = [];
    }
}

module.exports = TransactionPool;