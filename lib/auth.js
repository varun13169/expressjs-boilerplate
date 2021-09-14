const _ = require('lodash');
const Promise = require("bluebird");
const jwt = require('jsonwebtoken');
const secretKey = 'shhhhh'; // will be taking from config

const auth = {};

/**
 * Returns Promise with auth token.
 *
 * @param {Object} payload object which needs to be encoded.
 * @return {Promise} promise with token or error.
 */
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

/**
 * Returns Promise with auth info.
 *
 * @param {string} token auth info encoded token.
 * @return {Promise} promise with authInfo or error.
 */
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
}


module.exports = auth;