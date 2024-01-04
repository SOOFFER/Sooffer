import mongoose from 'mongoose';
   
var DocSchema = mongoose.Schema({ 
  _id: String, 
  currency: [{
  	id: String,
    name: String
 }] 
});

var Currency = mongoose.model('currency', DocSchema);
module.exports = Currency;   
  