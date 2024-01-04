import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId; 

var WalletSchema = new Schema({
  createdAt:{type: Date, default: Date.now },
  ridid: { type: ObjectId, ref: 'riders' },
  bal : { type: Number, default: 0 }, 

  stripe: { 
		id : { type: String, default: "" }, 
		currency : { type: String, default: "usd" }, 
		last4 : { type: String, default: "" } 
	},

  trx : [ { 
    trxid : { type: String , default: '' }, 
    amt : { type: Number , default: 0 } ,
    date : { type: String , default: '' }, 
    type : { type: String , default: '' } 
        } ]
 });

var Wallet = mongoose.model('wallet', WalletSchema);
module.exports = Wallet;  


