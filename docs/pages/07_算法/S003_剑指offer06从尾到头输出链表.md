---
title: 剑指Offer06. 从尾到头打印链表
author: songyuhang
date: 2021-12-15
tags:
  - 栈
  - 算法
---

[剑指 Offer06. 从尾到头打印链表](https://leetcode-cn.com/problems/cong-wei-dao-tou-da-yin-lian-biao-lcof/)

运用栈
思路: 遍历链表，遍历的顺序是从头到尾，可输出的顺序却是从尾到头；也就是说第一个遍历到的节点最后一个输出，而最后一个遍历到的节点第一个输出。这个就是典型的后进先出，我们可以用栈来实现这种顺序，每经过一个节点的时候，把该节点放到一个栈中，当遍历完整个链表后，再从栈顶开始依次输出节点的值

1. 非递归写法

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {number[]}
 */
var reversePrint = function(head) {
  const arr = [];
  while (head !== null) {
    arr.push(head.val);
    head = head.next;
  }
  // return arr.reverse(); // 直接用数组的方法
  const result = [];
  while (arr.length) {
    result.push(arr.pop());
  }
};
```

2. 递归写法

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {number[]}
 */
var reversePrint = function(head, arr = []) {
  if (head != null) {
    if (head.next != null) {
      reversePrint(head.next, arr);
    }
    arr.push(head.val);
  }
  return arr;
};
```
