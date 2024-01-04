import mongoose from 'mongoose';
   
var deliveryTypeSchema = mongoose.Schema({  
  _id: String,    
  name: String 
});

var deliveryType = mongoose.model('deliveryType', deliveryTypeSchema);
module.exports = deliveryType;   

 
 