var http = require('http')
var fs = require('fs')
let path = require('path')

http.createServer(function (request, response) {

    let url =  request.url
    if (url == '/a') { 
        response.writeHead(200, { 'Content-Type': 'text-plain' });
        //创建可读流
        let path_a = path.join(__dirname, 'input.txt')
        var readerStream = fs.createReadStream(path_a);
        readerStream.pipe(response)
    } else if (url == '/b') {
        response.writeHead(200, { 'Content-Type': 'text-plain' });
        response.end('b\n');
    } else {
        response.writeHead(404, { 'Content-Type': 'text-plain' });
        response.end('404\n');
    }
     
}).listen(8000);
