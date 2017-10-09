---
title: node package - minimist & 命令行参数解析规则学习笔记
tags:
  - node
  - nodejs
  - minimist
  - 命令行参数解析
thumbnail: 'https://www.npmjs.com/static/images/npm-is-BOXES.svg'
categories:
  - 学习笔记
  - node
date: 2017-10-08 17:21:48
---

# node package - minimist & 命令行参数解析规则学习笔记

## 背景

我希望使用 node 做一个 **CLI (Command line interface)** 工具, 因此必须解析命令行参数数组 *process.argv*.

<!-- more -->
**第一种方案是,** 对参数数组 process.argv 直接处理, 编写 swtich or if 语句块, 根据不同的参数做不同的处理.

**第二种方案是,** 写一个命令行参数解析 **helper**, 将 *process.argv* 解析成一个**对象**, 再进行下一步处理.

**第一种方案,** 在命令行参数足够复杂的时候, 会在工具读取参数的过程逻辑复杂化, 着实不可取的.

**第二种方案,** 则是一种通用的解决方案, 一次编写, 所有的命令行工具都可以使用.



在使用第二种方案的时候, 我们的目的是将 process.argv 数组解析成一个对象,包含一个个键值对 key => value, 那么 *process.argv* 中哪些项是键, 哪些是 value, 就需要制订一种规则 - **命令行的参数输入规则**.通常使用约定成熟的 unix command line 规则.



因此我找到了现成的 nodejs 环境下的**命令行参数解析 engine** - [`minimist`][minimist-npm]

## node package - minimist

minimist 是 nodejs 下的一个命令行参数解析引擎, 功能就是将 process.argv 中的参数解析成一个对象.

> 查阅[minimist 官方文档][minimist-npm]更快获得支持.



### 基本用法如下:
```javascript
#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2));
console.dir(argv);
```
为什么输入参数是 **process.argv.slice(2)**?
我们在 shell 中输入的命令行如下
```bash
$ node cmd.js xxx sss xxx sss xxx
```

**process.argv[0]** 是 **shell 类型**, 即 **node**. **process.argv[1]** 则是工具本身的路径.

### 高级用法
```javascript
#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2), opts={});
console.dir(argv);
```
opts 的更多介绍, 就在文档中(也可以查看源码,毕竟就一个 index.js 文件), 最主要使用的 opts.default 属性, 定义默认的参数.
## 命令行参数规则总结
以下命令行参数是我在 *minimist* 的使用过程中总结出来的. 逐个解析 *process.argv* 的每一个 item
1. item 不是 key, 将会被放入key 为 '_' 的数组中
```javascript
// $ node cmd.js arg1 arg2 arg3 arg4 arg5
// > { _: [ 'arg1', 'arg2', 'arg3', 'arg4', 'arg5' ] }
```
2. item 是 key(_+单个字符), item 会作为 key, nextItem(非 key) 会被作为 value, 扔进结果集
```javascript
// $ node cmd.js -u root -p password password1 password2
// > { _: [ 'password1', 'password2' ], u: 'root', p: 'password' }
```
> 注: 单个字符包含字母, 数字, 其他特殊字符在不造成 shell 误解的情况也可以使用.但`(` , `)` , `&` , `|` 亲测不行

如果 nextItem(是 key), 那么 item 会被作为 boolean 类型且值为 true 扔进结果集
```javascript
// $ node cmd.js -a -b testing
// > { _: [], a: true, b: 'testing' }
```
还有一种特殊情况, _+多个字符会怎么样?
```javascript
// $ node cmd.js -u root -p password -abcd
// > { _: [],
//          u: 'root',
//          p: 'password',
//          a: true,
//          b: true,
//          c: true,
//          d: true 
//      }
```
3.当 item 以 '--'(双横杠)开头的时候, item 将会被解析成一个对像(注意两种 boolean)
```javascript
// $ node cmd.js --ssl --no-cookie --user=root --password=asdf
// > { _: [], ssl: true, cookie: false, user: 'root', password: 'asdf' }
```

## minimist - 代码解读
就一个 index.js 文件, 语法也不难懂.最主要的逻辑在于一个 for 循环.对于 opts 的处理逻辑也不复杂.重点在于, 看代码前先看文档, 知道 opts 的作用在读代码就轻松多了, 毕竟, 这代码也没啥注释.

```javascript
for (var i = 0; i < args.length; i++) {
    var arg = args[i];
    
    if (/^--.+=/.test(arg)) {
        ...
    }
    else if (/^--no-.+/.test(arg)) {
        ...
    }
    else if (/^--.+/.test(arg)) {
        ...
    }
    else if (/^-[^-]+/.test(arg)) {
        ...
    }
    else {
       ...
    }
}
```

## 同类型工具
同是 nodejs 下的命令行参数解析引擎[optimist][optimist-npm] ,读读 readme.md 吧, optimist的作者自己跑去用 minimist 了, 弃坑了...


[minimist-npm]: https://www.npmjs.com/package/minimist "npmjs - minimist"

[optimist-npm]: https://www.npmjs.com/package/optimist "npmjs - optimist"