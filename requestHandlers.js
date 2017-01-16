var fs      =  require('fs');
var util       =  require('util');
var server  =  require('./server');
var url         =   require("url");

function sendInterface(response,request) {
  var pathname = url.parse(request.url).pathname;
  if (pathname == '/') pathname = '/webpage/main.html';
  //console.log(pathname);
  //console.log("Request handler 'webpage' was called.");
  //response.writeHead(200, {"Content-Type": "text/html"});
  response.writeHead(200);
  //var html = fs.readFileSync(__dirname + "/webpage/main.html")
  var html = fs.readFileSync(__dirname + pathname);
  response.end(html);
}



exports.sendInterface = sendInterface;
