const express = require('express');
const compression = require('compression');

//application routes
var index = require('./routes/index');
var fileupload = require('./routes/fileupload');

//set up application
var app = express();
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');

//compress all server responses
app.use(compression());

//serve static files
app.use(express.static('public'));

//app routes
app.use('/', index);
app.use('/fileupload', fileupload);

//catch all 404 errors and pass to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//error handlers
//development error handler will print stacktrace
if(app.get('env') === 'development'){
  app.use(function(err, req, res, next){
    if (!res.headersSent) { //if the headers are not already sent then set them
      res.status(err.status || 500);
    }
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

//production error handler will hide stacktrace
app.use(function(err, req, res, next) {
  if (!res.headersSent){
    res.status(err.status || 500);
  }
  res.render('error', {
    message: err.message,
    error: null
  });
});


app.listen(port);
