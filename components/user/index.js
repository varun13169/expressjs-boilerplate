const UserModel = require('./model/UserModel.js');

const userComponent = {};

userComponent.createUser = function(user) {
  let newUser = new UserModel(user);
  return newUser.save();
}

userComponent.findUser = function(query) {
  return UserModel.find(query);
}

module.exports = userComponent;








