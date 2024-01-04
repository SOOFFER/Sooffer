import mongoose from 'mongoose';

var CompanyDetailsSchema = mongoose.Schema({
  createdAt:{
    type: Date,
    default: Date.now
  },
  companyName: String,
  emailAddress: String,
  phoneNumber: String,
  addressLine: String,
  vatNumber: String
});

var CompanyDetails = mongoose.model('companydetails', CompanyDetailsSchema);
module.exports = CompanyDetails; 
// export default mongoose.model('CompanyDetails', CompanyDetailsSchema);

// var CompanyDetails = mongoose.model('CompanyDetails', CompanyDetailsSchema); 
  
// var AdminSchema = mongoose.Schema({
//   createdAt:{
//     type: Date,
//     default: Date.now
//   },
//   fname: String,
//   lname: String, 
//   email: String,
//   phone: String,
//   password: String,
//   group: String
// });

// var Admin = mongoose.model('admin', AdminSchema);
// module.exports = Admin;

// var Admin = mongoose.model('Admin', AdminSchema); 

// module.exports = {
//     // Admin: Admin,
//     CompanyDetails: CompanyDetails 
// };

 

 