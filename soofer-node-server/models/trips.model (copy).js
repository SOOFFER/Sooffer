import mongoose from 'mongoose';

var DriverPaymentSchema = mongoose.Schema({
	createdAt:{ type: Date, default: Date.now },
	tripno : { type: String,  required: true }, 
	driver : { type: String,  required: true },   
	
	amttopay : { type: Number, default: 0 },  //Total fare includes all to be Payed by Rider 
	cashpaid : { type: Number, default: 0 } , // Amount Paid by User In Cash to Driver
	commision : { type: Number, default: 0 }, //Amount to Admin = amttopay in Commmision percentage
	promodcnt : { type: Number, default: 0 },  //Discount Amount Using promo or referal code
	walletdebt : { type: Number, default: 0 },  //Amount Debt from Wallet
	tip : { type: Number, default: 0 },  //Amount Tip to Driver
	// toll : { type: Number, default: 0 },  //Amount Paid to toll
	amttodriver : { type: Number, default: 0 },  //Amount Actual Driver Need to Receive
	
	mtd : { type: String, default: "" }, 
	ispaid : { type: String, default: "no" }, //Is Commision settled
	todvr : { type: String, default: "no" }, //Is Amount settled to Driver
	 
});

var DriverPayment = mongoose.model('driverpayment', DriverPaymentSchema);
module.exports = DriverPayment;  

 