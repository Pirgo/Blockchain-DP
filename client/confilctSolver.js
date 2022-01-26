class ConflictSolver {
    constructor(blockchain,peers) {
        this.candidates = []   //unikalne chainy nadesłane przez peery
        this.counts = []   //liczby odpowiednich blockchainów w sieci
        this.peers=peers
        this.ready = false    //peer nie bierze udziału w sieci dopóki nie będzie miał chaina
        this.blockchain = blockchain
    }
    //peers:this.peers,

    reset = function () {
        this.candidates = []
        this.counts = []
    }
    append = function (chain) {
        let index = this.candidates.indexOf(chain)
        if (index == -1) {      //jeśli takiego blockchainu jeszcze nie dostałem...
            this.candidates.push(chain)     //dodaję do kandydatów
            this.counts.push(1)
        } else {
            this.counts[index]++    //wpp zapamiętuję że jest to kolejny
        }
        let topCount = this.counts.reduce((prev, curr) => { return max(prev, curr) })   //liczę ile peerów ma najpopularniejszy blockchain
        if (topCount >= Math.ceil(this.peers.length / 2)) {    //jeśli dany blockchain ma więcej niż połowa peerów...
            this.blockchain.replaceChain(this.candidates[this.counts.indexOf(topCount)])    //...nadpisuję swój blockchain tym, ktrego ma najwięcej peerów
            this.ready = true
            this.reset()
        }

    }

}
module.exports=ConflictSolver