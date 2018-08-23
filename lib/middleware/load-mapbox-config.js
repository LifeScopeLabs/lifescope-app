const config = require('config');

module.exports = async function(req, res, next) {
  req.mapbox = {
    accessToken: config.mapbox.access_token,
    options: {
      style: 'mapbox://styles/mapbox/light-v9',
      center: [-96, 37.8],
      zoom: 3
    }
  };

  next();
};
