'use strict'

const mqtt = require('mqtt-packet')

function write (client, packet, done) {
  let error = null
  if (client.connecting || client.connected) {
    try {
      //console.log('write.write => starting to write mqtt packet')
      const result = mqtt.writeToStream(packet, client.conn)
      //console.log('write.write => result is: '+result)

      if (!result && !client.errored) {
        client.conn.once('drain', done)
        return
      }
    } catch (e) {
      error = new Error('packet received not valid '+e.toString())
    }
  } else {
    error = new Error('connection closed')
  }

  setImmediate(done, error, client)
}

module.exports = write
