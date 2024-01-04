const express = require('express')
const path = require('path')
const app = express()
const port = 3000
  
// configure app
app.use('/', express.static(path.join(__dirname, '../../landing')));
app.use('/webadmin', express.static(path.join(__dirname, '../../webadmin'))); 
// start the server
app.listen(port,() => {
  console.log(`App Server Listening at ${port}`);
});



/* var express = require('express');
var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync('/home/nobletv/ssl/server.key'),
  cert: fs.readFileSync('/home/nobletv/ssl/d9c5368e511a4c1e.crt'),
  ca: fs.readFileSync('/home/nobletv/ssl/sf_bundle-g2-g1.crt')
};
  
app = express()
  
app.use('/', express.static(path.join(__dirname, './landing'))); 
app.use('/webadmin', express.static(path.join(__dirname, './webadmin'))); 

var server = https.createServer(options, app);

server.listen(443, function () {
  console.log("server running at https://IP_ADDRESS:8001/")
}); */