const Transaction = require("./transaction");
const {TypeEnum} = require('./transactionEnums');

class FinalGradeTransaction extends Transaction{
    course;
    grade;
    constructor(){
        super();
        this.type = TypeEnum.finalGrade;
    }
}

module.exports = FinalGradeTransaction;