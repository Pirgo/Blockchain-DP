var REMOTEPORT = 5001
var PORT = 5003;
var HOST = '192.168.100.52';
var REMOTEHOST  = '192.168.100.52'//'172.104.240.26'

var dgram = require('dgram');
var message = {type:"register"};
var messageString = JSON.stringify(message)
var client = dgram.createSocket('udp4');
client.bind(HOST)
//var server = dgram.createSocket('udp4');

client.on('listening', function () {
  var address = client.address();
  console.log('UDP Server listening on ' + address.address + ':' + address.port);
});

client.on('message', function (message, remote) {
  console.log("message from:"+remote.address+":"+remote.port)
  console.log(JSON.parse(message))
})

client.send(messageString, 0, messageString.length, REMOTEPORT, REMOTEHOST, function(err, bytes) {
  if (err) throw err;
  console.log('UDP message sent to ' + HOST +':'+ REMOTEPORT); 
});

messageString = JSON.stringify({"type":"ask"})
client.send(messageString, 0, messageString.length, REMOTEPORT, REMOTEHOST, function(err, bytes) {
  if (err) throw err;
  console.log('UDP message sent to ' + REMOTEHOST +':'+ REMOTEPORT);
 // client.close();
});