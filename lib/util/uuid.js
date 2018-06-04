const bson = require('bson');
const mongoose = require('mongoose');
const nodeUUID = require('uuid/v4');
const uuidParse = require('uuid-parse');


module.exports = function(value) {
	if (typeof value === 'string') {
		var uuidBuffer = new mongoose.Types.Buffer(uuidParse.parse(value));

		uuidBuffer.subtype(bson.Binary.SUBTYPE_UUID);

		return uuidBuffer.toObject();
	}
	else if (value == null) {
		return nodeUUID().replace(/-/g, '');
	}
	else {
		return value.toString('hex');
	}
};
