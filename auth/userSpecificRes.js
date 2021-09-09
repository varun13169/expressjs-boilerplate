const Route = require('../lib/Route.js');
const _ = require('lodash')

let route = new Route('POST', '/user-specific-res');
route.setAuthUsers(['SUPER_ADMIN'])

route.addMiddleWare((req, res, next) => {
  let isAuthorized = Route.isUserAuthorized(res, route);

  if(isAuthorized === false) {
    res.send({'message': 'User is not authorize.'})
  }
  else {
    next();
  }
});

route.addMiddleWare((req, res, next) => {
  res.locals.token = req.headers.token;
  next();
});

// decode the token
route.addMiddleWare((req, res, next) => {
  let authUserInfo = res.locals.authUserInfo;

  res.send({'decoded': authUserInfo})
  next();
});

module.exports = route.getRouter();
