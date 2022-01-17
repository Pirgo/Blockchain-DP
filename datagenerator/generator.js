const fs = require('fs');
const crypto = require("crypto");

let courses = ["Algebra", "Physics", "Unix", "English", "Algorithms"]

function makeKeys(keyLength, passphrase){
    let { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { //Generating pair of keys
        modulusLength: keyLength,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: passphrase
        }});
    
    publicKey = publicKey.replace(/\n/g, "");
    publicKey = publicKey.replace("-----BEGIN PUBLIC KEY-----", "");
    publicKey = publicKey.replace("-----END PUBLIC KEY-----", "");
    
    privateKey = privateKey.replace(/\n/g, "");
    privateKey = privateKey.replace("-----BEGIN ENCRYPTED PRIVATE KEY-----", "")
    privateKey = privateKey.replace("-----END ENCRYPTED PRIVATE KEY-----", "");

    return { publicKey, privateKey }
}

function createRecord(role,ID,keyLength){ //Creating record of our student or teacher
    if(role == 'Lecturer')
        secondPair = makeKeys(keyLength,role+ID);
    else{
        secondPair = null;
    }
    firstPair = makeKeys(keyLength,role+ID);
    var record = { //Record of teacher/student
        role : role,
        ID : ID,
        key : firstPair.publicKey,
        courses: [courses[0], courses[1]]
    }
    courses = courses.sort((a,b) => 0.5 - Math.random());
    return [record,firstPair.privateKey,secondPair]
}

function readWholeData(filename){ //Reading every record from .json file
    let data = fs.readFileSync(filename);
    return JSON.parse(data)
}

function addWholeData(records,filename){ //Sending every record to .json file
    console.log(filename)
    let data = JSON.stringify(records);
    fs.writeFileSync("./datagenerator/" + filename,data, (err)=>{
        if(err) console.log(err)
    });
}

function generateData(lecturersAmount,studentAmount){ //Generating some records. For example to tests
    var records = [];
    var keys = [];
    for(let i = 1; i <= lecturersAmount; i++){
        let res = createRecord("Lecturer",i,4096);
        records.push(res[0]);
        keys.push({
            ID : i,
            firstPrivateKey : res[1],
            secondPublicKey : res[2].publicKey,
            secondPrivateKey : res[2].privateKey
        });
    }
    for(let i = 1; i <= studentAmount; i++){
        let res = createRecord("Student",i+3000,4096);
        records.push(res[0]);
        keys.push({
            ID : i+3000,
            firstPrivateKey : res[1]
        });
    }
    addWholeData(records,'records.json');
    addWholeData(keys,"keys.json");
}
generateData(5,15);

