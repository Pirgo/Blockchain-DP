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
        this.transaction.weight = weight;
    }

    buildFromJSON(json){
        this.setID(json.id);
        this.setDate(json.date);
        this.setSignature(json.signature);
        this.setMasterSignature(json.masterSignature);
        this.setLecturerID(json.lecturerID);
        this.setVerification(json.verification);
        this.setGrade(json.grade);
        this.setCourse(json.course);
        this.setWeight(json.weight);
    }
    
    getResult(){
        return this.transaction;
    }
}

module.exports = PartialGradeTransactionBuilder;