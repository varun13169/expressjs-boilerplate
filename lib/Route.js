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

/**
 * Append the function to the array of middlewares.
 *
 * @param {function} middleware - middleware function.
 * @return {Route} route instance.
 */
Route.prototype.addMiddleWare = function(middleware) {
  if(!_.isFunction(middleware)) {
    throw new Error('Middleware is not a function.');
  }
  this.middlewareList.push(middleware);

  return this;
}

/**
 * Set if route is to be made public.
 *
 * @return {Route} route instance.
 */
Route.prototype.setPublic = function() {
  this.isPublic = true;
}

/**
 * Set authorized user.
 *
 * @param {string[]} authUserList - authorized user list.
 * @return {Route} route instance.
 */
Route.prototype.setAuthUsers = function(authUserList) {
  if(_.isArray(authUserList) == false) {
    throw new Error('User List is not an array.');
  }
  this.authUserList = authUserList;
}

/**
 * Set schema to validate body.
 *
 * @param {Object} schema - schema obj.
 * @return {Route} route instance.
 */
Route.prototype.setValidBodySchemaModel = function(schema) {
  if(_.isObject(schema) === false) {
    throw new Error('Schema not an object.');
  }
  this.validBodySchemaModel = ajv.compile(schema);
}

/**
 * Set schema to validate query.
 *
 * @param {Object} schema - schema obj.
 * @return {Route} route instance.
 */
Route.prototype.setValidQuerySchemaModel = function(schema) {
  if(_.isObject(schema) === false) {
    throw new Error('Schema not an object.');
  }
  this.validQuerySchemaModel = ajv.compile(schema);
}

/**
 * Set schema to validate params.
 *
 * @param {Object} schema - schema obj.
 * @return {Route} route instance.
 */
Route.prototype.setValidParamsSchemaModel = function(schema) {
  if(_.isObject(schema) === false) {
    throw new Error('Schema not an object.');
  }
  this.validParamsSchemaModel = ajv.compile(schema);
}

/**
 * Return the express router.
 *
 * @return {Route} route instance.
 */
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

/**
 * Set schema to validate params.
 * 
 * @param {AdjModel} schemaModel - schema model.
 * @param {Object} payload - payload obj.
 * @param {Object} req - req obj.
 * @param {Object} res - res obj.
 * @param {function} next - middelware function.
 * @return {Route} route instance.
 */
const validateSchema = function(schemaModel, payload, req, res, next) {
  let isValid = schemaModel(req[payload]);
  if(isValid === true) {
    next();
  }
  else {
    throw new Error(`${payload} does not match schema`);
  }
}

/**
 * Set schema to validate params.
 * 
 * @param {boolean} isPublic - schema model.
 * @param {Object} payload - payload obj.
 * @param {Object} req - req obj.
 * @param {Object} res - res obj.
 * @param {function} next - middelware function.
 * @return {Route} route instance.
 */
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

module.exports = Route;