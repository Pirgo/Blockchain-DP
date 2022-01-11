//ten visitor uzywamy gdy informacje pobiera student o sobie, dzieki temu nie trzeba rozszyfrowywac
//signature, robi to juz finder
class StudentTransactionVisitor{
    constructor(){}

    visitPartialGrade(t){
        let res = {}
        res.date = t.date;
        res.lecturerID = t.lecturerID;
        res.course = t.course;
        res.grade = t.grade;
        res.weight = t.weight;
        return res;
    }

    visitPresenceTransaction(t){
        let res = {}
        res.date = t.date;
        res.lecturerID = t.lecturerID;
        res.presence = t.presence;
        res.course = t.course;
        res.dateClass = t.dateClass;
        return res;
    }

    visitFinalGradeTransaction(t){
        let res = {}
        res.date = t.date;
        res.lecturerID = t.lecturerID;
        res.course = t.course;
        res.grade = t.grade;
        return res;
    }

    visitCertificateTransaction(t){
        let res = {}
        res.date = t.date;
        res.lecturerID = t.lecturerID;
        res.certfier = t.certfier;
        res.dateOfAward = t.dateOfAward;
        res.info = t.info;
        res.nameOfCertificate = t.nameOfCertificate;
        return res;
    }
}

module.exports = StudentTransactionVisitor;