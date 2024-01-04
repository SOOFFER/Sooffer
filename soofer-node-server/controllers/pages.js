import mongoose from 'mongoose';
import path from 'path';
import Menus from './../models/pagesmenu.model';
import * as HelperFunc from './adminfunctions';
import serviceAvailableCities from '../models/serviceAvailableCities.model';
import Admin from '../models/admin.model';

var fs = require('fs')

export const sendAboutus = (req, res) => {
    var path = '/html/about.html';
    if (req.query.language == 'es') path = '/html/esabout.html';
    fs.readFile(__dirname + path, 'utf8', function read(err, doc) {
        if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("Some error"), 'error': err }) }
        return res.status(200).json({ 'success': true, 'message': "req.i18n.__(Fetched successfully", doc })
    })
}

export const updateAboutus = (req, res) => {
    var path = '/html/about.html';
    if (req.query.language == 'es') path = '/html/esabout.html';
    fs.writeFile(__dirname + path, req.body.data, function (err, doc) {
        if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("Some error"), 'error': err }) }
        return res.status(200).json({ 'success': true, 'message': req.i18n.__("Updated successfully") })
    })
}

export const sendPrivacypolicy = (req, res) => {
    var path = '/html/privacypolicy.html';
    if (req.query.language == 'es') path = '/html/esprivacypolicy.html';
    fs.readFile(__dirname + path, 'utf8', function read(err, doc) {
        if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("Some error"), 'error': err }) }
        return res.status(200).json({ 'success': true, 'message': req.i18n.__("Fetched successfully"), doc })
    })
}

export const updatePrivacypolicy = (req, res) => {
    var path = '/html/privacypolicy.html';
    if (req.query.language == 'es') path = '/html/esprivacypolicy.html';
    fs.writeFile(__dirname + path, req.body.data, function (err, doc) {
        if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("Some error"), 'error': err }) }
        return res.status(200).json({ 'success': true, 'message': req.i18n.__("Updated successfully") })
    })
}

export const sendTnc = (req, res) => {
    var path = '/html/tnc.html';
    if (req.query.language == 'es') path = '/html/estnc.html';
    fs.readFile(__dirname + path, 'utf8', function read(err, doc) {
        if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("Some error"), 'error': err }) }
        return res.status(200).json({ 'success': true, 'message': req.i18n.__("Fetched successfully"), doc })
    })
}

export const updateTnc = (req, res) => {
    var path = '/html/tnc.html';
    if (req.query.language == 'es') path = '/html/estnc.html';
    fs.writeFile(__dirname + path, req.body.data, function (err, doc) {
        if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("Some error"), 'error': err }) }
        return res.status(200).json({ 'success': true, 'message': req.i18n.__("Updated successfully") })
    })
}

export const sendRiderTnc = (req, res) => {
    var path = '/html/ridertnc.html';
    if (req.query.language == 'es') path = '/html/esridertnc.html';
    fs.readFile(__dirname + path, 'utf8', function read(err, doc) {
        if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("Some error"), 'error': err }) }
        return res.status(200).json({ 'success': true, 'message': req.i18n.__("Fetched successfully"), doc })
    })
}

export const updateRiderTnc = (req, res) => {
    var path = '/html/ridertnc.html';
    if (req.query.language == 'es') path = '/html/esridertnc.html';
    fs.writeFile(__dirname + path, req.body.data, function (err, doc) {
        if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("Some error"), 'error': err }) }
        return res.status(200).json({ 'success': true, 'message': req.i18n.__("Updated successfully") })
    })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
export const addMenuSettings = (req, res) => {
    if (req.body.group && (req.body.menuslist.length != 0)) {

        Menus.findOne({ type: req.body.group }, function (err, user) {

            if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__('Error on Server..') });
            if (user) return res.status(200).json({ 'success': false, 'message': req.i18n.__('Admin Type Already Presents..') });
            else {
                var newDoc = new Menus({
                    type: req.body.group,
                    menus: req.body.menuslist,

                });
                newDoc.save((err, data) => {
                    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__('Error on Server..') }) }
                    return res.status(200).json({ 'success': true, 'message': req.i18n.__('Add Successfully'), 'datas': data })
                })
            }


        });
    }
    else {
        if (!req.body.group) return res.status(200).json({ 'success': false, 'message': req.i18n.__('Bad Request.Select Admin Type..') });
        if (req.body.menuslist.length == 0) return res.status(200).json({ 'success': false, 'message': req.i18n.__('Bad Request.Select Menus..') });
    }
}
/**
* 
* @param {*} req 
* @param {*} res 
*/
export const getMenuSettings = async (req, res) => {
    var adminBasedMenus = await Admin.findOne({ '_id': req.userId, 'group': req.body.group }, { group: 1, menus: 1 });
    if (adminBasedMenus && adminBasedMenus.menus != undefined && adminBasedMenus.menus.length) return res.status(200).json({ 'success': false, 'message': req.i18n.__('Admin Type Already Presents..'), "data": adminBasedMenus });
    else {
        Menus.findOne({ type: req.body.group }, function (err, user) {
            if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__('Error on Server..') });
            if (user) return res.status(200).json({ 'success': false, 'message': req.i18n.__('Admin Type Already Presents..'), "data": user });
            if (!user) return res.status(200).json({ 'success': false, 'message': req.i18n.__('No type Present') });
        })
    }

}

export const getMenuList = async (req, res) => {
    var likeQuery = HelperFunc.likeQueryBuilder(req.query);
    var pageQuery = HelperFunc.paginationBuilder(req.query);
    var sortQuery = HelperFunc.sortQueryBuilder(req.query);
    let TotCnt = Menus.find(likeQuery).count();
    let Datas = Menus.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery);
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
export const editMeunsSettings = (req, res) => {

    Menus.findOneAndUpdate({ _id: req.body.id }, { menus: req.body.menuslist }, function (err, user) {

        if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__('Error on Server..') });
        if (user) return res.status(200).json({ 'success': true, 'message': req.i18n.__('Update Successfully'), "data": user });

    })
}

export const getServiceCities = async (req, res) => {
    serviceAvailableCities.find({ city: { $ne: "Default" } }, { city: 1, nearby: 1 }, function (err, data) {
        if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__('Error on Server..') });
        if (data) return res.status(200).json({ 'success': true, "data": data });
    })
}
