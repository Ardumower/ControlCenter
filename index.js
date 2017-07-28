'use strict';

const app           = require('express')();
const cookieParser  = require('cookie-parser');
const debug         = require('debug')('index');
const express       = require('express');
const httpServer    = require('http').Server(app);
const path          = require('path');

const sep = path.sep;

//---config--------------------------------------------------------------------
const config      = require(__dirname + sep + 'resources' + sep + 'config.json');
const jsPath      = __dirname  + sep + config.resourcePath + sep + 'javascripts';
const port        = config.port;
const publicPath  = __dirname + sep + config.publicPath + sep;

//--ardumower module----------------------------------------------------------
const flash  = require(jsPath + sep + 'flash.js');
const server = require('./server');

//---express web server--------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendFile(publicPath + sep + 'main.html');
});

//--view engine
//--do not change this !!------------------------------------------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

httpServer.listen(port, function () {
  const host = httpServer.address().address;
  const message = ' app listening at http://' + host + ':' + port;
  debug(message);
});

//----------------------------------------------
server.start(httpServer);
console.log('to see more debug output on linux export DEBUG=* e.g. on windows set DEBUG=*,-not_this');

//==error handlers==============================================================

//catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//development error handler
//will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

//production error handler
//no stacktraces leaked to user
app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
