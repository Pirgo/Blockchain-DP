//const WebSocket = require('ws');
const dgram = require('dgram');
//declare the peer to peer server port 
const P2P_PORT = process.env.P2P_PORT || 5001;
const P2P_ADDR = "192.168.100.52"   //TODO
//list of address to connect to
//const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
const server = dgram.createSocket('udp4');
server.bind(P2P_PORT, P2P_ADDR);
const MESSAGE_TYPE = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION',
    clear_transactions: 'CLEAR_TRANSACTIONS',
    table: 'table'   //tabela z adresami i portami peerów

}

class P2pserver {
    constructor(blockchain, transactionPool) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.peers = [];
        server.on('listening', function () {
            var address = server.address();
            console.log('UDP Server listening on ' + address.address + ':' + address.port);
        });
        this.messageHandler()
        this.send({"type":"register"},'172.104.240.26',5001)
        this.send({"type":"ask"},'172.104.240.26',5001)
    }

    // create a new p2p server and connections
    multicast(msg) {
        console.log("multicast")
        this.peers.forEach(peer => {
            this.send(msg, peer.addr, peer.port)
        });
    }
    send(msg, addr, port) {
        console.log("send")
        let msgStr = JSON.stringify(msg)
        server.send(msgStr, 0, msgStr.length, port, addr, function (err, bytes) {
            if (err) throw err;
            console.log('UDP message sent to ' + addr + ':' + port);
        });
    }
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
        server.on('message',  (message, remote)=> {
            const data = JSON.parse(message);
            console.log(data)
            switch (data.type) {
                case MESSAGE_TYPE.chain:
                    this.blockchain.replaceChain(data.chain);
                    break;
                case MESSAGE_TYPE.transaction:
                    this.transactionPool.add(data.transaction);
                    break;
                case MESSAGE_TYPE.clear_transactions:
                    this.transactionPool.clear();
                    break;
                case MESSAGE_TYPE.table:
                    this.peers = data.table
                    console.log(this.peers)
                    this.multicast({"type":"none"})
                    break;

            }

        });
    }

    sendChain() {
        this.multicast({
            type: MESSAGE_TYPE.chain,
            chain: this.blockchain.chain
        });
    }

    syncChain() {
        this.sendChain
    }

    broadcastTransaction(transaction) {
        console.log("broadcast transaction")
        this.multicast({"type":MESSAGE_TYPE.transaction,"transaction": transaction})
    }


    // sendTransaction(socket, transaction) {
    //     socket.send(JSON.stringify({
    //         type: MESSAGE_TYPE.transaction,
    //         transaction: transaction
    //     })
    //     );
    // }

    broadcastClearTransactions() {
        
            this.multicast({ type: MESSAGE_TYPE.clear_transactions })
        
    }
}



module.exports = P2pserver;