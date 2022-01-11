const PORT = 5001;
const HOST = '192.168.100.52';
const TIME = 120000 //2 minuty
var dgram = require('dgram');

var server = dgram.createSocket('udp4');

var stunTable = new Map()
//stunTable.set("192.168.100.52", { "port": PORT, timeout })

function timeoutHandler(key) {
    return setTimeout(() => { stunTable.delete(key) }, TIME)
}
function send(msg,addr,port){
    msgStr = JSON.stringify(msg)
    server.send(msgStr, 0, msgStr.length, port, addr, function(err, bytes) {
        if (err) throw err;
        console.log('UDP message sent to ' + addr +':'+ port); 
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
    switch (parsedMsg.type) {
        case "register":    //rejestracja adresu i portu
            console.log("registering new peer")
            stunTable.set(remote.address, { "port": remote.port, "timeout": timeoutHandler(remote.address) })
            break;
        case "alive":   //odpowiedź na "ping" - peer uczestniczy w sieci
            let peer = stunTable.get(remote.address)
            clearTimeout(peer.timeout)
            peer.timeout = timeoutHandler(peer.address) //odnowienie dzierżawy w tablicy peerów
        case "ask":     //pytanie o adresy:porty innych peerów
            toSend = [] 
            stunTable.forEach((val, key, map) => {
                toSend.push({ "addr": key, "port": val.port })
            })
            send({"type":"table","table":toSend},remote.address,remote.port)
            break
        default:
            console.warn("unrecognized message type")
            break;
    }
    console.log(stunTable)

});

server.bind(PORT, HOST);