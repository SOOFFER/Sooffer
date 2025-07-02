import mongoose from 'mongoose';
import * as HelperFunc from './adminfunctions';

//import models
import Email from '../models/email.model';
// import Mail from '../models/mail.model';
import ContactUs from '../models/contactus.model';

var ejs = require('ejs');
const nodemailer = require('nodemailer');

//add email

export const addEmail = (req, res) => {
    var newDoc = new Email({
        subject: req.body.subject,
        description: req.body.description,
        body: req.body.body,
        status: req.body.status
    });
    newDoc.save((err, data) => {
        if (err) { return res.status(500).json({ 'status': false, 'message': req.i18n.__("ERROR_SERVER") }) }
        return res.status(200).json({ 'status': true, 'message': req.i18n.__("ADDED_SUCCESSFULLY"), 'datas': data })
    })

}

//edit email

export const editEmail = (req, res) => {
    Email.findById({ _id: req.body.id }, function (err, email) {
        if (err) { return res.status(500).json({ 'status': false, 'message': req.i18n.__("ERROR_SERVER") }) }
        email.subject = req.body.subject;
        // email.description = req.body.description;
        email.body = req.body.body;
        // email.status      = req.body.status;

        email.save((err, data) => {
            if (err) { return res.status(500).json({ 'status': false, 'message': req.i18n.__("ERROR_SERVER") }) }
            return res.status(200).json({ 'status': true, 'message': req.i18n.__("MAIL_TEMPLATE_UPDATED_SUCCESSFULLY"), 'datas': data })
        })
    })
}

//view email

export const viewEmail = async (req, res) => {
    var likeQuery = HelperFunc.likeQueryBuilder(req.query);
    var pageQuery = HelperFunc.paginationBuilder(req.query);
    var sortQuery = HelperFunc.sortQueryBuilder(req.query);
    likeQuery['status'] = "active"
    likeQuery['language'] = "en";
    // console.log("language", likeQuery['language']);
    if (req.query.language == "en") likeQuery['language'] = "en";
    let TotCnt = Email.find(likeQuery).count();
    let Datas = Email.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery);

    try {
        var promises = await Promise.all([TotCnt, Datas]);
        res.header('x-total-count', promises[0]);
        var resstr = promises[1];
        res.send(resstr);
    } catch (err) {
        return res.json([]);
    }
}

//sent email

export const sentEmail = async (req, res) => {
    var database = await Email.findOne({ description: req.body.description })
    var data = { name: req.body.name, email: req.body.email, otp: req.body.otp };
    var template = ejs.render(database.body, data);

    let smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // upgrade later with STARTTLS
        auth: {
            user: 'abservetech.smtp@gmail.com',
            pass: 'smtp@345'
        }
    };

    // 'host' => 'ssl://smtp.gmail.com', 'port' => 465, 'username' => 'abservetech.smtp@gmail.com', 'password' => 'smtp@345', 'transport' => 'Smtp'
    let transporter = nodemailer.createTransport(smtpConfig);

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Admin " <abservetech.smtp@gmail.com>', // sender address
        to: req.body.email, // list of receivers
        subject: database.subject, // Subject line
        text: database.subject, // plain text body
        html: template // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); 
    });
}

export const questionPost = (req, res) => {
}
//answer post  
export const answerPost = (req, res) => {
    var answerdata = {
        user_id: req.userId,
        username: req.name,
        ans: req.body.ans
    };
    ContactUs.findByIdAndUpdate({ _id: req.body.id },
        {
            $push: { ans_detail: answerdata },
            status: 'read'
        },
        { 'new': true },
        function (err, doc) {
            if (err) { return res.status(500).json({ 'status': false, 'message': req.i18n.__("ERROR_SERVER") }) }
            return res.status(200).json({ "status": true, 'message': req.i18n.__("ANSWER_POSTED_SUCCESSFULLY"), doc })
        })
}

//view unread

export const viewUnread = (req, res) => {
    ContactUs.find({ status: 'unread' }, function (err, data) {
        if (err) { res.send([]) }
        res.send(data)
    })
}

export const sendEmail = (mailFor, mailTo, doc) => {

}