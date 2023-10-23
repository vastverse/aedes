'use strict'


const port = 1883

const aedesOpts = {
  VAST: true,
  VASTGateway: true,
  VASTx:250,
  VASTy:500,
  VASTport:8080,
  VASTradius:50,
  MQTTport:port
}

const aedes = require('../aedes')(aedesOpts)
const server = require('net').createServer(aedes.handle)
const httpServer = require('http').createServer()
const ws = require('websocket-stream')
const wsPort = 8888


server.listen(port, function () {
  console.log('server listening on port', port)
})

ws.createServer({
  server: httpServer
}, aedes.handle)

httpServer.listen(wsPort, function () {
  console.log('websocket server listening on port', wsPort)
})

aedes.on('clientError', function (client, err) {
  console.log('client error', client.id, err.message, err.stack)
})

aedes.on('connectionError', function (client, err) {
  console.log('client error', client, err.message, err.stack)
})

aedes.on('publish', function (packet, client) {
  //if (client) {
  //  console.log('message from client', client.id)
  //}
})

aedes.on('subscribe', function (subscriptions, client) {
  if (client) {
    console.log('subscribe from client', subscriptions, client.id)
  }
})

aedes.on('client', function (client) {
  console.log('new client', client.id)
})
