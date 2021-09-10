const _ = require('lodash');
const express = require('express')
const router = express.Router()

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
};

Route.prototype.addMiddleWare = function(middleware) {
  if(!_.isFunction(middleware)) {
    throw new Error('Middleware is not a function.');
  }
  this.middlewareList.push(middleware);
}

Route.prototype.setPublic = function() {
  this.isPublic = true;
  console.log(this.isPublic);
  console.log("isPublic");
}

Route.prototype.setAuthUsers = function(userList) {
  if(_.isArray(userList) == false) {
    throw new Error('User List is not an array.');
  }
  this.authUserList = userList;
}

Route.prototype.getRouter = function() {
  return router[this.method](this.path, this.middlewareList);
}

const isUserAuthorized = function(res, route) {
  let isAuthorized = false;
  let isPublic = route.isPublic;
  let authUserList = route.authUserList;

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
  return isAuthorized;
}

Route.isUserAuthorized = isUserAuthorized;
module.exports = Route;