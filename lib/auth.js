const _ = require('lodash');
const Promise = require("bluebird");
const jwt = require('jsonwebtoken');
const secretKey = 'shhhhh'; // will be taking from config

const auth = {};

auth.getToken = function(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secretKey, (err, token) => {
      if(token) {
        resolve(token);
      }
      else if(err){
        reject(err);
      }
    });
  });

}

auth.decodeToken = function(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, authInfo) => {
      if(authInfo) {
        resolve(authInfo);
      }
      else if(err) {
        reject(err);
      }
    });
  });
  // let authInfo = jwt.verify(token, secretKey);
  // return authInfo;
}


module.exports = auth;