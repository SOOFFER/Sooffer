// ./express-server/controllers/todo.server.controller.js
import mongoose from 'mongoose';
const _ = require('lodash');

//import models
import CompanyDetails from '../models/company.model';
import * as HelperFunc from './adminfunctions';

//Add Company Details
export const addCompany = async (req, res) => {
  try {
    let checkCompanyEmail = await CompanyDetails.findOne({ 'email': req.body.email })
    if (checkCompanyEmail) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("EMAIL_ID_ALREADY_EXISTS") }) }
    const newTodo = new CompanyDetails();
    newTodo.name = req.body.name;
    newTodo.email = req.body.email;
    newTodo.phone = req.body.phone;
    newTodo.cnty = req.body.cnty;
    newTodo.cntyname = req.body.cntyname;
    newTodo.state = req.body.state;
    newTodo.statename = req.body.statename;
    newTodo.city = req.body.city;
    newTodo.adln1 = req.body.adln1;
    newTodo.adln2 = req.body.adln2;
    newTodo.vat = req.body.vat;
    newTodo.settlementType = req.body.settlementType;
    newTodo.rate = req.body.rate;
    newTodo.vatNumber = req.body.vatNumber;
    newTodo.setPassword(req.body.pwd);
    if (req.body.scIds) {
      var scIds = JSON.parse(req.body.scIds);
      _.forEach(scIds, function (element, i) {
        newTodo.scIds.push(element);
      });
    }

    newTodo.save((err, docs) => {
      if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err }); }
      return res.json({ 'success': true, 'message': req.i18n.__("DATA_ADDED"), docs });
    })
  }
  catch (err) {
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err.toString() })
  }
}

//Get Company Details
export const getCompany = (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);

  var totalCount = 10;
  if (req.cityWise == 'exists') { likeQuery['scIds.scId'] = { "$in": req.scId }; }
  CompanyDetails.find(likeQuery).count().exec((err, cnt) => {
    if (err) { }
    totalCount = cnt;
  });

  CompanyDetails.find(likeQuery, { "hash": 0, "salt": 0 }).sort(sortQuery).skip(pageQuery.skip).limit(pageQuery.take).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.header('x-total-count', totalCount);
    res.send(docs);
  });
}

//Update Company Details
export const updateCompany = async (req, res) => {
  let checkCompanyEmail = await CompanyDetails.findOne({ 'email': req.body.email, "_id": { "$ne": req.body._id } })
  if (checkCompanyEmail) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("EMAIL_ID_ALREADY_EXISTS") }) }

  CompanyDetails.findById(req.body._id, function (err, doc) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err }) }
    if (!doc) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("COMPANY_NOT_FOUND") }) }

    doc.name = req.body.name;
    doc.email = req.body.email;
    doc.phone = req.body.phone;
    doc.cnty = req.body.cnty;
    doc.cntyname = req.body.cntyname;
    doc.state = req.body.state;
    doc.statename = req.body.statename;
    doc.city = req.body.city;
    doc.adln1 = req.body.adln1;
    doc.adln2 = req.body.adln2;
    doc.vat = req.body.vat;
    doc.vatNumber = req.body.vatNumber;
    doc.scIds = req.body.scIds;
    doc.settlementType = req.body.settlementType;
    doc.rate = req.body.rate;
    var oldScId = req.body.oldScIds;
    let oldScIds = req.body.oldScIds;
    var scIds = req.body.scIds;
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
      if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), 'data': op });
    });
  })
}

//Delete Company Details
export const deleteCompany = (req, res) => {
  CompanyDetails.findByIdAndRemove(req.params.id, (err, docs) => {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR") });
    }
    return res.json({ 'success': true, 'message': req.i18n.__("TODO_DELETED_SUCCESSFULLY"), docs });
  })
}

//Company Login
export const login = (req, res) => {
  CompanyDetails.findOne({ email: req.body.email }, function (err, user) {
    var newDoc = CompanyDetails();
    if (err) return res.status(401).json({ data: { token: '', messages: req.i18n.__("ERROR_SERVER"), errors: 'Error on the server.', } });
    if (!user) return res.status(401).json({ data: { token: '', messages: req.i18n.__("USER_NOT_FOUND"), errors: 'No user found.', } });
    var passwordIsValid = newDoc.validPassword(req.body.password, user.salt, user.hash);
    if (!passwordIsValid) return res.status(401).json({ data: { token: '', messages: req.i18n.__("INVALID_PASSWORD"), errors: 'Invalid Password', } });
    var token = newDoc.generateJwt(user._id, user.email, user.name, "company"/* , user.scId */);
    return res.status(200).json({
      data: {
        token: token,
        messages: req.i18n.__("LOGIN_SUCCESS")
      }
    });
  })
}

//Company Logout
export const logout = (req, res) => {
  return res.status(200).json({
    data: {
      token: '',
      messages: req.i18n.__("LOGOUT_SUCCESS"),
      errors: 'Logout success.',
    }
  });
}

//View Company Profile
export const viewCompanyProfile = (req, res) => {
  CompanyDetails.findOne({ id: req.params.id }, { salt: 0, hash: 0, group: 0 }, function (err, docs) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("INTERNAL_SERVER_ERROR"), 'error': err }) }
    if (!docs) { return res.status(401).json({ 'success': false, 'message': req.i18n.__("USER_NOT_FOUND") }) }
    return res.status(200).json({ 'success': true, 'message': req.i18n.__("FETCHED_SUCCESSFULY"), 'data': docs });
  })
}


export const getCompanyCommison = async (totalFare, cpyid) => {
  try {
    if (cpyid) {
      var cmpyDetails = await CompanyDetails.findOne({ _id: cpyid });
      if (cmpyDetails) {
        var commision = CompanyDetails.rate;
        if (CompanyDetails.settlementType == 'Flat') {
          return commision;
        }else{
          commision = (Number(commision) * Number(totalFare)) / 100;
          return commision;
        } 
      }
    } else {
      return 0
    }
  } catch (error) {
    return 0
  }
}