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

const STUN_ADDR = '172.104.240.26'    //"192.168.100.52"
const STUN_PORT = 5001
const KEEP_ALIVE_INTERVAL = 30000
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
    register:'register', //rejestracja na serwerze
    alive:'alive',   //przedłużenie połączenia
    unregister:'unregister' //wyrejestrowanie z serwera

}

class P2pserver {
    constructor(blockchain, transactionPool) {
        this.peers = [];
        this.conflictSolver = new ConflictSolver(this.blockchain, this.peers)
        this.sender = new Sender(server,this.peers)
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;

        this.ip = Object.values(require('os').networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i.family === 'IPv4' && !i.internal && i.address || []), [])), [])[0]
        server.bind();  //TODO - jak nie działa, zmienić na server.bind(P2P_PORT,this.ip)
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

    }

    // create a new p2p server and connections


    listen() {
        // create the p2p server with port as argument

        // event listener and a callback function for any new connection
        // on any new connection the current instance will send the current chain
        // to the newly connected peer
        //server.on('connection',socket => this.connectSocket(socket));

        // to connect to the peers that we have specified

    }

    // after making connection to a socket
    // connectSocket(socket) {

    //     // push the socket too the socket array
    //     this.sockets.push(socket);
    //     console.log("Socket connected");
    //     this.messageHandler(socket);
    //     //TODO: zeby 50% akceptowalo zmiane
    //     this.sendChain(socket);

    // }

    // connectToPeers() {

    //     //connect to each peer
    //     peers.forEach(peer => {

    //         // create a socket for each peer
    //         const socket = new WebSocket(peer);

    //         // open event listner is emitted when a connection is established
    //         // saving the socket in the array
    //         socket.on('open', () => this.connectSocket(socket));

    //     });
    // }

    messageHandler() {
        //on recieving a message execute a callback function
        server.on('message', (message, remote) => {
            const data = JSON.parse(message);
            console.log(data)
            switch (data.type) {
                case MESSAGE_TYPE.chain:
                    if (!this.conflictSolver.ready)
                        this.conflictSolver.append(data.chain)
                    break;
                case MESSAGE_TYPE.transaction:
                    //console.log("transaction..." + this.conflictSolver.ready)
                    if (this.conflictSolver.ready) {
                        //todo - weryfikacja
                        console.log("adding transaction")
                        const builder = new TransactionBuilder();
                        builder.buildFromJSON(data.transaction);
                        const transaction = builder.getResult();
                        this.transactionPool.add(transaction);
                    }else{

                    }
                    break;
                case MESSAGE_TYPE.clear_transactions:
                    console.warn("clear transactions is deprecated")
                    // this.transactionPool.clear();
                    break;
                case MESSAGE_TYPE.ask:
                    this.sender.send({ type: MESSAGE_TYPE.chain, chain: this.blockchain ,pool:history.transactionPool}, remote.address, remote.port)
                    break;
                case MESSAGE_TYPE.table:
                    this.peers = data.table
                    //console.log(this.peers)
                    this.sender.garbage()
                    if (this.peers.length == 0) {
                        this.conflictSolver.ready = true
                    }
                    if (!this.conflictSolver.ready) {
                        this.conflictSolver.reset()
                        this.conflictSolver.ready = false
                        this.sender.ask()
                    }
                    break;
                case MESSAGE_TYPE.new_block:
                    if (this.conflictSolver.ready) {
                        let last = this.blockchain.chain[this.blockchain.chain.length - 1]
                        if (last.hash != data.block.hash) {
                            if (last.hash == data.block.lastHash) {
                                console.log("adding a block")
                                this.blockchain.chain.push(data.block)
                                this.transactionPool.clear()
                            }   //todo - to chyba powinno być gdzieś indziej
                            else {
                                //console.log("new block not compatible")
                            }


                        } else {
                            //console.log("block already known")
                        }   //blok nie zostanie dodany jeśli jest identyczny z ostatnim // todo policzyć hash na nowo?
                    } else {
                        this.conflictSolver.ready = false //nowy blok w trakcie odpytywania o blockchain
                        this.conflictSolver.reset();
                        setTimeout(() => {      //czekam aż peery dodają blok
                            this.conflictSolver.ready = false
                            this.conflictSolver.reset();
                            this.sender.ask()       //i próbuję jeszcze raz
                        }, COLLISION);  
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
        //console.log("brodadcasting transaction")
        this.sender.multicast({ "type": MESSAGE_TYPE.transaction, "transaction": transaction })
    }
    unregister(){
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