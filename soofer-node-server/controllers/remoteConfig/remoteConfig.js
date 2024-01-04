var rp = require('request-promise');
var fs = require('fs');
//var google = require('googleapis');
var { google } = require('googleapis');
const config = require('../../config');

var PROJECT_ID = config.project_id;
var HOST = 'https://firebaseremoteconfig.googleapis.com';
var PATH = '/v1/projects/' + PROJECT_ID + '/remoteConfig';
var SCOPES = ['https://www.googleapis.com/auth/firebase.remoteconfig'];

export const getTemplate = (req, res) => {
    getAccessToken().then(function (accessToken) {
        var options = {
            uri: HOST + PATH,
            method: 'GET',
            gzip: true,
            resolveWithFullResponse: true,
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Accept-Encoding': 'gzip',
            }
        };

        rp(options)
            .then(function (resp) {
                fs.writeFileSync(__dirname + '/config.json', resp.body);
                return res.status(200).json({ 'success': true, 'message': req.i18n.__("FETCHED_SUCCESSFULY"), 'data': resp.body, 'etag': resp.headers['etag'] })
            })
            .catch(function (err) {
                return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err.toString() })
            });
    });
}

export const publishTemplate = (req, res) => {
    fs.writeFile(__dirname + '/config.json', req.body.data, function (err, doc) {
        if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err }) }
        getAccessToken().then(function (accessToken) {
            var options = {
                method: 'PUT',
                uri: HOST + PATH,
                body: fs.readFileSync(__dirname + '/config.json', 'UTF8'),
                gzip: true,
                resolveWithFullResponse: true,
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json; UTF-8',
                    'If-Match': req.headers.etag
                }
            };
            rp(options)
                .then(function (resp) {
                    return res.status(200).json({ 'success': true, 'message': req.i18n.__("TEMPLATE_PUBLISHED"), 'etag': resp.headers['etag'] })
                })
                .catch(function (err) {
                    return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err.toString() })
                });
        });
    })
}

function getAccessToken() {
    return new Promise(function (resolve, reject) {
        var key = require('../../service-account.json');
        var jwtClient = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            SCOPES,
            null
        );
        jwtClient.authorize(function (err, tokens) {
            if (err) {
                reject(err);
                return;
            }
            resolve(tokens.access_token);
        });
    });
}