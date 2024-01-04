import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const autoIncrement = require('mongoose-ai');
autoIncrement.initialize(mongoose);
const featuresSettings = require('../featuresSettings');   

var EstimationSchema = new Schema({
	createdAt:{ type: Date, default: Date.now },
	distanceDetails: { type: Object },
	vehicleDetailsAndFare: { type: Object },
	scId: { type: ObjectId, ref: 'serviceavailablecities', default: null },
	loc: [String],
});
 
var EstimationModel = mongoose.model('estimations', EstimationSchema);
module.exports = EstimationModel;  

 