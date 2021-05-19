const http = require('http')
const fs = require('fs')
const path = require('path')

const mime = require('mime')

var server = http.createServer (function (req, res) {
    try {
        res.writeHead (200, {
            'Content-Type': mime.getType(req.url.split('.')[1])
        })
        res.end (fs.readFileSync(path.join(__dirname, 'public', req.url)) )
    } catch(e) {
        console.log(e)
        res.writeHead(404) 
        res.end()
    }
})

server.listen(8002)

/*20210517*/


