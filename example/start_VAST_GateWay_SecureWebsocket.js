'use strict'

const fs = require('fs');
const tls = require('tls');
const http = require('http');
const https = require('https');
const websocket = require('websocket-stream')

const aedesOpts = {
  VAST: true,
  VASTGateway: true,
  VASTx:250,
  VASTy:500,
  VASTport:8000,
  VASTradius:50
}

const aedes = require('../aedes')(aedesOpts);


var servers = [
  startHttps(),
  startHttp(),
];

function startHttps () {
  var server = https.createServer({
    key: fs.readFileSync('/etc/ssl/private/cert.key'),
    cert: fs.readFileSync('/etc/ssl/chain.crt')
  })
  websocket.createServer({
    server: server
  }, aedes.handle)
  server.listen(8883)
  return server
}

function startHttp () {
  var server = http.createServer();
  websocket.createServer({
    server: server
  }, aedes.handle)
  server.listen(8080)
  return server
}

aedes.on('clientError', function (client, err) {
  console.log('client error', client.id, err.message, err.stack)
})

aedes.on('connectionError', function (client, err) {
  console.log('client error', client, err.message, err.stack)
})

aedes.on('publish', function (packet, client) {
  if (client) {
    console.log('message from client', client.id)
  }
})

aedes.on('subscribe', function (subscriptions, client) {
  if (client) {
    console.log('subscribe from client', subscriptions, client.id)
  }
})

aedes.on('client', function (client) {
  console.log('new client', client.id)
})
