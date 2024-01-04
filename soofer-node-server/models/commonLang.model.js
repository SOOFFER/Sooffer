import mongoose from 'mongoose';
   
var DocSchema = mongoose.Schema({ 
  _id: String, 
  languages: [{
  	id: String,
    name: String
 }] 
});

var Lang = mongoose.model('languages', DocSchema);
module.exports = Lang;   
  