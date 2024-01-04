import mongoose, { Schema } from 'mongoose';

var SeoSettingsSchema = new Schema({
    keyword: { type: String, default: '' },
    tag: { type: String, default: '' },
    description: { type: String, default: '' },
})

var seosetting = mongoose.model('seosetting', SeoSettingsSchema)
module.exports = seosetting;