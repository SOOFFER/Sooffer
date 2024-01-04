import mongoose from 'mongoose';
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var config = require('../config');

var HotelSchema = mongoose.Schema({
  createdAt:{ type: Date,  default: Date.now  },
  fname: String, //Hotel name
  lname: String, //Owner name
  email:  {type: String, unique: true, required : true   }, 
  hash: String,
  salt: String, 
  phone: String, 
  phcode: { type: String, default: "+91" }, 
  zipCode: {type: String, default: ""},
  location: {type: [Number], index: '2dsphere'},
  
  address: {type: String, default: ""},
  country:{type: String, default: ""},
  state:{type: String, default: ""},
  city: {type: String, default: ""},
  commission:{type: Number, default: 0 },
  logo:{type: String, default:"public/file-1553145436434.jpg"},
  pickFrom:{ type: String },
  actHolder: { type: String, default: "" },
  actNo: { type: String, default: "" },
  actBank: { type: String, default: "" },
  actLoc: { type: String, default: "" },
  actCode: { type: String, default: "" },
  amount:{type: Number, default: 0 },


});

HotelSchema.index({ name: "text" },{address: "text"},{email: "text"}); 

HotelSchema.methods.setPassword = function(password="abservetech"){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000,64,'sha512').toString('hex');
}; 

HotelSchema.methods.validPassword = function(password="abservetech",salt,hashval) {
  var hash = crypto.pbkdf2Sync(password, salt , 1000, 64,'sha512').toString('hex');
  return hashval === hash;
};

HotelSchema.methods.generateJwt = function(_id,email,name,type="driver") {
 var expiry = new Date();
 expiry.setDate(expiry.getDate() + 7); // 7 days
 return jwt.sign({ 
   id: _id, 
   email: email, 
   name: name,
   type: type, 
 }, config.secret ); 
};

HotelSchema.methods.getPassword = function(password="abservetech"){
  const obj = {};
  obj.salt = crypto.randomBytes(16).toString('hex');
  obj.hash = crypto.pbkdf2Sync(password, obj.salt, 1000,64,'sha512').toString('hex'); 
  return obj;
}; 

var Hotel = mongoose.model('hotel', HotelSchema);
module.exports = Hotel;  