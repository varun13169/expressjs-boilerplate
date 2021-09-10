const _ = require('lodash');
const jwt = require('jsonwebtoken');
const secretKey = 'shhhhh'; // will be taking from config

const auth = {};

auth.decodeToken = function(token) {
  let authInfo = jwt.verify(token, secretKey);
  return authInfo;
}

auth.getToken = function(payload) {
  let token = jwt.sign(payload, secretKey);
  return token;
}

module.exports = auth;