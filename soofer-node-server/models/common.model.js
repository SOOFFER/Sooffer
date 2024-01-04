import mongoose from 'mongoose';
   
var CountrySchema = mongoose.Schema({ 
  
  id           : { type: String, required: true, unique: true },
  sortname     : { type: String, required: true },
  name         : { type: String, required: true },
  phoneCode    : { type: String, required: true },
  currencyCode : { type: String, required: true },
  currencyName : { type: String, required: true },
  status       : { type: Boolean , default: true },
  softDelete   : { type: Boolean , default: false },
  createdAt    : { type: Date, default: Date.now },
  createdBy    : { type: Number, default: 0 },
  modifiedAt   : { type: Date, default: Date.now },
  modifiedBy: { type: Number, default: 0 },
  flag: { type: String, default: "public/flags/default.gif" },

});

var Countries = mongoose.model('countries', CountrySchema);
module.exports = Countries;   