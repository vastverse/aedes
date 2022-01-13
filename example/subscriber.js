var mqtt = require('mqtt')


var _x = parseFloat(process.argv[2]) || 10
var _y = parseFloat(process.argv[3])|| 10
var _r = parseFloat(process.argv[4])|| 30
var _channel = 1
var _timeout = 500 // ms
var _port = parseInt(process.argv[5]) || 1883

function subscriber(x, y, radius, channel, port) {

  var area = {x: x, y: y, radius: radius, channel: channel};
  var topic = 'sp: <'+JSON.stringify(area)+'>'
  var client = mqtt.connect('mqtt://localhost:'+port)
  var messageNum = 0

  client.on('message', function (topic, message) {
    console.log(message.toString())
  })

  console.log('Subscribing to topic: '+topic)
  client.subscribe(topic)

  /*setTimeout(function () {
    console.log('Ending connecting')
    client.end()
  }, _timeout)*/
}

subscriber(_x, _y, _r, _channel, _port)
