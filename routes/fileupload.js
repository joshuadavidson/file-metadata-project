const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();


//configure mutler storage location
var storage = multer.diskStorage({
  destination: function (req, file, cb) { //store the file
    cb(null, path.join(__dirname, '..', '/tmp'));
  },
  filename: function (req, file, cb) { //name the file
    cb(null, 'tempupload.tmp');
  }
});

var upload = multer({ storage: storage });

//render just the index page on the index route
//use the multer middleware
router.post('/', upload.single('uploadedFile'), function(req, res, next) {
  var fileSize;

  if (req.file) { //if a file was uploaded display its size
    //get the file size
    fileSize = 'File Size: ' + req.file.size + ' bytes';

    //delete the file from the server
    fs.unlink(path.join(__dirname, '..', '/tmp/tempupload.tmp'), function(err){
      if (err) {
        return next(err);
      }

      //after file is deleted return the filesize
      res.render('index', {
        fileSize: fileSize
      });

    });

  } else { //if no file was uploaded display to user that no file was uploaded
    res.render('index', {
      fileSize: 'No file provided!'
    });
  }
});

module.exports = router;
