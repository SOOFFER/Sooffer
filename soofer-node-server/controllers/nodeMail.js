const nodemailer = require('nodemailer');
const ejs        = require('ejs');

//import model
import Email from '../models/email.model';

const sendEmailFor = ['forgotPasswordAdmin'];

export const sendEmail = async (email,data,description) => {
  var database   = await Email.findOne({description:description})
  var template   = ejs.render(database.body, data);
  let smtpConfig = {
    host   :'smtp.gmail.com',
    port   : 465,
    secure : true, // upgrade later with STARTTLS
    auth   : { 
      user  : 'abservetech.smtp@gmail.com',
      pass  : 'smtp@345' 
    }
  }; 

   let transporter = nodemailer.createTransport(smtpConfig);

   let mailOptions = {
       from    : '"Admin " <abservetech.smtp@gmail.com>', // sender address
       to      : email , // list of receivers
       subject : database.subject, // Subject line
       text    : database.subject, // plain text body
       html    : database.header+template+'</body></html>' // html body
    };

     // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
     if (error) { return console.log(error); }
     console.log('Message sent: %s', info.messageId); 
   });
}