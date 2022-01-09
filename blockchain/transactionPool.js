class TransactionPool{
    constructor(genesis){
        this.transactions = [];
        this.genesis = genesis;
    }

    add(transaction){
        if(transaction.checkVerification(this.genesis)){
            this.transactions.push(transaction);
        }
        
    }

    clear(){
        this.transactions = [];
    }
}

module.exports = TransactionPool;