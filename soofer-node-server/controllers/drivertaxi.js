// ./express-server/controllers/todo.server.controller.js
import mongoose from 'mongoose';

//import models
import Drivertaxi from '../models/drivertaxi.model';

// export const addData = (req,res) => {
// 	const newDoc = new Drivertaxi(
// 	{
// 		makeid: req.body.make,
// 		makename: req.body.makename, 
// 		model: req.body.model,
// 		year: req.body.year,
// 		licence: req.body.licence, 
// 		cpy: req.body.cpy, 
// 		driver: req.body.driver,
// 		color: req.body.color,
// 		handicap: req.body.handicap,
// 		type: [{
// 			basic: req.body.basic,
// 			normal: req.body.normal,
// 			luxury: req.body.luxury
// 		}] 
// 	}
// 	);
// 	newDoc.save((err,docs) => {
// 		if(err){
// 			return res.json({'success':false,'message':'Some Error'});
// 		} 
// 		return res.json({'success':true,'message':'Data added successfully',docs});
// 	})
// }


export const getDrivertaxis = (req, res) => {
  Drivertaxi.find({}).populate('companydetails').exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    return res.json(docs);
  });
}


export const addData = (req, res) => {
  // const newDoc = new Drivertaxi(
  // {
  // 	makeid: req.body.make,
  // 	makename: req.body.makename, 
  // 	model: req.body.model,
  // 	year: req.body.year,
  // 	licence: req.body.licence, 
  // 	cpy: req.body.cpy, 
  // 	driver: req.body.driver,
  // 	color: req.body.color,
  // 	handicap: req.body.handicap,
  // 	type: [{
  // 		basic: req.body.basic,
  // 		normal: req.body.normal,
  // 		luxury: req.body.luxury
  // 	}] 
  // }
  // );
  // newDoc.save((err,docs) => {
  // 	if(err){
  // 		return res.json({'success':false,'message':'Some Error'});
  // 	} 
  // 	return res.json({'success':true,'message':'Data added successfully',docs});
  // })

  // create a comment

  // var parent = new Drivertaxi({ type: [{ basic: 'Matt' }, { basic: 'Sarah' }] })
  // parent.type[0].basic = 'Matthew';

  // var parent = new Drivertaxi;
  // parent.type[0].basic = 'Matthew';


  // parent.save((err,docs) => {
  // 	if(err){
  // 		return res.json({'success':false,'message':'Some Error'});
  // 	} 
  // 	return res.json({'success':true,'message':'Data added successfully',docs});
  // })


  Drivertaxi.findOne({ _id: "5acb6f5c3d0d65343e876f55" },
    function (err, doc) {
      // console.log(doc);
      // doc.type[0].basic = 'Matthew push';
      doc.type.push({ basic: 'Liesl' });
      doc.save();
      return res.json({ 'success': true, 'message': req.i18n.__("DATA_ADDED"), doc });
    })

  // create a commen
  // parent.type.push({ basic: 'Liesl' });
  // var subdoc = parent.type[0];
  // console.log(subdoc) // { _id: '501d86090d371bab2c0341c5', name: 'Liesl' }
  // subdoc.isNew; // true

  // parent.save(function (err) { 
  // 		console.log('Success!');
  // });


}