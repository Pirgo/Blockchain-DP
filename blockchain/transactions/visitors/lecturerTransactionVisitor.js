const ChainUtil = require("../../../chain-util");

class LecturerTransactionVisitor {
  constructor(keyDecryptString) {
    this.keyDecrypt = ChainUtil.createPublicKey(keyDecryptString);
  }

  visitPartialGrade(t) {
    let res = {};
    res.date = t.date;
    res.studentID = ChainUtil.decryptPublic(this.keyDecrypt, t.masterSignature);
    res.course = t.course;
    res.grade = t.grade;
    res.weight = t.weight;
    return res;
  }

  visitPresenceTransaction(t) {
    let res = {};
    res.date = t.date;
    res.studentID = ChainUtil.decryptPublic(this.keyDecrypt, t.masterSignature);
    res.presence = t.presence;
    res.course = t.course;
    res.dateClass = t.dateClass;
    return res;
  }

  visitFinalGradeTransaction(t) {
    let res = {};
    res.date = t.date;
    res.studentID = ChainUtil.decryptPublic(this.keyDecrypt, t.masterSignature);
    res.course = t.course;
    res.grade = t.grade;
    return res;
  }

  visitCertificateTransaction(t) {
    let res = {};
    res.date = t.date;
    res.studentID = ChainUtil.decryptPublic(this.keyDecrypt, t.masterSignature);
    res.certifier = t.certifier;
    res.dateOfAward = t.dateOfAward;
    res.info = t.info;
    res.nameOfCertificate = t.nameOfCertificate;
    return res;
  }
}

module.exports = LecturerTransactionVisitor;
