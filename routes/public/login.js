const _ = require('lodash')
const db = require('db/db.js');
const auth = require('lib/auth.js');
const Route = require('lib/Route.js');

let route = new Route('POST', '/login');
route.setPublic();

// authenticate
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
  let user = {
    email: req.body.email,
    password: req.body.password
  };
  res.locals.user = user;
  next();
});

// validate user 
route.addMiddleWare((req, res, next) => {
  let user = res.locals.user;
  if(!_.find(db.users, user)) {
    res.send({
      'message': 'Email and Password combination is incorrect.'
    });
  }
  else {
    next();
  }
});


route.addMiddleWare((req, res, next) => {
  let user = res.locals.user;
  user.role = 'SUPER_ADMIN';
  let token = auth.getToken(user);
  res.locals.token = token;
  next();
});


route.addMiddleWare((req, res, next) => {
  let token = res.locals.token;
  res.send({
    'token': token,
  })
});



module.exports = route.getRouter();
