import mongoose, { Schema } from 'mongoose';
const ObjectId = Schema.Types.ObjectId;

var CityWiseOfficeSchema = new Schema({
    address: { type: String, default: '' },
    mail: { type: String, default: '' },
    phone: { type: String, default: '' },
    phonetwo : { type: String, default: '' },

    scIds: [{
        name: { type: String, default: "" },
        scId: { type: ObjectId },
    }],
    isSupportNoEnable: { type: Boolean, default: true }

}
    , { usePushEach: true }
)

var cityWiseOffice = mongoose.model('cityWiseOffice', CityWiseOfficeSchema)
module.exports = cityWiseOffice;