
// import mongoose, { ObjectId } from 'mongoose';
// const Schema = mongoose.Schema;
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId; 
   
var PaymentSchema = mongoose.Schema(
    {     
        userId: { 
            type: ObjectId,
            default: null 
        },
        userType: {
            type: String,
            enum: ["admin","driver", "rider"],
            default: "driver"
        },
        paymentType:{
            type: String,
            enum: ["trip","payout","subscription"],
            default: "trip"
        },
        status:{
            type: String,
            enum: ["initiated","processing", "completed","reversed"],
            default: "initiated"
        },
        
        referenceId:{ type: String, default: null },
        transactionId:{ type: String, default: null },
        description:{ type: String, default: null },
        amount:{ type: String, default: null },
        currency:{ type: String, default: "USD" },
        
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },        
    }
);

var Payments = mongoose.model('payments', PaymentSchema);
module.exports = Payments;   

 
 