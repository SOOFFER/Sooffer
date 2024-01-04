import mongoose from 'mongoose'
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var DistancefareSchema = new mongoose.Schema({
  //Vehicletypeid: { type: String, required: true },
  distanceFrom: { type: String, required: true },
  distanceTo: { type: String, required: true },
  distanceFareType: { type: String, enum: ["flatrate", "kmrate"], default: "flatrate" },
  distanceFarePerKM: { type: Number, default: 0 },
  distanceFarePerFlatRate: { type: Number, default: 0 },
  applyTax: { type: Boolean, default: true },
  applyWaitingTime: { type: Boolean, default: true },
  applyNightCharge: { type: Boolean, default: true },
  applyPeakCharge: { type: Boolean, default: true },
  applyCommission: { type: Boolean, default: true },
  applyPickupCharge: { type: Boolean, default: true },

  // company Allowance creation wit Discount,No.Of.offerperDay,No.Of.offerperUser
  cmpyAllowance: { type: Boolean, default: true }, //Is remaining amount will be paid by admin for this offer
  discount: { type: Number, default: 0 }, //discount percentage
  offerPerDay: { type: Number, default: 0 },
  offerPerUser: { type: Number, default: 0 },
  additionalFarePerHrs: { type: Number, default: 0 }

})


var vehicleSchema = mongoose.Schema({
  type: { type: String, required: true },
  tripTypeCode: { type: String, required: true },
  loc: { type: ObjectId, ref: 'serviceavailablecities' }, //scID
  scIds: [{
    name: { type: String, default: "" },
    scId: { type: String, default: "" },
  }],
  baseFare: { type: Number, default: 0 }, // Access fee
  bookingFare: { type: Number, default: 0 }, // bookingFare  
  bkm: { type: Number, default: 0 }, // Fare per KM
  timeFare: { type: Number, default: 0 }, // Time fare //Per minu rate 
  packageTimeRate: { type: Number, default: 0 }, // Package Time fare Base amount
  mfare: { type: Number, default: 0 }, //Base Rate
  comison: { type: Number, default: 0 }, //Admin Commision
  asppc: { type: Number, default: 0 }, //Seats capacity
  displayorder: { type: Number, default: 0 },
  description: { type: String, default: '' },
  features: [String],
  file: { type: String, default: "public/vehicle/file-default.png" },
  fileForWeb: { type: String, default: "public/vehicle/file-default.png" },
  conveyanceAvailable: { type: Boolean, default: true },//Pickup allowence to Driver
  conveyanceType: { type: String, default: 'kmrate' },
  conveyancePerKm: { type: Number, default: 0 },
  isTax: { type: Boolean, default: true },
  taxPercentage: { type: Number, default: 0 },
  cancelationFeesDriver: { type: Number, default: 0 },
  cancelationFeesRider: { type: Number, default: 0 },
  peakHours: [{
    from: { type: String, default: '00:00:00' }, to: { type: String, default: '00:00:00' },
    percentPeakFare: { type: Number, default: 0 },
  }],
  nightHours: [{ from: { type: String, default: '00:00:00' }, to: { type: String, default: '00:00:00' }, percentNightFare: { type: Number, default: 0 }, }],
  isWaitingTimeExceddedChargesApplicable: { type: Boolean, default: true },
  allowMinimumWaitingTimeInMinutes: { type: Number, default: 0 },//IN Nunites
  chargeRatePerMinuteForExceededMinimumWaitingTime: { type: Number, default: 0 },
  distance: [DistancefareSchema],
  available: { type: Boolean, default: true },
  isRideLater: { type: Boolean, default: true },//true schedule
  isShareAvailable: { type: Boolean, default: false },//true available
  rental: {
    isRental: { type: Boolean, default: true },
    ForKm: { type: Number, default: 0 },
    ForAddKm: { type: Number, default: 0 },
    ForAddHr: { type: Number, default: 0 },
    ForHr: { type: Number, default: 0 },
  },
  isDeliveryAvailable: { type: Boolean, default: false },//true available
  softDel: { type: Boolean, default: false },
  lowCategoryOptions: { type: [String], default: [] }
}
  , { usePushEach: true }
);

var Vehicletype = mongoose.model('vehicletype', vehicleSchema);
module.exports = Vehicletype;
