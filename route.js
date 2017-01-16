var requestHandlers = require("./requestHandlers");

function route(handle, pathname,response,request,debug) 
{
	//console.log("About to route a request for " + pathname);

	try{
		
		return requestHandlers.sendInterface(response,request);
		
	} catch(e) {
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("404 Not found");
		response.end();
	}
	
}

exports.route = route;
