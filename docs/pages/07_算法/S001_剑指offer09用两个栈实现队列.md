---
title: 剑指offer09.用两个栈实现队列
author: songyuhang
date: 2021-12-14
tags:
  - 栈
  - 算法
---

[剑指 offer09.用两个栈实现队列](https://leetcode-cn.com/problems/yong-liang-ge-zhan-shi-xian-dui-lie-lcof/)

- 栈，先进后出
- 队列，先进先出

### 第一次写法

第一次看时候题目都没读懂，后来看了评论，看懂了题目的意思，但是没看到用两个栈

```js
var CQueue = function() {
  this.result = [];
};

/**
 * @param {number} value
 * @return {void}
 */
CQueue.prototype.appendTail = function(value) {
  this.result.push(value);
};

/**
 * @return {number}
 */
CQueue.prototype.deleteHead = function() {
  if (this.result.length > 0) {
    return this.result.shift();
  } else {
    return -1;
  }
};

/**
 * Your CQueue object will be instantiated and called as such:
 * var obj = new CQueue()
 * obj.appendTail(value)
 * var param_2 = obj.deleteHead()
 */
```

### 第二次写法

思路: 首先题目是用两个栈实现队列，栈是先进后出，队列是先进先出，设立一个入队栈，将值直接压入栈中，在设置一个出队栈，如果出队栈不为空，弹出一个值，否则把入队栈倒入出队栈

```js
var CQueue = function() {
  this.stackA = [];
  this.stackB = [];
};

/**
 * @param {number} value
 * @return {void}
 */
CQueue.prototype.appendTail = function(value) {
  this.stackA.push(value);
};

/**
 * @return {number}
 */
CQueue.prototype.deleteHead = function() {
  if (this.stackB.length) {
    return this.stackB.pop();
  } else {
    while (this.stackA.length) {
      this.stackB.push(this.stackA.pop());
    }
    if (this.stackB.length) {
      return this.stackB.pop();
    } else {
      return -1;
    }
  }
};

/**
 * Your CQueue object will be instantiated and called as such:
 * var obj = new CQueue()
 * obj.appendTail(value)
 * var param_2 = obj.deleteHead()
 */
```
