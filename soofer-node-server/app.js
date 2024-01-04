// ./express-server/app.js
import express from 'express';
import path from 'path';
const http2 = require('http2');
//const spdy = require('spdy');

 var https = require('https');
 const fs = require('fs');
 import http from 'http';
// const httpsoptions = {
 //  key: fs.readFileSync('/home/ubuntu/ssl/private.key'),
 //   cert: fs.readFileSync('/home/ubuntu/ssl/certificate.crt'),
 //   ca: fs.readFileSync('/home/ubuntu/ssl/ca.crt')
 // };

import logger from 'morgan';
import mongoose from 'mongoose';
import SourceMapSupport from 'source-map-support';

// import bb from 'express-busboy';
var bodyParser = require('body-parser');
var multer = require('multer');
var validator = require('express-validator');
const trimmer = require('express-trimmer');
const mustacheExpress = require('mustache-express');
var winston = require('winston'),
  expressWinston = require('express-winston');
const i18n2 = require('i18n-2');
var debugMode = false;
const app = express();

// import routes
import uberRoutes from './routes/uber.server.route';
import uberAppRoutes from './routes/uberapp.server.route';
import uberTestRoutes from './routes/ubertest.server.route';
import uberHotelRoutes from './routes/uberhotel.server.route';
import uberComapnyRoutes from './routes/ubercompany.server.route';
import uberTwilioRoutes from './helpers/twilio/index';

import deliveryRoutes from './modules/delivery/delivery.route';
import incentiveRoutes from './modules/incentive/incentive.route';
import cancelationRoutes from './modules/cancelation/cancelation.route';
import rentalRoutes from './modules/rental/rental.route';
import safeRideRoutes from './modules/safeRide/safeRide.route';

import cron from './cron';

const config = require('./config');
// define our app using express

app.engine('html', mustacheExpress());
app.set('view engine', 'ejs', 'mustache');
app.set('views', __dirname + '/views');
// allow-cors
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept-Language');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, Accept-Language");
  res.header('access-control-expose-headers', 'x-total-count');

  // allow preflight
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(bodyParser.json({ limit: '50mb' })); // for parsing application/json
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // for parsing application/x-www-form-urlencoded
app.use(trimmer);
app.use(validator());

if (debugMode) {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  // express-winston logger makes sense BEFORE the router
  app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true
      })
    ]
  }));
}

function skipLog(req, res) {
  var url = req.url;
  if (url.indexOf('?') > 0)
    url = url.substr(0, url.indexOf('?'));
  if (url.match(/(js|jpg|png|ico|css|woff|woff2|eot)$/ig)) {
    return true;
  }
  if (url == '/DriverLocation') {
    return true;
  }
  return false;
}
// configure app
app.use(logger('dev', { skip: skipLog }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/locales', express.static(path.join(__dirname, 'locales')));
app.use('/webadmin', express.static(path.join(__dirname, '../webadmin')));
app.use('/landing', express.static(path.join(__dirname, '../landing')));

// set the port
const port = process.env.PORT || config.port;

// connect to database
mongoose.Promise = global.Promise;

// app.use((req, res, next) => {
//   var url = req.protocol + '://' + req.headers.host + req.originalUrl;
//   // connectWithRetry();
//   next();
// });

// app.use((req, res, next) => { //Or check in VT only if admin
//   if(req.method == "DELETE"){
//     return res.status(500).json({ 'success': false, 'message': 'Deletion not allowed on demo' });
//   }else{
//   next();
//   }
// });

//Connect to Db
const options = {
  // useMongoClient: false,
  useNewUrlParser: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  reconnectTries: 30, // Retry up to 30 times
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};

const connectWithRetry = () => {
  // console.log('MongoDB connection with retry')
  mongoose.connect("mongodb://sooferUser:4kmnCqYGFcVrRyQg@localhost:27017/rebustarv2server", options).then(() => {
   // mongoose.connect("mongodb://localhost/rebustarv2enterprise", options).then(() => {
    console.log("MongoDB connection success...")
  }).catch(err => {
    console.log('MongoDB connection unsuccessful, retry after 5 seconds.', err)
    setTimeout(connectWithRetry, 3000)
  })
};

connectWithRetry();

// add Source Map Support
// SourceMapSupport.install();

app.post('/profile', (req, res, next) => {
  // console.dir(req.headers['content-type']);
  console.log(req.body);
  return res.end('Api working');
});

i18n2.expressBind(app, {
  locales: ['en', 'es', 'hi', 'ta', 'tu', 'fr'],
  cookieName: 'locale',
  extension: ".json"
});

app.use(function (req, res, next) {
  if (req.headers['accept-language'] && req.headers['accept-language'].length < 3) {
    let language = (req.headers['accept-language']) ? req.headers['accept-language'] : config.appDefaultLanguageCode;
    req.i18n.setLocale(language);
  } else {
    req.i18n.setLocale(config.appDefaultLanguageCode);
  }
  next();
})

app.use('/adminapi/cancelation', cancelationRoutes);
app.use('/adminapi/incentive', incentiveRoutes);
app.use('/adminapi', uberRoutes);
app.use('/api/twilio', uberTwilioRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/rental', rentalRoutes);
app.use('/api/safeRide', safeRideRoutes);
app.use('/api', uberAppRoutes);
app.use('/test', uberTestRoutes);
app.use('/hotel', uberHotelRoutes);
app.use('/company', uberComapnyRoutes);


app.get('/', (req, res) => {
  return res.end('Api working');
})


// catch 404
app.use((req, res, next) => {
  res.status(404).send('<h2 align=center>Page Not Found!</h2>');
});

// start the server
/* app.listen(port, () => {
  console.log(`App Server Listening at ${port}`);
}); */

// https.createServer(httpsoptions, app).listen(port,() => {
//    console.log(`App Server Listening at ${port}`);
// });

// // start the HTTP/2 server with express
//  spdy.createServer(httpsoptions, app).listen(port, error => {
//   if (error) {
//     console.error(error)
//     return process.exit(1)
//   } else {
//     console.log(`HTTP/2 server listening on port: ${port}`)
//   }
// })

const server = http.createServer(app);  //for http
// var server = spdy.createServer(httpsoptions, app) //for https
server.listen(port, error => {
  if (error) {
    console.error(error)
    return process.exit(1)
  } else {
    console.log(`HTTP/2 server listening on port: ${port}`)
  }
});
