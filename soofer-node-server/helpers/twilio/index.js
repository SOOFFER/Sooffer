import express from 'express'; 
const router = express.Router();

const methods = require('./src/server.js');
const tokenGenerator = methods.tokenGenerator;
const makeCall = methods.makeCall;
const placeCall = methods.placeCall;
const incoming = methods.incoming;
const welcome = methods.welcome;

router.get('/', function(request, response) {
  response.send(welcome());
});

router.post('/', function(request, response) {
  response.send(welcome());
});

router.get('/accessToken', function(request, response) {
  tokenGenerator(request, response);
});

router.post('/accessToken', function(request, response) {
  tokenGenerator(request, response);
});

router.get('/makeCall', function(request, response) {
  makeCall(request, response);
});

router.post('/makeCall', function(request, response) {
  makeCall(request, response);
});

router.get('/placeCall', placeCall);

router.post('/placeCall', placeCall);

router.get('/incoming', function(request, response) {
  response.send(incoming());
});

router.post('/incoming', function(request, response) {
  response.send(incoming());
});
 
export default router;
 