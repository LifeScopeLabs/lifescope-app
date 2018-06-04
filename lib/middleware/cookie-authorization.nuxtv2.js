import config from 'config';
import moment from 'moment';

let $lookup = {
  $lookup: {
    from: 'users',
    localField: 'user_id',
    foreignField: '_id',
    as: 'users'
  }
};

let $project = {
  $project: {
    _id: false,
    token: true,
    csrf_secret: true,
    expires: true,
    'users._id': true,
    'users.handle': true,
    'users.email': true,
    'users.last_name': true,
    'users.first_name': true,
    'users.last_login': true,
    'users.settings': true
  }
};


export default async function (req, res, next) {
  let mongo = env.databases.mongo;

  // if (!req.cookies['cookieconsent']) {
  //   if (req.cookies['sessionid']) {
  //     res.clearCookie('sessionid', {
  //       domain: config.domain,
  //       secure: true,
  //       httpOnly: true
  //     });
  //   }
  // }

  let $match = {
    $match: {
      token: req.cookies['sessionid'],
      expires: {
        $gt: moment.utc().toDate()
      },
      logout: null
    }
  };

  let sessionResult = await mongo.db('live').collection('sessions').aggregate([$match, $lookup, $project]).toArray();

  if (sessionResult.length > 1) {
    return Promise.reject(new Error('Duplicate session.'));
  }

  if (sessionResult.length === 0) {
    req.session = null;
  }
  else {
    let session = sessionResult[0];

    req.session = session;
    req.user = session.users[0] || null;
  }

  next();
};
