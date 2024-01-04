import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var OutstationPackageSchema = mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    name: { type: String, default: "" },
    price: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    distance: { type: Number, default: 0 },
    scIds: [{
        name: { type: String, default: "" },
        scId: { type: String, default: "" },
    }],
    fixedRate: [{
        name: { type: String, default: "" },
        rate: { type: Number, default: 0 },
    }],
    jouneyType: { type: String, default: "oneway" },
    // fixedRateForRoundTrip: [{
    //     name: { type: String, default: "" },
    //     rate: { type: Number, default: 0 },
    // }]
}
    , { usePushEach: true }
);

var OutstationPackage = mongoose.model('outstationPackage', OutstationPackageSchema);
module.exports = OutstationPackage;   