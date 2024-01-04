import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId; 

var ReferalSchema = new Schema({
    createdAt: {type: Date, default: Date.now }, 
	rider : { type: ObjectId, ref: 'riders' } , 
	referalId : { type: String, default: "" } , 
	ref : [{ 
		user : { type: String, default: "" },
		tranx : { type: String, default: "" } 
	}]  
 });

var Referal = mongoose.model('referal', ReferalSchema);
module.exports = Referal;  


