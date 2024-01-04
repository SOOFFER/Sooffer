/*var fs = require('fs')
var conversion = require("phantom-html-to-pdf")();
conversion({ html: "<h1>Hello World</h1>" }, function(err, pdf) {
	if(err) console.log('er',err)
  var output = fs.createWriteStream('./output.pdf')
  console.log(pdf.logs);
  console.log(pdf.numberOfPages);
    // since pdf.stream is a node.js stream you can use it
    // to save the pdf to a file (like in this example) or to
    // respond an http request.
  pdf.stream.pipe(output);
});*/


var fs = require('fs');
var pdf = require('html-pdf');
var html = fs.readFileSync('./stripe-express-success.html', 'utf8');
var options = { format: 'Letter' };
 
pdf.create(html, options).toFile('./businesscard.pdf', function(err, res) {
  if (err) return console.log("err", err);
  console.log(res); // { filename: '/app/businesscard.pdf' }
});

//sudo apt-get install libfontconfig
//https://github.com/marcbachmann/node-html-pdf/issues/35
//