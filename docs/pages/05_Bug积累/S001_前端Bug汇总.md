---
title: 前端Bug汇总
author: 摘录自手炒
date: 2020-07-29
tags:
  - Bug积累
---

1. android 4.4 及以下版本 在 `display: -webkit-flex;`的容器中子容器高度兼容性有问题

1. ios 系统使用 zepto 的 dom.on('click', 'ele' ,func) (事件委托)不生效[
   【解决办法】不要对$('body').append('xxxx') 的 xxx 元素进行事件委托]

1. android 6.0 淡出淡出的动画 bug 頓卡
   【解决办法】不要把样式直接加在 img 上面，需要在外面加一个 div，把动画写在 div 上）

1. rem 使用过程中可能会出现的 bug 及解决方案：
   1）ios 上返回抓不到统计【代码中使用“取消放大字体”和“关闭底部分享栏”客户端协议时，要区分平台，ios 不需要调用这两个协议。】  
   2）最好使用 100%来设置占满屏幕的宽度，避免使用 rem 时出现小数点，导致出现横向滚动条）

1. android 4.3 及以下不能很好地支持 Blob 文件

1. 魅族 3 手炒中页面上移飞到顶部或下移飞到底部，点击按钮，使用 display:none 和 show 切换页面 tab 的显示会导致页面错位。  
   【解决办法】：修改渲染方式

1. 安卓 4.4.x（酷派），半透明背景色（使用 opacity）时，使用 border-radius 无法画出一个完整的圆（背景色会缺一块，会有一道直线边），把 opacity 用 rgba 替换掉

1. IOS 中事件委托失效问题
   ios 会阻止非点击元素(没有本身注册点击事件的普通元素....)的事件冒泡，所以 div,span 委托不起作用。
   【解决办法】  
   1）给元素添加 `cursor:pointer;`样式  
   2）将事件委托源放在非 document,body 的元素上  
   3）将 click 事件直接绑定到目标 ​ 元素（​​ 即 .target）上  
   4）将目标 ​ 元素换成 `<a>` 或者 button 等可点击的 ​ 元素  
   5）或者添加属性 onclick = ""；（这个方式比较麻烦）试过可以触发委托事件，相当于默认该元素是可点击元素

1. 动态渲染页面 title，在 ios 系统中 title 偶现的 bug。

1. ios 系统中，focus 后，系统键盘使得 position：fixed 失效的问题。
   【解决办法】不要让整个 body 滚动，而是滚动 content

1. android4.3 版本中，position：fixed 使得 css（animation）动画失效。（定位问题 position：relative 或者 absolute）

1. 遮罩层有一条 2 次半透明遮罩的横条  
   【解决办法】对 fixed 图层进行半透明遮罩的时候，图层内部必须没有元素，如果父级 div 也是 fixed 定位的话，需要半透明的 div 也需要设置 fixed

1. IOS8 系统不支持 `display: -webkit-flex; justify-content:center;` css 样式属性

1. 用 a 标签的 href 属性，在 IOS 的 VoiceOver 开启的状态下，连续点击两次，就算加进程锁，还是会触发两次。  
   【解决办法】点击都用 click

1. 目前的 iOS 11 用 transform 的 3D 效果都有问题，只要滑动，图片就会消失，滑动停止图片显示

1. iphoneX ios 11.3 系统 使用 echarts 画图 滑动页面遮住 canvas 再滑动页面显示 canvas 有较大概率出现 canvas 图不显示的情况  
   【解决办法】设置 canvas 父级元素的背景颜色及和 canvas 有重叠的 dom 元素的 z-index 能解决部分问题

1. 第一个子元素不要写 marginTop，在三星 N9009V，小米 3 上不生效

1. `input[type='date‘]`调起时间产生问题总结  
   1）页面默认展示的是 2017/12/13 ,但实际通过 value 获取到的格式是 2017-12-13；  
   2）移动端调起 input[type='date]，ios 上 input 的 value 默认值需设置’yyyy-mm-dd‘这样的日期格式，不能是其他字符，不然无法调起。android 没有这个问题；  
   3）ios 日期键盘上有‘清除’和‘确认’两个按钮，由于 ios 上需设置默认值来调起键盘，点击弹出日期键盘后，在不更改日期直接点击确认的情况下，由于值没有改变，不会执行 change 事件，但点击确认或清除按钮，待键盘收回时均能触发 blur 事件，故 ios 上最好使用 blur 事件；  
   4）android 上调起日期键盘一般有三个按钮（清除 、取消、设置），选择日期点击设置会触发 blur
   事件，但某些操作情况下点击按键，日期键盘消失后不会触发 blur 事件（比如先点击清除-->重新调起弹窗-->不更改日期点击设置），故 android 上需使用 change 事件。

1. 关于使用 echarts （底层 svg 渲染）画多幅图，并且有多种点击交互画图问题  
   1）在同一个页面有多幅图（没有多幅图点击交互），可使用 svg 渲染，控制动画时间和设置 echarts 动画加载时间，达到较好体验（目前在各种手机体验很好，canvas 在有些手机会导致不能画图偶现的 bug）  
   2）如果页面中存在 k 线，一定要使用 svg 渲染，在某些机型 canvas 绘图会出现暂短黑屏的问题  
   3）在 iphone 手机，出现 k 线和折线绘图交互的时候，折线使用 canvas，k 线使用 svg，（如果都用 svg，一个绘图的时候会影响到另一个图像的展示），在 android 上可以都使用 svg  
   4）页面加载多种图，其中包含有饼图，iphone 使用 svg，android 使用 svg（vivo 和小米 max 使用 canvas，这两种系统好像不太支持 svg 渲染，加载数据的时候会导致 app 崩溃，与客户端开发抓日志，发现是 echarts 库，底层 svg 渲染的 bug，等后期库优化再看吧）  
   5）同个容器，切换画图交互，echarts 提供两个函数，clear（）清除数据，dispose（）销毁画布，这两个函数都可以达到重新绘制，建议使用 clear（），因为在画 k 线的时候，dispose 会导致 echarts 库报错，某些 android 手机在切换的时候，如果不调用 clear 函数，之前的数据是不能清除的。

1. 使用 rem2.1 版本库，在 ios 的 dpr 缩放后  
   1）border-radius 会使 border 变细  
   2）当用 canvas 或 svg 绘图后【使用 echarts】，在手炒客户端当前 webview 下【safari 浏览器里是好的】，图下方边框会因为 border-radius 导致同一条边框 border 粗细不一致，且会随着页面滑动发生变化。  
   【产生原因】不明，将边框的元素脱离文档流也没有用  
   【解决办法】不使用 `border-radius`

1. input 输入框不要使用 line-height，ios 下会使 placeholder 偏高  
   对 input 加 height 的方法在 OPPO R9M 下 placeholder 会偏下不居中

1. bug 描述：ios 上，底部浮动购买栏顶部的边框显示较粗【见附件：ios 浮动栏 borderTop 变粗.jpg】  
   【产生原因】页面使用了 v2.1 版本 rem，同时 meta 标签添加了
   `<meta name="rem" content="design-width=720">`，浮动框使用了 `display:-webkit-box;`  
   【解决方案】  
   方案 1、不使用 `display:-webkit-box;`  
   方案 2、不使用`<meta name="rem" content="design-width=720">`

1. 【bug 描述】iOS8+系统，页面使用 dpr 和 meta 标签来缩放显示（也就是引用当前的 rem.js）,echarts 画图手机会渲染不出来  
   【解决方案】针对 iOS8+系统，在 rem.js 中将 rem.dpr 设置为 1，这样就不会用到 meta 来缩放 0.5 倍

1. 【bug 描述】低于 Android 6 的版本，box-shadow 会影响页面的滑动流畅度（内阴影影响页面整体滑动的流程，外阴影影响 swiper 滑动流畅）  
   【解决方案】针对安卓 5 及以下版本做 box-shadow 的兼容影响
