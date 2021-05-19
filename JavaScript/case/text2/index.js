const { fork } = require('child_process')
const { Server } = require('http')
const path = require('path')
const readline = require('readline')
const fs = require('fs')
const lodash = require('lodash')

function debounce(fn, delay){
    let timer = null //借助闭包
    return function() {
        if(timer){ //如果在 一个计时当中，就清零
            clearTimeout(timer) 
        }
        timer = setTimeout(fn,delay) //如果不在一个计时中就执行函数
    }
}

var forked = fork(path.join(__dirname, 'server.js'))
fs.watch(path.join(__dirname, 'server.js'), {recursive : true}, debounce((eventType, filename) => {
    forked.send('stop')
    forked = fork(path.join(__dirname, 'server.js'))
    }, 1000)
)

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.on('line', (input) => {
    if(input === 'reload'){
        forked.send('reload')
    } else if(input === 'stop'){
        forked.send('stop')
        rl.close()
    }
})






