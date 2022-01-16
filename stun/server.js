const PORT = 5001;
const HOST = '192.168.100.52'//"172.104.240.26";
const TIME = 120 //2 minuty
var dgram = require('dgram');
const { parse } = require('querystring');

const server = dgram.createSocket('udp4');

const stunTable = new Map()

function timeoutHandler() {
    let deadList = []
    stunTable.forEach((val, key, map) => {

        if (val.ttl <= 0) {
            deadList.push(key)
        } else {
            val.ttl -= 10
        }

    })
    deadList.forEach(element => {
        stunTable.delete(element)
    });
    notify()

}
function send(msg, addr, port) {
    msgStr = JSON.stringify(msg)
    server.send(msgStr, 0, msgStr.length, port, addr, function (err, bytes) {
        if (err) throw err;
        //console.log('UDP message sent to ' + addr + ':' + port);
    });
}
function notify() {  //rozesłanie tablicy stun wszystkim peerom
    let toSend = []
    stunTable.forEach((val, key, map) => {
        //host = key.split(":")   //oddzielenie adresu od portu
        //host[1] = parseInt(host[1])
        toSend.push({ "addr": val.addr, "port": val.port })
    })
    stunTable.forEach((val, key, map) => {
        let filtered = toSend.filter((el) => { return el.addr != val.addr || el.port != val.port }) //nie wysyłamy peerowi jego adresu
        //if (filtered.length > 0)
        send({ "type": "table", "table": filtered }, val.addr, val.port)
    })
}
server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ':' + address.port);
    setInterval(timeoutHandler, 10000);
});

server.on('message', function (message, remote) {
    //console.log("message from:")
    //console.log(remote.address + ':' + remote.port + ' - ' + message);

    let parsedMsg
    try {
        parsedMsg = JSON.parse(message)
    } catch (error) {
        console.error("message parsing error")
        return
    }
    let pair = remote.address + ":" + remote.port
    switch (parsedMsg.type) {
        case "register":    //rejestracja adresu i portu
            //console.log("registering new peer")
            stunTable.set(pair, { addr: remote.address, port: remote.port, ttl: TIME })
            notify()
            break;
        case "alive":   //odpowiedź na "ping" - peer uczestniczy w sieci
            try {
                let peer = stunTable.get(pair)
                peer.ttl = TIME
            } catch (e) {
                stunTable.set(pair, { addr: remote.address, port: remote.port, ttl: TIE }) //jeśli peer odnawia uczestnictwo, ale serwer go usunął. doda go na nowo
                notify()
            }
            break;
        case "ask":     //pytanie o adresy:porty innych peerów
            console.warn("type:'ask' deprecated")
            notify
            break
        case "none":    //garbage do robienia dziury NAT
            break
        default:
            console.warn("unrecognized message type")
            break;
    }
    // console.log(stunTable)

});

server.bind(PORT, HOST);