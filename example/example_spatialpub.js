var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://localhost:1883')

var publish = {
            x : 27,
            y : 27,
            radius : 5,
            channel : 1
        };

var payload = 'Hello spatial MQTT <10,10,30>'
var subscribe = {x: 10, y: 10, radius: 30, channel: 1};

//var topic = 'normal MQTT'
//console.log('Subscribing to topic: '+topic)
//client.subscribe(topic)


/*
console.log('Publishing message to topic: '+topic)
var msg = 'Hello Normal MQTT'
client.publish(topic, msg)

console.log('Unsubscribing from topic: '+topic)
client.unsubscribe(topic)
*/

topic = 'sp: <'+JSON.stringify(subscribe)+'>'
//console.log('Subscribing to topic: '+topic)
//client.subscribe(topic)
//console.log('Unsubscribing from topic: '+topic)
//client.unsubscribe(topic)


msg = 'sp: <'+JSON.stringify(publish)+'>'
console.log('Publishing message to topic: '+topic)
client.publish(topic, payload)

client.on('message', function (topic, message) {
  console.log(message.toString())
})


setTimeout(function () {
	console.log('Ending connecting')
	client.end()
  }, 
500);


