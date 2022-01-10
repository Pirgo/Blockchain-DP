const express = require('express');
const Blockchain = require('../blockchain/blockchain');
const bodyParser = require('body-parser');
const P2pServer = require('./p2p-server.js');
const TransactionPool = require('../blockchain/transactionPool');
const Transaction = require('../blockchain/transactions/transaction');
const Miner = require('./miner');

const ChainUtil = require('../chain-util');

const {TypeEnum} = require('../blockchain/transactions/transactionEnums')

const PresenceTransactionBuilder = require('../blockchain/transactions/builders/presenceTransactionBuilder');
const CertificateTransactionBuilder = require('../blockchain/transactions/builders/certificateTransactionBuilder');
const PartialGradeTransactionBuilder = require('../blockchain/transactions/builders/partialGradeTransactionBuilder');
const FinalGradeTransactionBuilder = require('../blockchain/transactions/builders/finalGradeTransactionBuilder');

const BlockchainIterator = require('../blockchain/iterators/BlockchainIterator');

const StudentTransactionFinder = require('../blockchain/finders/studentTransactionFinder');

//get the port from the user or set the default port
const HTTP_PORT = process.env.HTTP_PORT || 3001;

//create a new app
const app  = express();

//using the blody parser middleware
app.use(bodyParser.json());

// create a new blockchain instance
const blockchain = new Blockchain();
const transactionPool = new TransactionPool(blockchain.getGenesis());
const p2pserver = new P2pServer(blockchain, transactionPool);
p2pserver.listen(); // starts the p2pserver

const miner = new Miner(blockchain, transactionPool, p2pserver);

//EXPOSED APIs

//api to get the blocks
app.get('/blocks',(req,res)=>{

    res.json(blockchain.chain);

});

// api to view transaction in the transaction pool
app.get('/transactions',(req,res)=>{
    res.json(transactionPool.transactions);
    });

//api to view all certificates in chain
app.get('/transactions-certificate', (req, res) => {
    let certificateIterator = new BlockchainIterator(blockchain, TypeEnum.certificate);
    let finder = new StudentTransactionFinder(3001, "-----BEGIN ENCRYPTED PRIVATE KEY-----\nMIIJrTBXBgkqhkiG9w0BBQ0wSjApBgkqhkiG9w0BBQwwHAQIMH2T2BYDBQICAggA\nMAwGCCqGSIb3DQIJBQAwHQYJYIZIAWUDBAEqBBDRCRG0D1Hlz+xuAjuX8HO6BIIJ\nUIAH43vkkaDCuRgyudpnc4g7OMLg05b835+n+JzF7USWa1ca/FlUD1+eCfbTO59J\nNk/bcXVxJ9GWv0ilgKqju55IVkQ+FknPy/Nt+WgXadSwkM/TjNyXwJEr5IFu4Sf5\nnksUzm2xVOiRqLGfOS6ZflNVt/6gj8EAVqEr60E3NMVJ+6FCe0Pzg29amW30ANr8\nv61mpe6Y3PVTWv8qFTdn0oM2SXSAjPK+KTmC6b+hKLLCPYBnjB6E4IRllKRzTu5p\n3z7iQ7E+yH6jWBKzzcLh8tRMePIePJsucz941QcYQKuPYeW1HPZHVypVDZTJTsdm\nQrAw2G91+gh0D17p/ndWS9NKF0rmS+fAX+p50gxE8roaD65RE0gyIr7+rFjiHBoZ\n67VaEvercgDcgNYDDuGybPoE8Ol1kTfwmqyiH3mZ4kEXr5kdAbnfsEZxPhU/jEe1\nij7FfT92XZAL+7TT/3JNatZPE9xV4XkH/DjhqnPdRq7J9DhL8RCqjksQYbrML1Y/\noQkxOjzw1s34IG/Y97r1vs/x8rzTL4wFDPcWh23rm2CNSdeJLECGpIjK+he0ceqo\ndqM8SKiI95uLbjER/pIIR+xveZfw2n1LYAzE9LL4aGV7IWe9tI58IJkwwhdaeyLr\nKvOlLvfB9ItY+A/oCjvTHtp9euXIgfBnSc3WhnbfhwEpXWr/X+koq330FiKpk6DX\nWc/42SxxCNq3j05tcvlG8QC/VtNS3OGFLYMYvbqbgPYGytM4TFxsVBi8ot8nAUbK\nqh6VStLGSE33ddHtFUE8V+vrvnuNT5u705NaUd4eFONCqOptvA8HpBwNnfYi68CO\n4Zjj5XjV6WaIFcrmONcBduqmNw3aRjsUavH/fl/TcbFobhpVwFfiWAm4ZJs4zEME\nsZfF2jScpZuZcE1bZSwecmINfAqW4BLBvK9NLiWvjvzJzq4uqA6bO2QHENYn4V4Y\nW7WSIn7Q0j1imRtcLnSKIdyhlU5mQhgtKyDmdlnb2rySdtEHLwspZnQVIhjTxEd6\n+FezRBCRC2sOIFVs8nZD/EL6452QqN9vYJM+wpTX61u5uw3z/6cmn34XuAVNdqcF\n/ALUY1McUzkBwGB+Z9kfeKAEC+UORv355FnSNXVmr0ddugQjO1yjRrcdp16XB/WA\nwfW3ZRm8M/GND2THm8xVDAgWRNQoOOZDbZvdz3RDsIwZywFA+Zbh4KUv01Lypc8h\n9FoZ+eDcRaKKzXC0PtmxqQnfk4ewJ/Ti5Zq7MhAV1fHOYMfVOISdr42zZm4KLP4i\nmH6Heg8RelE/EkxvjN+Vg1CxnENPCDRJsgmy56nod+YfP5TXyGybIBtW8szZRSHr\nLemmaTbW+EQONeLlJI0w3fASfrCoUp1sOYSf6/FXc7gDtW1Bo1O5BLxqEKgXiNWG\nzLfse7Zk4uTjwRVDWk7OY7o7uCUvDTPHSMXGQWCeA+27lTV0IjgJ4F3zNsGQTZrJ\nP6ghe5Tngrq9tkXeBRDA6iqDXLK7hPm9KH3m0+/cPsgM7unleB2aY5j/KNkdxjwi\nWbbAMkuFeJFDRW43tfhfwZWxtKkBk+THVrUQjzRpP6WhWudK1lHTcdyLnpDcTso+\nqnnSTZrrx19Gje5XmbZ8mRr9IateChLUEIS/Ld9aLe0lHR/3PKevLjtefVMRkeA5\nDRID/UWb4cLGuj3YhAuCgPJgo6GUoYFzQKYzq+m3GTxullqCDbhGG6E5P7UQuggS\nHrtPkrEO7BW9PDJNSSclx1CizG50Y/cpr1UirEkWXNooBCwFAZ1mtysDa9jtM97T\n65f5e8SUpmryjMhJxeNNaeMLmn+EtX2Fa6d0venmhD2apDP7dESmMnuyKreFnZoH\nZIA61TUJ61rE3XPOPu4RTI7/CnOpnoombtJWuAbppc8dqYR5HvyHyFr6s4tBWjWN\nf+jPaKBUFw9b86GKijgYGbbdNFaP3ZviI5FEPQnUnQMlMK0FMot9luc9i/lD1OBC\nqwAr5IU4YSzfFw56cGAM1h6z1J6/IQUR8tfpk59fOfnB+AotfWC/TuqdP2yN/6GY\nPBax9a7jCUY2onMMdDLvhJ75aPkOPLOYnK3WWzYTArSDA0AbA/RyVCpY2XftkzTA\nJPcr8L6YbSMhPcGIsgQ19U+VHT/1B3Qe3FjzmGuW2Sb9ATPzIj6O+lGrvM7Q5Xb2\n0QvP2fSlwXKKBP/Svxzm37qX7DLNwiOwpfRS1xSSGQFlz7nRLSXwytpzGIO4jVPU\n7RGKRJ6NhxvPF9H9pSkvTuB3DNMp1ii1dgG+msJXGKuJKTFA2Dilh5lO4vxE3xBu\nmkacPAIEEgjEfDICsjpzoLo8+7DBvY9EhJZnAkmuFAOWOnFBH31PaokmffMPFZMY\nbziFYxhM8a8CHZwQ7cvrNUUwe8/HkNvbmwRLnkNIirp9dsKDrB/mw8LnzhS8LrPV\nfliMWwpPlCTR/IZSI50Vh0jFa7fh4AaUVVUdCon6Sa7HZp7bUGfxtIFvq+diMrAY\n5pA0MK0ZiUfLANzApFYoE4PN/y67ednEPifQ8W/walS9XLyCbPvsDVP3iQjGQ44a\nza9VPccfhOzSqW6D3BmZHYx2VTti/RtNUCfFD/xvhTsSJ8mxKMhEa4sMzMwuR8Y5\nuYK8/NQ7bdzg2PpG21QWZUPWyVwAfB9UlHyvH7QhX5tDSVS3d7PjNZSS4XVwMW9u\nBpqOQE1wHuRtd5nmLlCy76dFq7UsIPZ6ZCUkvd+SkGv9X5u7IzkqkdsmjMqgk2gb\nvjsxeArTR3zINdzmy3wSted+UH6NKjGvae/DpvfO0NlsAjNxWEPu7EZ722cmoOeb\nNPV/JUkZvNJNHxajsbvEzxQIhFAfZV5g/PniE4fZB1+lff0Fxj7K9P1yzq0b7UMq\n+kMfmAWPZhje3T+SooXD5elgpz1162X7iv8y2hVrXqmhxm90I9T1WUkmPcg6mnLv\ns8lTWPRgxtWHlxbRHIxAWjWQgSE5CJNSzJpJ9coYe+RIQGiYJSR4yzOsBiDbOao/\nzI0R5ClmpxcjKcE+0+ouoDj86KUQ/Vnw8s5iw4HqXXDIv50uPQU1VqhzrXgacocO\nYAPpkTfhykfuTKjHeVz3mSZsmwUixkt4xS9Un8huItFweBEjQZw0JlwHssOsH1rc\nrC2TKiEjDLcO+sFtEQUCjJU6QKH6/ZNucLBc86eZKEpm\n-----END ENCRYPTED PRIVATE KEY-----\n" , certificateIterator);
    console.log(finder.getTransactions());
    let tmp = new Array();
    for(t of certificateIterator){
        tmp.push(t);
    }
    res.json(tmp);
})

//
app.get('/transactions-presence', (req, res) => {
    let certificateIterator = new BlockchainIterator(blockchain, TypeEnum.presence);
    let tmp = new Array();
    for(t of certificateIterator){
        tmp.push(t);
    }
    res.json(tmp);
})

app.get('/transactions-finalGrade', (req, res) => {
    let certificateIterator = new BlockchainIterator(blockchain, TypeEnum.finalGrade);
    let tmp = new Array();
    for(t of certificateIterator){
        tmp.push(t);
    }
    res.json(tmp);
})

app.get('/transactions-partialGrade', (req, res) => {
    let certificateIterator = new BlockchainIterator(blockchain, TypeEnum.partialGrade);
    let tmp = new Array();
    for(t of certificateIterator){
        tmp.push(t);
    }
    res.json(tmp);
})

app.get('/mine-transactions', (req, res)=>{
    const block = miner.mine();
    console.log(`New block added ${block.toString}`);
    res.redirect('/blocks');
})

//api to add blocks
// app.post('/mine',(req,res)=>{
//     const block = blockchain.addBlock(req.body.data);
//     console.log(`New block added: ${block.toString()}`);
//     p2pserver.syncChain();
//     res.redirect('/blocks');
// });

//create transactions
// app.post('/transact', (req, res) => {
//     const {data} = req.body;
//     const transaction = new Transaction(data);
//     transactionPool.add(transaction);
//     p2pserver.broadcastTransaction(transaction);
//     res.redirect('/transactions');
// })

app.post('/transact-presence', (req, res) => {
    const {date, studentID, masterKeyString, lecturerID, verificationKeyString, presence, course, dateClass} = req.body;
    const masterSignatureKey = ChainUtil.createPrivateKey('Lecturer', lecturerID, masterKeyString);
    const verificationKey = ChainUtil.createPrivateKey('Lecturer', lecturerID, verificationKeyString);
    const signatureKey = ChainUtil.createPublicKey(blockchain.getSignatureKey(studentID))

    const signature = ChainUtil.encryptPublic(signatureKey, studentID.toString());
    const masterSignature = ChainUtil.encryptPrivate(masterSignatureKey, studentID.toString());
    const verification = ChainUtil.encryptPrivate(verificationKey, ChainUtil.getVerificationString());

    const builder = new PresenceTransactionBuilder();

    builder.setID(ChainUtil.id());
    builder.setDate(date);
    builder.setSignature(signature);
    builder.setMasterSignature(masterSignature);
    builder.setLecturerID(lecturerID);
    builder.setVerification(verification)
    builder.setPresence(presence);
    builder.setCourse(course);
    builder.setDateClass(dateClass);

    const presenceTransaction = builder.getResult();
    transactionPool.add(presenceTransaction);
    p2pserver.broadcastTransaction(presenceTransaction);
    res.redirect('/transactions');

})

app.post('/transact-certificate', (req, res) => {
    const {date, studentID, masterKeyString, lecturerID, verificationKeyString, certfier, dateOfAward, info, nameOfCertificate} = req.body;
    const masterSignatureKey = ChainUtil.createPrivateKey('Lecturer', lecturerID, masterKeyString);
    const verificationKey = ChainUtil.createPrivateKey('Lecturer', lecturerID, verificationKeyString);
    const signatureKey = ChainUtil.createPublicKey(blockchain.getSignatureKey(studentID))

    const signature = ChainUtil.encryptPublic(signatureKey, studentID.toString());
    const masterSignature = ChainUtil.encryptPrivate(masterSignatureKey, studentID.toString());
    const verification = ChainUtil.encryptPrivate(verificationKey, ChainUtil.getVerificationString());


    const builder = new CertificateTransactionBuilder();

    builder.setID(ChainUtil.id());
    builder.setDate(date);
    builder.setSignature(signature);
    builder.setMasterSignature(masterSignature);
    builder.setLecturerID(lecturerID);
    builder.setVerification(verification)
    builder.setCertifier(certfier);
    builder.setDateOfAward(dateOfAward);
    builder.setInfo(info);
    builder.setNameOfCertificate(nameOfCertificate);

    const certificateTransaction = builder.getResult();
    transactionPool.add(certificateTransaction);
    p2pserver.broadcastTransaction(certificateTransaction);
    res.redirect('/transactions');

})

app.post('/transact-partialGrade', (req, res) => {
    const {date, studentID, masterKeyString, lecturerID, verificationKeyString, course, grade, weight} = req.body;
    const masterSignatureKey = ChainUtil.createPrivateKey('Lecturer', lecturerID, masterKeyString);
    const verificationKey = ChainUtil.createPrivateKey('Lecturer', lecturerID, verificationKeyString);
    const signatureKey = ChainUtil.createPublicKey(blockchain.getSignatureKey(studentID))

    const signature = ChainUtil.encryptPublic(signatureKey, studentID.toString());
    const masterSignature = ChainUtil.encryptPrivate(masterSignatureKey, studentID.toString());
    const verification = ChainUtil.encryptPrivate(verificationKey, ChainUtil.getVerificationString());

    const builder = new PartialGradeTransactionBuilder();

    builder.setID(ChainUtil.id());
    builder.setDate(date);
    builder.setSignature(signature);
    builder.setMasterSignature(masterSignature);
    builder.setLecturerID(lecturerID);
    builder.setVerification(verification)
    builder.setCourse(course);
    builder.setGrade(grade);
    builder.setWeight(weight);

    const partialGradeTransaction = builder.getResult();
    transactionPool.add(partialGradeTransaction);
    p2pserver.broadcastTransaction(partialGradeTransaction);
    res.redirect('/transactions');

})

app.post('/transact-finalGrade', (req, res) => {
    const {date, studentID, masterKeyString, lecturerID, verificationKeyString, course, grade} = req.body;
    const masterSignatureKey = ChainUtil.createPrivateKey('Lecturer', lecturerID, masterKeyString);
    const verificationKey = ChainUtil.createPrivateKey('Lecturer', lecturerID, verificationKeyString);
    const signatureKey = ChainUtil.createPublicKey(blockchain.getSignatureKey(studentID))

    const signature = ChainUtil.encryptPublic(signatureKey, studentID.toString());
    const masterSignature = ChainUtil.encryptPrivate(masterSignatureKey, studentID.toString());
    const verification = ChainUtil.encryptPrivate(verificationKey, ChainUtil.getVerificationString());

    const builder = new FinalGradeTransactionBuilder();

    builder.setID(ChainUtil.id());
    builder.setDate(date);
    builder.setSignature(signature);
    builder.setMasterSignature(masterSignature);
    builder.setLecturerID(lecturerID);
    builder.setVerification(verification)
    builder.setCourse(course);
    builder.setGrade(grade);

    const finalGradeTransaction = builder.getResult();
    transactionPool.add(finalGradeTransaction);
    p2pserver.broadcastTransaction(finalGradeTransaction);
    res.redirect('/transactions');

})

// app server configurations
app.listen(HTTP_PORT,()=>{
    console.log(`listening on port ${HTTP_PORT}`);
})