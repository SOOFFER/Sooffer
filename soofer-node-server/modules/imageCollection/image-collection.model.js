import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const imageSchema = mongoose.Schema({
    tripId: { type: String, },
    imageArray: { type: Array},
    status: { type: String}
    
});
var ImageCollection = mongoose.model('imageCollection', imageSchema);
module.exports = ImageCollection;
