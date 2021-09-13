const _ = require('lodash');
const fs = require('fs');
const auth = require('lib/auth.js');

const utils = {};

utils.addAuthInfoToReq = function(req, res, next) {
  if(_.has(req.headers, 'token')) {
    auth.decodeToken(req.headers.token)
    .then((decoded) => {
      res.locals.authUserInfo = decoded;
      next();
    })
    .catch(next);
  }
  else {
    next();
  }
};

utils.mountModulesSync = function(rootPath, handler) {
  let files = fs.readdirSync(rootPath);

  for (let i = 0; i < files.length; i++) {
    let filePath = rootPath + '/' + files[i];
    let isDir = fs.lstatSync(filePath).isDirectory();
    
    if(isDir === true) {
      utils.mountModulesSync(filePath, handler);
    }
    else {
      handler(filePath);
    }
  }
}

module.exports = utils;