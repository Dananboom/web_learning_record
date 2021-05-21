const { fork } = require('child_process')
const { Server } = require('http')
const path = require('path')
const readline = require('readline')
const fs = require('fs')
const lodash = require('lodash')

//创建子进程
var forked = fork(path.join(__dirname, 'server.js'))

//防抖函数
function debounce(fn, delay){
    let timer = null //借助闭包
    return function() {
        if(timer){ //如果在 一个计时当中，就清零
            clearTimeout(timer) 
        }
        timer = setTimeout(fn,delay) //如果不在一个计时中就执行函数
    }
}

//监听文件
fs.watch(path.join(__dirname, 'server.js'), {recursive : true}, debounce((eventType, filename) => {
    forked.send('stop')
    forked = fork(path.join(__dirname, 'server.js'))
    }, 1000)
)

//监听输入
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

//和子进程通信
rl.on('line', (input) => {
    if(input === 'reload'){
        forked.send('reload')
    } else if(input === 'stop'){
        forked.send('stop')
        rl.close()
    }
})






