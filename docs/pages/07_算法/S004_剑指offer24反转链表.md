---
title: 剑指Offer24. 反转链表
author: songyuhang
date: 2021-12-15
tags:
  - 链表
  - 算法
---

[剑指 Offer24. 反转链表](https://leetcode-cn.com/problems/fan-zhuan-lian-biao-lcof/)

1. 迭代法

在遍历链表时，将当前节点的 \textit{next}next 指针改为指向前一个节点。由于节点没有引用其前一个节点，因此必须事先存储其前一个节点。在更改引用之前，还需要存储后一个节点。最后返回新的头引用。

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
 * @return {ListNode}
 */
var reverseList = function(head) {
  let prev = null;
  let current = head;
  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  return prev;
};
```
