import mongoose from 'mongoose';
const Schema = mongoose.Schema;


var EmailSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  subject: String,
  description: String,
  body: String,
  status: String,
  header: String,
  language: { type: String, default: "en" } //en/es
});

var Email = mongoose.model('email', EmailSchema);
module.exports = Email;