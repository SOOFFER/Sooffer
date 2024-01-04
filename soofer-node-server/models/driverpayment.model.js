import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const config = require('../config');

var DriverPaymentSchema = new Schema({
	createdAt: { type: Date, default: Date.now },
	tripno: { type: String, required: true },
	driver: { type: ObjectId, ref: 'drivers' },
	dvrfname: { type: String, default: 'driver' },

	amttopay: { type: Number, default: 0 },  //Total fare includes all to be Payed by Rider 
	cashpaid: { type: Number, default: 0 }, // Amount Paid by User In Cash to Driver
	commision: { type: Number, default: 0 }, //Amount to Admin = amttopay in Commmision percentage (in amt)
	booking: { type: Number, default: 0 },
	tax: { type: Number, default: 0 },
	driverTaxTDS: { type: Number, default: 0 },
	addittionalFee: { type: Number, default: 0 },
	tollFee: { type: Number, default: 0 },
	totalDetucted: { type: Number, default: 0 },

	promoamt: { type: Number, default: 0 },  //Discount Amount Using promo or referal code
	walletdebt: { type: Number, default: 0 },  //Amount Debt from Wallet
	carddebt: { type: Number, default: 0 },  //Amount Debt from Cards

	digital: { type: Number, default: 0 },  //Sum promoamt + walletdebt + stripedebt
	outstanding: { type: Number, default: 0 }, //Outstanding to pay = amttopay - digital

	inhand: { type: Number, default: 0 }, //cashpaid + outstanding
	// tip : { type: Number, default: 0 },  //Amount Tip to Driver
	// toll : { type: Number, default: 0 },  //Amount Paid to toll
	amttodriver: { type: Number, default: 0 },  //amttopay - commision  - booking - tax
	toSettle: { type: Number, default: 0 },  //amttopay - commision - inhand  ( - take from, + give to Driver)

	mtd: { type: String, default: "Cash" },
	ispaid: { type: String, default: "no" }, //Is Commision settled
	todvr: { type: String, default: "no" }, //Is Amount settled to Driver

	chId: { type: String }, //Paid/settled via 
	scId: { type: ObjectId, ref: 'serviceavailablecities', default: null },
	scity: { type: String, default: "" },
	totalDistTravelled: { type: Number, default: 0 },
	distanceUnit: { type: String, default: config.distanceUnit },
	GatewayCharge: { type: Number, default: 0 }
});

var DriverPayment = mongoose.model('driverpayment', DriverPaymentSchema);
module.exports = DriverPayment;  
