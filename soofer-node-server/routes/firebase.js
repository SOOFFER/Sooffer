var firebase = require('firebase');
  
  firebase.initializeApp({
    "appName": "rebustar-d96c1" ,
  "serviceAccount" : "service-account.json" ,
  "authDomain" : "rebustar-d96c1.firebaseapp.com" ,
  "databaseURL" : "https://rebustar-d96c1.firebaseio.com/" ,
  "storageBucket" : "rebustar-d96c1.appspot.com"   
  });
 
module.exports = firebase;