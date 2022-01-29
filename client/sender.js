class Sender {
    peers
    constructor(server, peers) {
        this.server = server
        this.peers = peers
    }
    send = function (msg, addr, port) {
        console.log("sending message to " + addr + ":" + port)
        let msgStr = JSON.stringify(msg)
        this.server.send(msgStr, 0, msgStr.length, port, addr, function (err, bytes) {
            if (err) throw err;
        });
    }
    multicast = function (msg) {
        this.peers.forEach(peer => {
            this.send(msg, peer.addr, peer.port)
        });
    }
    garbage = function () {
        this.multicast({ "type": "none" })  //garbage do zrobienia dziury NAT
    }
    ask = function () {
        this.multicast({
            type: "ASK" //todo enum
        })
    }
}
module.exports = Sender