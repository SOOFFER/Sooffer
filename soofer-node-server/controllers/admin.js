// ./express-server/controllers/todo.server.controller.js
import mongoose from 'mongoose';
import path from 'path';
import * as HelperFunc from './adminfunctions';
import { sendEmail } from './mailGateway';
const url = require('url');
const config = require('../config');
const randomize = require('randomatic');
const _ = require('lodash');
const Mustache = require('mustache');
const fs = require('fs')
var jwt = require('jsonwebtoken');

//import models
import Admin from '../models/admin.model';


// var multer  = require('multer')
// var upload = multer({ dest: '../uploads/' })

// var multer = require('multer');
// export  const imageUpload = function(req, res) {
//     multer({
//         onFileUploadComplete: function(file) {
//             res.send();
//         }
//     });
// }

// var storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/')
//   },
//   filename: (req, file, cb) => {
//     // cb(null, file.originalname )
//     cb(null,  Date.now() + file.originalname )
//   }
// });
// var upload = multer({storage: storage});

export const addData = (req, res) => {
  var errMsg = 'PHONE_ALREADY_EXISTS';
  var findOrCondition = [{ "$and": [{ 'phone': req.body.phone }, { "phcode": req.body.phcode }] }];
  if (req.body.email) {
    findOrCondition.push({ 'email': req.body.email })
    errMsg = 'PHONE_EMAIL_ALREADY_EXISTS';
  }

  Admin.findOne({ $or: findOrCondition }, function (err, user) {
    if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__('ERROR_SERVER') });
    if (user) return res.status(401).json({ 'success': false, 'message': errMsg });

    var newDoc = new Admin(
      {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        phone: req.body.phone,
        group: req.body.group,
        menus: req.body.menuslist,
      }
    );
    newDoc.scIds = JSON.parse(req.body.scIds)
    newDoc.setPassword(req.body.password);
    newDoc.save((err, datas) => {
      if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), err }); }
      return res.json({ 'success': true, 'message': req.i18n.__("DATA_ADDED"), datas });
    })
  })
}


export const getData = (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);

  if (
    typeof req.query["_sort"] === "undefined"
    || req.query["_sort"] === ""
  ) {
    req.query["_sort"] = "createdAt";
  }
  if (
    typeof req.query["_order"] === "undefined"
    || req.query["_order"] === ""
  ) {
    req.query["_order"] = "DESC";
  }
  if (req.cityWise == 'exists') {
    likeQuery['$or'] = [{ 'group': { $eq: "dispatcher" } }, { 'group': { $eq: "billing" } }]
    likeQuery['scIds.scId'] = { "$in": req.scId };
  }
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);

  var totalCount = 10;
  Admin.find({ $and: [likeQuery] }).count().exec((err, cnt) => {
    if (err) { }
    totalCount = cnt;

  });

  Admin.find({ $and: [likeQuery] }, { "salt": 0, "hash": 0 }).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery).exec((err, docs) => {
    if (err) {

      return res.json([]);
    }
    res.header('x-total-count', totalCount);
    res.send(docs);
  });

}

/**
 * Update Admin Profile Details
 * @input
 * @param
 * @return
 * @response
 */

export const updateAdmin = (req, res) => {
  const id = req.params.id;
  var errMsg = 'Phone No. already Exists.';
  var findOrCondition = [{ "$and": [{ 'phone': req.body.phone }, { "phcode": req.body.phcode }] }];
  if (req.body.email) {
    findOrCondition.push({ 'email': req.body.email })
    errMsg = 'Phone No. Or Email already Exists.';
  }
  Admin.findOne({ _id: { $ne: id }, '$or': findOrCondition }).exec((err, data) => {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    if (data) return res.status(401).json({ 'success': false, 'message': req.i18n.__(errMsg) });
    else {
      Admin.findOne({ _id: id }).exec((err, doc) => {
        if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
        if (!doc) return res.json({ 'success': false, 'message': req.i18n.__("ADMIN_NOT_fOUND") });

        doc.fname = req.body.fname;
        doc.lname = req.body.lname;
        doc.email = req.body.email;
        doc.phone = req.body.phone;
        doc.menus = req.body.menuslist;

        let oldScIds = JSON.parse(req.body.oldScIds);
        //let oldScIds = req.body.oldScIds;
        var scIds = req.body.scIds;
        scIds = JSON.parse(scIds);
        //scIds = JSON.parse(scIds);

        var result = _.xorBy(oldScIds, scIds, 'scId');

        var oldValues = []; var newValues = [];
        _.forEach(result, function (value, key) {
          let isExist = _.has(value, '_id')
          if (isExist) {
            oldValues.push(value);
          } else {
            newValues.push(value);
          }
        })

        _.forEach(oldValues, function (element, i) {
          doc.scIds.pull({ '_id': element._id });
        });

        _.forEach(newValues, function (element, i) {
          doc.scIds.push(element);
        });

        doc.save(function (err, op) {
          if (err) return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
          return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), op });
        });
      })
    }
  });
};

export const adminupdate = (req, res) => {
  var newDoc =
  {
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    phone: req.body.phone,
  }
  Admin.findOneAndUpdate({ _id: req.params.id }, newDoc, { new: true }, (err, adminDoc) => {
    if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    return res.status(200).json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), adminDoc });
  });
}

export const adminPushToken = (req, res) => {
  var newDoc =
  {
    fcmId: req.body.fcmId,
  }
  // var id = mongoose.Types.ObjectId(req.userId);
  // console.log(req.userId)
  Admin.findOneAndUpdate({ _id: req.userId }, newDoc, { new: true }, (err, adminDoc) => {
    if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    return res.status(200).json({ 'success': true, 'message': req.i18n.__("TOKEN_UPDATED") });
  });
}

/**
 * Delete Admin Profile
 * @input
 * @param
 * @return
 * @response
 */
export const deleteAdmin = (req, res) => {
  Admin.findByIdAndRemove(req.params.id, (err, docs) => {
    if (err) {
      return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR") });
    }
    return res.json({ 'success': true, 'message': req.i18n.__("ADMIN_DELETED"), docs });
  })
};


// export const uploadas = (req,res) => {

//  upload.single('avatar');

//  // console.log(req.file.avatar);
//  // const host = req.hostname;
//  // const filePath = req.protocol + "://" + host + '/' + req.file.path;
//  // console.log(filePath);

//     // console.log(req);
// // upload2.single('file');
// //      var newUpload = {
// //     name: req.body.name,
// //     created: Date.now(),
// //     file: req.file
// //   };
//     // console.log(newUpload);

//     return res.json({'success':true,'message':'Data added successfully 323'});
//   }

export const uploadas = (req, res) => {
  // req.files
  // console.log(req.file);
  // console.log(req.body.name);
  // console.log(req.file.avatar);
  // upload.single('avatar');
  // console.log(req);
  // upload2.single('file');
  //      var newUpload = {
  //     name: req.body.name,
  //     created: Date.now(),
  //     file: req.file
  //   };
  // console.log(newUpload);
  // req.originalUrl.replace(/page=[^&]+/, "pagea=" + 434);

  // console.log(req.originalUrl);

  return res.json({ 'success': true, 'message': req.i18n.__("DATA_ADDED"), 'file': req['file'], 'name': req.query });
}




// app.post('/upload', upload.single('avatar'), (req, res, next) => {
//  console.log(req.file.filename);
//  const host = req.hostname;
//  const filePath = req.protocol + "://" + host + '/' + req.file.path;
//  console.log(filePath);
//  res.json({'message': 'File uploaded successfully'});

// });


/**
 * Update Admin password Details
 * @input
 * @param
 * @return
 * @response
 */
export const updatePassword = (req, res) => {
  if (req.body.newpassword != req.body.confirmpassword) {
    return res.status(401).json({ 'success': false, 'message': req.i18n.__("NEW_CONFIRM_PASSWORD_DIFFERENT") });
  }

  Admin.findById(req.body.id, function (err, docs) {
    if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    else {
      if (!docs) return res.status(404).json({ 'success': false, 'message': req.i18n.__("NO_USER_FOUND") });
      var newDoc = Admin();
      var passwordIsValid = newDoc.validPassword(req.body.oldpassword, docs.salt, docs.hash);
      if (!passwordIsValid) return res.status(401).json({ 'success': false, 'message': req.i18n.__("INVALID_OLD_PASSWORD") });
      var obj = newDoc.getPassword(req.body.newpassword);
      var update = {
        salt: obj.salt,
        hash: obj.hash
      }
      Admin.findOneAndUpdate({ _id: req.body.id }, update, { new: false }, (err, doc) => {
        if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err }); }
        return res.json({ 'success': true, 'message': req.i18n.__("PASSWORD_UPDATED") });
      })
    }
  });
}

export const logout = (req, res) => {
  return res.status(200).json({
    data: {
      token: '',
      messages: req.i18n.__("LOGOUT_SUCCESS"),
      errors: 'Logout success.',
    }
  });
}

export const login = (req, res) => {
  Admin.findOne({ email: req.body.email }, function (err, user) {
    var newDoc = Admin();
    if (err) return res.status(401).json({ data: { token: '', messages: req.i18n.__('"ERROR_SERVER"'), errors: 'Error on the server.', } });
    if (!user) return res.status(401).json({ data: { token: '', messages: req.i18n.__("NO_USER_FOUND"), errors: 'No user found.', } });
    var passwordIsValid = newDoc.validPassword(req.body.password, user.salt, user.hash);
    if (!passwordIsValid) return res.status(401).json({ data: { token: '', messages: req.i18n.__("INVALID_PASSWORD"), errors: 'Invalid Password', } });
    var token = newDoc.generateJwt(user._id, user.email, user.fname, user.group, user.scIds[0].scId, user.scIds[0].name);
    return res.status(200).json({
      data: {
        token: token,
        messages: req.i18n.__("LOGIN_SUCCESS")
      }
    });
  })
}

export const viewAdminProfile = (req, res) => {
  Admin.findById(mongoose.Types.ObjectId(req.params.id), { salt: 0, hash: 0, group: 0 }, function (err, docs) {

    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("INTERNAL_SERVER_ERROR"), 'error': err }) }
    if (!docs) { return res.status(401).json({ 'success': false, 'message': req.i18n.__("NO_USER_FOUND"), docs }) }
    return res.status(200).json({ 'success': true, 'message': req.i18n.__("FETCHED_SUCCESSFULY"), 'data': docs });
  })
}

export const checkAdminEmail = (req, res) => {
  var randomGen = randomize('Aa0', 10);
  Admin.findOne({ email: req.body.email }, function (err, user) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
    if (!user) return res.status(401).json({ 'success': false, 'messages': req.i18n.__("NO_USER_FOUND") });

    user.verificationCode = randomGen;
    user.save((err, docs) => {
      if (err) { return res.status(500).json({ 'success': false, 'messages': req.i18n.__("ERROR_SERVER"), 'errors': err }) }
      var data = { name: docs.fname, url: config.baseurl + `adminapi/changePassword/` + randomGen };
      sendEmail(docs.email, data, 'forgotPassword')
      return res.status(200).json({ 'success': true, 'message': req.i18n.__("EMAIL_SEND_SUCCESSFULLY") })
    })
  })
}

export const passwordTemplate = (req, res) => {
  fs.readFile(__dirname + '/html/forgot_password.html', 'utf8', (err, template) => {
    var params = {
      url: config.baseurl + 'adminapi/changePassword/',
      id: req.params.id,
      loginUrl: config.frontendurl  //login page config
    }
    var html = Mustache.render(template, params);
    return res.send(html)
  });
}

export const addNewPassword = (req, res) => {
  if (typeof req.body.email === 'undefined' || req.body.email === '') {
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("ENTER_YOUR_MAILID") })
  }

  if (req.body.newPwd != req.body.conPwd) {
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("NEW_CONFIRM_PASSWORD_DIFFERENT") });
  }

  Admin.findOne({ 'email': req.body.email }, function (err, docs) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err });
    else {
      if (!docs) return res.status(404).json({ 'success': false, 'message': req.i18n.__("NO_USER_FOUND") });
      if (docs.verificationCode !== req.params.id || typeof req.params.id === 'undefined') {
        return res.status(409).json({ 'success': false, 'message': req.i18n.__("FORGET_PASSWORD_LINK_EXPIRED") })
      }

      var newDoc = Admin();
      var obj = newDoc.getPassword(req.body.newPwd);
      var update = {
        salt: obj.salt,
        hash: obj.hash,
        verificationCode: ''
      }
      Admin.findOneAndUpdate({ _id: docs._id }, update, { new: false }, (err, doc) => {
        if (err) { return res.json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }); }
        return res.json({ 'success': true, 'message': req.i18n.__("PASSWORD_UPDATED") });
      })
    }
  });
}



/**
 * Update Admin Soft delete Status
 * @input
 * @param
 * @return
 * @response
 */
export const adminstatus = (req, res) => {
  const id = req.params.id;
  var update = {
    "softdel": req.body.status
  }
  Admin.findOneAndUpdate({ _id: id }, update, { new: true }, (err, doc) => {
    if (err) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'err': err }); }
    else {
      return res.json({ 'success': true, 'message': req.i18n.__("ADMIN_INACTIVATED_SUCCESSFULLY") });
    }
  })
};

export const testToken = (req, res) => {
  var token = req.headers['x-access-token'];
  // var Authorizationtoken = req.headers['Authorization'];
  // console.log(Authorizationtoken);
  if (!token)
    return res.status(200).send({ 'success': false, 'message': 'Forbidden No Token Found.' });
  jwt.verify(token, config.adminsecret, async function(err, decoded) {
    if (err) return res.status(200).send({ 'success' : false, message: 'Failed to authenticate token.' });
    else return res.status(200).send({ 'success' : true, message: 'Token Passed.' });
  });
}
