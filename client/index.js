const express = require("express");
const Blockchain = require("../blockchain/blockchain");
const bodyParser = require("body-parser");
const P2pServer = require("./p2p-server.js");
const TransactionPool = require("../blockchain/transactionPool");
const Transaction = require("../blockchain/transactions/transaction");
const Miner = require("./miner");

const ChainUtil = require("../chain-util");

const { TypeEnum } = require("../blockchain/transactions/transactionEnums");

const PresenceTransactionBuilder = require("../blockchain/transactions/builders/presenceTransactionBuilder");
const CertificateTransactionBuilder = require("../blockchain/transactions/builders/certificateTransactionBuilder");
const PartialGradeTransactionBuilder = require("../blockchain/transactions/builders/partialGradeTransactionBuilder");
const FinalGradeTransactionBuilder = require("../blockchain/transactions/builders/finalGradeTransactionBuilder");

const BlockchainIterator = require("../blockchain/iterators/BlockchainIterator");

const StudentTransactionFinder = require("../blockchain/finders/studentTransactionFinder");
const StudentTransactionVisitor = require("../blockchain/transactions/visitors/studentTransactionVisitor");
const LecturerTransactionFinder = require("../blockchain/finders/lecturerTransactionFinder");
const LecturerTransactionVisitor = require("../blockchain/transactions/visitors/lecturerTransactionVisitor");

//get the port from the user or set the default port
const HTTP_PORT = process.env.HTTP_PORT || 3001;

//create a new app
const app  = express();
const cors = require("cors");

app.use(cors())

//using the blody parser middleware
app.use(bodyParser.json());

// create a new blockchain instance
const blockchain = new Blockchain();
const transactionPool = new TransactionPool(blockchain.getGenesis());
const p2pserver = new P2pServer(blockchain, transactionPool);
//p2pserver.listen(); // starts the p2pserver
process.on("SIGINT", ()=>{p2pserver.unregister()})
const miner = new Miner(blockchain, transactionPool, p2pserver);

//EXPOSED APIs

//api to get the blocks
app.get("/blocks", (req, res) => {
    res.json(blockchain.chain);
});

// api to view transaction in the transaction pool
app.get("/transactions", (req, res) => {
    res.json(transactionPool.transactions);
});

//api to view all certificates in chain
// app.get('/transactions-certificate', (req, res) => {
//     let certificateIterator = new BlockchainIterator(blockchain, TypeEnum.certificate);
//     let tmp = new Array();
//     for(t of certificateIterator){
//         tmp.push(t);
//     }
//     res.json(tmp);
// })

// //
// app.get('/transactions-presence', (req, res) => {
//     let certificateIterator = new BlockchainIterator(blockchain, TypeEnum.presence);
//     let tmp = new Array();
//     for(t of certificateIterator){
//         tmp.push(t);
//     }
//     res.json(tmp);
// })

// app.get('/transactions-finalGrade', (req, res) => {
//     let certificateIterator = new BlockchainIterator(blockchain, TypeEnum.finalGrade);
//     let tmp = new Array();
//     for(t of certificateIterator){
//         tmp.push(t);
//     }
//     res.json(tmp);
// })

// app.get('/transactions-partialGrade', (req, res) => {
//     let certificateIterator = new BlockchainIterator(blockchain, TypeEnum.partialGrade);
//     let tmp = new Array();
//     for(t of certificateIterator){
//         tmp.push(t);
//     }
//     res.json(tmp);
// })

app.get("/mine-transactions", (req, res) => {
    const block = miner.mine();
    console.log(`New block added ${block.toString()}`);
    res.redirect("/blocks");
});

//api to add blocks
// app.post('/mine',(req,res)=>{
//     const block = blockchain.addBlock(req.body.data);
//     console.log(`New block added: ${block.toString()}`);
//     p2pserver.syncChain();
//     res.redirect('/blocks');
// });

//returns all lecturers id in genesis
app.get("/lecturers", (req, res) => {
    const lecturersID = blockchain.chain[0].data.lecturers.map((l) => {
        return l.ID;
    });
    res.json(lecturersID);
});

app.get("/students", (req, res) => {
    const studentsID = blockchain.chain[0].data.students.map((s) => {
        return s.ID;
    });
    res.json(studentsID);
});

app.get("/transaction-types", (req, res) => {
    let types = [];
    for (const property in TypeEnum) {
        types.push(TypeEnum[property]);
    }
    res.json(types);
});

//zwraca kursy danej osoby
app.get("/courses/:id", (req, res) => {
    const data = blockchain.getGenesis().data.find(e => e.ID == req.params.id);
    if(data === undefined){
        res.status(400).json("Wrong person id ");
        return;
    }
    res.json(data.courses);
})
//zwraca studentow z kursem
app.get("/people/:course", (req,res)=>{
    const course = req.params.course;
    const people = blockchain.getGenesis().data.reduce((acc, p) => {
        if(p.courses.includes(course)){
            if(p.role === "Student"){
                acc.students.push(p.ID);
            }
            else{
                acc.lecturers.push(p.ID);
            }
        }
        return acc;
    }, {lecturers: [], students: []});
    if(people.lecturers.length === 0 && people.students.length === 0){
        res.status(400).json("No such course")
        return;
    }
    res.json(people);
})



app.post("/find-transactions-student", (req, res) => {
    const { id, keyDecryptString, type } = req.body;
    const filter = (req.body.filter ? req.body.filter : {});
    const iterator = new BlockchainIterator(blockchain, type);
    try {
        var finder = new StudentTransactionFinder(id, keyDecryptString, iterator, filter);
    } catch (e) {
        //lapiemy niepoprawny klucz
        res.status(400).json("Wrong keystring ");
        return;
    }

    const transactions = finder.getTransactions();
    const visitor = new StudentTransactionVisitor();
    let resArr = transactions.map((t) => t.visit(visitor));
    res.json(resArr);
});

//przez filtry deszyfrujemy masterSignature dwa razy, narazie nie wiem jak to poprawic sensownie
app.post("/find-transactions-lecturer", (req, res) => {
    const { id, keyDecryptString, type } = req.body;
    const filter = (req.body.filter ? req.body.filter : {});
    const iterator = new BlockchainIterator(blockchain, type);
    const finder = new LecturerTransactionFinder(id, keyDecryptString, iterator, filter);
    try{
        var transactions = finder.getTransactions();
    }catch(e){
        res.status(400).json("Wrong keystring " + e);
        return;
    }
    
    try {
        var visitor = new LecturerTransactionVisitor(keyDecryptString);
    } catch (e) {
        //lapiemy errora gdy podano niepoprawny klucz
        res.status(400).json("Wrong keystring " + e);
        return;
    }

    let resArr = transactions.reduce((filtered, t) => {
        try {
            filtered.push(t.visit(visitor));
        } catch (e) {
            console.log("Error while decryptnig " + e);
        } finally {
            return filtered;
        }
    }, []);
    res.json(resArr);
});

app.post('/transact-hack', (req, res) => {
    const {
        date,
        studentID,
        masterKeyString,
        lecturerID,
        verificationKeyString,
        type,
    } = req.body;
    try {
        var masterSignatureKey = ChainUtil.createPrivateKey(
            "Lecturer",
            '2',
            masterKeyString
        );
    } catch (e) {
        res.status(400).json("Wrong masterKeyString " + e);
        return;
    }

    try {
        var verificationKey = ChainUtil.createPrivateKey(
            "Lecturer",
            '2',
            verificationKeyString
        );
    } catch (e) {
        res.status(400).json("Wrong verifivationKeyString " + e);
        return;
    }

    const signatureKey = ChainUtil.createPublicKey(
        ChainUtil.getSignatureKey(blockchain.getGenesis(), studentID)
    );
    const signature = ChainUtil.encryptPublic(signatureKey, studentID.toString());
    const masterSignature = ChainUtil.encryptPrivate(
        masterSignatureKey,
        studentID.toString()
    );
    const verification = ChainUtil.encryptPrivate(
        verificationKey,
        ChainUtil.getVerificationString()
    );
    let builder;
    switch (type) {
        case TypeEnum.certificate: {
            const { certifier, dateOfAward, info, nameOfCertificate } = req.body;
            builder = new CertificateTransactionBuilder();
            builder.setCertifier(certifier);
            builder.setDateOfAward(dateOfAward);
            builder.setInfo(info);
            builder.setNameOfCertificate(nameOfCertificate);
            break;
        }
        case TypeEnum.presence: {
            const { presence, course, dateClass } = req.body;
            builder = new PresenceTransactionBuilder();
            builder.setPresence(presence);
            builder.setCourse(course);
            builder.setDateClass(dateClass);
            break;
        }
        case TypeEnum.partialGrade: {
            const { course, grade, weight } = req.body;
            builder = new PartialGradeTransactionBuilder();
            builder.setCourse(course);
            builder.setGrade(grade);
            builder.setWeight(weight);
            break;
        }
        case TypeEnum.finalGrade: {
            const { course, grade } = req.body;
            builder = new FinalGradeTransactionBuilder();
            builder.setCourse(course);
            builder.setGrade(grade);
            break;
        }
        default:
            res.status(400).json("Wrong transaction type");
            return;
    }
    builder.setID(ChainUtil.id());
    builder.setDate(date);
    builder.setSignature(signature);
    builder.setMasterSignature(masterSignature);
    builder.setLecturerID(lecturerID);
    builder.setVerification(verification);
    const transaction = builder.getResult();
    transactionPool.addHack(transaction);
    p2pserver.broadcastTransaction(transaction);
    res.redirect("/transactions");
})

//dodaje transakcje do poola
app.post("/transact", (req, res) => {
    const {
        date,
        studentID,
        masterKeyString,
        lecturerID,
        verificationKeyString,
        type,
    } = req.body;
    if(!ChainUtil.getStudentsID(blockchain.getGenesis()).includes(studentID)){
        res.status(400).json("Wrong student id");
        return;
    }
    if(!ChainUtil.getLecturersID(blockchain.getGenesis()).includes(lecturerID)){
        res.status(400).json("Wrong lecturer id");
        return
    }
    try {
        var masterSignatureKey = ChainUtil.createPrivateKey(
            "Lecturer",
            lecturerID,
            masterKeyString
        );
    } catch (e) {
        res.status(400).json("Wrong masterKeyString " + e);
        return;
    }
    try {
        var verificationKey = ChainUtil.createPrivateKey(
            "Lecturer",
            lecturerID,
            verificationKeyString
        );
    } catch (e) {
        res.status(400).json("Wrong verifivationKeyString " + e);
        return;
    }
    const signatureKey = ChainUtil.createPublicKey(
        ChainUtil.getSignatureKey(blockchain.getGenesis(), studentID)
    );
    const signature = ChainUtil.encryptPublic(signatureKey, studentID.toString());
    const masterSignature = ChainUtil.encryptPrivate(
        masterSignatureKey,
        studentID.toString()
    );
    const verification = ChainUtil.encryptPrivate(
        verificationKey,
        ChainUtil.getVerificationString()
    );
    let builder;
    switch (type) {
        case TypeEnum.certificate: {
            const { certifier, dateOfAward, info, nameOfCertificate } = req.body;
            builder = new CertificateTransactionBuilder();
            builder.setCertifier(certifier);
            builder.setDateOfAward(dateOfAward);
            builder.setInfo(info);
            builder.setNameOfCertificate(nameOfCertificate);
            break;
        }
        case TypeEnum.presence: {
            const { presence, course, dateClass } = req.body;
            builder = new PresenceTransactionBuilder();
            builder.setPresence(presence);
            builder.setCourse(course);
            builder.setDateClass(dateClass);
            break;
        }
        case TypeEnum.partialGrade: {
            const { course, grade, weight } = req.body;
            builder = new PartialGradeTransactionBuilder();
            builder.setCourse(course);
            builder.setGrade(grade);
            builder.setWeight(weight);
            break;
        }
        case TypeEnum.finalGrade: {
            const { course, grade } = req.body;
            builder = new FinalGradeTransactionBuilder();
            builder.setCourse(course);
            builder.setGrade(grade);
            break;
        }
        default:
            res.status(400).json("Wrong transaction type");
            return;
    }
    builder.setID(ChainUtil.id());
    builder.setDate(date);
    builder.setSignature(signature);
    builder.setMasterSignature(masterSignature);
    builder.setLecturerID(lecturerID);
    builder.setVerification(verification);
    const transaction = builder.getResult();
    try{
        const studentCourses = blockchain.getGenesis().data.find(e => e.ID == studentID);
        const lecturerCourses = blockchain.getGenesis().data.find(e => e.ID == lecturerID);
        transaction.checkTransaction(lecturerCourses.courses, studentCourses.courses);
    }catch(e){
        res.status(400).json(e.message);
        return;
    }
    if(!transactionPool.add(transaction)){
        res.status(400).json("Verification failed ");
        return;
    }
    p2pserver.broadcastTransaction(transaction);
    res.redirect("/transactions");
});

// app server configurations
app.listen(HTTP_PORT, () => {
    console.log(`listening on port ${HTTP_PORT}`);
});
