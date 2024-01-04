import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId; 

var HotelPaymentSchema = new Schema({
	createdAt:{ type: Date, default: Date.now },
	tripno : { type: Number,  ref: 'trips', required: true }, 
	hotel : { type: ObjectId, ref: 'hotels' },
	hotelname : { type: String, default: 'hotels' }, 

	amttopay : { type: Number, default: 0 },  //Total fare includes all to be Payed by Rider 
	//cashpaid : { type: Number, default: 0 } , // Amount Paid by User In Cash to Driver
	commision : { type: Number, default: 0 }, //Amount to Admin = amttopay in Commmision percentage (in amt)

	// promoamt : { type: Number, default: 0 },  //Discount Amount Using promo or referal code
	// walletdebt : { type: Number, default: 0 },  //Amount Debt from Wallet
	// carddebt : { type: Number, default: 0 },  //Amount Debt from Cards

	//digital :  { type: Number, default: 0 },  //Sum promoamt + walletdebt + stripedebt
//	outstanding : { type: Number, default: 0 }, //Outstanding to pay = amttopay - digital
 	
 //	inhand :  { type: Number, default: 0 }, //cashpaid + outstanding
	// tip : { type: Number, default: 0 },  //Amount Tip to Driver
	// toll : { type: Number, default: 0 },  //Amount Paid to toll
	amttohotel : { type: Number, default: 0 },  //amttopay - commision  
	//toSettle : { type: Number, default: 0 },  //amttopay - commision - inhand  ( - take from, + give to Driver)
	
 	mtd : { type: String, default: "Cash" }, 
//	ispaid : { type: String, default: "no" }, //Is Commision settled
	tohotel : { type: String, default: "no" }, //Is Amount settled to Driver

	chId: { type: String  } //Paid/settled via 
}); 

var HotelPayment = mongoose.model('hotelpayment', HotelPaymentSchema);
module.exports = HotelPayment;  