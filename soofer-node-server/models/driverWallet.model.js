import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId; 

var DriverWalletSchema = new Schema({
    createdAt  : { type: Date, default: Date.now },
    driverId   : { type: ObjectId, ref: 'drivers' },
    driverName : { type: String,   default: "" },
    totalBal   : { type: Number, default: 0 }, 

    card: { 
        id       : { type: String, default: "" }, 
        currency : { type: String, default: "usd" }, 
        last4    : { type: String, default: "" } 
    },

    trx : [ { 
        trxId       : { type: String , default: '' }, 
        description : { type: String , default: '' },
        amt         : { type: Number , default: 0 } ,
        type        : { type: String , default: 'credit' },
        paymentDate: { type: String , default : ''}, 
        bal         : { type: Number , default: 0},
        createdAt: { type: Date, default: Date.now },
    }]
},
{
    usePushEach: true
});

var DriverWallet = mongoose.model('driverwallets', DriverWalletSchema);
module.exports = DriverWallet;  