const PORT = 5001;
const HOST = '172.104.240.26'; //TODO
const TIME = 120000 //2 minuty
var dgram = require('dgram');
const { parse } = require('querystring');

const server = dgram.createSocket('udp4');

var stunTable = new Map()
//stunTable.set("192.168.100.52", { "port": PORT, timeout })

function timeoutHandler(key) {
    return setTimeout(() => {
        stunTable.delete(key)   //wyrejestrowanie peera z tablicy
        notify()

    }, TIME)
}
function send(msg, addr, port) {
    msgStr = JSON.stringify(msg)
    server.send(msgStr, 0, msgStr.length, port, addr, function (err, bytes) {
        if (err) throw err;
        console.log('UDP message sent to ' + addr + ':' + port);
    });
}
function notify() {  //rozesłanie tablicy stun wszystkim peerom
    toSend = []
    stunTable.forEach((val, key, map) => {
        host = key.split(":")   //oddzielenie adresu od portu
        host[1] = parseInt(host[1])
        toSend.push({ "addr": host[0], "port": host[1] })
    })
    toSend.forEach(element => {
        send({ "type": "table", "table": toSend }, element.addr, element.port)
    });
}
server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ':' + address.port);
});

server.on('message', function (message, remote) {
    console.log("message from:")
    console.log(remote.address + ':' + remote.port + ' - ' + message);

    let parsedMsg
    try {
        parsedMsg = JSON.parse(message)
    } catch (error) {
        console.error("message parsing error")
        return
    }
    let pair = remote.address+":"+remote.port
    switch (parsedMsg.type) {
        case "register":    //rejestracja adresu i portu
            console.log("registering new peer")
            stunTable.set(pair,  timeoutHandler(remote.address))
            notify()
            break;
        case "alive":   //odpowiedź na "ping" - peer uczestniczy w sieci

            let peer = stunTable.get(pair)
            clearTimeout(peer)
            peer = timeoutHandler(pair) //odnowienie dzierżawy w tablicy peerów
        case "ask":     //pytanie o adresy:porty innych peerów
            console.warn("type:'ask' deprecated")
            notify          
            break
        default:
            console.warn("unrecognized message type")
            break;
    }
    console.log(stunTable)

});

server.bind(PORT, HOST);