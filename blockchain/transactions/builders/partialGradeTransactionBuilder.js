const PartialGradeTransaction = require('../partialGradeTransaction');

class PartialGradeTransactionBuilder{
    transaction;

    constructor(){
        this.reset();
    }

    reset(){
        this.transaction = new PartialGradeTransaction();
    }

    setID(id){
        this.transaction.id = id;
    }

    setDate(date){
        this.transaction.date = date;
    }

    setSignature(signature){
        this.transaction.signature = signature;
    }

    setMasterSignature(masterSignature){
        this.transaction.masterSignature = masterSignature;
    }

    setLecturerID(lecturerID){
        this.transaction.lecturerID = lecturerID;
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