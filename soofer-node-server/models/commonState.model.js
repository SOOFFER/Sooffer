import mongoose from 'mongoose';
   
var DocSchema = mongoose.Schema({ 
  id          : { type: String, required: true, unique: true },
  name        : { type: String, required: true },
  country_id  : { type: String, required: true },
  status      : { type: Boolean , default: true },
  softDelete  : { type: Boolean , default: false },
  createdAt   : { type: Date, default: Date.now },
  createdBy   : { type: Number, default: 0 },
  modifiedAt  : { type: Date, default: Date.now },
  modifiedBy  : { type: Number, default: 0 }
});

var States = mongoose.model('states', DocSchema);
module.exports = States;   
  