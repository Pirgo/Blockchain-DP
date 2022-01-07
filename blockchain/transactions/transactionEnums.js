const TypeEnum = Object.freeze({"partialGrade" : "partial grade", "finalGrade" : "final grade", "presence": "presence", "certificate" : "certificate"});

const PresenceEnum = Object.freeze({"absence" : 0, "presence" : 1, "late" : 3});

module.exports = {TypeEnum, PresenceEnum};