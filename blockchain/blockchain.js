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

    // getVerificationKey(id){
    //     const genesis = this.getGenesis();
    //     const lecturers = genesis.data.lecturers;
    //     for(let i = 0; i < lecturers.length; i++){
    //         if(lecturers[i].ID == id){
    //             return lecturers[i].key
    //         }
    //     }
    //     return null;
    // }

    // getSignatureKey(id){
    //     const genesis = this.getGenesis();
    //     const students = genesis.data.students;
    //     for(let i = 0; i < students.length; i++){
    //         if(students[i].ID == id){
    //             return students[i].key
    //         }
    //     }
    //     return null;
    // }

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