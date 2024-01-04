const AccessToken = require('twilio').jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const defaultIdentity = 'vikram';
const callerId = 'client:ridespick';
// Use a valid Twilio number by adding to your account via https://www.twilio.com/console/phone-numbers/verified
const callerNumber = '+16467599485';

/**
 * Creates an access token with VoiceGrant using your Twilio credentials.
 *
 * @param {Object} request - POST or GET request that provides the recipient of the call, a phone number or a client
 * @param {Object} response - The Response Object for the http request
 * @returns {string} - The Access Token string
 */
function tokenGenerator(request, response) {
  // Parse the identity from the http request
  var identity = null;
  if (request.method == 'POST') {
    identity = request.body.identity;
  } else {
    console.log("call get method");
    identity = request.query.identity;
  }

  if(!identity) {
    identity = defaultIdentity;
  }

  //Our testing
 /* // Used when generating any kind of tokens
  var accountSid = "ACa93e510157fa35a6fbb2f9fc98e71591";
  var apiKey = "SK865d9383ac91e7cf22aff61aaadd1d50";
  var apiSecret = "rtW8efon36x34SSn9BcI1TrOzU0RIi57";
  // Used specifically for creating Voice tokens
  const pushCredSid = "CR2d7dff80a2cc90b88f4474f24f53e758";
  const outgoingApplicationSid = "APa52b2578b7084f82bee4cdbb28c0e102";*/

  //Ridespick real
  var accountSid = "ACff55d6cffd82e669fd8b4a451dd49654";
  var apiKey = "SKa61443adc16b0c94b8955d5347159a46";
  var apiSecret = "WKpUr3hppCpxwr2RlQAAgOqoObJ4w8x3";
  // Used specifically for creating Voice tokens
  const pushCredSid = "CR6569467efba55785f54192ed502d8636";
  const outgoingApplicationSid = "AP75e2a9329db74b8b9f9bec19279758a4";


  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: outgoingApplicationSid,
      pushCredentialSid: pushCredSid
    });

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  const token = new AccessToken(accountSid, apiKey, apiSecret);
  console.log('tesststst:' + accountSid+"tetetet"+apiKey+"gdsdshjsd"+apiSecret);
  token.addGrant(voiceGrant);
  token.identity = identity;
  console.log('Token:' + token.toJwt());
  return response.json({
    token : token.toJwt() 
  });
}

/**
 * Creates an endpoint that can be used in your TwiML App as the Voice Request Url.
 * <br><br>
 * In order to make an outgoing call using Twilio Voice SDK, you need to provide a
 * TwiML App SID in the Access Token. You can run your server, make it publicly
 * accessible and use `/makeCall` endpoint as the Voice Request Url in your TwiML App.
 * <br><br>
 *
 * @param {Object} request - POST or GET request that provides the recipient of the call, a phone number or a client
 * @param {Object} response - The Response Object for the http request
 * @returns {Object} - The Response Object with TwiMl, used to respond to an outgoing call
 */
function makeCall(request, response) {
  // The recipient of the call, a phone number or a client
  var to = null;
  if (request.method == 'POST') {
    to = request.body.to;
  } else {
    to = request.query.to;
  }

  const voiceResponse = new VoiceResponse();

  if (!to) {
      voiceResponse.say("Congratulations! You have made your first call! Good bye.");
  } else if (isNumber(to)) {
      const dial = voiceResponse.dial({callerId : callerNumber});
      dial.number(to);
  } else {
      const dial = voiceResponse.dial({callerId : callerId});
      dial.client(to);
  }
  console.log('Response:' + voiceResponse.toString());
  return response.send(voiceResponse.toString());
}

/**
 * Makes a call to the specified client using the Twilio REST API.
 *
 * @param {Object} request - POST or GET request that provides the recipient of the call, a phone number or a client
 * @param {Object} response - The Response Object for the http request
 * @returns {string} - The CallSid
 */
async function placeCall(request, response) {
  // The recipient of the call, a phone number or a client
  var to = +918220844459;
  if (request.method == 'POST') {
    to = request.body.to;
  } else {
    to = request.query.to;
  }
  console.log(to);
  // The fully qualified URL that should be consulted by Twilio when the call connects.
  var url = request.protocol + '://' + request.get('host') + '/incoming';
  console.log(url);
  var accountSid = "ACa93e510157fa35a6fbb2f9fc98e71591";
  var apiKey = "SK865d9383ac91e7cf22aff61aaadd1d50";
  var apiSecret = "rtW8efon36x34SSn9BcI1TrOzU0RIi57";
  const client = require('twilio')(apiKey, apiSecret, { accountSid: accountSid } );

  if (!to) {
    console.log("Calling default client:" + defaultIdentity);
    call = await client.api.calls.create({
      url: url,
      to: 'client:' + defaultIdentity,
      from: callerId,
    });
  } else if (isNumber(to)) {
    console.log("Calling number:" + to);
    call = await client.api.calls.create({
      url: url,
      to: to,
      from: callerNumber,
    });
  } else {
    console.log("Calling client:" + to);
    call =  await client.api.calls.create({
      url: url,
      to: 'client:' + to,
      from: callerId,
    });
  }
  console.log(call.sid)
  //call.then(console.log(call.sid));
  return response.send(call.sid);
}

/**
 * Creates an endpoint that plays back a greeting.
 */
function incoming() {
  const voiceResponse = new VoiceResponse();
  voiceResponse.say("Congratulations! You have received your first inbound call! Good bye.");
  console.log('Response:' + voiceResponse.toString());
  return voiceResponse.toString();
}

function welcome() {
  const voiceResponse = new VoiceResponse();
  voiceResponse.say("Welcome to Twilio");
  console.log('Response:' + voiceResponse.toString());
  return voiceResponse.toString();
}

function isNumber(to) {
  if(to.length == 1) {
    if(!isNaN(to)) {
      console.log("It is a 1 digit long number" + to);
      return true;
    }
  } else if(String(to).charAt(0) == '+') {
    number = to.substring(1);
    if(!isNaN(number)) {
      console.log("It is a number " + to);
      return true;
    };
  } else {
    if(!isNaN(to)) {
      console.log("It is a number " + to);
      return true;
    }
  }
  console.log("not a number");
  return false;
}

exports.tokenGenerator = tokenGenerator;
exports.makeCall = makeCall;
exports.placeCall = placeCall;
exports.incoming = incoming;
exports.welcome = welcome;
