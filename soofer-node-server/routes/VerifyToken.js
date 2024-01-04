var jwt = require('jsonwebtoken');
var config = require('../config');

function verifyToken(req, res, next) {
  var token = req.headers['x-access-token'];
  // console.log("...token",token)
  // var Authorizationtoken = req.headers['Authorization'];
  // console.log(Authorizationtoken);
  // console.log("...token",token)
  if (!token)  
    return res.status(403).send({ 'success': false, 'message': 'Forbidden Making a request that isn’t allowed.' });
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
      return res.status(401).send({ 'success' : false, message: 'Failed to authenticate token.' });
    // save to request for use in other routes
    req.userId = decoded.id;
    req.email = decoded.email;
    req.name = decoded.name;
    req.type = decoded.type;
    req.scId = decoded.scId;
    next();
    
  });
}

module.exports = verifyToken;