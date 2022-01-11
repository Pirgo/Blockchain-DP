class TransactionPool{
    constructor(genesis){
        this.transactions = [];
        this.genesis = genesis;
    }

    add(transaction){
       // if(transaction.checkVerification(this.genesis)){
            this.transactions.push(transaction);
            return true;
       // }
       // return false;
        
    }

    clear(){
        this.transactions = [];
    }
}

module.exports = TransactionPool;