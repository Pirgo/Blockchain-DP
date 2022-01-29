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
    
    checkTransaction(coursesLecturer, coursesStudent){
        if(!coursesLecturer.includes(this.course)) throw new Error('Lecturer doesnt conduct the course')
        if(!coursesStudent.includes(this.course)) throw new Error('Student is not attending at this course');
        if(this.grade == undefined) throw new Error("Grade empty");
    }
}

module.exports = FinalGradeTransaction;