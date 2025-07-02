// const constantText = require('./html/constantText');  

var request = require('request');

export const sendSmsMsg = (smsto, smsbody) => { 
  
  const formData = {
    Message:   smsbody,
    Addresses: [smsto] 
  };

  request.post(
    {
      url: 'https://smsmate.lk/api/sms/v2/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'ApiKey': '78227b4f-245a-47ae-b88d-ec84f13ccbc9'
      },
      form: formData
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
      } else {
        console.log('error:', body);
      } 
    }
  );

  // var options = {
  //   url: 'https://smsmate.lk/api/sms/v2/send',
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded', 
  //     'ApiKey': '78227b4f-245a-47ae-b88d-ec84f13ccbc9'
  //   },
  //   method: 'POST',
  //   body: {
  //     "Message": smsbody,
  //     "Addresses": [smsto]
  //   } 
  // };

  // function callback(error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     var info = JSON.parse(body); 
  //     console.log('body:', info);  
  //   }else{
  //     console.log('error:', body);   
  //   } 
  // }

  // request(options, callback);


}  


