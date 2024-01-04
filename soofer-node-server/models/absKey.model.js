import mongoose from 'mongoose';

var absKeySchema = mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    }, 
    emailId      : String,
    productKey        : String,
    status : String,
 });

var absKey = mongoose.model('absKeys', absKeySchema);
module.exports = absKey;  