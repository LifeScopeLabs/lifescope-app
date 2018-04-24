import config from 'config';
import moment from 'moment';

import {SessionTC} from '../../schema/models/sessions';
import {UserTC} from '../../schema/models/users';


export default async function (req, res, next) {
	if (!req.cookies['cookieconsent']) {
		if (req.cookies['sessionid']) {
			res.clearCookie('sessionid', {
				domain: config.domain,
				secure: true,
				httpOnly: true
			});
		}
	}

	let sessionResult = await SessionTC.getResolver('findMany').resolve({
		args: {
			filter: {
				token: req.cookies['sessionid'],
				expires: {
					$gt: moment.utc().toDate()
				},
				logout: null
			}
		},
		projection: {
			id: true,
			token: true,
			csrf_secret: true,
			expires: true,
			user_id: true,
		}
	});

	if (sessionResult.length > 1) {
		return Promise.reject(new Error('Duplicate session.'));
	}

	if (sessionResult.length === 0) {
		req.session = null;
	}
	else {
		let userResult = await UserTC.getResolver('findOne').resolve({
			args: {
				filter: {
					id: sessionResult[0].user_id.toString('hex')
				}
			}
		});


		let session = sessionResult[0];
		let user = userResult;

		req.session = session;
		req.user = user || null;
	}

	next();
};
