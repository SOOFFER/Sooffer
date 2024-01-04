import mongoose from 'mongoose';

var Schema = mongoose.Schema({
  createdAt:{
    type: Date,
    default: Date.now
  },
  makeid: String,
  makename: String, 
  model: String,
  year: String,
  licence: String, 
  cpy: String, 
  driver: String,
  color: String,
  handicap: { type: String, default: "false" },
  type: [{
    basic: { type: String, default: "false" },
    normal: { type: String, default: "false" },
    luxury: { type: String, default: "false" }
  }] 
});

var Drivertaxi = mongoose.model('drivertaxi', Schema);
module.exports = Drivertaxi;  


