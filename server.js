import BitScoop from 'bitscoop-sdk';
import config from 'config';
import express from 'express';
import mongodb from 'mongodb';
import {Nuxt, Builder} from 'nuxt';

import nuxtConfig from './nuxt.config.js';

const BITSCOOP_API_KEY = config.bitscoop.api_key;
const MONGODB_URI = config.mongodb.address;

const server = express();

const listenPort = 3002;

const opts = {
  poolSize: 5
};

const nuxt = new Nuxt(nuxtConfig);

const builder = new Builder(nuxt);


const bitscoop = new BitScoop(BITSCOOP_API_KEY, {
  allowUnauthorized: true
});

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
  };

  builder.build();

  // server.use(
  //   '/',
  //   meta,
  //   bodyParser.json(),
  //   cookieParser(),
  //   cookieAuthorization,
  //   views
  // );

  server.use(nuxt.render);

  server.listen(listenPort);

  console.log('Lifescope App listening on: ' + listenPort);
});
