const _ = require('lodash');
const express = require('express')
const router = express.Router()
const Ajv = require('ajv')
const ajv = new Ajv();

const validMethods = ['post', 'get', 'put', 'delete']

const Route = function(method, path) {

  // Check for valid type
  if(_.isString(method) === true) {
    // lowercase the input
    method = method.toLowerCase();
  }

  if(_.includes(validMethods, method) === false) {
    throw new Error('Not a valid method'); 
  }

  this.method = method;
  this.path = path;
  this.isPublic = false;
  this.authUserList = [];
  this.middlewareList = [];
  this.validBodySchemaModel = null;
  this.validQuerySchemaModel = null;
  this.validParamsSchemaModel = null;
};

Route.prototype.addMiddleWare = function(middleware) {
  if(!_.isFunction(middleware)) {
    throw new Error('Middleware is not a function.');
  }
  this.middlewareList.push(middleware);
}

Route.prototype.setPublic = function() {
  this.isPublic = true;
}

Route.prototype.setAuthUsers = function(userList) {
  if(_.isArray(userList) == false) {
    throw new Error('User List is not an array.');
  }
  this.authUserList = userList;
}

Route.prototype.setValidBodySchemaModel = function(schema) {
  if(_.isObject(schema) === false) {
    throw new Error('Schema not an object.');
  }
  this.validBodySchemaModel = ajv.compile(schema);
}

Route.prototype.setValidQuerySchemaModel = function(schema) {
  if(_.isObject(schema) === false) {
    throw new Error('Schema not an object.');
  }
  this.validQuerySchemaModel = ajv.compile(schema);
}

Route.prototype.setValidParamsSchemaModel = function(schema) {
  if(_.isObject(schema) === false) {
    throw new Error('Schema not an object.');
  }
  this.validParamsSchemaModel = ajv.compile(schema);
}

Route.prototype.getRouter = function() {
  let helperMiddlewares = [];

  // validate body
  if(this.validBodySchemaModel !== null) {
    helperMiddlewares.push(_.partial(validateSchema, this.validBodySchemaModel, 'body'));
  }
  // validate query
  if(this.validQuerySchemaModel !== null) {
    helperMiddlewares.push(_.partial(validateSchema, this.validQuerySchemaModel, 'query'));
  }
  // validate params  
  if(this.validParamsSchemaModel !== null) {
    helperMiddlewares.push(_.partial(validateSchema, this.validParamsSchemaModel, 'params'));
  }
  // authenticate user
  helperMiddlewares.push(_.partial(isUserAuthorized, this.isPublic, this.authUserList));

  this.middlewareList = _.concat(helperMiddlewares, this.middlewareList);
  return router[this.method](this.path, this.middlewareList);
}

const validateSchema = function(schemaModel, payload, req, res, next) {
  let isValid = schemaModel(req[payload]);
  if(isValid === true) {
    next();
  }
  else {
    throw new Error(`${payload} does not match schema`);
  }
}

const isUserAuthorized = function(isPublic, authUserList, req, res, next) {
  let isAuthorized = false;

  if(isPublic === true) {
    isAuthorized = true;
  }
  else {
    let authUserInfo = res.locals.authUserInfo;
    
    if((authUserInfo) && 
       (_.includes(authUserList, authUserInfo.role)) == true) {
      isAuthorized = true;
    }
    else {
      isAuthorized = false;
    }
  }
  // return isAuthorized;
  if(isAuthorized === false) {
    res.send({'message': 'User is not authorize.'})
  }
  else {
    next();
  }
}

Route.
module.exports = Route;