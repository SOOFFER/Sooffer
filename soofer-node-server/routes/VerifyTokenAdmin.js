import mongoose from 'mongoose';
var jwt = require('jsonwebtoken');
var config = require('../config');
var featuresSettings = require('../featuresSettings')

//import model
import Admin from '../models/admin.model';
import CompanyDetails from '../models/company.model';


function vtAdmin(req, res, next) {
  var token = req.headers['x-access-token'];
  // var Authorizationtoken = req.headers['Authorization'];
  //  console.log(Authorizationtoken);
  // console.log("...tokenadmin",token)
  if (!token)  
    return res.status(403).send({ 'success': false, 'message': 'Forbidden Making a request that isn’t allowed.' });
  jwt.verify(token, config.adminsecret, async function(err, decoded) {
    if (err)
      return res.status(401).send({ 'success' : false, message: 'Failed to authenticate token.' });

    if(featuresSettings.isCityWise){
      var scId = await Admin.findById(decoded.id,{'scIds':1});
      if(scId){
      var checkDefaultCity = scId.scIds.some(function (el) {
        return el.name === "Default";
      });
      if(!checkDefaultCity){
        req.scId     = scId.scIds.map(a => a.scId);
        req.cityWise = 'exists';
      }     
      }
    } 
    
    // save to request for use in other routes
    req.userId = decoded.id;
    req.email = decoded.email;
    req.name = decoded.name;
    req.type = decoded.type;
    //req.scId = decoded.scId;

    next();
  });
}

module.exports = vtAdmin;