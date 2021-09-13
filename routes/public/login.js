const _ = require('lodash');
const auth = require('lib/auth.js');
const Route = require('lib/Route.js');
const userComponent = require('components/user');

let route = new Route('POST', '/login');
route.setPublic();

// authenticate
route.addMiddleWare((req, res, next) => {
  let isAuthorized = Route.isUserAuthorized(res, route);

  if(isAuthorized === false) {
    res.send({'message': 'User is not authorize.'});
  }
  else {
    next();
  }
});

// add user details to locals
route.addMiddleWare((req, res, next) => {
  let user = {
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
  };
  res.locals.user = user;
  next();
});

// validate user details
route.addMiddleWare((req, res, next) => {
  let query = res.locals.user;
  userComponent.findUser(query)
  .then((userList) => {
    if( userList.length === 0) {
      res.send({
        'message': 'Email and Password combination is incorrect.'
      });
    }
    else {
      res.locals.userTokenInfo = {
        userId: userList[0]._id,
        email: userList[0].email,
        role: userList[0].role,
        };
      next();
    }
  })
  .catch(next);
});

// generate token
route.addMiddleWare((req, res, next) => {
  let userTokenInfo = res.locals.userTokenInfo;
  auth.getToken(userTokenInfo)
  .then((token) => {
    res.locals.token = token;
    next();
  })
  .catch(next);
});

// send token as response
route.addMiddleWare((req, res, next) => {
  let token = res.locals.token;
  res.send({
    'token': token,
  })
});



module.exports = route.getRouter();
