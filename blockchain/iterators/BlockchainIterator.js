const {TypeEnum} = require('../transactions/transactionEnums');

//jak przekazemy nulla to zwraca wszystkie tranzakcje
class BlockchainIterator{
    constructor(blockchain, type){
        this.blockchain = blockchain;
        this.start = 1;
        this.end = blockchain.chain.length;
        this.type = type;
    }

    [Symbol.iterator](){
        let counter = 0;
        let i = 0;
        let nextTransaction;
        return{
            next: () =>{
                while(this.start < this.end){
                    while(i < this.blockchain.chain[this.start].data.length){
                        if(this.type === null){
                            counter++;
                            nextTransaction = this.blockchain.chain[this.start].data[i];
                            i++;
                            return {value: nextTransaction, done: false};
                        }
                        else if(this.blockchain.chain[this.start].data[i].type === this.type){
                            counter++;
                            nextTransaction = this.blockchain.chain[this.start].data[i];
                            i++;
                            return {value: nextTransaction, done: false};
                        }
                        i++;
                    }
                    this.start++;
                    i = 0;
                }
                return {value: counter, done: true};
            }
        }
    }
}

module.exports = BlockchainIterator;