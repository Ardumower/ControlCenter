"use strict";

const app		    = require('express')();
const express 		= require('express');
const httpServer   	= require('http').Server(app);
const path         	= require('path');

const sep          = path.sep;

var server = require("./server");
//var router = require("./route");

//---express web server--------------------------------------------------------
const config = require(__dirname + sep + 'resources' + sep + 'config.json');
var port			= config.port;
var publicPath		= __dirname + sep + config.publicPath + sep;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	  res.sendFile(publicPath + sep + 'main.html');
});

httpServer.listen(port, function(){
	var host = httpServer.address().address
	var message = ' app listening at http://' + host + ':' + port;
	console.log(message);
});


console.log('to see debug output set debu=true e.g. on windows set DEBUG=*,-not_this');
//----------------------------------------------
server.start(httpServer);

//==error handlers==============================================================

//catch 404 and forward to error handler
app.use(function(req, res, next) {
var err = new Error('Not Found');
err.status = 404;
next(err);
});

//development error handler
//will print stacktrace
if (app.get('env') === 'development') {
app.use(function(err, req, res, next) {
 res.status(err.status || 500);
 res.render('error', {
   message: err.message,
   error: err
 });
});
}

//production error handler
//no stacktraces leaked to user
app.use(function(err, req, res, next) {
res.status(err.status || 500);
res.render('error', {
 message: err.message,
 error: {}
});
});