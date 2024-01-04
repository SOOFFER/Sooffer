import Trips from '../../models/trips.model';
import * as HelperFunc from '../../controllers/adminfunctions';
import * as GFunctions from '../../controllers/functions';
import mongoose from 'mongoose';
import ImageData from '../imageCollection/image-collection.model'

export const imageAdd = async (req, res) => {
    try{
        var filesUpload = (req.files).map((e) => e.path);

        var exists = await ImageData.find({tripId: req.body.tripId,status: req.body.status});
    
        if(!exists || exists.length <= 0){
    
            const newDoc = new ImageData(
                {
                    tripId: req.body.tripId,
                    imageArray: filesUpload,
                    status: req.body.status
                }
            );
    
            newDoc.save((err, docs) => {
                if (err) {
                    return res.status(503).json({ 'success': false, 'message': 'Some Error' })
                }
                return res.status(200).json({ 'success': true, 'message': 'Data added successfully', docs })
            })
        }else{
            return res.status(503).json({ 'success': false, 'message': 'Already Added' })
        }
    }catch(err){
        console.log(err);
        return res.status(503).json({ 'success': false, 'message': 'Some Error' })
    }
}