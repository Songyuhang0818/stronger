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

## 手写实现 bind

- 可以修改 this 指向
- bind 返回一个绑定 this 的新函数
- 支持函数柯里化
- 新函数的 this 无法再被修改，使用 call、apply 也不行

可以使用 call、apply

- 因为 bind 的使用方法是 某函数.bind(某对象，...剩余参数)
- 所以需要在 Function.prototype 上进行编程
- 将传递的参数中的某对象和剩余参数使用 apply 的方式在一个回调函数中执行即可
- 要在第一层获取到被绑定函数的 this，因为要拿到那个函数用 apply

```js
Function.prototype.my_bind = function() {
  var self = this, // 保存原函数
    context = Array.prototype.shift.call(arguments), // 保存需要绑定的this上下文
    // 上一行等价于 context = [].shift.call(arguments);
    args = Array.prototype.slice.call(arguments); // 剩余的参数转为数组
  return function() {
    // 返回一个新函数
    self.apply(
      context,
      Array.prototype.concat.call(args, Array.prototype.slice.call(arguments))
    );
  };
};

function a(m, n, o) {
  console.log({ m, n, o });
  console.log(this.name + " " + m + " " + n + " " + o);
}
var b = {
  name: "song",
};

a.my_bind(b, 4, 5, 6)();
```
