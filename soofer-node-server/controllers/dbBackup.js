import mongoose from 'mongoose';
import * as HelperFunc from './adminfunctions';

var exec = require('child_process').exec;
const zipFolder = require('zip-folder');
const rmdir = require('rmdir');
const config = require('../config');

//import models
import DBbackup from '../models/dbBackup.model';

export const addDbBackup = (req, res) => {
  var helper = {
    run: function () {
      var date = new Date().getDate();
      var month = new Date().getMonth() + 1;
      var year = new Date().getFullYear();
      var theDate = year + '-' + month + '-' + date;
      var path = './public/DBbackup/' + theDate;
      // exec('mongodump --db ' + config.database + ' --out ' + path, function (err, res, res2) {
      exec('mongodump  --username myUserAdmin --password  xFTS1SOH8WLQEYBy --authenticationDatabase admin --db rebustarv2serverenterprise --out ' + path, function (err, res, res2) {
        helper.zip(path, theDate)
        console.log('Database Back Up Completed', 'log');
      });
    },
    zip: function (dir, theDate) {
      zipFolder(dir, dir + '.zip', function (err) {
        if (err) {
          console.log(err);
        } else {
          deletefolder(dir)
          helper.dbsave(dir, theDate)
        }
      });
    },
    dbsave: function (dir, date) {
      DBbackup.find({ foldername: date }).exec((err, checkdb) => {
        if (err) { }
        if (checkdb.length == 0) {
          var doc = new DBbackup({
            foldername: date,
            folderpath: 'public/DBbackup/' + date + '.zip',
            type: 'Manual'
          });
          doc.save((err, data) => {
            if (err) { }
            return res.status(200).json({ 'success': true, 'message': req.i18n.__("BACKUP_OF_RESOURCES_AND_DATABASE_SUCCESSFULLY"), "datas": data })
          });
        }
        else {
          return res.status(200).json({ 'success': true, 'message': req.i18n.__("BACKUP_OF_RESOURCES_AND_DATABASE_SUCCESSFULLY"), "datas": checkdb })
        }
      })
    }
  };
  helper.run();
}

export const viewDbBackup = async (req, res) => {
  if (typeof req.query._sort === "undefined" || req.query._sort === "") {
    req.query._sort = "date";
  }

  if (typeof req.query._order === "undefined" || req.query._order === "") {
    req.query._order = "DESC";
  }

  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  let TotCnt = DBbackup.find(likeQuery).count();
  let Datas = DBbackup.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    for (var i = 0; i < resstr.length; i++) { resstr[i].folderpath = config.baseurl + resstr[i].folderpath; }
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }
}

//db backup delete 
export const deleteDbBackup = (req, res) => {
  DBbackup.findById(req.params.id, function (err, docs) {
    if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__("INTERNAL_SERVER_ERROR"), 'error': err });
    if (!docs) return res.status(401).json({ 'success': false, 'message': req.i18n.__("NOT_FOUND") });
    if (docs) {
      deletefolder(docs.folderpath)
      DBbackup.remove({ _id: req.params.id }, function (err, op) {
        if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__("INTERNAL_SERVER_ERROR"), 'error': err });
        return res.status(200).json({ 'success': true, 'message': req.i18n.__("DELETED_SUCCESSFULLY") });
      });
    }
  });
}

//delete folder
function deletefolder(dir) {
  rmdir(dir, function (err, dirs, files) {
    if (err) { console.log(err) }
  });
}