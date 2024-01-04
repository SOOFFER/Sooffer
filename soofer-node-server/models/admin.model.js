import mongoose from 'mongoose';
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var config = require('../config');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var AdminSchema = mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  fname: String,
  lname: String,
  hash: String,
  salt: String,
  email: String,
  phone: String,
  group: String,
  verificationCode: { type: String, default: "" },
  fcmId: { type: String, default: "" },
  //scId: { type: ObjectId, ref: 'serviceavailablecities' },
  scIds: [{
    name: { type: String, default: "" },
    scId: { type: ObjectId },
  }],
  menus: [],
  softdel: { type: String, default: "active" },
}
  , { usePushEach: true }
);


AdminSchema.methods.setPassword = function (password = "abservetech") {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

AdminSchema.methods.validPassword = function (password = "abservetech", salt, hashval) {
  var hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hashval === hash;
};

AdminSchema.methods.getPassword = function (password = "abservetech") {
  const obj = {};
  obj.salt = crypto.randomBytes(16).toString('hex');
  obj.hash = crypto.pbkdf2Sync(password, obj.salt, 1000, 64, 'sha512').toString('hex');
  return obj;
};

AdminSchema.methods.generateJwt = function (_id, email, name, type = "admin", scId, scity) {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 1); // 7 days
  return jwt.sign({
    id: _id,
    email: email,
    name: name,
    type: type,
    scId: scId,
    city: scity
  }, config.adminsecret, { expiresIn: '1d' });
};

var Admin = mongoose.model('admin', AdminSchema);
module.exports = Admin;



