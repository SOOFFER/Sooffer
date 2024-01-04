import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var DriverBankSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  driverId: { type: ObjectId, ref: 'drivers' },
  driverName: { type: String, default: "" },
  totalBal: { type: Number, default: 0 },

  bank: {
    email: { type: String, default: "" },
    holdername: { type: String, default: "" },
    acctNo: { type: String, default: "" },
    banklocation: { type: String, default: "" },
    bankname: { type: String, default: "" },
    swiftCode: { type: String, default: "" },
    currency: { type: String, default: "" },
    chid: { type: String, default: "" },
    fundId: { type: String, default: "" },
  },

  trx: [{
    trxId: { type: String, default: '' },
    description: { type: String, default: '' },
    amt: { type: Number, default: 0 },
    type: { type: String, default: 'credit' },
    paymentDate: { type: String, default: '' },
    paymentDateSort: { type: Date, default: Date.now },
    bal: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  }]
},
  {
    usePushEach: true
  });

var DriverBank = mongoose.model('driverbank', DriverBankSchema);
module.exports = DriverBank;


