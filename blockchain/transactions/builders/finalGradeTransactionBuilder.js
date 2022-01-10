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

    buildFromJSON(json){
        this.setID(json.id);
        this.setDate(json.date);
        this.setSignature(json.signature);
        this.setMasterSignature(json.masterSignature);
        this.setLecturerID(json.lecturerID);
        this.setVerification(json.verification);
        this.setGrade(json.grade);
        this.setCourse(json.course);
    }

    getResult(){
        return this.transaction;
    }
}

module.exports = FinalGradeTransactionBuilder;

