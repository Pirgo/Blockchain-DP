const crypto = require('crypto');
const ChainUtil = require('../../chain-util');

class LecturerTransactionFinder{
    constructor(id, keyDecryptString, iterator, filter){
        this.id = id;
        this.keyDecryptString = keyDecryptString;
        this.filter = filter;
        this.iterator = iterator;
    }

    filterTransaction(t){
        for( const [key, value] of Object.entries(this.filter)){
            if(value !== "-"){
                if(key == "studentID"){
                    const studentID = ChainUtil.decryptPublic(ChainUtil.createPublicKey(this.keyDecryptString), t.masterSignature);
                    if(studentID != value){
                        return false;
                    }
                }
                else if(value != t[key]){
                    return false;
                }
            }
        }
        return true;
    }

    getTransactions(){
        let res = [];
        for(let t of this.iterator){
            if(t.lecturerID == this.id && this.filterTransaction(t)){
                res.push(t);
            }
        }
        return res;
    }
}

module.exports = LecturerTransactionFinder;