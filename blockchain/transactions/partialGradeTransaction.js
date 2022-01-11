const Transaction = require("./transaction");
const {TypeEnum} = require('./transactionEnums');

class PartialGradeTransaction extends Transaction{
    course;
    grade;
    weight;

    constructor(){
        super();
        this.type = TypeEnum.partialGrade;
    }

    visit(visitor){
        return visitor.visitPartialGrade(this);
    }
}

module.exports = PartialGradeTransaction;