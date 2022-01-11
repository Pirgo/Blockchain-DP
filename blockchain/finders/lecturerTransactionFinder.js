const crypto = require('crypto');
const ChainUtil = require('../../chain-util');

class LecturerTransactionFinder{
    constructor(id, iterator){
        this.id = id;
        this.iterator = iterator;
    }

    getTransactions(){
        let res = [];
        for(let t of this.iterator){
            if(t.lecturerID === this.id){
                res.push(t);
            }
        }
        return res;
    }
}

module.exports = LecturerTransactionFinder;