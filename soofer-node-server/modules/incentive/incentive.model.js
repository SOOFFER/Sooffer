import mongoose from 'mongoose'
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var incentiveSchema = mongoose.Schema({
    targetTime: { type: String, enum: ["weekly", "daily"], required: true, default: "weekly" },
    targetFor: { type: String, enum: ["trips", "earnings"], required: true, default: "trips" },
    targetType: [{
        target: { type: Number, default: 0 },
        targetAmt: { type: Number, default: 0 },
        status: { type: Boolean, default: true }
    }],
    status: { type: Boolean, default: true },
    targetName: { type: String, required: true, default: "" }
})


var incentiveType = mongoose.model('incentivetype', incentiveSchema);
module.exports = incentiveType;