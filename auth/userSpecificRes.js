var express = require('express')
var router = express.Router()
const Route = require('../lib/Route.js');
const _ = require('lodash')

let route = new Route();
route.setAuthUsers(['SUPER_ADMIN'])

route.addMiddleWare((req, res, next) => {
  let isAuthorized = Route.isUserAuthorized(res, route);
  console.log(isAuthorized);

  if(isAuthorized === false) {
    res.send({'message': 'User is not authorize.'})
  }
  else {
    next();
  }
});

route.addMiddleWare((req, res, next) => {
  res.locals.token = req.headers.token;
  console.log('USR Route')
  next();
});

// decode the token
route.addMiddleWare((req, res, next) => {
  let authUserInfo = res.locals.authUserInfo;

  res.send({'decoded': authUserInfo})
  next();
});

router.post('/', route.getMiddleWareList());

module.exports = router
