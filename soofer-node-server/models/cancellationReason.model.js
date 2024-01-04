import mongoose from 'mongoose';

var CancelReasonSch = mongoose.Schema({
    language: { type: String, default: "en" },
    driverCancelReason: [String],
    riderCancelReason: [String],
});

var CancelReasons = mongoose.model('cancelreasons', CancelReasonSch);
module.exports = CancelReasons;
