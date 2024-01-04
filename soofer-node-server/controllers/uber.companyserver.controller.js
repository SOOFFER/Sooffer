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
