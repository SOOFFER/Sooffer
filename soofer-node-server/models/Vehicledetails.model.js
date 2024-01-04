import mongoose from 'mongoose'
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var vehicleDetailsSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  priceTag: { type: String, default: '' },
  packageDetails: { type: String, default: '' },
  outstationDetails: { type: String, default: '' },
  sliderSection: { type: String, default: 'first' },
  displayorder: { type: Number, default: 1 },
  file: { type: String, default: "public/vehicle/file-default.png" },
  fileForWeb: { type: String, default: "public/vehicle/file-default.png" },
  softDel: { type: Boolean, default: false },
  language: { type: String, default: "en" } //en/es
}
  , { usePushEach: true }
);

var Vehicledetails = mongoose.model('Vehicledetails', vehicleDetailsSchema);
module.exports = Vehicledetails;
