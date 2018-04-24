import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import config from 'config';
import mongoose from 'mongoose';
import {Nuxt, Builder} from 'nuxt';

import nuxtConfig from './nuxt.config.js';

const MONGODB_URI = config.mongodb.address;

const opts = {
	autoReconnect: true,
	reconnectTries: Number.MAX_VALUE,
	reconnectInterval: 1000,
};

mongoose.connect(MONGODB_URI, opts);

const mongooseConnect = mongoose.connection;

const nuxt = new Nuxt(nuxtConfig);

mongooseConnect.on('error', e => {
	if (e.message.code === 'ETIMEDOUT') {
		console.log(e);
		mongoose.connect(MONGODB_URI, opts);
	}
	console.log(e);
});

mongooseConnect.once('open', () => {
	console.log(`MongoDB successfully connected to ${MONGODB_URI}`);
});