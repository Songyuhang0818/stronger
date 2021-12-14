---
title: webpack使用(基础篇)
author: dengxiaolong
date: 2020-09-03
tags:
  - 分享
---

## webpack简单介绍

- **Output**：如何命名输出文件，以及输出目录，比如常见的dist目录。
- **Loaders**：作用在于解析文件，将无法处理的非js文件，处理成webpack能够处理的模块。
- **Plugins**：更多的是优化，提取精华(公共模块去重)，压缩处理(css/js/html)等，对webpack功能的扩展。
- **Chunk**：个人觉得这个是webpack 4 的`Code Splitting` 产物，抛弃了webpack3的`CommonsChunkPlugin`,它最大的特点就是配置简单，当你设置 `mode` 是 `production`，那么 webpack 4 就会自动开启 `Code Splitting`，可以完成将某些公共模块去重，打包成一个单独的`chunk`。

学习配置之前首先就需要安装webpack和webapack-cli，命令如下：
```bash
 npm installl webapck webpack-cli -g // 全局安装webpack
```
但是在全局安装是我们并不推荐的一种做法，所以此处我们卸载之前的安装
```bash
 npm uninstall webpack webpack-cli -g   //卸载全局webpack
```
此时查看一下安装的webpack的版本：
```bash
npx webpack -v
```
此处说一下npx这个东西：
::: tip
By default, npx will check whether  exists in $PATH, or in the local project binaries, and execute that. If  is not found, it will be installed prior to execution.<br />这个是从npm上的npx介绍中摘录的一段话，意思是说，npx命令会首先从你的全局环境变量中去查找比如webpack这样的东西，随后在你当前项目的库中去查找，再找不到的话就会去事先安装它随后再去执行。
:::
```bash
npm info webpack   // 查看webpack包版本
```
webpack.config.js就是webpack的默认配置文件，我们可以自定义配置文件，比如文件的入口，出口。
```js
const path = require('path');
module.exports = {
    entry : './index.js',
    output : {
        filename : 'bundle.js',
        path : path.join(__dirname, 'dist')
    }
}
```
那么这个时候，在命令行中运行`npx webpack`，就会去找webpack.config.js文件中的配置信息
如果你选择创建另外一个文件去导出webpack的配置的话，此时你需要使用如下的命令了：
```bash
npx webpack --config webpack.config.js // --config 后面就是你额外指定的webpack的配置文件了
```
你也可以把当前命令作为一个node的脚本去执行，例如在package.json文件中写下如下的scripts命令：
```json
"scripts": {
    "start": "webpack --config webpack.config.js"
  },
```
mode： 提供 `mode` 配置选项，告知 webpack 使用相应模式的内置优化。
主要分为`development`和`production`两种环境，默认情况下是`production`环境，**两者的区别就是，后者会对打包后的文件压缩。**
```js
const path = require('path')
module.exports = {
    mode : 'development',
    entry : './index.js',
    output : {
        filename : 'bundle.js',
        path : path.join(__dirname, 'bundle')
    }
}
```
## 什么是loader

**loader就是一个打包的方案，它知道对于某个特定的文件该如何去打包。** 本身webpack不清楚对于一些文件如何处理，loader知道怎么处理，所以webpack就会去求助于loader。<br />webpack是默认知道如何打包js文件的，但是对于一些，比如图片，字体图标的模块，webpack就不知道如何打包了，那么我们如何让webpack识别图片等其他格式的模块呢？
```js
const path = require('path')
module.exports = {
    mode: 'production',
    entry: './src/index.js',
    module: {
        rules: [{
            test: /\.(png|jpg|gif)$/,
            use: {
                loader: 'file-loader'
            }
        }]
    },
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    }
}
```
使用file-loader前让我们先安装它：
```bash
npm install file-loader -D
```
webpack文档中loader专门作为一个子目录去介绍它，要使用loader的话可以去里面查找，熟悉它的api<br />官方地址： [https://www.webpackjs.com/loaders/](https://www.webpackjs.com/loaders/)

```js
{
    loader: 'file-loader',
    options: {
        // name就是原始名称,hash使用的是MD5算法,ext就是后缀
        name: '[name]_[hash].[ext]'
    }
}
```
也可以区分环境来返回打包后的名称

```js
{
  loader: 'file-loader',
  options: {
    name (file) {
      if (env === 'development') {
        return '[path][name].[ext]'
      }

      return '[hash].[ext]'
    }
  }
}
```

返回打包后的文件路径配置
```js
{
    loader: 'file-loader',
    options: {
        name: '[name]_[hash].[ext]',
        outputPath: 'images/'
    }
}
```

对于图片的打包，我们除了可以使用file-loader去解析，还可以使用url-loader去解析它。
```js
{
    loader: 'url-loader',
    options: {
        name: '[name]_[hash].[ext]',
        outputPath: 'images/',
        limit : 102400  //100KB
    }
}
```
limit的配置项限定文件是以base64的形式生成到bundle.js文件还是生成到images文件夹下。<br />

当我们使用到css时需要借助于另外两个loader,老规矩,安装它:
```bash
cnpm install css-loader style-loader -D   // 下载对应的模块
```
然后就是配置这两个loader的使用

```js
{
    test: /\.css$/,
    use: ['style-loader','css-loader']
}
```
::: tip
- css-loader主要作用就是将多个css文件整合到一起，形成一个css文件。
- style-loader会把整合的css部分挂载到head标签中。
:::
当我们使用scss预编译css的话就需要使用到sass-loader和node-sass:
```bash
npm install sass-loader node-sass --save-dev
```
不知道大家有没有遇到过在构建一个项目时，你的bash会提示你去重新构建node-sass,这个就是因为你的开发环境发生了改变，之前安装的node-sass不能满足你当前环境的运行了，所以需要你去重新构建环境。
<br />配置代码如下：
```js
{
    test: /\.scss$/,
    use: ['style-loader','css-loader','sass-loader']
}
```
::: tip
模块的加载就是从右向左来的，所以先加载sass-loader翻译成css文件，然后使用css-loader打包成一个css文件，在通过style-loader挂载到页面上去。
:::
对于一些新的css3的写法，编译后的css文件需要加上浏览器厂商前缀，此时需借助于另外一个loader:wrench::arrow_right:postcss-loader，老方法，我们先下载安装它：
```shell
npm i -D postcss-loader autoprefixer
```
然后，还需要建一个**postcss.config.js**，这个配置文件(**位置跟webpack.config.js一个位置**)配置如下信息:
```js
// postcss.config.js
// 需要配置这个插件信息
module.exports = {
    plugins: [
        require('autoprefixer')({
            overrideBrowserslist: [
                "Android 4.1",
                "iOS 7.1",
                "Chrome > 31",
                "ff > 31",
                "ie >= 8"
            ]
        })
    ]
};

```
webpack.config.js中加上：
```js
{
  test: /\.scss$/,
  use: ['style-loader','css-loader','postcss-loader','sass-loader']
}
```
有时候，你会遇到这样子的一个问题，你在某个scss文件中又导入新的scss文件，这个时候，打包的话，它就不会帮你重新走上面的loader过程，这个时候，我们应该如何去设置呢？下面是解决办法
```js{7}
{
    test: /\.scss$/,
    use: ['style-loader',
        {
            loader: 'css-loader',
            options:{
                importLoaders:2,
               // modules : true // 区分模块
            }
        },
        'postcss-loader'
        'sass-loader'
    ]
}
```
::: tip
`importLoaders:2`该配置信息解决的就是在scss文件中又引入scss文件，会重新从sass-loader开始打包<br />意思是会支持当前loader前面的两个loader也执行。
:::
对于字体图标的打包我们还是可以借助file-loader去完成的
```js
{
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    use: [
        'file-loader'
    ]
}
```
## 什么是plugin

当我们遇到一些loader都没办法帮助我们完成的事情的时候，这个时候我们就可以去借助plugin这个工具了<br />比如我们想生成一个html文件，我们就可以借助于html-webpack-plugin<br />首先下载它:
```bash
cnpm install --save-dev html-webpack-plugin
```
**多页应用的配置如下**
```js
// 每一个htmlwebpackPlugin的实例对应生成一个.html文件，即生成一个页面
plugins: [
  new htmlWebpackPlugin({
    title: 'index 页面',
    template: 'public/index.html',
    filename: 'index.html',
    chunks: ['index']
  }),
  new htmlWebpackPlugin({
    title: 'home 页面', // title设置页面标题
    template: 'public/index.html', // 使用那个html作为页面模版
    filename: 'home.html', //编译后的文件名
    chunks: ['home'] // 包含的某些chunk名
  }),
]
```
index.html文件如下：
```html{7}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- 此处的htmlWebpackPlugin.options即为上面htmlWebpackPlugin生成的对应实例里面配置的对象-->
  <title><%= htmlWebpackPlugin.options.title %></title>
</head>
<body>
</body>
</html>
```
clean-webpack-plugin<br />这个插件的作用就是会帮你删除某个目录的文件,是在打包前删除所有上一次打包好的文件。<br />安装它：
```bash
cnpm i clean-webpack-plugin -D
```
```js
plugins: [
  new CleanWebpackPlugin()
]
```
最新的webpack4版本是不需要去配置路径的，自动帮我们清除打包好的dist目录下的文件<br />多页配置的entry和output
```js
entry: {
  index: './src/pages/index/index.js',
  home: './src/pages/home/home.js',
},
output: {
  chunkFilename: 'js/[name].[hash:8].min.js', // 此处hash:8的意思是取hash的前8位
  filename: 'js/[name].[hash:8].min.js',
  publicPath: publicPath, // 统一加在资源文件前面的地址，可以是一个路径，也可以是一串cdn
  path: path.join(__dirname, 'dist')
}
```

之前我们利用style-loader处理css文件，将它们挂载到style标签里面
<br />我们可以使用一个pulgin将其处理成css文件导出，并利用link标签链入html中
mini-css-extract-plugin让我们先安装它
``` bash
  npm install -D mini-css-extract-plugin
```
再使用它：
``` js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].min.[contenthash:8].css',
      chunkFilename: 'css/[name].chunk.min.[contenthash:8].css',
    })
  ]
```
是不是以为这样就结束了，不然，我们还需要配置一个loader,即替换之前的style-loader
``` js
use: [MiniCssExtractPlugin.loader, 'css-laoder']
```
## webpack-dev-server快速开启一个开发环境
安装它：
```bash
npm i webpack-dev-server -D
```
配置：
```js
devServer: {
  contentBase: path.join(__dirname, "dist"), // 当前放在内存中的路径
  compress: true, //是否为每个文件开启gzip compression
  port: 9000, // 开启服务的端口好号
  hot: true // 是否热更新
  // open: true // 是否立即打开浏览器窗口
},
```
在package.json中配置启动项脚本
```json
"start": "webpack-dev-server"
```
使用devtool配置source-map<br />devtool配置source-map,解决的问题就是,当你代码出现问题时,会映射到你的原文件目录下的错误,并非是打包好的错误,这点也很显然,如果不设置的话,只会显示打包后bundle.js文件中报错,对于查找错误而言,是很不友好的
```js
// devtool: 'inline-cheap-source-map',
  // devtool: 'cheap-module-eval-source-map',
```
有些人总结的使用经验为
- development环境下,配置 `devtool:'cheap-module-eval-source-map'`
- production环境下,配置 `devtool:'cheap-module-source-map'`
>我认为生产环境下我们可以不使用source-map, 所以我们使用环境变量来区分是否使用它

模块热替换还要加入两个插件
```js
// new webpack.NamedModulesPlugin(), // 可配置也可不配置,会显示模块的相对路径
new webpack.HotModuleReplacementPlugin(), 
// 这个是必须配置的插件,这个不需要安装，直接在我们之前安装的webpack中就存在
```

## 编译es6的语法

在所在项目中加入babel和babel-polyfill<br />安装：
```bash
npm install --save-dev babel-loader @babel/core
// @babel/core 是babel中的一个核心库

npm install --save-dev @babel/preset-env
// preset-env 这个模块就是将语法翻译成es5语法,这个模块包括了所有翻译成es5语法规则

npm install --save @babel/polyfill
// 将Promise,Map,Set等低版本中没有实现的语法,用polyfill来实现.
```

配置如下
```js{9}
{
  test: /\.js$/,
  exclude: '/node_modules',
  use: [{
    loader: 'babel-loader',
    options: {
      "presets": [
        ["@babel/preset-env", {
          "useBuiltIns": 'entry',
          // 'corejs': 3
        }]
      ]
    }
  }]
},
```
按照上面的`entry`配置需要在我们的文件入口处引入@babel-polyfill即 
```js
import '@babel/polyfill';
```
在webpack.cofnig.js中增加优化配置项：
```js
optimization: {
  moduleIds: 'hashed', // 保证当前打包模块id根据hash而不是随时自增变化
  runtimeChunk: 'single',
  splitChunks: {
    // chunks: 'all',
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/, // 此处表示将所有node_modules文件下的包生成到名字叫vendors的chunk中
        name: 'vendors',
        chunks: 'all'
      }
    },
  }
},
```
* 在配置多页应用时，需要设置entry为多个入口，除此之外还需要设置多个html-webpack-plugin并且它的配置项中的chunk即为entry中的module的name

:tada: :snowboarder:

