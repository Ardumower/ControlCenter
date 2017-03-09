function flash(){
  console.log('flash ' + config.arduino.port);
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

exports.flash = flash;