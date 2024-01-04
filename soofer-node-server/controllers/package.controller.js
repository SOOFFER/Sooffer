import mongoose from 'mongoose';
import * as HelperFunc from './adminfunctions';

//import models
import Package from '../models/package.model';
import RentalPackage from '../models/rentalPackage.model';
import OutstationPackage from '../models/outstationPackage.model';
//add package
//param --> req.body.pkname,amt,minkm,minhr,maxkm,maxhr
const _ = require('lodash');

export const addPackage = (req, res) => {
    var newDoc = new Package({
        pkname: req.body.pkname,
        amt: req.body.amt,
        minkm: req.body.minkm,
        minhr: req.body.minhr,
        pkm: req.body.pkm,
        phr: req.body.phr
    });
    newDoc.save((err, data) => {
        if (err) { console.log(err); }
        return console.log('Package Added');
    })
}

//view package

export const viewPackage = async (req, res) => {
    var likeQuery = HelperFunc.likeQueryBuilder(req.query);
    var pageQuery = HelperFunc.paginationBuilder(req.query);
    var sortQuery = HelperFunc.sortQueryBuilder(req.query);

    let TotCnt = Package.find(likeQuery).count();
    let Datas = Package.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery);

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
 *
 * @param {*} req
 * @param {*} res
 */
export const addRentalPackage = (req, res) => {
  
    var scIds = req.body.scIds;
    scIds = JSON.parse(scIds);
    RentalPackage.findOne({ "name": req.body.name, 'scIds.name': { $in: scIds[0].name } }, {}, function (err, user) {
        if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER") });
        if (user) return res.status(401).json({ 'success': false, 'message': req.i18n.__("PACKAGE_NAME_ALREADY_EXISTS") });
        else {
            var newDoc = {
                name: req.body.name,
                price: req.body.price,
                duration: req.body.duration,
                distance: req.body.distance
            };

            var scIds = req.body.scIds;
            scIds = JSON.parse(scIds);
            newDoc = new RentalPackage(newDoc);

            _.forEach(scIds, function (element, i) {
                newDoc.scIds.push(element);
            });

            var fixedRate = req.body.fixedRate;
            if (fixedRate) {
                fixedRate = JSON.parse(fixedRate);
                newDoc = new RentalPackage(newDoc);

                _.forEach(fixedRate, function (element, i) {
                    newDoc.fixedRate.push(element);
                });
            }

            newDoc.save((err, data) => {
                if (err) { return res.status(500).json({ "success": false, "message": req.i18n.__("SOME_ERROR"), "error": err }) }
                else { return res.status(200).json({ "success": true, "message": req.i18n.__("PACKAGE_ADDED_SUCCESSFULLY"), "data": data }) }
            })
        }
    });
}
/**
 *
 * @param {*} req
 * @param {*} res
 */
export const viewRentalPackage = async (req, res) => {
    var likeQuery = HelperFunc.likeQueryBuilder(req.query);
    var pageQuery = HelperFunc.paginationBuilder(req.query);
    var sortQuery = HelperFunc.sortQueryBuilder(req.query);
    if (req.cityWise == 'exists') likeQuery['scIds.scId'] = { "$in": req.scId };

    let TotCnt = RentalPackage.find(likeQuery).count();
    let Datas = RentalPackage.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery);

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
 * Delete Admin Profile
 * @input
 * @param
 * @return
 * @response
 */

export const deleteRentalPackage = (req, res) => {
    RentalPackage.findByIdAndRemove(req.params.id, (err, docs) => {
        if (err) {
            return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR") });
        }
        return res.json({ 'success': true, 'message': req.i18n.__("DATA_DELETED_SUCCESSFULLY") });
    })
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
export const updateRentalPackage = (req, res) => {
    RentalPackage.findOne({ _id: req.body._id }).exec((err, doc) => {
        if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
        if (!doc) return res.json({ 'success': false, 'message': req.i18n.__("PACKAGE_NOT_FOUND") });
        doc.name = req.body.name,
            doc.price = req.body.price,
            doc.duration = req.body.duration,
            doc.distance = req.body.distance

        // var  rental=req.body.rental;
        let oldScIds = JSON.parse(req.body.oldScIds);
        var scIds = req.body.scIds;
        scIds = JSON.parse(scIds);

        var result = _.xorBy(oldScIds, scIds, 'scId');
        // if(rental.isRental=='true')doc.rental=rental;

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
            if (err) return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
            return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), op });
        });
    })
}

export const updateRentalPackageFare = (req, res) => {
    RentalPackage.findOne({ _id: req.params.id }).exec((err, doc) => {
        if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
        if (!doc) return res.json({ 'success': false, 'message': req.i18n.__("PACKAGE_NOT_FOUND") });

        // var  rental=req.body.rental;
        let oldfixedRate = JSON.parse(req.body.oldfixedRate);
        var fixedRate = req.body.fixedRate;
        fixedRate = JSON.parse(fixedRate);

        var result = _.xorBy(oldfixedRate, fixedRate, 'name');
        // if(rental.isRental=='true')doc.rental=rental;

        /*var oldValues = []; var newValues = [];
        _.forEach(result, function (value, key) {
            let isExist = _.has(value, '_id')
            if (isExist) {
                oldValues.push(value);
            } else {
                newValues.push(value);
            }
        })*/

        var oldValues = oldfixedRate; var newValues = fixedRate;

        /*_.forEach(oldValues, function (element, i) {
            doc.fixedRate.pull({ 'name': element.name });
        });*/

        doc.fixedRate = [];

        _.forEach(newValues, function (element, i) {
            doc.fixedRate.push(element);
        });

        doc.save(function (err, op) {
            if (err) return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
            return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), op });
        });
    })
}

//Outstation
/**
 *
 * @param {*} req
 * @param {*} res
 */
export const addOutstationPackage = (req, res) => {
    var scIds = req.body.scIds;
    scIds = JSON.parse(scIds);
    OutstationPackage.findOne({ "name": req.body.name, 'scIds.name': { $in: scIds[0].name } }, {}, function (err, user) {
        if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER") });
        if (user) return res.status(401).json({ 'success': false, 'message': req.i18n.__("PACKAGE_NAME_ALREADY_EXISTS") });
        else {
            var newDoc = {
                name: req.body.name,
                price: req.body.price,
                duration: req.body.duration,
                distance: req.body.distance,
                jouneyType: req.body.jouneyType
            };

            var scIds = req.body.scIds;
            scIds = JSON.parse(scIds);
            newDoc = new OutstationPackage(newDoc);

            _.forEach(scIds, function (element, i) {
                newDoc.scIds.push(element);
            });

            var fixedRate = req.body.fixedRate;
            if (fixedRate.length) {
                fixedRate = JSON.parse(fixedRate);
                newDoc = new OutstationPackage(newDoc);

                _.forEach(fixedRate, function (element, i) {
                    newDoc.fixedRate.push(element);
                });
            }

            // var fixedRateForRoundTrip = req.body.fixedRateForRoundTrip;
            // if (fixedRateForRoundTrip.length) {
            //     fixedRateForRoundTrip = JSON.parse(fixedRateForRoundTrip);
            //     newDoc = new OutstationPackage(newDoc);
            //     _.forEach(fixedRateForRoundTrip, function (element, i) {
            //         newDoc.fixedRateForRoundTrip.push(element);
            //     });
            // }

            newDoc.save((err, data) => {
                if (err) { return res.status(500).json({ "success": false, "message": req.i18n.__("SOME_ERROR"), "error": err }) }
                else { return res.status(200).json({ "success": true, "message": req.i18n.__("PACKAGE_ADDED_SUCCESSFULLY"), "data": data }) }
            })
        }
    });
}

/**
 *
 * @param {*} req
 * @param {*} res
 */
export const updateOutstationPackage = async (req, res) => {
    let oldScIds = JSON.parse(req.body.oldScIds);
    var scIds = req.body.scIds;
    scIds = JSON.parse(scIds);


    let findData = await OutstationPackage.findOne({ "name": req.body.name, 'scIds.name': { $in: scIds[0].name }, "_id": { $ne: mongoose.Types.ObjectId(req.body._id) } }, {}).exec();
    if (findData)
        return res.json({ 'success': false, 'message': req.i18n.__("PACKAGE_NAME_ALREADY_EXISTS") });
    OutstationPackage.findOne({ _id: req.body._id }).exec((err, doc) => {
        if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
        if (!doc) return res.json({ 'success': false, 'message': req.i18n.__("PACKAGE_NOT_FOUND") });
        doc.name = req.body.name,
            doc.price = req.body.price,
            doc.duration = req.body.duration,
            doc.distance = req.body.distance

        // var  rental=req.body.rental;
        // let oldScIds = JSON.parse(req.body.oldScIds);
        // var scIds = req.body.scIds;
        // scIds = JSON.parse(scIds);

        var result = _.xorBy(oldScIds, scIds, 'scId');
        // if(rental.isRental=='true')doc.rental=rental;

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
            if (err) return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
            return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), op });
        });
    })
}

export const updateOutstatioPackageFare = (req, res) => {
    OutstationPackage.findOne({ _id: req.params.id }).exec((err, doc) => {
        if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
        if (!doc) return res.json({ 'success': false, 'message': req.i18n.__("PACKAGE_NOT_FOUND") });
        // var  rental=req.body.rental;

        doc.jouneyType = req.body.jouneyType;

        let oldfixedRate = JSON.parse(req.body.oldfixedRate);
        var fixedRate = req.body.fixedRate;
        fixedRate = JSON.parse(fixedRate);

        var result = _.xorBy(oldfixedRate, fixedRate, 'name');
        // if(rental.isRental=='true')doc.rental=rental;

        /*var oldValues = []; var newValues = [];
        _.forEach(result, function (value, key) {
            let isExist = _.has(value, '_id')
            if (isExist) {
                oldValues.push(value);
            } else {
                newValues.push(value);
            }
        })*/

        var oldValues = oldfixedRate; var newValues = fixedRate;

        /*_.forEach(oldValues, function (element, i) {
            doc.fixedRate.pull({ 'name': element.name });
        });*/

        doc.fixedRate = [];

        _.forEach(newValues, function (element, i) {
            doc.fixedRate.push(element);
        });

        // let oldfixedRateForRoundTrip = JSON.parse(req.body.oldfixedRateForRoundTrip);
        // var fixedRateForRoundTrip = req.body.fixedRateForRoundTrip;
        // fixedRateForRoundTrip = JSON.parse(fixedRateForRoundTrip);

        // var result = _.xorBy(oldfixedRateForRoundTrip, fixedRateForRoundTrip, 'name');
        // // if(rental.isRental=='true')doc.rental=rental;

        // /*var oldValues = []; var newValues = [];
        // _.forEach(result, function (value, key) {
        //     let isExist = _.has(value, '_id')
        //     if (isExist) {
        //         oldValues.push(value);
        //     } else {
        //         newValues.push(value);
        //     }
        // })*/

        // var oldValuesForRoundTrip = oldfixedRateForRoundTrip; var newValuesForRoundTrip = fixedRateForRoundTrip;

        // /*_.forEach(oldValues, function (element, i) {
        //     doc.fixedRate.pull({ 'name': element.name });
        // });*/

        // doc.fixedRateForRoundTrip = [];

        // _.forEach(newValuesForRoundTrip, function (element, i) {
        //     doc.fixedRateForRoundTrip.push(element);
        // });

        doc.save(function (err, op) {
            if (err) return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
            return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), op });
        });
    })
}

export const deleteOutstationPackage = (req, res) => {
    OutstationPackage.findByIdAndRemove(req.params.id, (err, docs) => {
        if (err) {
            return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR") });
        }
        return res.json({ 'success': true, 'message': req.i18n.__("DATA_DELETED_SUCCESSFULLY") });
    })
};

export const viewOutstationPackage = async (req, res) => {
    var likeQuery = HelperFunc.likeQueryBuilder(req.query);
    var pageQuery = HelperFunc.paginationBuilder(req.query);
    var sortQuery = HelperFunc.sortQueryBuilder(req.query);
    if (req.cityWise == 'exists') likeQuery['scIds.scId'] = { "$in": req.scId };

    let TotCnt = OutstationPackage.find(likeQuery).count();
    let Datas = OutstationPackage.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery);

    try {
        var promises = await Promise.all([TotCnt, Datas]);
        res.header('x-total-count', promises[0]);
        var resstr = promises[1];
        res.send(resstr);
    } catch (err) {
        return res.json([]);
    }

}
