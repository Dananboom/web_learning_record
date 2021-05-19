var http = require('http')
var fs = require('fs')
let path = require('path')
const mime = require('mime')
var url = require('url')

http.createServer(function (request, response) {

 //遍历文件
 function travel(dir, callback) {
     fs.readdirSync(dir).forEach(function (file) {
         var pathname = path.join(dir, file);

         if (fs.statSync(pathname).isDirectory()) {
             travel(pathname, callback);
         } else {
             callback(pathname);
         }
     });
 }
//获取url的路径
 let path_url = request.url

 //动态获取mime
 let suffix = path_url.split('.')[1]
 let type = mime.getExtension(suffix)

 let new_path_url = path.join(__dirname, path_url)
 travel ('D:\\code\\web_learning_record\\JavaScript\\case\\text2\\public', function (pathname) {
     let path_local = pathname.split('public')[1]
     let new_path_local = path.join(__dirname, path_local)
     if ( new_path_url == new_path_local) {
         response.writeHead(200, {'content-type' : type})
         //创建可读流
         var readerStream = fs.createReadStream(pathname);
         readerStream.pipe(response)
     }

 })

}).listen(8001);