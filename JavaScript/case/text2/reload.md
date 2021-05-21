[toc]

# 1.需求

学习`http`协议的时候，用`node.js`创建了`http`服务，在客户端与服务端通信，但是有一个问题就是当我退出主进程的时候，监听端口的进程并没有退出，一开始是手动在`cmd`里面杀进程，但是这样太麻烦了，于是想做个自动杀进程的工具，顺便学一下进程管理。

* 当`ctrl+s`保存的时候，服务自动重启
* 手动输入stop杀进程，输入reload重启
* (这个不考虑是否多次一举，就是我学node和http的练手而已)

# 2.准备

这里是一个http服务，根据不同的url在‘访问在’public“文件夹的不同文件

```js
const http = require('http')
const path = require('path')
const fs = require('fs')

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
```



# 2.实现重启和关闭

> * 退出进程的方式有几种
>
>   1. 终端杀进程
>   2. 关闭会话窗口（就是直接退出创建进程的终端）
>   3. 父进程关闭（父进程创建的子进程，他有子进程的控制权，所以父进程可以关闭子进程）
>
> * 这个文件此时有两个进程
>
>   * js进程
>   * 监听端口的进程
>
>   关闭js父进程的时候，监听端口的子进程没有关闭
>
> * 父进程和子进程的关系
>   * 父进程可以控制子进程，但是清除父进程不能关闭子进程
>   * 关闭父进程 子进程不会关闭，但是关闭子进程父进程可能关闭
>     * 因为进程在有任务的时候不会被关闭，比如写了个死循环，这个进程会一种阻塞在那一直不会关，或者是创建了个子进程，而子进程在活跃的时候，父进程也不会关闭
> * 总结：我们只需要把server的进程关掉，js的主进程也就被关闭了

### 2.1 实现输入`stop`进程关闭

```js
const readline = require('readline')

//模块提供了一个接口，用于一次一行地读取可读流中的数据。
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
//此时进程有三个
rl.on('line', (input) => {
    if(input === 'stop'){
        //退出server子进程
        server.close()
        console.log('服务已停止')
        //退出js子进程
        process.exit()
        //退出readline子进程
        rl.close()
    }
})
```

### 2.2 输入`reload` 重启

只需要在上面代码基础上加上重启就可以了

```js
const readline = require('readline')

//模块提供了一个接口，用于一次一行地读取可读流中的数据。(就是输入，但是不会blocking，因为是异步的)
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
//此时进程有三个
rl.on('line', (input) => {
    if(input === 'stop'){
        //退出server子进程
        server.close()
        console.log('服务已停止')
        //退出js子进程
        process.exit()
        //退出readline子进程
        rl.close()
    } else if(input === 'reload'){
        server.close(()=>{//
            server.listen(8000)
            console.log('服务已重启')
        })
})
```

# 3 实现自动化

* 新建个文件叫做`index.js`
* 此时有两个文件和一个文件夹
  * `public`里面装着要访问的资源
  * 通过`index.js`启动`server.js`
  * `server.js`里面是刚刚写的`reload`、`stop`和`serever`

### 3.1 用`index.js`启动`server.js`

```js
const { fork } = require('child_process')

var forked = fork(path.join(__dirname, 'server.js'))
```

* `fork`直接执行node文件，只能开node子进程

* 此时现在有三个进程
  1. index是一个主进程
  2. 用index启动了个server的子进程
  3. server进程里还监听了端口

### 3.2  `server.js`和`index.js`通信

* `index.js`输入`stop`或者`reload`传输给`server.js`
* `send（）`和`message`事件

```js
//index.js
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

//server.js
process.on('message', (m) => {
    if(m === 'reload'){
        //如果是这样
        //if(m === 'reload'){
        //server.close()
        //server.listen(8000)
        //console.log('服务已重启')
        //端口有时可能会被占用
        //因为异步，有可能close没关闭，他只是开始关闭了，把监听进程写在callback里
        server.close(()=>{ 
            server.listen(8000)
            console.log('服务已重启')
        })
    } else if(m === 'stop'){
        server.close()
        console.log('服务已停止')
        process.exit()
    }
})
```

### 3.3  监听文件

* 监听文件，当文件有改动时，（`ctrl+s`）就启动重启服务

  ```js
  fs.watch(path.join(__dirname, 'server.js'), {recursive : true}, (eventType, filename) => {
      //在stop中有priocess.exit()重启的时候实际连server.js也重启了
      forked.send('stop')
      forked = fork(path.join(__dirname, 'server.js'))
      })
  ```

* 其实保存了就有写入流，就会被重启

#### 3.1.1现在有一个问题

在保存时，服务会被自动重启三次

![image-20210520204935012](https://typora-danan.oss-cn-beijing.aliyuncs.com/img/typora/20210520204935.png)



这是由于windows调用api的[问题](https://github.com/nodejs/node-v0.x-archive/issues/1970#issuecomment-2599352)

需要我们写个[防抖](https://segmentfault.com/a/1190000018428170)，让函数只被执行一次。注意这里`watch`没有被执行好多次，真正被执行好几次的是里面的`callback`

* 用lodash这个小工具合集里的防抖
  * 输入`npm install lodash —save`
  * `const lodash = require('lodash')`
  * `lodash.debounce()`就防抖了
  * ![image-20210520205441221](https://typora-danan.oss-cn-beijing.aliyuncs.com/img/typora/20210520205441.png)

* 防抖函数

  ```js
  //防抖函数本函数
  function debounce(fn, delay){
      let timer = null //借助闭包
      return function() {
          if(timer){ //如果在 一个计时当中，就清零
              clearTimeout(timer) 
          }
          timer = setTimeout(fn,delay) //如果不在一个计时中就执行函数
      }
  }
  ```

  ```js
  //调用
  fs.watch(path.join(__dirname, 'server.js'), {recursive : true}, debounce((eventType, filename) => {
      forked.send('stop')
      forked = fork(path.join(__dirname, 'server.js'))
      }, 1000)
  )
  ```

  

此时就大功告成了😊

# 4 源码

### `index.js`

```js
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
```

### `server.js`

```js
const http = require('http')
const path = require('path')
const fs = require('fs')
const readline = require('readline')

const mime = require('mime')

//http服务
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

//重启
process.on('message', (m) => {
    if(m === 'reload'){
        server.close(()=>{
            server.listen(8000)
            console.log('服务已重启')
        })
    } else if(m === 'stop'){
        server.close()
        console.log('服务已停止')
        process.exit()
    }
})

```

最后欢迎来[我的GitHub](https://github.com/Dananboom)捧场（虽然没啥拿得出手的东西）