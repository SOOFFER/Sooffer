import path from 'path'; 
var multer = require('multer'); 

var storage = multer.diskStorage({ 
  destination: (req, file, cb) => {
    cb(null,  './public/' )
  },
  filename: (req, file, cb ) => { 
    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase()); 
    if (mimetype && extname) { 
      console.log(2);

      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) ;  
    } 
  }  
}); 

var upload = multer({storage: storage}); 
// var cpUpload = upload.single('photo');
function cpUpload(req, res, next) {
  upload.single('photo');
 next();
}


  // next();

  module.exports = cpUpload;