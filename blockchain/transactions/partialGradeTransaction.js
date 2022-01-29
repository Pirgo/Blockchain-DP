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
    
    checkTransaction(coursesLecturer, coursesStudent){
        if(!coursesLecturer.includes(this.course)) throw new Error('Lecturer doesnt conduct the course')
        if(!coursesStudent.includes(this.course)) throw new Error('Student is not attending at this course');
        if(this.grade == undefined) throw new Error("Grade empty");
        if(this.weight == undefined) throw new Error('Weight empty');
    }
}

module.exports = PartialGradeTransaction;