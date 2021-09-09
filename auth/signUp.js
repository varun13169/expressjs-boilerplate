var express = require('express')
var router = express.Router()
const _ = require('lodash')
var db = require('../DBModule/index.js');
const Route = require('../lib/Route.js');

let route = new Route();
route.setPublic();

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
  let body = req.body;

  let user = {
    email: body.email,
    password: body.password
  }

  res.locals.user = user;
  next();
});

route.addMiddleWare((req, res, next) => {
  let user = res.locals.user;

  console.log(route.isUserAuthorized);
  if(_.find(db.users, {'email': user.email})) {
    res.send({
    'message': 'User Already exist'
  });
  }
  else {
    next();
  }
});

route.addMiddleWare((req, res, next) => {
  let user = res.locals.user;
  db.users.push(user);
  
  res.send({
    'message': 'User Added'
  });
  next();
})



router.post('/', route.getMiddleWareList());

module.exports = router