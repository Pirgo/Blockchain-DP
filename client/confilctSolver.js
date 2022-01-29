
class ConflictSolver {
    peers
    ready
    blockchain
    constructor(blockchain, peers, pool) {
        this.candidates = []   //unikalne chainy nadesłane przez peery
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

        let index = this.candidates.indexOf(chain)
        if (index == -1) {      //jeśli takiego blockchainu jeszcze nie dostałem...
            this.candidates.push(chain)     //dodaję do kandydatów
            this.counts.push(1)
        } else {
            this.counts[index]++    //wpp zapamiętuję że jest to kolejny
        }
        let topCount = Math.max.apply(undefined ,this.counts);   //liczę ile peerów ma najpopularniejszy blockchain
        if (topCount >= Math.ceil(this.peers.length / 2)) {    //jeśli dany blockchain ma więcej niż połowa peerów...
            console.log(this.candidates[this.counts.indexOf(topCount)]);
            this.blockchain.replaceChain(this.candidates[this.counts.indexOf(topCount)])    //...nadpisuję swój blockchain tym, ktrego ma najwięcej peerów
            for (let i = 0; i < transactionPool.transactions.length; i++) {
                const element = transactionPool.transactions[i];
                this.pool.add(element)
            }
            this.ready = true
            console.log("blockchain accepted")
            this.reset()
        }

    }

}
module.exports = ConflictSolver