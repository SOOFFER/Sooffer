import mongoose from "mongoose";

var Schema = mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // makeid: String,
  safeRidestatus: String,
  number: String,
  makename: String,
  model: String,
  vehiclecolor: String,

  // licence: String,
  // cpy: String,
  // rider: String,
  // color: String,
  // handicap: { type: String, default: "false" },
  // type: [{
  //   basic: { type: String, default: "false" },
  //   normal: { type: String, default: "false" },
  //   luxury: { type: String, default: "false" }
  // }],
  // vehicletype: String,
  // noofshare: { type: String, default: 0 },
  // share: { type: String, default: "false" },
  // chaisis: String,
  // ownername: String,
  // registrationnumber: String,
  // vin_number: String,
  // others1: { type: String, default: "" },
  // isDaily: { type: String, default: "true" },
  // isRental: { type: String, default: "false" },
  // isOutstation: { type: String, default: "false" },
});
var Ridertaxi = mongoose.model("Ridertaxi", Schema);
module.exports = Ridertaxi;
