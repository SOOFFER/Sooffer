import mongoose from 'mongoose';
import * as HelperFunc from './adminfunctions';  

//import models
import Trips from '../models/trips.model';
import * as GFunctions from './functions';  
  
export const getTripDetails = async (req,res) => { 
/*     var likeQuery = HelperFunc.likeQueryBuilder(req.query); 
    var pageQuery = HelperFunc.paginationBuilder(req.query); 
    var totalCount = 10;  
    Trips.find(likeQuery).count().exec((err,cnt) => {  
      if(err){}  
        totalCount = cnt;
    }); 
    
    Trips.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).exec((err,docs) => {  
     if(err){ 
      return res.json([]); 
    }  
    res.header('x-total-count',  totalCount ); 
    res.send(docs); 
    }); */

    var likeQuery = HelperFunc.likeQueryBuilder(req.query); 
    var pageQuery = HelperFunc.paginationBuilder(req.query); 
    var sortQuery = HelperFunc.sortQueryBuilder(req.query); 
    let TotCnt    = Trips.find(likeQuery).count();
    let Datas     = Trips.find(likeQuery,{"pwd":0}).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery).populate('dvrid','code');

/*     let Datas     = Trips.aggregate([ 
      {
        "$lookup": {
          "localField": "ridid",
          "from": "riders",
          "foreignField": "_id",
          "as": "userinfo"
        }
      },//{$toObjectId: }
      { "$unwind": "$userinfo" },    

         { $project : 
         {
           _id:1,

           //"userinfo.code" : 1 
             // count:{$cond:[{ $ne: ["$PlnSls", 0] },{$multiply:[{$divide: ['$ActSls', '$PlnSls']},100]},0]}
           }

         },
         //{"$match" : likeQuery},
        /* {"$sort"  : sortQuery},
         {"$skip"  : pageQuery.skip},
         {"$limit" : pageQuery.take}, 
         ]); */
  console.log(likeQuery)
    try {
      var promises = await Promise.all([TotCnt, Datas]);
      res.header('x-total-count', promises[0]);
      var resstr = promises[1];
      res.send(resstr);
    } catch (err) {
      return res.json([]);
    }
} 

export const getScheduletrips = async (req, res) => {
/*   var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var totalCount = 10;
  Trips.find(likeQuery).count().exec((err, cnt) => {
    if (err) { }
    totalCount = cnt;
  });

  Trips.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.header('x-total-count', totalCount);
    res.send(docs);
  }); */

  var likeQuery = HelperFunc.likeQueryBuilder(req.query); 
  var pageQuery = HelperFunc.paginationBuilder(req.query); 
  var sortQuery = HelperFunc.sortQueryBuilder(req.query); 
  let TotCnt    = Trips.find(likeQuery).count();
  let Datas     = Trips.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery).populate('dvrid','code');
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }
} 

export const ongoingTrips = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);  
  likeQuery['status'] = { $ne: 'Finished' };
  let TotCnt = Trips.find(likeQuery).count();
  let Datas = Trips.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery).populate('dvrid','code') //have to catch Err
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  } 
} 



export const upcomingTrips = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  likeQuery['status'] = { $in: ['accepted', 'noresponse'] };
  likeQuery['tripFDT'] = { "$gte": new Date().toISOString() };
  //console.log(likeQuery);
  let TotCnt = Trips.find(likeQuery).count();
  let Datas = Trips.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery); //have to catch Err
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }
  
} 

export const pastTrips = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  likeQuery['status'] = 'Finished';
  likeQuery['tripFDT'] = { "$lt": new Date().toISOString() };
  let TotCnt = Trips.find(likeQuery).count();
  let Datas = Trips.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery).populate('dvrid','code') //have to catch Err
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }
  
} 


export const getATripDetails = (req,res) => {
  Trips.find( { _id:req.params.id }  ).exec((err,docs) => {
    if(err){
      return res.json([]); 
    }
    if(docs.length){
      return res.json(docs);
    }
    else{
      return res.json([]); 
    }
  })
} 

/**
 * Delete Trip Details 
 * @input  
 * @param 
 * @return 
 * @response  
 */ 
export const deleteATripDetails = (req,res) => {
  Trips.findByIdAndRemove(req.params.id, (err,docs) => {
    if(err){
      return res.json({'success':false,'message':req.i18n.__('SOME_ERROR')});
    }  
    return res.json({'success':true,'message':req.i18n.__('DELETED_SUCCESS')}); 
  })
}