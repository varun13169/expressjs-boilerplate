const _ = require('lodash')
var db = require('../DBModule/index.js');
const Route = require('../lib/Route.js');

let route = new Route('POST', '/signup');
route.setPublic();

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
})


module.exports = route.getRouter();