// ./express-server/controllers/todo.server.controller.js
import mongoose from 'mongoose';

//import models
import CompanyDetails from '../models/uber.server.model';

export const getTodos = (req,res) => {
  CompanyDetails.find().exec((err,docs) => {
    if(err){
    return res.json({'success':false,'message':req.i18n.__('SOME_ERROR')});
    }

    return res.json({'success':true,'message':req.i18n.__('COMPANY_DETAILS_FETECH_SUCCESS'),docs});
  });
}
 
export const addTodo = (req,res) => {
  console.log(req.body);
  const newTodo = new CompanyDetails(req.body);
  newTodo.save((err,docs) => {
    if(err){
    return res.json({'success':false,'message':req.i18n.__('SOME_ERROR')});
    }

    return res.json({'success':true,'message':req.i18n.__('TODO_ADDED_SUCCESS'),docs});
  })
}

export const updateTodo = (req,res) => {
  CompanyDetails.findOneAndUpdate({ _id:req.body.id }, req.body, { new:true }, (err,todo) => {
    if(err){
    return res.json({'success':false,'message':req.i18n.__('SOME_ERROR'),'error':err});
    }
    console.log(todo);
    return res.json({'success':true,'message':req.i18n.__('TODO_UPDATED_SUCCESS'),todo});
  })
}

export const getTodo = (req,res) => {
  CompanyDetails.find({_id:req.params.id}).exec((err,todo) => {
    if(err){
    return res.json({'success':false,'message':req.i18n.__('SOME_ERROR')});
    }
    if(todo.length){
      return res.json({'success':true,'message':req.i18n.__('TODO_FETCHED_ID_SUCCESS'),todo});
    }
    else{
      return res.json({'success':false,'message':req.i18n.__('TODO_FETCHED_ID_FAILED')});
    }
  })
}

export const deleteTodo = (req,res) => {
  CompanyDetails.findByIdAndRemove(req.params.id, (err,todo) => {
    if(err){
    return res.json({'success':false,'message':req.i18n.__('SOME_ERROR')});
    }

    return res.json({'success':true,'message':req.i18n.__('TODO_DELETED_SUCCESS'),todo});
  })
}


export const deleteCompany = (req,res) => {
  CompanyDetails.findByIdAndRemove(req.params.id, (err,docs) => {
    if(err){
    return res.json({'success':false,'message':req.i18n.__('SOME_ERROR')});
    } 
    return res.json({'success':true,'message':req.i18n.__('TODO_DELETED_SUCCESS'),docs}); 
  })
}

export const updateCompany = (req,res) => {
  CompanyDetails.findOneAndUpdate({ _id:req.body.id }, req.body, { new:true }, (err,todo) => {
    if(err){
    return res.json({'success':false,'message':req.i18n.__('SOME_ERROR'),'error':err});
    }
    console.log(todo);
    return res.json({'success':true,'message':req.i18n.__('COMPANY_DETAILS_UPDATE_SUCCESS'),todo});
  })
}

export const addCompany = (req,res) => {
  const newTodo = new CompanyDetails(req.body);
  newTodo.save((err,docs) => {
    if(err){
    return res.json({'success':false,'message':req.i18n.__('SOME_ERROR')});
    }

    return res.json({'success':true,'message':req.i18n.__('TODO_ADDED_SUCCESS'),docs});
  })
}

export const getCompany = (req,res) => { 
  //Remember to sanitize the query before passing it to db
  var query = {};
  if (req.query._limit) query.limit = req.query._limit;
  if (req.query._page) query.page = req.query._page; 
  // if (req.query.companyName_like) query.companyName_like = req.query.companyName_like;  
  var take = query.limit;
  var pageNo = query.page; 
  var skip = (pageNo - 1 ) * take;
  take = Number(take);
  skip = Number(skip); 
  var totalCount = 100;
 

  CompanyDetails.find().count().exec((err,cnt) => {  
    if(err){}  
    totalCount = cnt;
  });

  CompanyDetails.find().skip(skip).limit(take).exec((err,docs) => {  
   if(err){ 
    return res.json([]); 
   }  
    res.header('x-total-count',  totalCount ); 
    res.send(docs); 
  });
 
}
 

 