import mongoose from 'mongoose';

var PageSchema = mongoose.Schema({
  title: String,
  section: String,
  desc: String,
  link: String,
  language: { type: String, default: "en" } //en/es
});

var Pages = mongoose.model('pages', PageSchema);
module.exports = Pages;   