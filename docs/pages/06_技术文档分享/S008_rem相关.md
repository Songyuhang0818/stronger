---
title: rem相关
author: zhangyijie
date: 2020-10-27
tags:
  - 分享
---

## rem 相关

### 什么是 rem

rem 是一个相对单位。其相对于根元素 html 的 font-size 进行计算，这样一来 rem 就完美的绕开了复杂的层级关系。默认情况下，浏览器给的字体大小是 16px，按照转化关系 16px = 1rem。

### 实现方案

1. 根据 dpr 的值来修改 viewport 实现 1px 的线
   - 这步可以省略，使用固定的 dpr，但是相对的 1px 的问题需要用别的方法解决
2. 根据 dpr 的值来修改 html 的 font-size，从而使用 rem 实现等比缩放
   - 公式：document.documentElement.clientWidth \* dpr / 10

### rem 下字体怎么处理？

1. 要求不高的话可以直接使用 rem 单位
2. 根据 dpr 值分段调整

```javascript
/* $design-dpr 移动端页面设计稿dpr基准值 */
@mixin font-size($fontSize) {
    font-size: $fontSize / $design-dpr;
    [data-dpr="2"] & {
        font-size: $fontSize / $design-dpr * 2;
    }
    [data-dpr="3"] & {
        font-size: $fontSize / $design-dpr * 3;
    }
}
```

### rem 和 vw 的优点和缺点

rem：

- 优点
  1. 兼容性好
- 缺点
  1.  用到了 JS 来动态设置 html 的 font-size，相对繁琐而且可能造成页面的抖动  
      vw：
- 优点
  1. 设置简单，一般来说 1vw === 移动端页面设计稿宽度 / 100
- 缺点
  1. 兼容性不太行（在移动端 ios8 以上以及 Android 4.4 以上获得支持，并且在微信 x5 内核中也得到完美的全面支持）
  2. 无法设置容器最大最小宽度

### 1px 的问题怎么解决？

1. <code>border:0.5px solid #E5E5E5 </code>
   - 只适用于 iOS
2. 使用边框图片<code>border-image</code>
   - border 颜色变了就得重新制作图片
   - 圆角会比较模糊
3. 使用 box-shadow 实现
   - 仔细看的话其实还是看的出来不是边框的  
     例子：
   ```javascript
   box-shadow: 0  -1px 1px -1px #e5e5e5,   //上边线
         1px  0  1px -1px #e5e5e5,   //右边线
         0  1px  1px -1px #e5e5e5,   //下边线
         -1px 0  1px -1px #e5e5e5;   //左边线
   ```
4. 使用伪元素
   - 占用了 after 元素，代码比较多  
     例子：
   ```javascript
   .onePx{
     // 1 条border
     position: relative;
     &::after{
       position: absolute;
       content: '';
       background-color: #e5e5e5;
       display: block;
       width: 100%;
       height: 1px; /*no*/
       transform: scale(1, 0.5);
       top: 0;
       left: 0;
     }
   }
   .borderAll{
     // 4 条border
     position: relative;
       &:after{
           content:" ";
           position:absolute;
           top: 0;
           left: 0;
           width: 200%;
           height: 200%;
           transform: scale(0.5);
           transform-origin: left top;
           box-sizing: border-box;
           border: 1px solid #E5E5E5;
           border-radius: 4px;
       }
     }
   ```
5. viewport  
   例子：
   ```javascript
   <meta name="viewport" id="WebViewport" content="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
   ......
   var viewport = document.querySelector("meta[name=viewport]")
   if (window.devicePixelRatio == 1) {
       viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no')
   }
   if (window.devicePixelRatio == 2) {
       viewport.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no')
   }
   if (window.devicePixelRatio == 3) {
       viewport.setAttribute('content', 'width=device-width, initial-scale=0.333333333, maximum-scale=0.333333333, minimum-scale=0.333333333, user-scalable=no')
   }
   var docEl = document.documentElement;
   var fontsize = 10 * (docEl.clientWidth / 320) + 'px';
   docEl.style.fontSize = fontsize;
   ```
   - 由于缩放涉及全局的 rem 单位，所以不推荐用在老项目上
