var mqtt = require('./')
var client = mqtt.connect('mqtt://localhost:1883')

var publish = {
            x : 10,
            y : 10,
            radius : 5,
            channel : 1
        };

var payload = 'Hello spatial MQTT'
var subscribe = {x: 50, y: 50, radius: 60, channel: 1};

		

/*var topic = 'normal MQTT'
console.log('Subscribing to topic: '+topic)
client.subscribe(topic)


console.log('Publishing message to topic: '+topic)
var msg = 'Hello Normal MQTT'
/client.publish(topic, msg)

console.log('Unsubscribing from topic: '+topic)
client.unsubscribe(topic)
*/

topic = 'sp: <'+JSON.stringify(subscribe)+'>'

console.log('Subscribing to topic: '+topic)
client.subscribe(topic)

/*
console.log('Unsubscribing from topic: '+topic)
client.unsubscribe(topic)

msg = 'sp: <'+JSON.stringify(publish)+'>'
console.log('Publishing message to topic: '+topic)
client.publish(topic, payload)
*/


client.on('message', function (topic, message) {
  console.log(message.toString())
})


/*
console.log('Ending connecting')
client.end()
*/
