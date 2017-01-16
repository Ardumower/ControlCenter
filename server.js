// Ardumower Control Center
var fs          =   require('fs');
var request 	=	require('request');
var http        =   require('http');
var net 		= 	require('net');
var socketio    =   require('socket.io');
var android	    =   require('./android');
//var io 			= 	require('socket.io-client');
var url         =   require("url");
var serialPort 	= 	require("serialport");
var sys 		= 	require('sys')
var exec 		= 	require('child_process').exec;
var spawn 		= 	require('child_process').spawn;
//var webcam	    = 	require( "node-webcam" );


var socketServer;
var socketClientAndroid;
var sendData  =  "";
var satMapFileName = "";
var i = 0;
var cam;


var state = {
	server: {
		connections: 0,
	},
	robot: {
		pos: {x: 10, y: 10},  
		orientation: 0,		
		inside: false,
		motorLeft:0,
		motorRight: 0,
	},
	ranging: [ 0,0,0 ],
	android: {						
	}
};


var config = { 
	demoMode: true,
	arduino: {
		//port: '/dev/ttyS0',
		port: '//./COM23',
	},
	android: {
		enable: true,				
		accessory: false,
		server: '192.168.2.102',
		port: 8080,
	},
	camera: {
		enable: true,
		url: 'http://raspberrypi.local',		
	},
	map: {
		width: 40,
		height: 40,
		zoom: 20,
		centerLat: 52.267312,		
		centerLon: 8.609331,
		meterPerPixel: 0,
	},
	chargingStation: {
		pos: {x: 1, y: 10},		
	},
	satellites: { 		
		positions: {
			0:	{x: 2, 	y: 2, 	z: 0},
			1:	{x: 22,	y: 22,	z: 0}, 
			2:	{x: 22,	y:  2,	z: 0},
		},
	},
	perimeter: [	{x:1, 	y:1}, 
					{x:25,	y:1}, 
					{x:25,	y:20}, 
					{x:1,	y:20} ],
};	


// rescale to -PI..+PI			
function scalePI(v)
{
  var d = v;
  while (d < 0) d+=2*Math.PI;
  while (d >= 2*Math.PI) d-=2*Math.PI;
  if (d >= Math.PI) return (-2*Math.PI+d);
  else if (d < -Math.PI) return (2*Math.PI+d);
  else return d;
}
   

function download(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

function updateSatMap(){
	var url = "http://maps.google.com/maps/api/staticmap?center=";    
	var lat= config.map.centerLat;
	var lon= config.map.centerLon;
	config.map.meterPerPixel = (Math.cos(lat * Math.PI/180) * 2 * Math.PI * 6378137) / (256 * Math.pow(2, config.map.zoom));
	console.log("meterPerPixel="+config.map.meterPerPixel);
	//lat = Math.round(lat / 1000) * 1000;
	//lon = Math.round(lon / 1000) * 1000;				
	//url += lat / 10000000.0 + "," + lon / 10000000.0;
	url += lat + "," + lon;
    url += "&zoom=" + config.map.zoom + "&size=640x640&maptype=satellite&sensor=false";    
	satMapFileName = './uploads/map_' + lat + '_' + lon + '.png';
	console.log("satMapFileName="+satMapFileName);
	if (fs.existsSync(satMapFileName)) return;	
	download(url, satMapFileName, function(){
		console.log('download done');			
	});
}


// distance
function dist2d(pt1, pt2){
	return Math.sqrt(Math.pow(pt1.x-pt2.x,2)+Math.pow(pt1.y-pt2.y,2));				
}

// extract Yaw,Pitch,Roll from Quaternion orientation
function quaternionYawPitchRoll(q){
	var ypr = {yaw:0, pitch:0, roll:0};
	ypr.yaw = Math.atan2(2.0*(q.x*q.y + q.w*q.z), q.w*q.w + q.x*q.x - q.y*q.y - q.z*q.z);		
	ypr.roll = Math.atan2(2.0*(q.y*q.z + q.w*q.x), q.w*q.w - q.x*q.x - q.y*q.y + q.z*q.z);
	ypr.pitch = Math.asin(-2.0*(q.x*q.z - q.w*q.y));	
	return ypr;
}


// checks if point is inside polygon
// The algorithm is ray-casting to the right. Each iteration of the loop, the test point is checked against
// one of the polygon's edges. The first line of the if-test succeeds if the point's y-coord is within the
// edge's scope. The second line checks whether the test point is to the left of the line
// If that is true the line drawn rightwards from the test point crosses that edge.
// By repeatedly inverting the value of c, the algorithm counts how many times the rightward line crosses the
// polygon. If it crosses an odd number of times, then the point is inside; if an even number, the point is outside.

function pnpoly(vertices, test)
{
  var i, j, c = 0;
  var nvert = vertices.length;
  for (i = 0, j = nvert-1; i < nvert; j = i++) {
    if ( ((vertices[i].y>test.y) != (vertices[j].y>test.y)) &&
     (test.x < (vertices[j].x-vertices[i].x) * (test.y-vertices[i].y) / (vertices[j].y-vertices[i].y) + vertices[i].x) )
       c = !c;
  }
  return c;
}


function startAndroidClientSocket(){
	if (config.android.enable){
		socketClientAndroid = new net.Socket();		
		socketClientAndroid.connect(config.android.port, config.android.server, function() {
			console.log('Android connected');						
			socketClientAndroid.write('{"learn": false, "adf": "Wohnzimmer"}\n');
		});
		socketClientAndroid.on("error", function(err){
			console.log('Android error');
		});
		socketClientAndroid.on('close', function(){
			console.log('Android closed');
			socketClientAndroid.connect(config.android.port, config.android.server, function() {
				console.log('Android connected');						
			});
		});
		socketClientAndroid.on('data', function(data) {
			var s = data.toString('utf8');			
			if(s.indexOf("\n")!==-1){
				console.log(s);			
				s = s.split('\n')[0];
				state.android = JSON.parse(s);
				state.robot.pos.x = state.android.pos[0]*15 + 20;
				state.robot.pos.y = state.android.pos[1]*15 + 20;
				var q = {x: state.android.ori[0], y: state.android.ori[1], z: state.android.ori[2], w: state.android.ori[3]};
				var ypr = quaternionYawPitchRoll(q, ypr);
				state.robot.orientation = ypr.yaw;
			}
		});
		/*console.log('android ' + config.android.server + ':' + config.android.port);
		socketClientTango = io.connect(config.tango.url);
		socketClientTango.on('data', function (data) { console.log(data); });*/
		//socket.emit('private message', { user: 'me', msg: 'whazzzup?' });
	}
}	
	

function startServer(httpServer,debug)
{
	try{
		config = require('./uploads/config.json');
	} catch (e){
		console.log('cannot find config file');
	}

	//serialListener(debug);	
	initSocketIO(httpServer,debug);
	runComputations();
	doBroadcast();	
	updateSatMap();		
	if (config.accessory) android.start(config);
	  else startAndroidClientSocket();
	
	//cam = webcam.create( config.camera ); 	
	//webcam.capture( "my_picture", {}, function() {
	//	console.log( "Image created!" );
	//});
}

function sendSatMap()
{
	fs.readFile(satMapFileName, function(err, buf){		
		socketServer.emit('satmap', { image: true, buffer: buf.toString('base64') });		
		//socketServer.emit('satmap', { image: true, buffer: buf });		
	});
}

function sendTerminal(data)
{
	socketServer.emit('term',  data);			    
}

function initSocketIO(httpServer,debug)
{
	socketServer = socketio.listen(httpServer);
	
	if(debug == false)
	{
		socketServer.set('log level', 1); // socket.io debug OFF
	}
	
	socketServer.on('connect', function() { 
	  state.server.connections++;	  
	  console.log("connect");
	});
		
	socketServer.on('connection', function (socket) {
		console.log("user connected " + state.server.connections);
		sendSatMap();
		
		socket.on('disconnect', function() { 
			state.server.connections--;
			console.log("disconnect");
		});	
	
		
		socketServer.on('update', function(data) {
			socket.emit('updateData',{pollOneValue:data});
		});
		
		socket.on('msg', function(data) {
			console.log("msg: " + data);
			serialPort.write(data);
		});
		
		socket.on('buttonval', function(data) {
			serialPort.write(data.toString());
			console.log("buttonval: " + data);
		});
		
		socket.on('sliderval', function(data) {
			serialPort.write(data.toString());
			console.log("sliderval: " + data);
		});
		
		socket.on('start', function(data) {
			serialPort.write(data.toString());
			console.log("start: " + data);
		});
		
		socket.on('getconfig', function(data){
			socket.emit('config', config);
		});
		
		socket.on('setconfig', function(data){
			config = data;
			socketServer.emit('config', config);
			fs.open("./uploads/config.json", "w", 0755, function(err, fd){
				if(err)
				{
					console.log(err);
				} else {
					fs.write(fd, JSON.stringify(config), null, 'utf8', function(err, Writen){				
					  fs.close(fd);					  
					});
				}
			});				
		});
		
		socket.on('motorsteer', function(data){			
			state.robot.motorLeft = data.left;
			state.robot.motorRight = data.right;						
		});
				
		socket.on('upload', function (data){									
			var name = data['Name'];
			var size = data['Data'].length;
			console.log("upload " + name + " " + size);								
			fs.open("./uploads/" + name, "w", 0755, function(err, fd){
				if(err)
				{
					console.log(err);
				} else {
					fs.write(fd, data['Data'], null, 'Binary', function(err, Writen){				
					  fs.close(fd);
					  console.log("upload finished");
					  flash();
					});
				}				
			});			
		});
		
    });
}

function flash(){
	console.log("flash " + config.arduino.port);		
	//exec("ls -la", puts);			
	//exec("dir d:\\temp /S", puts);									
	const cmd = spawn('cmd.exe', ['/c', 'test.bat']);
	cmd.stdout.setEncoding('utf8');
	cmd.stdout.on('data', function(data) {
		var str = data.toString();
		socketServer.emit('term',  str);	 
		console.log(str);
	});
}

function serialListener(debug)
{
	var receivedData = "";

	serialPort = new SerialPort(config.arduino.port, {
		parser: serialport.parsers.readline("\n"),
		baudrate    :  19200,
		dataBits    :  8,
		parity      : 'none',
		stopBits    :  1,
		flowControl :  false
	});

	serialPort.on("open", function () 
	{	    
	    console.log('open serial communication');
	    
	    serialPort.on('data', function(data) {				
			console.log("serial " + data);
			var receivedData = data;			
			socketServer.emit('term',  data);			
		});			  
   });  
}

function runComputations(){
	if (config.demoMode){
		state.robot.orientation -= (state.robot.motorLeft - state.robot.motorRight)*0.1;    
		state.robot.orientation = scalePI(state.robot.orientation);
		state.robot.speed = (state.robot.motorLeft+state.robot.motorRight)/2.0 * 0.1;			

		state.robot.pos.x += Math.cos(state.robot.orientation) * state.robot.speed;
		state.robot.pos.y += Math.sin(state.robot.orientation) * state.robot.speed;
	
		for (sat in state.ranging){		
			//console.log(config.satellites.positions[sat]);
			var pos = config.satellites.positions[sat];		
			var d = dist2d(state.robot.pos, pos);
			//state.ranging[sat] = Math.random()*0.2+d;
			state.ranging[sat] = d;
		}				
	}
	
	setTimeout(runComputations, 50);
}


function doBroadcast() {
			//var receivedData = data;
			//console.log("doThing");
			var receivedData = Math.round(Math.random()*100) + 'A.' 
			             + Math.round(Math.random()*100) + 'B.' 
						 + Math.round(Math.random()*100) + 'C.' 
						 + Math.round(Math.random()*100) + 'X.' 
						 + Math.round(Math.random()*100) + 'Y.' 
						 + Math.round(Math.random()*100) + 'Z';						 
			//"14A.44B.92C.4D.87E.4X.1Y.5Z";			
			sendData = receivedData.split('.')  //Split data by '.'
		
			for(i=0; i<sendData.length; i++)     //transmit the sendData array
			{
					//socketServer.emit('updateData',  {'pollOneValue': sendData[i]});					
			}
			
			var c = pnpoly(config.perimeter, state.robot.pos);			
			state.robot.inside = ((c % 2) == 0);
			
			socketServer.emit('state', state);
			//socketServer.emit('term',  ".");
			//flash();
			setTimeout(doBroadcast, 200); 										
}		



exports.start = startServer;
exports.flash = flash;
exports.sendTerminal = sendTerminal;

