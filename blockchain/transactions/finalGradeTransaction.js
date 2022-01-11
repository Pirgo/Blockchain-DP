const Transaction = require("./transaction");
const {TypeEnum} = require('./transactionEnums');

class FinalGradeTransaction extends Transaction{
    course;
    grade;
    constructor(){
        super();
        this.type = TypeEnum.finalGrade;
    }

    visit(visitor){
        return visitor.visitFinalGradeTransaction(this);
    }
}

module.exports = FinalGradeTransaction;