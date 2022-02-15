//const WebSocket = require('ws');
import("../blockchain/blockchain.js")
const dgram = require('dgram');
const TransactionBuilder = require('../blockchain/transactions/builders/transactionBuilder');
const ConflictSolver = require("./confilctSolver")
const Sender = require("./sender")
const Blockchain = require('../blockchain/blockchain');
const { throws } = require("assert");
//declare the peer to peer server port 

const P2P_PORT = process.env.P2P_PORT || 5001;

//const STUN_ADDR = "192.168.100.52"
const STUN_ADDR = '172.104.240.26' 
const STUN_PORT = 5001
const KEEP_ALIVE_INTERVAL = 10000
const COLLISION = 5000  //czas mniejszy od czasu kopania, ale większy od czasu propagacji
//list of address to connect to
//const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
const server = dgram.createSocket('udp4');

const MESSAGE_TYPE = {
    chain: 'CHAIN', //odpowiedź z blockchainem
    transaction: 'TRANSACTION',     //nowa transakcja w puli
    clear_transactions: 'CLEAR_TRANSACTIONS',   //deprecated
    new_block: 'NEW_BLOCK',  //nowy blok 
    ask: 'ASK',  //pytanie o blockchain
    table: 'table',   //tabela z adresami i portami peerów //todo uppercase na serwerze
    register: 'register', //rejestracja na serwerze
    alive: 'alive',   //przedłużenie połączenia
    unregister: 'unregister' //wyrejestrowanie z serwera

}

class P2pserver {
    constructor(blockchain, transactionPool) {
        this.peers = new Array();
        this.transactionPool = transactionPool;
        this.blockchain = blockchain;

        this.conflictSolver = new ConflictSolver(this.blockchain, this.peers, this.transactionPool)
        this.sender = new Sender(server, this.peers)

        this.ip = Object.values(require('os').networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i.family === 'IPv4' && !i.internal && i.address || []), [])), [])[0]
        server.bind();  //jak nie działa, zmienić na server.bind(P2P_PORT,this.ip)
        server.on('listening', function () {
            var address = server.address();
            console.log('UDP Server listening on ' + address.address + ':' + address.port);
        });
        this.messageHandler()
        this.sender.send({ "type": MESSAGE_TYPE.register }, STUN_ADDR, STUN_PORT)
        setInterval(() => {
            this.sender.send({ "type": MESSAGE_TYPE.alive }, STUN_ADDR, STUN_PORT)    //informowanie o aktywności/uczestnictwie
            //console.log("im alive")
        }, KEEP_ALIVE_INTERVAL);
        setTimeout(() => {  //dołączenie do sieci; opóźnienie po to aby dostać tablicę peerów
            this.join()
        }, 1000);
    }
    join() {    //procedura dołączania do sieci
        this.conflictSolver.ready = false
        this.conflictSolver.reset();
        this.sender.ask()
    }
    collide() {  //procedura kolizji - bezpieczne rozwiązanie to poczekanie chwili i próba dołączenia do sieci od nowa
        console.log("collision - will retry in " + (COLLISION / 1000.0) + " seconds")
        this.conflictSolver.ready = false
        this.conflictSolver.reset();
        setTimeout(() => {
            console.log("retrying to join network...")
            this.conflictSolver.ready = false
            this.conflictSolver.reset();
            this.sender.ask()
        }, COLLISION);
    }
    messageHandler() {
        server.on('message', (message, remote) => {
            const data = JSON.parse(message);
            console.log("message from:" + remote.address + ":" + remote.port)
            console.log(data)
            switch (data.type) {
                case MESSAGE_TYPE.chain:
                    if (!this.conflictSolver.ready)
                        if (Blockchain.isValidChain(data.chain.chain)) // czy otrzymany chain jest poprawny ?   //TODO nwm czemu nie działa
                            this.conflictSolver.append(data.chain, data.pool)          //biorę go pod uwagę w wyborze najpopularniejszego
                        else
                            console.log("response with invalid chain - ignored")
                    break;
                case MESSAGE_TYPE.transaction:
                    if (this.conflictSolver.ready) {
                        console.log("adding transaction")
                        const builder = new TransactionBuilder();
                        builder.buildFromJSON(data.transaction);
                        const transaction = builder.getResult();
                        if(! this.transactionPool.add(transaction)){
                            console.log("Wrong transaction")
                        };
                    } else {
                        this.collide()
                    }
                    break;
                case MESSAGE_TYPE.clear_transactions:
                    console.warn("clear transactions is deprecated")
                    // this.transactionPool.clear();
                    break;
                case MESSAGE_TYPE.ask:
                    console.log("responding with current blockchain")
                    let msg = { type: MESSAGE_TYPE.chain, chain: this.blockchain, pool: this.transactionPool }
                    let msgStr = JSON.stringify(msg)
                    server.send(msgStr, 0, msgStr.length, remote.port, remote.address, function (err, bytes) {
                        if (err) throw err;
                    });
                    // this.sender.answer(remote.address,remote.port)
                    // this.sender.send({ type: MESSAGE_TYPE.chain, chain: this.blockchain, pool: this.transactionPool }, remote.address, remote.port)
                    break;
                case MESSAGE_TYPE.table:
                    if (data.table.length == 0) {   //jedyny peer w sieci
                        console.log("last peer in the network")
                        this.conflictSolver.ready = true
                    }
                    if (!this.conflictSolver.ready) {
                        if (this.peers.length > data.table.length) {
                            this.collide()
                        }
                        //^ jeśli w trakcie odpytywania o chain, ktoś się rozłączy to odpytuję jeszcze raz

                    }
                    this.peers = data.table
                    this.conflictSolver.peers = data.table
                    this.sender.peers = data.table      //zapisanie peerów
                    this.sender.garbage()   //wybijanie dziury NAT
                    console.log("updated peer table:")
                    console.log(this.peers)

                    break;
                case MESSAGE_TYPE.new_block:
                    if (this.conflictSolver.ready) {
                        let last = this.blockchain.chain[this.blockchain.chain.length - 1]
                        if (last.hash != data.block.hash) {
                            if (last.hash == data.block.lastHash) {
                                for(const t of data.block.data){
                                    const json = {
                                        id: t.id,
                                        type: t.type,
                                        date: t.date,
                                        signature: t.signature,
                                        masterSignature: t.masterSignature,
                                        lecturerID: t.lecturerID,
                                        verification: t.verification
                                    }
                                    const builder = new TransactionBuilder();
                                    builder.buildFromJSON(json);
                                    const transaction = builder.getResult();
                                    if( ! transaction.checkVerification(this.blockchain.getGenesis())){
                                        console.log("Wrong block");
                                        return;
                                    }

                                }
                                console.log("adding a block")
                                this.blockchain.chain.push(data.block)
                                this.transactionPool.clear()
                            }   //todo - to chyba powinno być gdzieś indziej
                            else {
                                console.log("new block not compatible")
                                this.collide();
                            }


                        } else {
                            console.log("block already known")
                        }   //blok nie zostanie dodany jeśli jest identyczny z ostatnim // todo policzyć hash na nowo?
                    } else {
                        this.collide()
                    }


            }

        });
    }
    broadcastBlock(block) {
        this.sender.multicast({
            type: MESSAGE_TYPE.new_block,
            block: block
        })
    }

    sendChain() {
        this.sender.multicast({
            type: MESSAGE_TYPE.chain,
            chain: this.blockchain.chain
        });
    }

    syncChain() {
        this.sendChain();
    }

    broadcastTransaction(transaction) {
        console.log("brodadcasting transaction")
        this.sender.multicast({ "type": MESSAGE_TYPE.transaction, "transaction": transaction })
    }
    unregister() {
        console.log("unregistering...")
        this.sender.send({ "type": MESSAGE_TYPE.unregister }, STUN_ADDR, STUN_PORT)
    }

    // sendTransaction(socket, transaction) {
    //     socket.send(JSON.stringify({
    //         type: MESSAGE_TYPE.transaction,
    //         transaction: transaction
    //     })
    //     );
    // }

    broadcastClearTransactions() {

        this.sender.multicast({ type: MESSAGE_TYPE.clear_transactions })

    }
}



module.exports = P2pserver;