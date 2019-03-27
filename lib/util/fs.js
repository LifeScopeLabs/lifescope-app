import fs from 'fs';

import glob from 'glob';

export default {
  find: function(pattern, options) {
    return new Promise(function(resolve, reject) {
      glob(pattern, options, function(err, files) {
        if (err) {
          reject(err);
        }
        else {
          resolve(files);
        }
      });
    });
  },

  readFile: function(name) {
    return new Promise(function(resolve, reject) {
      fs.readFile(name, function(err, buffer) {
        if (err) {
          reject(err);
        }
        else {
          resolve(buffer);
        }
      });
    });
  }
};
