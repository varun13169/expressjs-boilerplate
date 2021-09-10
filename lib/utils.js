const _ = require('lodash');
const fs = require('fs');
const auth = require('lib/auth.js');

const utils = {};

utils.addAuthInfoToReq = function(req, res, next) {
  if(_.has(req.headers, 'token')) {
    let decoded = auth.decodeToken(req.headers.token);
    res.locals.authUserInfo = decoded
  }
  next();
};

utils.mountModulesSync = function(rootPath, application) {
  let files = fs.readdirSync(rootPath);

  for (let i = 0; i < files.length; i++) {
    let filePath = rootPath + '/' + files[i];
    let isDir = fs.lstatSync(filePath).isDirectory();
    
    if(isDir === true) {
      utils.mountModulesSync(filePath, application);
    }
    else {
      application.use('/', require(filePath));
    }
  }
}

module.exports = utils;