'use strict';

const debug       = require('debug')('server');
const error 		  = debug('app:error');
const fs          = require('fs');
const path        = require('path');
const request 	  = require('request');
const serialPort 	= require('serialport');
const socketio    = require('socket.io');
//let webcam	    = 	require( "node-webcam" );
//let cam;
const sep     = path.sep;


//serial
let myPort;

//socket
let socketServer;
let sendData  =  '';
let i = 0;

//satMap
let satMap = {
  'width': 40,
  'height': 40,
  'zoom': 20,
  'centerLat': 52.267312,
  'centerLon': 8.609331,
  'meterPerPixel': 0
};
let satMapFileName = '';

let config = require(__dirname + sep + 'resources' + sep + 'config.json');
let state  = require(__dirname + sep + 'resources' + sep + 'state.json');

const debuggig = config.debug;

// rescale to -PI..+PI			
function scalePI(v)
{
  let d = v;
  while (d < 0) d+=2*Math.PI;
  while (d >= 2*Math.PI) d-=2*Math.PI;
  if (d >= Math.PI) return (-2*Math.PI+d);
  else if (d < -Math.PI) return (2*Math.PI+d);
  else return d;
}

function download(uri, filename, callback){
  request.head(uri, function(err, res){
    debug('content-type:', res.headers['content-type']);
    debug('content-length:', res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
}

function mkDirOnce (dirPath) {
  try {
    fs.statSync(dirPath);
    debug('createDirectoryOnce found ' + dirPath);
  } catch(e) {
    try {
      fs.mkdirSync(dirPath);
      debug('createDirectoryOnce created ' + dirPath);
    }catch(err){
      error(err);
    }
  }
}

function updateSatMap(){
  let url = 'http://maps.google.com/maps/api/staticmap?center=';
  let lat= satMap.centerLat;
  let lon= satMap.centerLon;
  let uploads = config.uploads.dir;
	
  satMap.meterPerPixel = (Math.cos(lat * Math.PI/180) * 2 * Math.PI * 6378137) / (256 * Math.pow(2, satMap.zoom));
  debug('meterPerPixel='+satMap.meterPerPixel);
	
	//lat = Math.round(lat / 1000) * 1000;
	//lon = Math.round(lon / 1000) * 1000;				
	//url += lat / 10000000.0 + "," + lon / 10000000.0;
  url += lat + ',' + lon;
  url += '&zoom=' + satMap.zoom + '&size=640x640&maptype=satellite&sensor=false';    
  satMapFileName = uploads + 'map_' + lat + '_' + lon + '.png';
  debug('satMapFileName='+satMapFileName);
	
  mkDirOnce(uploads);
  if (fs.existsSync(satMapFileName)) return;
  download(url, satMapFileName, function(){
    debug('download done');			
  });
}


// distance
function dist2d(pt1, pt2){
  return Math.sqrt(Math.pow(pt1.x-pt2.x,2)+Math.pow(pt1.y-pt2.y,2));				
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
  let i, j, c = 0;
  let nvert = vertices.length;
  for (i = 0, j = nvert-1; i < nvert; j = i++) {
    if ( ((vertices[i].y>test.y) != (vertices[j].y>test.y)) &&
     (test.x < (vertices[j].x-vertices[i].x) * (test.y-vertices[i].y) / (vertices[j].y-vertices[i].y) + vertices[i].x) )
      c = !c;
  }
  return c;
}

function startServer(httpServer,debuggig)
{
	serialListener(debuggig);	
  initSocketIO(httpServer,debuggig);
  runComputations();
  doBroadcast();	
 // updateSatMap();		

	//cam = webcam.create( config.camera ); 	
	//webcam.capture( "my_picture", {}, function() {
	//	debug( "Image created!" );
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

function initSocketIO(httpServer)
{
  socketServer = socketio.listen(httpServer);
	
  if(debuggig == false)
	{
    socketServer.set('log level', 1); // socket.io debuggig OFF
  }
	
  socketServer.on('connect', function() { 
    state.server.connections++;
    debug('connect');
  });
		
  socketServer.on('connection', function (socket) {
    debug('user connected ' + state.server.connections);
   // sendSatMap();
		
    socket.on('disconnect', function() { 
      state.server.connections--;
      debug('disconnect');
    });	
	
		
    socketServer.on('update', function(data) {
      socket.emit('updateData',{pollOneValue:data});
    });
		
    socket.on('msg', function(data) {
      debug('msg: ' + data);
      myPort.write(data);
    });
		
    socket.on('buttonval', function(data) {
      myPort.write(data.toString());
      debug('buttonval: ' + data);
    });
		
    socket.on('sliderval', function(data) {
      myPort.write(data.toString());
      debug('sliderval: ' + data);
    });
		
    socket.on('start', function(data) {
      myPort.write(data.toString());
      debug('start: ' + data);
    });
		
    socket.on('getconfig', function(){
      socket.emit('config', config);
    });
		
    socket.on('setconfig', function(data){
      socketServer.emit('config', data);
      fs.open('./uploads/config.json', 'w', function(err, fd){
        if(err)
				{
          debug(err);
        } else {
          fs.write(fd, JSON.stringify(data), null, 'utf8', function(){
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
      let name = data['Name'];
      let size = data['Data'].length;
      debug('upload ' + name + ' ' + size);								
      fs.open('./uploads/' + name, 'w', function(err, fd){
        if(err)
				{
          error(err);
        } else {
          fs.write(fd, data['Data'], null, 'Binary', function(){
            fs.close(fd);
            debug('upload finished');
            //flash();
          });
        }				
      });			
    });
  });
}

function serialListener()
{
  let receivedData = '';

  myPort = new serialPort(config.arduino.port, {
    parser: serialPort.parsers.readline('\n'),
    baudrate    :  19200,
    dataBits    :  8,
    parity      : 'none',
    stopBits    :  1,
    flowControl :  false
  });

  myPort.on('open', function ()
	{
    debug('open serial communication');
    myPort.on('data', function(data){
      debug('serial ' + data);
      let receivedData = data;
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
	
    let sat;
    for (sat in state.ranging){		
			//debug(config.satellites.positions[sat]);
      let pos = config.satellites.positions[sat];		
      let d = dist2d(state.robot.pos, pos);
			//state.ranging[sat] = Math.random()*0.2+d;
      state.ranging[sat] = d;
    }				
  }
	
  setTimeout(runComputations, 50);
}


function doBroadcast() {
			//let receivedData = data;
			//debug("doThing");
  let receivedData =  Math.round(Math.random()*100) + 'A.'
                    + Math.round(Math.random()*100) + 'B.'
                    + Math.round(Math.random()*100) + 'C.'
                    + Math.round(Math.random()*100) + 'X.'
                    + Math.round(Math.random()*100) + 'Y.'
                    + Math.round(Math.random()*100) + 'Z';
  //"14A.44B.92C.4D.87E.4X.1Y.5Z";
  sendData = receivedData.split('.');  //Split data by '.'
		
  for(i=0; i<sendData.length; i++)     //transmit the sendData array
			{
					//socketServer.emit('updateData',  {'pollOneValue': sendData[i]});					
  }
			
  let c = pnpoly(config.perimeter, state.robot.pos);			
  state.robot.inside = ((c % 2) == 0);
			
  socketServer.emit('state', state);
			//socketServer.emit('term',  ".");
			//flash();
  setTimeout(doBroadcast, 200); 										
}		



exports.start = startServer;
exports.sendTerminal = sendTerminal;

