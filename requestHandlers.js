const fs     =  require('fs');
const url    =   require('url');

function sendInterface(response,request) {
  let pathname = url.parse(request.url).pathname;
  if (pathname == '/') pathname = '/webpage/main.html';
  response.writeHead(200);
  const html = fs.readFileSync(__dirname + pathname);
  response.end(html);
}

exports.sendInterface = sendInterface;
