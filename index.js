var slug = require('slug');
var bodyParser = require('body-parser');
var multer = require('multer');
var nodemon = require('nodemon');
var path = require('path');


// Set storage for images (where the images go after submit)
var storage = multer.diskStorage({
    destination: './views/uploads/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Upload with multer
var upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('myImage');

// Check what file type (this is a security for other files files than pictures)
function checkFileType(file, cb){

    // Allowed extensions
    var filetypes = /jpeg|jpg|png|/;

    // Check for the extensions
    var extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());

    // Check mime type, because extension name can be changed
    var mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    } else {
        cb('Error: Alleen Fotos!');
    }
}

// Express
var express = require('express');
var app = express();
var port = 8000;

// EJS
app.set('view engine', 'ejs');

// Set static folder
app.use(express.static(path.join(__dirname, 'views')));


// route to home page 
app.get('/', function(req, res) {
    res.render('index.ejs');
});

// Before the image gets shown, check for error, else upload the photo
app.post('/upload', function(req, res){
    upload(req, res, (err) => {
        if(err){
           res.render('index', {
               msg: err
           }); 
        } else {
            res.render('index', {
                file: `uploads/${req.file.filename}`
                })
            }
    })
});



// 404 page
function wrongPage(req, res) {
    res.status(404).render('404.ejs')
  }


  app.listen(port);


