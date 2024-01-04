// ./express-server/controllers/todo.server.controller.js
import mongoose from 'mongoose';
import path from 'path';
import * as HelperFunc from './adminfunctions';  
const mround = require('mongo-round'); 
const url = require('url');

//import models
import DriverPayment from '../models/driverpayment.model';
import Trips from '../models/trips.model';
import Rider from '../models/rider.model'; 
import Driver from '../models/driver.model'; 
import Wallet from '../models/wallet.model';  

/**
 * Driver Pay Reports
 * @input  
 * @param 
 * @return 
 * @response  
 */ 
 export const driverPayReport = async (req,res) => {  
    //Match, sort, filter by No, limit, search, xtotal 
    /* var likeQuery = HelperFunc.likeQueryBuilder(req.query); 
    var pageQuery = HelperFunc.paginationBuilder(req.query); 
    var totalCount = 10;  
    req.params.type = 'no'
    DriverPayment.aggregate([ 
      { "$match": { todvr : req.params.type } },   
      {
        "$group"  : {
          "_id": '$driver',   
          "dvrfname": { $addToSet: "$dvrfname"  } ,   
          "count": {$sum: 1},  
        },  
      },   
      ], function (err, result) {
        if (err) { } else {
          totalCount = result.length; 
          console.log(totalCount)
        }
      }); 
//console.log(likeQuery)
    DriverPayment.aggregate([ 
      { "$match": { todvr :  req.params.type} },  
        // { "$match": likeQuery }, //Need to match to sum value
        //{"$match":{count:12}},
        {
          "$group"  : {
            "_id": '$driver',   
            "dvrfname": { $addToSet: "$dvrfname"  } ,   
            "count": {$sum: 1}, 
            "commision": { $sum: "$commision" },  
            "inhand": { $sum: "$inhand" }, 
            "digital": { $sum: "$digital" }, 
            "toSettle": { $sum: "$toSettle" }
          },  
        },
        //{$unwind:"$data"},
        { $project : 
         {
           _id:1,
           dvrfname:1,
           //data:1,
           count:1,
           commision : mround ('$commision', 2),
           inhand: mround ('$inhand', 2),  
           digital: mround ('$digital', 2),   
           toSettle: mround ('$toSettle', 2)  
             // count:{$cond:[{ $ne: ["$PlnSls", 0] },{$multiply:[{$divide: ['$ActSls', '$PlnSls']},100]},0]}
           }

         },
         //{$match:{count:12}},
         {"$skip": pageQuery.skip},
         {"$limit": pageQuery.take},
         ], function (err, result) {
          if (err) {
            res.json(err); 
          } else {
            res.header('x-total-count',  totalCount );  
            res.json(result);
          }
        });    */
        var likeQuery = HelperFunc.likeQueryBuilder(req.query); 
        var pageQuery = HelperFunc.paginationBuilder(req.query); 
        var sortQuery = HelperFunc.sortQueryBuilder(req.query); 
        //req.params.type = 'no';
        let TotCnt    = DriverPayment.aggregate([ 
          { "$match": { todvr : req.params.type } },   
          {
            "$group"  : {
              "_id"      : '$driver',   
              "dvrfname" : { $addToSet: "$dvrfname"  } ,   
              "count"    : {$sum: 1},  
            },  
          },   
          { "$match": likeQuery },
          ]);
          //console.log(likeQuery)
        let Datas     = DriverPayment.aggregate([ 
          { "$match": { todvr :  req.params.type} },
          {
            "$lookup": {
              "localField": "driver",
              "from": "drivers",
              "foreignField": "_id",
              "as": "userinfo"
            }
          },
          { "$unwind": "$userinfo" },    
            //{ "$match": likeQuery }, //Need to match to sum value
            {
              "$group"  : {
                "_id": '$driver',   
                "dvrfname": { $addToSet: "$dvrfname"  } ,   
                "count": {$sum: 1}, 
                "commision": { $sum: "$commision" },  
                "inhand": { $sum: "$inhand" }, 
                "digital": { $sum: "$digital" }, 
                "toSettle": { $sum: "$toSettle" },
                "code" : { $addToSet: "$userinfo.code"}
              },  
            },
            //{ $match:likeQuery},

            { $project : 
             {
               _id:1,
               dvrfname:1,
               count:1,
               commision : mround ('$commision', 2),
               inhand: mround ('$inhand', 2),  
               digital: mround ('$digital', 2),   
               toSettle: mround ('$toSettle', 2),
               code : 1  
                 // count:{$cond:[{ $ne: ["$PlnSls", 0] },{$multiply:[{$divide: ['$ActSls', '$PlnSls']},100]},0]}
               }
    
             },
             {"$match" : likeQuery},
             {"$sort"  : sortQuery},
             {"$skip"  : pageQuery.skip},
             {"$limit" : pageQuery.take},
             ]);
        try {
          var promises = await Promise.all([TotCnt, Datas]);
          res.header('x-total-count', promises[0].length);
          var resstr = promises[1];
          res.send(resstr);
        } catch (err) {
          return res.json([]);
        } 
  }


/**
 * Driver Pay Reports Single
 * @input  
 * @param 
 * @return 
 * @response  
 */ 
 export const driverPayReportSingle = (req,res) => { 
  DriverPayment.find( { driver : req.params.id , todvr : 'no' } , function ( err, docs) {  
    if (err) {
      res.json([]); 
    } else {
      res.json(docs);
    }
  }); 
}


/**
 * All Ride Payment Report
 * @input  
 * @param 
 * @return 
 * @response  
 */ 
 export const paymentReport = async (req,res) => {   
   var likeQuery = HelperFunc.likeQueryBuilder(req.query,DriverPayment); 
   var pageQuery = HelperFunc.paginationBuilder(req.query); 
   var sortQuery = HelperFunc.sortQueryBuilder(req.query); 
   likeQuery = HelperFunc.findQueryBuilder(req.query,likeQuery); 

/*    var totalCount = 10; 
   
   console.log(likeQuery);
   DriverPayment.find(likeQuery).count().exec((err,cnt) => {  
    if(err){}  
      totalCount = cnt;
  }); 

   DriverPayment.find( likeQuery ,{ _id :0}).skip(pageQuery.skip).limit(pageQuery.take).exec((err,docs) => {  
     if(err){   
      return res.json([]); 
    }  
    res.header('x-total-count',  totalCount ); 
    res.send(docs); 
  });  */  

  let TotCnt    = DriverPayment.find( likeQuery).count();
  let Datas     = DriverPayment.find(likeQuery,{"_id":0}).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery).populate('driver','code'); 
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }

 }


/**
 * markSettledDvrPayment
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
 export const markSettledDvrPayment = (req,res) => {   
  var dvrstosettle = req.body;
  dvrstosettle.forEach(function(element) { 
    markSettledDvrPaymentFunc(element);
  }); 
  return res.json(req.body);  
}   

function markSettledDvrPaymentFunc(element){ 
  //If paid out log Trx Id too
  var driverId =  new mongoose.Types.ObjectId( element._id ) ; 
  var query = { driver :  driverId };
  var update = { todvr : 'yes' };

  DriverPayment.update( query ,  update , {multi: true} , function (err) {
    if (err) { 
     throw err;
   }
   else { 
     console.log("updated!");
   }
 });

}

/**
 * [canceledTrips]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
 export const canceledTrips = async (req,res) => { 
  var likeQuery = HelperFunc.likeQueryBuilder(req.query); 
  var pageQuery = HelperFunc.paginationBuilder(req.query); 
  var sortQuery = HelperFunc.sortQueryBuilder(req.query); 
  likeQuery = HelperFunc.findQueryBuilder(req.query,likeQuery);   
  likeQuery['status']  = 'canceled'; 
    // Trips.find(likeQuery).count().exec((err,cnt) => {  
    //   if(err){}  
    //     totalCount = cnt;
    // }); 
    
    // Trips.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).exec((err,docs) => {  
    //  if(err){ 
    //   return res.json([]); 
    // }  
    // res.header('x-total-count',  totalCount ); 
    // res.send(docs); 
    // });    

    let TotCnt = Trips.find(likeQuery).count() ;
    let Datas = Trips.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery).populate('dvrid','code'); //have to catch Err
    try {
      var promises =  await Promise.all([TotCnt,Datas]);
      res.header('x-total-count',  promises[0] ); 
      var resstr = promises[1]; 
      res.send(resstr);  
    } catch (err) {
      return res.json([]); 
    } 
  } 


/**
 * UserWallet 
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
 export const userWallet = async (req,res) => { 
     var likeQuery = HelperFunc.likeQueryBuilder(req.query); 
     var pageQuery = HelperFunc.paginationBuilder(req.query); 
     var sortQuery = HelperFunc.sortQueryBuilder(req.query); 
    // likeQuery = HelperFunc.findQueryBuilder(req.query,likeQuery);   
    // likeQuery['status']  = 'canceled';  

    // let TotCnt = Rider.find(likeQuery).count() ;
//console.log(sortQuery)
    Wallet.aggregate([
    // { "$match": { "trx.trxid": "" } }, //Make to "" as Referal - Referal Code i
    
    { "$lookup": {
      "localField": "ridid",
      "from": "riders",
      "foreignField": "_id",
      "as": "userinfo"
    } },
    { "$unwind": "$userinfo" },
    { "$match":likeQuery},
    { "$project": {
      "bal": 1,
      "trx": 1,
      "userinfo.fname": 1,
      "userinfo.phone": 1
    } },
    {"$sort":sortQuery},
    {"$skip": pageQuery.skip},
    {"$limit": pageQuery.take},
    ], function (err, result) {
      if (err) { 
        return res.json([]); 
      } 
      return res.json(result);  
    });

  } 

/**
 * Referrer 
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
 export const referrer = async (req,res) => { 
    var likeQuery = HelperFunc.likeQueryBuilder(req.query); 
    var pageQuery = HelperFunc.paginationBuilder(req.query); 
    var sortQuery = HelperFunc.sortQueryBuilder(req.query); 
    // likeQuery = HelperFunc.findQueryBuilder(req.query,likeQuery);   
    // likeQuery['status']  = 'canceled';  

    // let TotCnt = Rider.find(likeQuery).count() ;
    Wallet.aggregate([
    { "$match": { "trx.trxid": "" } }, //Make to "" as Referal - Referal Code i
    
    { "$lookup": {
      "localField"   : "ridid",
      "from"         : "riders",
      "foreignField" : "_id",
      "as"           : "userinfo"
    } },
    { "$unwind": "$userinfo" },
    { "$project": {
      "bal"            : 1,
      "trx"            : 1,
      "userinfo.fname" : 1,
      "userinfo.phone" : 1
    } },
    {"$match": likeQuery},
    {"$sort" : sortQuery},
    {"$skip" : pageQuery.skip},
    {"$limit": pageQuery.take},
    ], function (err, result) {
      if (err) { 
        return res.json([]); 
      } 
      return res.json(result);  
    });

  } 


/**
 * [tripTimeVariance]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
 export const tripTimeVariance = async (req,res) => { 
  var likeQuery = HelperFunc.likeQueryBuilder(req.query); 
  var pageQuery = HelperFunc.paginationBuilder(req.query); 
  var sortQuery = HelperFunc.sortQueryBuilder(req.query); 
  likeQuery = HelperFunc.findQueryBuilder(req.query,likeQuery);   
  likeQuery['status']  = 'Finished';  

  let TotCnt = Trips.find(likeQuery).count() ;
    let Datas = Trips.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery); //have to catch Err
    try {
      var promises =  await Promise.all([TotCnt,Datas]);
      res.header('x-total-count',  promises[0] ); 
      var resstr = promises[1]; 
      res.send(resstr);  
    } catch (err) {
      return res.json([]); 
    } 
  } 


/**
 * [logReport]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
 export const logReport = async (req,res) => { 
  var likeQuery = HelperFunc.likeQueryBuilder(req.query); 
  var pageQuery = HelperFunc.paginationBuilder(req.query); 
   var sortQuery = HelperFunc.sortQueryBuilder(req.query);  
  likeQuery = HelperFunc.findQueryBuilder(req.query,likeQuery);   

   let TotCnt = Driver.find(likeQuery).count() ;
   let Datas = Driver.find(likeQuery, { fname: 1, email: 1, phone: 1,last_out:1,last_in:1}).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery); //have to catch Err
    try {
      var promises =  await Promise.all([TotCnt,Datas]);
      res.header('x-total-count',  promises[0] ); 
      var resstr = promises[1]; 
      res.send(resstr);  
    } catch (err) {
      return res.json([]); 
    } 
  } 

 /**
  *  All Driver Earnings
  * @param  {[type]} req [description]
  * @param  {[type]} res [description]
  * @return {[type]}     [description]
  */ 
 export const driverEarnings = async (req,res) => {  
    //Match, sort, filter by No, limit, search, xtotal 
/*     var likeQuery = HelperFunc.likeQueryBuilder(req.query); 
    var pageQuery = HelperFunc.paginationBuilder(req.query); 
    var totalCount = 10;  
    DriverPayment.aggregate([  
      {
        "$group"  : {
          "_id": '$driver',   
          "dvrfname": { $addToSet: "$dvrfname"  } ,   
          "count": {$sum: 1},  
        },  
      },   
      ], function (err, result) {
        if (err) { } else {
          totalCount = result.length; 
        }
      }); 

    DriverPayment.aggregate([  
        {
          "$group"  : {
            "_id": '$driver',   
            "dvrfname": { $addToSet: "$dvrfname"  } ,   
            "count": {$sum: 1}, 
            "commision": { $sum: "$commision" },  
            "inhand": { $sum: "$inhand" }, 
            "digital": { $sum: "$digital" }, 
            "toSettle": { $sum: "$toSettle" } 
          },  
        },  

        { $project : 
         {
           _id:1,
           dvrfname:1,
           count:1,
           commision : mround ('$commision', 2),
           inhand: mround ('$inhand', 2),  
           digital: mround ('$digital', 2),   
           toSettle: mround ('$toSettle', 2)  
             // count:{$cond:[{ $ne: ["$PlnSls", 0] },{$multiply:[{$divide: ['$ActSls', '$PlnSls']},100]},0]}
           }

         },

         {"$skip": pageQuery.skip},
         {"$limit": pageQuery.take},
         ], function (err, result) {
          if (err) {
            res.json(err); 
          } else {
            res.header('x-total-count',  totalCount );  
            res.json(result);
          }
        });   */
        var likeQuery = HelperFunc.likeQueryBuilder(req.query); 
        var pageQuery = HelperFunc.paginationBuilder(req.query); 
        var sortQuery = HelperFunc.sortQueryBuilder(req.query); 
        //console.log(likeQuery)


        let TotCnt    = DriverPayment.aggregate([  
          {
            "$group"  : {
              "_id": '$driver',   
              "dvrfname": { $addToSet: "$dvrfname"  } ,   
              "count": {$sum: 1},  
            },  
          },   
          ]);
          console.log(likeQuery)
        let Datas     = DriverPayment.aggregate([  
          {
            "$lookup": {
              "localField": "driver",
              "from": "drivers",
              "foreignField": "_id",
              "as": "userinfo"
            }
          },
          { "$unwind": "$userinfo" },   
          {
            "$group"  : {
              "_id": '$driver',   
              "dvrfname": { $addToSet: "$dvrfname"  } ,   
              "count": {$sum: 1}, 
              "commision": { $sum: "$commision" },  
              "inhand": { $sum: "$inhand" }, 
              "digital": { $sum: "$digital" }, 
              "toSettle": { $sum: "$toSettle" },
              "code" : { $addToSet: "$userinfo.code"},
             // "fname":{ $addToSet: "$userinfo.fname"} 
            },  
          },  
          //{ $match:likeQuery},
          { $project : 
           {
             _id:1,
             dvrfname:1,
             count:1,
             commision : mround ('$commision', 2),
             inhand: mround ('$inhand', 2),  
             digital: mround ('$digital', 2),   
             toSettle: mround ('$toSettle', 2),
             code:1,
            // fname:1  
               // count:{$cond:[{ $ne: ["$PlnSls", 0] },{$multiply:[{$divide: ['$ActSls', '$PlnSls']},100]},0]}
             }
  
           },
           {"$match":likeQuery},
           {"$sort":sortQuery},
           {"$skip": pageQuery.skip},
           {"$limit": pageQuery.take},
           ]);
        try {
          var promises = await Promise.all([TotCnt, Datas]);
          res.header('x-total-count', promises[0].length);
          var resstr = promises[1];
          res.send(resstr);
        } catch (err) {
          return res.json([]);
        }
  }
/*   const Schema = mongoose.Schema;
  const ObjectId = Schema.Types.ObjectId;
export const test = (req,res) =>{
  Trips.find().limit(2).exec((err,data)=>{
   if(err) {}
   console.log(data[0].dvrid)


   })
  })
} */
