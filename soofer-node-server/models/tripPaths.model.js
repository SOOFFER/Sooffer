import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

/* const polygonSchema = new mongoose.Schema({
	coordinates: {
		type: [Number],
		index: '2dsphere',
		default: null
	},
	time: { type: Date, default: null },
}); */

var TripPathSchema = new Schema({
	createdAt:{ type: Date, default: Date.now },
	tripno : { type: String },  
	tripid: { type: ObjectId, ref: 'trips', default : null },
	// geometry: [{ lat: Number, lng: Number, time: Date }],
	encodedPoly: { type: String },  
	status: { type: String, default: "active" }, 
	geo: {
		type: {
			type: String, "enum": [
				"Point",
				"MultiPoint",
				"LineString",
				"MultiLineString",
				"Polygon",
				"MultiPolygon"
			]
		},
		coordinates: { type: Array }
	},
});

var tripPaths = mongoose.model('tripPaths', TripPathSchema);
module.exports = tripPaths;  

 