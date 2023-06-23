'use strict'

const write = require('../write')
//const isSpatial = require('../utils')
//const extractSpatialData = require('../utils')


function isSpatial(topic) {
  return topic.startsWith('sp:')
}

function extractSpatialData(topic) {
  const first = topic.indexOf('<')
  const last = topic.lastIndexOf('>')
  return JSON.parse(topic.slice(first+1, last))
}

function PubAck (packet) {
  this.cmd = 'puback'
  this.messageId = packet.messageId
}

function PubRec (packet) {
  this.cmd = 'pubrec'
  this.messageId = packet.messageId
}

const publishActions = [
  authorizePublish,
  enqueuePublish
]

const spatialpublishActions = [
  authorizePublish,
  enqueuePublish,
  spatialPublish
]

function handlePublish (client, packet, done) {
  const topic = packet.topic
  //console.log('Handle publish of packet with topic <'+topic+'>')

  let err
  if (topic.length === 0) {
    err = new Error('empty topic not allowed in PUBLISH')
    return done(err)
  }
  if (topic.indexOf('#') > -1) {
    err = new Error('# is not allowed in PUBLISH')
    return done(err)
  }
  if (topic.indexOf('+') > -1) {
    err = new Error('+ is not allowed in PUBLISH')
    return done(err)
  }

  if (isSpatial(topic)) {
    //console.log('Spatial publish <'+msg.x+','+msg.y+','+msg.radius+','+msg.channel+','+packet.payload+'>')

    //console.log('packet.cmd: '+packet.cmd)
    //console.log('packet.brokerId: '+packet.brokerId)
    //console.log('packet.brokerCounter: '+packet.brokerCounter)
    //console.log('packet.topic: '+packet.topic)
    //console.log('packet.payload: '+packet.payload.length)
    //console.log('packet.qos: '+packet.qos)
    //console.log('packet.retain: '+packet.retain)
    //console.log('packet.dup: '+packet.dup)
    //console.log('packet.messageId: '+packet.messageId)
    //console.log('publish => client <'+client.id+'>')
    //console.log('done => '+done.toString())
    client.broker._series(client, spatialpublishActions, packet, done)
    //done(packet, client)
    //console.log('publish => Finished spatialpublishActions')
    //console.trace()
   /* switch (packet.qos) {
      case 2:
        write(client, new PubRec(packet), done)
        break
      case 1:
        write(client, new PubAck(packet), function (err) {
          if (err) {
            return done(err)
          }
          noop
        })
        break
      case 0:
        break
      default:
      // nothing to do
    }*/
  } else {
    client.broker._series(client, publishActions, packet, done)
    //console.log('publish => Finished publishActions')
    //console.trace()
  }
}

function enqueuePublish(packet, done) {
  const client = this

  switch (packet.qos) {
    case 2:
      client.broker.persistence.incomingStorePacket(client, packet, function (err) {
        if (err) { return done(err) }
        write(client, new PubRec(packet), done)
      })
      break
    case 1:
      write(client, new PubAck(packet), function (err) {
        if (err) { return done(err) }
        client.broker.publish(packet, client, done)
      })
      break
    case 0:
      //console.log("Publish::enqueuePublish => enqueuePublish to client <"+client.id+">")
      //console.log('done => '+done.toString())
      client.broker.publish(packet, client, done)
      break
    default:
      // nothing to do
  }
}

function authorizePublish (packet, done) {
  this.broker.authorizePublish(this, packet, done)
}


function spatialPublish (packet, done) {
  //console.log('spatialpublish done function '+done.name)
  const client = this
  const msg = extractSpatialData(packet.topic)
  var payload = JSON.stringify(packet)
  //that = this
  client.broker.matcher.publish(
    client.id,
    msg.x,
    msg.y,
    msg.radius,
    payload,
    msg.channel, done)
}

module.exports = handlePublish
