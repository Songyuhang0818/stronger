---
title: Call、Apply、Bind
author: songyuhang
date: 2021-12-14
tags:
  - JS
---

## 共同点

都可以改变 this 指向

## 不同点

- 传入参数不同，call 从第二个参数开始都是以 arg1,arg2...这种形式传入,apply 第二个参数为数组
- 通过 bind 改变 this 会返回一个新的函数，这个函数不会立即执行

## 手写实现 call

思路: 将要改变 this 指向的方法，挂到目标对象上执行并返回

```js
Function.prototype.myCall = function(context, ...arguments) {
  if (typeof this !== "function") {
    throw new Error("this is not function");
  }
  context = context || window;
  let result = null;
  // this指的就是调用call 方法的函数
  // 给当前上下文(call方法的第一个参数)添加一个属性fn，属性值为this，当前上下文就可以调用这个方法了。
  // 把call方法传入的其他的参数传入到属性fn指代的函数中，直接调用函数
  // fn.myCall(obj) 就是将fn方法添加到obj的属性中，fn中的this 指向 obj
  context.fn = this; // this指向的是当前的函数（Function实例）
  result = context.fn(...arguments); // 隐式绑定，当前函数的this指向context
  delete context.fn;
  return result;
};
const obj = {
  value: "kobe",
};

function fn(name, age) {
  return {
    value: this.value,
    name,
    age,
  };
}

console.log(fn.myCall(obj, "SYH", 25));

console.log(fn.call(obj, "SYH", 25));
```

## 手写实现 apply

```js
Function.prototype.myApply = function(context, arguments) {
  if (typeof this !== "function") {
    throw new Error("this is not function");
  }
  context = context || window;
  let result = null;
  // this指的就是调用call 方法的函数
  // 给当前上下文(call方法的第一个参数)添加一个属性fn，属性值为this，当前上下文就可以调用这个方法了。
  // 把call方法传入的其他的参数传入到属性fn指代的函数中，直接调用函数
  // fn.myCall(obj) 就是将fn方法添加到obj的属性中，fn中的this 指向 obj
  context.fn = this; // this指向的是当前的函数（Function实例）
  result = context.fn(...arguments); // 隐式绑定，当前函数的this指向context
  delete context.fn;
  return result;
};
const obj = {
  value: "kobe",
};
function fn(name, age) {
  return {
    value: this.value,
    name,
    age,
  };
}
console.log(fn.myApply(obj, ["SYH", 25]));

console.log(fn.apply(obj, ["SYH", 25]));
```
