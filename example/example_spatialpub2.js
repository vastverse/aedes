var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://localhost:1884')

var publish = {
            x : 127,
            y : 127,
            radius : 5,
            channel : 1
        };

var payload = 'Hello spatial MQTT <100,100,30>' 
var subscribe = {x: 100, y: 100, radius: 30, channel: 1};

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


//console.log('Ending connecting')
//client.end()

