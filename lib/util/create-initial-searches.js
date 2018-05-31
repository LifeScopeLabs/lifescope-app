const crypto = require('crypto');
const _ = require('lodash');
const moment = require('moment');

const { readFile } = require('./fs');
const uuid = require('./uuid');
const sortDictionary = require('./sort-dictionary');


let initialSearches = readFile('fixtures/searches/initial_searches.json');


module.exports = async function(userId) {
  let mongo = env.databases.mongo;
	let data = await initialSearches;

	let searches = JSON.parse(data);

	let promises = _.map(searches, async function(search) {
		let unnamedFilters = _.map(search.filters, function(filter) {
			return _.omit(filter, 'name');
		});

		let hashObj = {
			filters: unnamedFilters
		};

		if (search.query != null) {
			hashObj.query = search.query;
		}

		let sorted = sortDictionary(hashObj);
    let stringifiedSorted = JSON.stringify(sorted);
    let hash = crypto.createHash('sha512').update(stringifiedSorted).digest('hex');

		let existing = await mongo.db('live').collection('searches').findOne({
      hash: hash,
      user_id: userId
    });

		if (existing == undefined) {
      return mongo.db('live').collection('searches').update({
        hash: hash,
        user_id: userId
      }, {
        $setOnInsert: {
          _id: uuid(uuid()),
          count: 1,
          last_run: moment.utc().toDate(),
          filters: search.filters,
          hash: hash,
          user_id: userId,
          favorited: search.favorited,
          icon: search.icon,
          icon_color: search.icon_color,
          query: search.query,
          name: search.name
        }
      }, {
        upsert: true
      });
		}
		else {
			return Promise.resolve();
		}
	});

	await Promise.all(promises);

	return await mongo.db('live').collection('users').update({
    _id: userId
  }, {
    $set: {
      'settings.explorer.initial_searches': true
    }
  });
};
