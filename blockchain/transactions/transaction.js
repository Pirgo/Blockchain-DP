const ChainUtil = require('../../chain-util');

class Transaction{
    constructor(data){
        this.id = ChainUtil.id();
        this.data = data;
    }
}
module.exports = Transaction;