import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId; 

var SharesSchema = new Schema({
  createdAt:{type: Date, default: Date.now },
  dvrid: { type: ObjectId, ref: 'drivers' },
  available : { type: String, default: 'yes' }, 
  direction : { type: String, default: 'S' }, 
  distance : { type: String, default: "0" }, 
  tripId : { type: String, default: '' }, //First trip Request Id
  // https://stackoverflow.com/questions/19695058/how-to-define-object-in-array-in-mongoose-schema-correctly-with-2d-geo-index
  start : { 
    latitude : { type: Number, default: '' },
    longitude : { type: Number, default: '' }
  },  

  end : { 
    latitude : { type: Number, default: '' },
    longitude : { type: Number, default: '' }
  }, 

  left : { 
    latitude : { type: Number, default: '' },
    longitude : { type: Number, default: '' }
  }, 

  right : { 
    latitude : { type: Number, default: '' },
    longitude : { type: Number, default: '' }
  }

 });

var ShareRides = mongoose.model('share', SharesSchema);
module.exports = ShareRides;  


