const TransactionBuilder = require("../blockchain/transactions/builders/transactionBuilder")
const PresenceTransactionBuilder = require("../blockchain/transactions/builders/presenceTransactionBuilder");
const CertificateTransactionBuilder = require("../blockchain/transactions/builders/certificateTransactionBuilder");
const PartialGradeTransactionBuilder = require("../blockchain/transactions/builders/partialGradeTransactionBuilder");
const FinalGradeTransactionBuilder = require("../blockchain/transactions/builders/finalGradeTransactionBuilder");

class ConflictSolver {
    peers
    ready
    blockchain
    constructor(blockchain, peers, pool) {
        this.candidates = []   //unikalne chainy nadesłane przez peery
        this.identifiers = []
        this.counts = []   //liczby odpowiednich blockchainów w sieci
        this.peers = peers
        this.ready = false    //peer nie bierze udziału w sieci dopóki nie będzie miał chaina
        this.blockchain = blockchain
        this.pool = pool
        console.log("solver blockchain:")
        console.log(this.blockchain)
    }
    //peers:this.peers,

    reset = function () {
        this.candidates = []
        this.counts = []
    }
    append = function (chain, transactionPool) {
        const identifier = chain.chain.reduce((acc, e) => {
            acc += e.hash;
        }, '')
        let index = this.identifiers.indexOf(identifier)
        if (index == -1) {      //jeśli takiego blockchainu jeszcze nie dostałem...
            this.identifiers.push(identifier);
            this.candidates.push(chain)     //dodaję do kandydatów
            this.counts.push(1)
        } else {
            this.counts[index]++    //wpp zapamiętuję że jest to kolejny
        }
        let topCount = Math.max.apply(undefined ,this.counts);   //liczę ile peerów ma najpopularniejszy blockchain
        if (topCount >= Math.ceil(this.peers.length / 2)) {    //jeśli dany blockchain ma więcej niż połowa peerów...
            this.blockchain.replaceChain(this.candidates[this.counts.indexOf(topCount)])    //...nadpisuję swój blockchain tym, ktrego ma najwięcej peerów
            for (let i = 0; i < transactionPool.transactions.length; i++) {
                const element = transactionPool.transactions[i];
                let builder;
                switch(element.type){
                    case TypeEnum.certificate: {
                        builder = new CertificateTransactionBuilder();
                        break;
                    }
                    case TypeEnum.presence: {
                        builder = new PresenceTransactionBuilder();
                        break;
                    }
                    case TypeEnum.partialGrade: {
                        builder = new PartialGradeTransactionBuilder();
                        break;
                    }
                    case TypeEnum.finalGrade: {
                        builder = new FinalGradeTransactionBuilder();
                        break;
                    }
                    default:
                        res.status(400).json("Wrong transaction type");
                        return;
                }
                builder.buildFromJSON(element)
                const transaction = builder.getResult();
                this.pool.add(transaction)
            }
            this.ready = true

            console.log("blockchain accepted")
            console.log(this.blockchain.chain);
            this.reset()
        }

    }

}
module.exports = ConflictSolver