import 'idempotent-babel-polyfill';
import BitScoop from 'bitscoop-sdk';
import config from 'config';
//import easyRTC from './static/easyrtc/easyrtc.js';
import express from 'express';
import http from 'http';
import mongodb from 'mongodb';
import {Nuxt, Builder} from 'nuxt';
import nuxtConfig from './nuxt.config.js';
//import socketIO from 'socket.io';

const BITSCOOP_API_KEY = config.bitscoop.api_key;
const MONGODB_URI = config.mongodb.address;
const ICE_SERVERS = config.iceServers;
const LISTEN_PORT = config.listenPort;
const NAF_LISTEN_PORT = 7070;
const opts = {
  poolSize: 5
};


const bitscoop = new BitScoop(BITSCOOP_API_KEY, config.bitscoop.arguments);

const nuxt = new Nuxt(nuxtConfig);
const server = express();

const builder = new Builder(nuxt);


// var NAFServer = http.createServer(server);

Promise.resolve()
  .then(async function() {
  let mongo = await new Promise(function(resolve, reject) {
    mongodb.MongoClient.connect(MONGODB_URI, opts, function (err, db) {
      if (err) {
        reject(err);
      }
      else {
        resolve(db);
      }
    });
  });

  global.env = {
    databases: {
      mongo: mongo
    },

    bitscoop: bitscoop

    // iceServers: ICE_SERVERS
  };

  if (process.env.NODE_ENV !== 'production') {
    builder.build();
  }

  server.use(nuxt.render);

  server.listen(LISTEN_PORT);

  console.log('Lifescope App listening on: ' + LISTEN_PORT);

  // start websockets for NAF
  // var socketServer = socketIO.listen(NAFServer, {"log level":1});

  // // start RTC for NAF
  // easyRTC.setOption("appIceServers", ICE_SERVERS);
  // easyRTC.setOption("logLevel", "debug");
  // easyRTC.setOption("demosEnable", false);

  // // Overriding the default easyrtcAuth listener, only so we can directly access its callback
  // easyRTC.events.on("easyrtcAuth", function(socket, easyrtcid, msg, socketCallback, callback) {
  //     easyRTC.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, function(err, connectionObj){
  //         if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
  //             callback(err, connectionObj);
  //             return;
  //         }

  //         connectionObj.setField("credential", msg.msgData.credential, {"isShared":false});

  //         console.log("["+easyrtcid+"] Credential saved!", connectionObj.getFieldValueSync("credential"));

  //         callback(err, connectionObj);
  //     });
  // });

  // // To test, lets print the credential to the console for every room join!
  // easyRTC.events.on("roomJoin", function(connectionObj, roomName, roomParameter, callback) {
  //     console.log("["+connectionObj.getEasyrtcid()+"] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
  //     easyRTC.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
  // });

  // // Start EasyRTC server
  // var rtc = easyRTC.listen(server, socketServer, null, function(err, rtcRef) {
  //     console.log("Initiated");

  //     rtcRef.events.on("roomCreate", function(appObj, creatorConnectionObj, roomName, roomOptions, callback) {
  //         console.log("roomCreate fired! Trying to create: " + roomName);

  //         appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
  //     });
  // });

  // //listen on port
  // NAFServer.listen(NAF_LISTEN_PORT, function () {
  //     //console.log("webServer.listen");
  //     console.log('NAFServer listening on http://localhost:' + NAF_LISTEN_PORT);
  // });

});
