// Android Accessory interface (USB)
// https://source.android.com/devices/accessories/aoa.html
// NOTE: for Windows only: without installing 'zadig' driver you will get LIBUSB_ERROR_NOT_FOUND error
var usb		    =  	require('usb');


var VID_ANDROID_ACCESSORY = 0x18d1;
var PID_ANDROID_ACCESSORY = 0x2d01;

var dev;
var iface;


function setProtocol(callback){
	dev.controlTransfer(0xC0, 51, 0, 0, 2, function(error, data){		
		if (error) {
			var s = "setProtocol prot: " + data[0];
			s += " error: " + error;
			console.log(s);
		}
		callback();
	});	   			
}

function sendString(id, val, callback){
	new Buffer(0);
	dev.controlTransfer(0x40, 52, 0, id, Buffer.from(val), function(error, data){						
		if (error) {
			var s = "sendString " + id + "=" + val;
			s+= " error: " + error;
			console.log(s);
		}
		callback();
	});	   			
}

function setStrings(callback){
	sendString(0, 'grauonline.de', function(){
		sendString(1, 'PCAndroidAccessory', function(){
			sendString(2, 'PC based Android accessory', function(){
					sendString(3, '1.0', function(){
						sendString(4, 'http://www.grauonline.de', function(){
							callback();
						});
					});
			});
		});
	});     
}

function setAccessoryMode(callback){
	dev.controlTransfer(0x40, 53, 0, 0, Buffer.from(''), function(error, data){		
		if (error) {
			var s = "setAccessoryMode";
			s += " error: " + error;
			console.log(s);
		}
		setTimeout(callback, 1000); 										
	});	   				
}

function sendData(data){	
	var outEndpoint = iface.endpoints[1];
	outEndpoint.transfer(data, function(error){
		console.log('Android error sending data');
	});
}

function readData(){
	var inEndpoint = iface.endpoints[0];
	inEndpoint.transfer(150, function(error, data){
		console.log('Android received:' + data);		
	});		
}

function findAndroidDevice(){
	var list = usb.getDeviceList();	
	for (idx in list){		
		var d = list[idx];
		var cls = d.deviceDescriptor.bDeviceClass;
		var vid = d.deviceDescriptor.idVendor;
		var pid = d.deviceDescriptor.idProduct;				
		var details = "cls=" + cls + " vid=" + vid.toString(16) + " pid=" + pid.toString(16);				
		if ((cls === 0) && (vid !== VID_ANDROID_ACCESSORY) && (pid !== PID_ANDROID_ACCESSORY)) {
			dev = d;			
			s = 'found Android device ' + details;			
			console.log(s);
			return true;
		}				
	}	
	return false;		
}

function findAndroidAccessory(){
	var list = usb.getDeviceList();	
	for (idx in list){		
		var d = list[idx];
		var cls = d.deviceDescriptor.bDeviceClass;
		var vid = d.deviceDescriptor.idVendor;
		var pid = d.deviceDescriptor.idProduct;				
		var details = "cls=" + cls + " vid=" + vid.toString(16) + " pid=" + pid.toString(16);				
		if ((vid === VID_ANDROID_ACCESSORY) && (pid === PID_ANDROID_ACCESSORY)) {
			dev = d;						
			s = 'found Android Accessory ' + details;
			console.log(s);			
			return true;
		}				
	}	
	return false;
}

function onAndroidAccessoryFound(){
	console.log("onAndroidAccessoryFound");
	dev.open();
	iface = dev.interfaces[0];	
	iface.claim();						
	//sendData('test');
	readData();
}


start = function(config) {
	setTimeout(function(){
		console.log("trying to find Android...");		
		if (findAndroidDevice()) {
			dev.open();
			setProtocol(function(){
				setStrings(function(){
				setAccessoryMode(function(){																					
					if (findAndroidAccessory()){
						onAndroidAccessoryFound();
					}
					});	
				});
			});				
		} else {
			if (findAndroidAccessory()){
				onAndroidAccessoryFound();
			}
		}
	}, 2000);
};


exports.start = start;