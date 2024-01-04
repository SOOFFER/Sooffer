import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var AnswerSchema = new mongoose.Schema({
  ans_id: { type: ObjectId },
  ans: String
});


var WebContactSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  fname: { type: String },
  lname: { type: String },
  mailid: { type: String },
  phone : {type: String},
  subject: String,
  detail: String,
  ans_detail: [AnswerSchema]
});

var WebContactUs = mongoose.model('webContact', WebContactSchema);
module.exports = WebContactUs;  