import mongoose from 'mongoose';
import { object } from 'twilio/lib/base/serialize';

var PageSchema = mongoose.Schema({  
  	type : {type:String,required:true,unique:true},
    menus : {type:Object,required:true},
});

var Menus = mongoose.model('menus', PageSchema);
module.exports = Menus;   