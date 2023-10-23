// imports
var mqtt = require('mqtt')


const logLayer = 'Client_logs';
const eventsLayer = 'Client_events';
const logFile = 'Client_logs';
const eventsFile = 'Client_events';
const logDirectory = 'logs_and_events';
const eventsDirectory = 'logs_and_events';
const logRecordLevel = 5;
const eventRecordLevel = 5;
const logDisplayLevel = 0;
const eventDisplayLevel = 0;

var events = LOG.newLayer(eventsLayer, eventsFile, eventsDirectory, eventDisplayLevel, eventRecordLevel);


// Gateway information
var broker = "127.0.0.1"
var port = 1883

// Client information
clientAlias = "C1"
client_x = Math.random()*1000;
client_y = Math.random()*1000;
client_radius = 20
var joined = false;

pub_radius = 20
channel = "channel1"
message = "Spatial publication for client C1"


spatialmove_topic = 'cm:'

//const client = mqtt.connect("wss://spat.vastverse.net:443/mqtt", {rejectUnauthorized: false});
var options = {
  clientId: clientAlias,
  username: clientAlias,
  password: JSON.stringify({password: "password", x: client_x, y: client_y}),
}


var that;

var client = mqtt.connect("mqtt://"+broker+":"+port, options);

var register = function(client) {
  that = client

  // wait to receive any message and write it to console
  that.on('message', function (topic, message) {

    _recordEvent(Client_Event.RECEIVE_PUB, {pub: pub});

    console.log("topic ["+topic+"] message ["+message+"]");
    if (topic == options.clientId) {
      var migrateMsg = JSON.parse(message);
      console.log(migrateMsg)
      broker = migrateMsg.matcherAddr.host;
      port = migrateMsg.brokerPort;
      console.log("Migrating to broker mqtt://"+broker+":"+port)
      _recordEvent(Client_Event.CLIENT_DISCONNECT)
			client.end()
      client = mqtt.connect("mqtt://"+broker+":"+port, options);
      register(client);
    }
  })
}

register(client)

that.on('connect', function () {

  _recordEvent(Client_Event.CLIENT_CONNECT, {pos: _pos, radius: _radius, matcherID: _matcherID});

  that.subscribe(options.clientId)

  if (joined === false) {
    console.log("Starting thread to keep on moving");
    joined = true;

    var interval = Math.random() * 100;
    setInterval(function () {
      var x = Math.random() * 1000;
      var y = Math.random() * 1000;
      console.log('connected to port ['+port+'] and moving to <' + x + ',' + y + '>');
      var payload = '<' + JSON.stringify({
        x: x,
        y: y
      }) + '>';
      _recordEvent(Client_Event.CLIENT_MOVE, {oldpos: oldpos});
      that.publish(spatialmove_topic, payload)
    }, interval);

  }

});


# _recordEvent(Client_Event.SUB_NEW, sub)

# _recordEvent(Client_Event.SUB_DELETE, {sub: subID})


// record updates to results file
var _recordEvent = this.recordEvent = function(event, msg){
  //console.log(msg)
  switch (event){

    case Client_Event.CLIENT_JOIN :{
      var data = {
        time : UTIL.getTimestamp(),
        event : Client_Event.CLIENT_JOIN,
        id : _id,
        alias : _alias,
        pos: msg.pos,
        matcher : _matcherID
      }
      events.printObject(data);
      break
    }

    case Client_Event.CLIENT_CONNECT :{
      var data = {
        time : UTIL.getTimestamp(),
        event : Client_Event.CLIENT_CONNECT,
        id : _id,
        alias : _alias,
        pos: msg.pos,
        matcher : _matcherID
      }
      events.printObject(data);
      break
    }


    case Client_Event.CLIENT_MIGRATE :{
      var data = {
        time : UTIL.getTimestamp(),
        event : Client_Event.CLIENT_MIGRATE,
        id : _id,
        alias : _alias,
        pos: msg.pos,
        matcher : _matcherID
      }
      events.printObject(data);
      break
    }

    case Client_Event.CLIENT_MOVE :{
      var data = {
        time : UTIL.getTimestamp(),
        event : Client_Event.CLIENT_MOVE,
        id : _id,
        alias : _alias,
        pos: _pos,
        oldpos: msg.oldpos,
        matcher : _matcherID
      }
      events.printObject(data);
      break;
    }

    case Client_Event.CLIENT_LEAVE :{
      var data = {
        time : UTIL.getTimestamp(),
        event : Client_Event.CLIENT_LEAVE,
        id : _id,
        alias : _alias,
        matcher : _matcherID
      }
      events.printObject(data);
      break;
    }

    case Client_Event.SUB_NEW :{
      var data = {
        time : UTIL.getTimestamp(),
        event : Client_Event.SUB_NEW,
        id : _id,
        alias : _alias,
        matcher: _matcherID,
        sub : msg
      }
      events.printObject(data);
      break;
    }

    case Client_Event.SUB_DELETE :{
      var data = {
        time : UTIL.getTimestamp(),
        event : Client_Event.SUB_DELETE,
        id : _id,
        alias : _alias,
        matcher: _matcherID,
        subID : msg.sub
      }
      events.printObject(data);
      break;
    }


    case Client_Event.PUB :{
      var aoi = new VAST.area(new VAST.pos(msg.pub.x, msg.pub.y), msg.pub.radius);
      var pub = {
        pubID: msg.pub.pubID,
        aoi: aoi,
        channel: msg.pub.channel,
        payload: msg.pub.payload
      }

      var data = {
        time : UTIL.getTimestamp(),
        event : Client_Event.PUB,
        id : _id,
        alias : _alias,
        matcher: _matcherID,
        pub : pub
      }
      events.printObject(data);
      break;
    }


    case Client_Event.RECEIVE_PUB :{
      var data = {
        time : UTIL.getTimestamp(),
        event : Client_Event.RECEIVE_PUB,
        id : _id,
        alias : _alias,
        matcher: _matcherID,
        pub : msg.pub
      }
      events.printObject(data);
      break;
    }
  }