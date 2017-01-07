var server = require("./server");
var router = require("./route");
var requestHandlers = require("./requestHandlers");

var debug = false;

var handle = {}
handle["/"] = requestHandlers.sendInterface;
handle["/webpage"] = requestHandlers.sendInterface;
// handle["/upload"] = requestHandlers.uploadFile;

server.start(router.route,handle,debug);
