var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var template = require("art-template");

var routes = require('./routes');

var app = express();

// view engine setup
template.config("base", "");
template.config('extname', '.html');
app.engine('.html', template.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.locals.moment = require("moment");
app.locals.substr = function(str, len){
    return str.substr(0, len);
}
app.locals.html2text = function(str){
    return str.replace(/<[^>]+>/g,"");
}
app.locals.Math = Math;

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        switch(err.status){
            case 400:
                res.render('error', {
                    status : err.status,
                    message: err.message,
                    error: err
                });
                break;
            case 500:
                res.render('error', {
                    status : err.status,
                    message: err.message,
                    error: err
                });
                break;
            default:
                res.render('error', {
                    status : err.status,
                    message: err.message,
                    error: err
                });
        }
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    status : err.status,
    message: err.message,
    error: {}
  });
});


module.exports = app;
