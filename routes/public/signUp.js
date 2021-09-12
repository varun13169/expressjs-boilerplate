const _ = require('lodash')
const userComponent = require('components/user');
const Route = require('lib/Route.js');

let route = new Route('POST', '/signup');
route.setPublic();

// checking if user is authorized
route.addMiddleWare((req, res, next) => {
  let isAuthorized = Route.isUserAuthorized(res, route);

  if(isAuthorized === false) {
    res.send({'message': 'User is not authorize.'})
  }
  else {
    next();
  }
});

// creating user obj and adding to locals
route.addMiddleWare((req, res, next) => {
  let body = req.body;

  let user = {
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: body.password,
    role: body.role
  }

  res.locals.user = user;
  next();
});

// check if user exist
route.addMiddleWare((req, res, next) => {
  let user = res.locals.user;
  let query = {
    email: user.email,
    role: user.role
  }

  userComponent.findUser(query)
  .then((userList) => {
    if(userList.length !== 0) {
      res.send({
      'message': 'User Already exist'
    });
    }
    else {
      next();
    }
  })
  .catch((err) => {
    res.send({
      'err': err,
    })
  })  
});

// adding user to the database
route.addMiddleWare((req, res, next) => {
  let user = res.locals.user;
  // db.users.push(user);
  userComponent.createUser(user)
  .then((addedUser)=> {
    res.send({
      'user': addedUser,
    });
  })
  .catch((err) => {
    res.send({
      'err': err,
    })
  })
  
})


module.exports = route.getRouter();