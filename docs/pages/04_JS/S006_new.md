---
title: new
author: songyuhang
date: 2021-12-22
tags:
  - JS
---

## new 一个对象时，js 做了什么？

1. 首先创建一个空对象 {};
2. 给 {} 添加`__proto__`属性，将该属性链接至构造函数的原型对象;
3. 将 {} 作为 this 的上下文;
4. 如果该函数没有返回对象，则返回 this

```js
function _new(constructor, ...arg) {
  // 创建一个空对象
  let obj = {};
  // 给空对象添加__proto__属性，并将该属性链接到构造函数的原型对象
  obj.__proto__ = constructor.prototype;
  // 将空对象作为this上下文
  let result = constructor.call(obj, ...arg);
  // 返回结果
  return typeof result === "object" ? result : obj;
}
```
