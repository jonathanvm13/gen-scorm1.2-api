var express = require('express'),
  path = require('path'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  multer = require('multer');

var app = express();
app.use(cors());

mongoose.connect('mongodb://localhost:27017/ticademia', function (err, res) {
  if (err) console.log("error en la conexion a mongo")
  else    console.log("conexion a mongo exitosa")
});

var models = require('./models/question')(app, mongoose);
models = require('./models/user')(app, mongoose);
models = require('./models/folder')(app, mongoose);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

require('./routes/config.js')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500).jsonp({ok: false, message: err.message, error: err});
  });
}

// production error handler no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500).jsonp({ok: false, message: err.message, error: {}});
});


module.exports = app;
