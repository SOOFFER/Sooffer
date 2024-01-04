import mongoose from 'mongoose';
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var config = require('../config');

var CompanyDetailsSchema = mongoose.Schema({
  createdAt:{
    type: Date,
    default: Date.now
  },
  name: String,
  email: String,
  hash: String,
  salt: String,
  phone: String,
  vatNumber: String,
  adln1: String,
  adln2: String,
  vat: String,  
  cnty: String,
  cntyname: String,
  state: String,
  statename: String,
  city: String,   
  cityname: String,
  settlementType:{type:String,enum:['Flat','Percentage'],defalut:'Flat'},
  rate:String,
  scIds : [{
    name: { type: String, default: "" },
    scId: { type: String, default: "" },
  }],   
}
,{ usePushEach: true }
);

CompanyDetailsSchema.methods.setPassword = function (password = "abservetech") {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

CompanyDetailsSchema.methods.validPassword = function (password = "abservetech", salt, hashval) {
  var hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hashval === hash;
};

CompanyDetailsSchema.methods.getPassword = function (password = "abservetech") {
  const obj = {};
  obj.salt = crypto.randomBytes(16).toString('hex');
  obj.hash = crypto.pbkdf2Sync(password, obj.salt, 1000, 64, 'sha512').toString('hex');
  return obj;
};

CompanyDetailsSchema.methods.generateJwt = function (_id, email, name, type = "superadmin") {
  var expiry = new Date();
  // expiry.setDate(expiry.getDate() + 7); // 7 days
  return jwt.sign({
    id: _id,
    email: email,
    name: name,
    type: type,
  }, config.secret);
}

var CompanyDetails = mongoose.model('companydetails', CompanyDetailsSchema);
module.exports = CompanyDetails; 