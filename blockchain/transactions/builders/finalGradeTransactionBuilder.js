const FinalGradeTransaction = require('../finalGradeTransaction');
const TransactionBuilder = require('./transactionBuilder');

class FinalGradeTransactionBuilder extends TransactionBuilder{

    constructor(){
        super();
        this.reset();
    }

    reset(){
        this.transaction = new FinalGradeTransaction();
    }

    setCourse(course){
        this.transaction.course = course;
    }

    setGrade(grade){
        this.transaction.grade = grade;
    }

    getResult(){
        return this.transaction;
    }
}

module.exports = FinalGradeTransactionBuilder;

