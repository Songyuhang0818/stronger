---
title: this
author: songyuhang
date: 2021-12-22
tags:
  - JS
---

## 全局执行上下文中的 this

全局上下文中的 this 指向 window 对象，this 和作用域链的唯一交点，作用域链的最底端包含了 window 对象，全局执行上下文中的 this 也是指向 window 对象。

## 函数执行上下文中的 this

改变 this 指向的方式

1. [call、apply、bind](./S002_call、apply、bind.html)
2. 通过对象调用来设置
   使用对象来调用其内部的一个方法，该方法的 this 是指向对象本身的。

- 在全局环境中调用一个函数，函数内部的 this 指向的是全局变量 window。
- 通过一个对象来调用其内部的一个方法，该方法的执行上下文中的 this 指向对象本身。

3. 通过构造函数设置

```js
function CreateObj() {
  this.name = "songyuhang";
}
var myObj = new CreateObj();
```

箭头函数没有自己的执行上下文，所以箭头函数的 this 就是它外层函数的 this。
