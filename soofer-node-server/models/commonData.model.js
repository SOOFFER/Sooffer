import mongoose from 'mongoose';
   
var DocSchema = mongoose.Schema({  
  _id: String, 
  datas: [{
  	id: String, 
    name: String 
  }]
});

var CmnData = mongoose.model('commondata', DocSchema);
module.exports = CmnData;   

 
 