const Route = require('./Route');
const auth = require('./auth');
const utils = require('./utils');
const ErrorUtils = require('./ErrorUtils');

const boilerplateLib = {};
module.exports = boilerplateLib;

boilerplateLib.Route = Route;
boilerplateLib.auth = auth;
boilerplateLib.utils = utils;
boilerplateLib.ErrorUtils = ErrorUtils;

