const PartialGradeTransaction = require('../partialGradeTransaction');
const TransactionBuilder = require('./transactionBuilder');

class PartialGradeTransactionBuilder extends TransactionBuilder{

    constructor(){
        super();
        this.reset();
    }

    reset(){
        this.transaction = new PartialGradeTransaction();
    }

    setCourse(course){
        this.transaction.course = course;
    }

    setGrade(grade){
        this.transaction.grade = grade;
    }

    setWeight(weight){
        this.transaction.weight;
    }
    
    getResult(){
        return this.transaction;
    }
}

module.exports = PartialGradeTransactionBuilder;