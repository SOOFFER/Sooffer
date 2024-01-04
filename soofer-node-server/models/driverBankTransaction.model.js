import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId; 

var DriverBankTransactionSchema = new Schema({
  createdAt:{type: Date, default: Date.now },
  dvrid: { type: ObjectId, ref: 'drivers' },
  bal : { type: Number, default: 0 }, 

  bank: {  
    email  : { type: String, default: "" },
    holdername  : { type: String, default: "" },
    acctNo  : { type: String, default: "" },
    banklocation   : { type: String, default: "" },
    bankname : { type: String, default: "" },
    swiftCode   : { type: String, default: "" }, 
  }, 

  trx : [ { 
    trxid : { type: String , default: '' }, 
    packageId: { type: ObjectId, ref: 'payPackage', default : null },
    packageName : String,
    amt : { type: Number , default: 0 } ,
    date: { type: Date, default: Date.now }, 
    type: { type: String, default: 'Credit' },
    isVerified: { type: Boolean, default: false }, //Is admin Approved
    filepath: { type: String, default: "" },  
    forTrip : { type: Boolean , default: false } //Is admin Approved
        } ]
 });

var DriverBankTransaction = mongoose.model('driverbanktransaction', DriverBankTransactionSchema);
module.exports = DriverBankTransaction;  