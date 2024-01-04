import mongoose from 'mongoose';

var Schema = mongoose.Schema({
  createdAt:{type: Date,default: Date.now },
  subject: { type: String  },
  message: { type: String  },
  from: { type: String },
  fromId: { type: String  }, 
  mail: { type: String  }, 
  type: { type: String  }, 
  reply: [{  
    msg: { type: String, default: "" },
    from: { type: String, default: "" } 
  }],  
  status : { type: String, default : "unread"},//read,unread
});

var ContactUs = mongoose.model('contact', Schema);
module.exports = ContactUs;  


