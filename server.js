import 'idempotent-babel-polyfill';
import BitScoop from 'bitscoop-sdk';
import config from 'config';
import express from 'express';
import http from 'http';
import mongodb from 'mongodb';
import {Nuxt, Builder} from 'nuxt';
import nuxtConfig from './nuxt.config.js';

const BITSCOOP_API_KEY = config.bitscoop.api_key;
const MONGODB_URI = config.mongodb.address;
const ICE_SERVERS = config.iceServers;
const LISTEN_PORT = config.listenPort;
const opts = {
  poolSize: 5
};


const bitscoop = new BitScoop(BITSCOOP_API_KEY, config.bitscoop.arguments);

const app = express();

const nuxt = new Nuxt(nuxtConfig);
const builder = new Builder(nuxt);


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

    bitscoop: bitscoop,

    iceServers: ICE_SERVERS
  };

  // CORS
  app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


  builder.build();
  app.use(nuxt.render);
  app.listen(LISTEN_PORT);
  console.log('Nuxt App listening on: ' + LISTEN_PORT);


});
