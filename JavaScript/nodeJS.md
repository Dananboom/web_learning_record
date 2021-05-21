# 1 是什么

* 就是是脚本语言，脚本需要解析器，在浏览器里面的js，浏览器是环境，提供了dom对象等等，而独立运行的js，node是解析器
* 运行在nodejs里面的js的作用是**操作文件**或者**搭建web服务器**，所以有`http`或者是`fs`内置对象

# 2 有什么用

* nodejs生来是为了做web服务器，要求语言有良好的**事件支持机制**和**异步IO**

# 3 模块

编写代码大的程序的时候会将代码**模块化**

## 3.1 require

在当前的模块加载别的模块

## 3.2 exports

导出模块的公有方法和属性

## 3.3 module

替换当前模块的导出对象

## 3.4 nodejs里面使用commonjs模块

[CommonJs, AMD/RequireJs,CMD/seajs, UMD, webpack #32](CommonJs, AMD/RequireJs,CMD/seajs, UMD, webpack #32)

