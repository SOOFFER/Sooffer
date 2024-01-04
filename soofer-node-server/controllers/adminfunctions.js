import moment from 'moment';

/**
 *  likeQueryBuilder
 * @input  
 * @param 
 * @return null
 * @response null
 */
 export const likeQueryBuilder = (query="") => { 
  
  var likeQuery = {};
     
  for (let key of Object.keys(query)) {  
    let value = query[key]; 
    if (key.indexOf('_like') > -1)
    {
      var res = key.split("_like");
      if(res[0]){
           if(/^\d+(\.\d+)?$/.test(value)){
            likeQuery[res[0]] = Number(value) ;
          }
           else if(["true","false"].includes(value)){
            likeQuery[res[0]] = value =="true"?true:false ; 
          }
           else {
            likeQuery[res[0]] = new RegExp( value , 'i') ; 
           }
           
      }  
    }  
  }  
   if (likeQuery.code){
     likeQuery['code'] = new RegExp(likeQuery.code, 'i'); //String(likeQuery.code)
   } else if (likeQuery["userinfo.code"]){
     likeQuery["userinfo.code"] = new RegExp(likeQuery["userinfo.code"], 'i'); //String(likeQuery.code)
   } else if (likeQuery["dvrid.code"]) {
     likeQuery["dvrid.code"] = new RegExp(likeQuery["dvrid.code"], 'i'); //String(likeQuery.code)
   }
   else if (likeQuery["phone"]) {
     likeQuery["phone"] = new RegExp(likeQuery["phone"], 'i'); //String(likeQuery.code)
   }
   else if (likeQuery["tripno"]) {
     likeQuery["tripno"] = new RegExp(likeQuery["tripno"], 'i'); //String(likeQuery.code)
   }
   // else if (likeQuery["isSubcriptionActive"]) {
   //   likeQuery["isSubcriptionActive"] = new RegExp(likeQuery["isSubcriptionActive"], 'i'); //String(likeQuery.code)
   // }

  return likeQuery; 
}

export const findQueryBuilder = (query = "", likeQuery = '') => {
  var fromDate = '';
  var toDate = '';
  var likekey = '';

  for (let key of Object.keys(query)) {
    let value = query[key];
    if (key.indexOf('_gte') > -1) {
      var res = key.split("_gte");
      if (res[0]) {
        likekey = res[0];
        fromDate = value;
      }
    }

    if (key.indexOf('_lte') > -1) {
      var res = key.split("_lte");
      if (res[0]) {
        likekey = res[0];
        toDate = value;

        // var To = moment(toDate).format("YYYY-MM-DDT00:00:00.000[Z]");
        // var ToDate = moment(To).add(1, "days").format("YYYY-MM-DDT00:00:00.000[Z]");
        var ToDate = moment(toDate).format("YYYY-MM-DDT23:59:59.000[Z]");

      }
    }

  }

  if (fromDate && toDate) {
    likeQuery[likekey] = { '$gte': new Date(fromDate), '$lte': new Date(ToDate) };
  } else if (fromDate) {
    likeQuery[likekey] = { '$gte': new Date(fromDate) };
  } else if (toDate) {
    likeQuery[likekey] = { '$lte': new Date(toDate) };
  }
  return likeQuery;
}

 /**
 *  paginationBuilder
 * @input  
 * @param 
 * @return null
 * @response null
 */
 export const paginationBuilder = (query="") => { 
   var pagination = {}; 
   var take = query._limit;
   var pageNo = query._page; 
   var skip = (pageNo - 1 ) * take;
   pagination.take = Number(take);
   pagination.skip = Number(skip); 
   return pagination;
 }  

/**
*  Sort Query Builder
* @input  
* @param 
* @return null
* @response null
*/
export const sortQueryBuilder = (query = "") => {
  var sortQuery = {};
  var sort = query._sort; 
  var type = query._order; 
  if (type == 'ASC'){
    sortQuery[sort] = 1 ; 
  } else {
    sortQuery[sort] = -1; 
  }

       if (sortQuery["date"]) {
         sortQuery["createdAt"] = sortQuery["date"];
         delete sortQuery["date"];
       }

  return sortQuery; 
}

export const addSClike = (scId = null) => { 

}

export const btQueryBuilder = (query = "", likeQuery = '') => {
  var fromValue = '';
  var toValue = '';
  var likekey = '';

  for (let key of Object.keys(query)) {
    let value = query[key];
    if (key.indexOf('_gte') > -1) {
      var res = key.split("_gte");
      if (res[0]) {
        likekey = res[0];
        fromValue = value;
      }
    }
    if (key.indexOf('_lte') > -1) {
      var res = key.split("_lte");
      if (res[0]) {
        likekey = res[0];
        toValue = value;
      }
    }
  }

  if (fromValue && toValue) {
    likeQuery[likekey] = { '$gte': fromValue, '$lte': toValue };
  } else if (fromValue) {
    likeQuery[likekey] = { '$gte': fromValue };
  } else if (toValue) {
    likeQuery[likekey] = { '$lte': toValue };
  }
  return likeQuery;
}