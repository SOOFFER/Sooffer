import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var DbSchema = new Schema({
  createdAt  :{type: Date, default: Date.now },
  foldername : String,
  folderpath : String,
  type       : String
});

var DBbackup = mongoose.model('dbbackup', DbSchema);
module.exports = DBbackup;  
