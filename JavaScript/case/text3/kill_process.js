const http = require('http')
const path = require('path')
const fs = require('fs')
const readline = require('readline')

const mime = require('mime')


const server = http.createServer(function(req, res){
    try{
        res.writeHead(200, {
            'Content-Type': mime.getType(req.url.split('.')[1])
        })
        res.end(fs.readFileSync(path.join(__dirname, 'public', req.url)))
    } catch(e){
        console.log(e)
        res.writeHead(404)
        res.end()
    }
})
server.listen(8000)
console.log('服务已启动')
console.log('http://localhost:8000')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.on('line', (input) => {
    if(input === 'stop'){
        server.close()
        rl.close()
        console.log('服务已停止')
        process.exit()
    }
});
