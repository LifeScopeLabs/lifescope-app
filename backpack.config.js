/* eslint-disable no-unused-vars */
module.exports = {
  webpack: (config, options, webpack) => {
    config.entry.main = [
      './server.js'
    ];

    return config;
  }
};
/* eslint-enable no-unused-vars */