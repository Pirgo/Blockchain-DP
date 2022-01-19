const Block = require('./block');

class Blockchain{
    constructor(){
        this.chain = [Block.genesis()];
    }

    static isValidChain(chain){
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
            return false;
        
        for(let i = 1 ; i<chain.length; i++){
            const block = chain[i];
            const lastBlock = chain[i-1];
            if((block.lastHash !== lastBlock.hash) || (block.hash !== Block.blockHash(block)))
                return false;
        }

        return true;    
    }

    getGenesis(){
        return this.chain[0];
    }


    addBlock(data){
        const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
        this.chain.push(block);
        return block;
    }

    //TODO: rozwiązać problem kiedy otrzymujemy chainy od dwoch nodeów jednocześnie
    replaceChain(newChain){
        console.log(newChain);
        //TODO: tu wyodrębnic czy otrzymujemy dluzzszy chain czy taki sam
        if(newChain.length <= this.chain.length){
            console.log("Recieved chain is not longer than the current chain");
            return;
        }else if(!Blockchain.isValidChain(newChain)){
            console.log("Recieved chain is invalid");
            return;
        }
        
        console.log("Replacing the current chain with new chain");
        this.chain = newChain; 
    }
    
}

module.exports = Blockchain;