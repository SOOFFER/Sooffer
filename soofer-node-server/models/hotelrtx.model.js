
    import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId; 

var HotelTransactionSchema = new Schema({
  createdAt:{type: Date, default: Date.now },
  hotelid: { type: ObjectId, ref: 'drivers' },
  hotelname:{ type: String   },
  totalBal : { type: Number, default: 0 }, 
  trx : [ { 
    trxId: { type: String , default: '' }, 
    description: { type: String , default: '' },
    amt: { type: Number , default: 0 } ,
    type: { type: String , default: 'credit' },
    paymentDate: { type: String , default : ''}, 
    bal: { type: Number , default: 0}
    } ]
 });

var HotelTransaction = mongoose.model('hoteltransaction', HotelTransactionSchema);
module.exports = HotelTransaction;  