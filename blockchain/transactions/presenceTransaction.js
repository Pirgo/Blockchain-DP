const Transaction = require("./transaction");
const {TypeEnum} = require('./transactionEnums');

class PresenceTransaction extends Transaction{
    presence;
    course;
    dateClass;
    constructor(){
        super();
        this.type = TypeEnum.presence;
    }

    visit(visitor){
        return visitor.visitPresenceTransaction(this);
    }

    checkTransaction(coursesLecturer, coursesStudent){
        if(!coursesLecturer.includes(this.course)) throw new Error('Lecturer doesnt conduct the course')
        if(!coursesStudent.includes(this.course)) throw new Error('Student is not attending at this course');
        if(this.dateClass == undefined) throw new Error("Date class empty");
    }
}

module.exports = PresenceTransaction;
