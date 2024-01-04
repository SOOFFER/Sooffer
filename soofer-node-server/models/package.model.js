import mongoose from 'mongoose';


var PackageSchema = mongoose.Schema({
  createdAt: { type: Date,  default: Date.now  },
  pkname   : { type:String},
  amt      : { type:Number},
  minkm    : { type:String},
  minhr    : { type:String},
  pkm    : { type:String},
  phr    : { type:String}
  
});

var Package = mongoose.model('package', PackageSchema);
module.exports = Package;  