const mongoose = require('mongoose');
const uuid = require('uuid');

const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuid.v1
  },
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: String,
  role: String,

  created: {
    type: Date,
    default: Date.now,
  },
});


const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;