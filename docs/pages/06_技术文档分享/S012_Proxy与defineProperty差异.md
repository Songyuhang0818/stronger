---
title: Proxy与defineProperty差异
author: hejiamin
date: 2021-05-12
tags:
  - 分享
---  
### defineProperty使用

#### 题目
先上两道开胃题：
1. if (a=== 1 && a===2 && a===3 ) {}, if可能执行？
2. 不用const，有什么办法使定义的变量不可变？


********
#### Object.defineProperty
Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。

##### 语法
> Object.defineProperty(obj, prop, descriptor)

##### 参数
> obj: 要定义属性的对象。
> prop: 要定义或修改的属性的名称或 Symbol 。
> descriptor: 要定义或修改的属性描述符。


下面要着重讲一下descriptor属性描述对象，该描述对象共有value、configurable、enumerable、value、writable、get、set等6个属性值，前4个为数据描述符和后2个为存取描述符.
> `如果一个描述符同时拥有 (value 或 writable) 和 (get 或 set) 键，则会产生一个异常`  

1. Value 属性
> 默认为 undefined， 该属性对应的值
* 示例
```js
var o = {};
Object.defineProperty(o, "a",{
    value: 1
});
console.log(o.a)  // 1
console.log(Object.getOwnPropertyDescriptor(o, "a"))
```
*****
2. Writable 属性
> 默认值为false, 代表着它能否被重新赋值
* 示例
```js
var o = {};
Object.defineProperty(o, "a",{
    value: 1,
    writable: false
});
console.log(o.a);  // 1
o.a = 2;
console.log(o.a);  // 1
```
*****
3. Enumerable 属性
> 默认值为false, 代表着它能否被for...in和Object.keys方法中被遍历
* 示例
```js
var o = {};
Object.defineProperty(o, "a", { value : 1, enumerable: true });
Object.defineProperty(o, "b", { value : 2, enumerable: false });
Object.defineProperty(o, "c", { value : 3 }); // enumerable 默认为 false
o.d = 4; // 如果使用直接赋值的方式创建对象的属性，则 enumerable 为 true
Object.defineProperty(o, Symbol.for('e'), {
  value: 5,
  enumerable: true
});
Object.defineProperty(o, Symbol.for('f'), {
  value: 6,
  enumerable: false
});

for (var i in o) {
  console.log(i);
}
// logs 'a' and 'd' (in undefined order)

Object.keys(o); // ['a', 'd']
Object.getOwnPropertyNames(o);   // ["a", "b", "c", "d"]
Object.getOwnPropertySymbols(o);  // [Symbol(e), Symbol(f)]
Reflect.ownKeys(o);  // ["a", "b", "c", "d", Symbol(e), Symbol(f)]

o.propertyIsEnumerable('a'); // true
o.propertyIsEnumerable('b'); // false
o.propertyIsEnumerable('c'); // false
o.propertyIsEnumerable('d'); // true
o.propertyIsEnumerable(Symbol.for('e')); // true
o.propertyIsEnumerable(Symbol.for('f')); // false

var p = { ...o }
p.a // 1
p.b // undefined
p.c // undefined
p.d // 4
p[Symbol.for('e')] // 5
p[Symbol.for('f')] // undefined
```
上面可以看到，getOwnPropertyNames是可以遍历出所有的非Symbol属性值，无论enumerable是否为false

*******
4. Configurable 属性
> 默认为false, 表示对象的属性是否可以被`删除`，以及除 `value 和 writable` 特性外的其他特性是否可以被修改
* 示例
```js
var o = {};
Object.defineProperty(o, "a",{
    value: 1,
    configurable: false,
    writable: true
});
Object.defineProperty(o, 'a', {
  value: 12
});  // 这里定义时，由于writable以经定义初始值，所以为true

Object.defineProperty(o, "a", {   // 会报错
  enumerable: true
})

console.log(o.a)  // 12
o.a = 2;    //  有效
delete o.a;  // 无效
console.log(o.a)  // 2
```
*****
* 所以普通定义时：
```js
var o = {};

o.a = 1;
// 等同于：
Object.defineProperty(o, "a", {
  value: 1,
  writable: true,
  configurable: true,
  enumerable: true
});


// 另一方面，
Object.defineProperty(o, "a", { value : 1 });
// 等同于：
Object.defineProperty(o, "a", {
  value: 1,
  writable: false,
  configurable: false,
  enumerable: false
});
```
******
5. Get属性
> 默认值为undefined，当访问该属性时，会调用此函数，该函数的返回值会被用作属性的值
* 示例
```js
var o = { a: 1 };
Object.defineProperty(o, "a", {
  get: function(){
      console.log("getter");
      return 2
  }
});
console.log(o.a);  // getter,  2
```
*******
6. Set属性
> 默认值为undefined,当属性值被修改时，会调用此函数。该方法接受一个参数（也就是被赋予的新值）
* 示例
```js
var o = { a: 1 };
var a = o.a;
Object.defineProperty(o, "a", {
  set: function(newValue){
      console.log("setter",newValue);
      a = newValue
  },
  get: function(){
      return a
  }
});
```

*****
问题：1
```js
var b = 1;  // 避免重复取值定义b
Object.defineProperty(window, "a", {
    get: function(){
        return b++
    }
})
if (a=== 1 && a===2 && a===3 ) {console.log("good")}
```

问题：2
```js
var o = {};
Object.defineProperty(o, "a",{
    value: 1
    writable: false
});
console.log(o.a);  // 1
o.a = 2;
console.log(o.a);  // 1
```

*****

### proxy使用
#### 简单使用
```js
var obj = new Proxy({}, {
  get: function (target, propKey, receiver) {
    console.log(`getting ${propKey}!`);
    return Reflect.get(target, propKey, receiver);
  },
  set: function (target, propKey, value, receiver) {
    console.log(`setting ${propKey}!`);
    return Reflect.set(target, propKey, value, receiver);
  }
});
```
**********

#### Proxy所支持的操作
> Proxy 支持的拦截操作一览，一共 13 种。
 1. get(target, propKey, receiver)：拦截对象属性的读取，比如proxy.foo和proxy['foo']。
2. set(target, propKey, value, receiver)：拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
3. has(target, propKey)：拦截propKey in proxy的操作，返回一个布尔值。
4. deleteProperty(target, propKey)：拦截delete proxy[propKey]的操作，返回一个布尔值。
5. ownKeys(target)：拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
6. getOwnPropertyDescriptor(target, propKey)：拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。
7. defineProperty(target, propKey, propDesc)：拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
8. preventExtensions(target)：拦截Object.preventExtensions(proxy)，返回一个布尔值。
9. getPrototypeOf(target)：拦截Object.getPrototypeOf(proxy)，返回一个对象。
10. isExtensible(target)：拦截Object.isExtensible(proxy)，返回一个布尔值。
11. setPrototypeOf(target, proto)：拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
12. apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
13. construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。

#### 在问及，proxy相比defineProperty优点时，一个是对数组的处理，还有就是对深度对象的处理

#### 对于数组处理
1. defineProperty
```js
var list = ["name","age","sex"];

console.log(Object.keys(list));

Object.keys(list).forEach((key)=>{
    let value = list[key]
    Object.defineProperty(list, key,{
        get: function(){
            console.log(key, "getting is running")
            return value
        },
        set: function(newValue){
            console.log(key, "setting is running")
            value = newValue
        }
    })
})

console.log(list[0]);
list[0] = "name123";
console.log(list); 
list.push('new');
console.log(list[3])  
```
新push的数据无法形成数据观测

2. Proxy
```js
const list = [];
const arr = new Proxy(list,{
    get(target,key, receiver){
        console.log(typeof key); // string
        console.log(key,"getting is running");
        return Reflect.get(target,key)
    },
    set(target, key, value){
        console.log("setting is running");
        return Reflect.set(target, key, value)
    }
})

arr[0] = "min";  // setting is running
console.log(list); // ["min"]
console.log(arr);  // Proxy {0: "min"}
console.log(arr[0]);  // 0 ; string ;  getting is running ; min
```
可以捕捉到length的改变，且新push的数据依旧可以被拦截

#### 对于深度数据处理
1. defineProperty
```js
var person = {
    a: {
        b: 123
    }
}

function defineReactive(data){
    Object.keys(data).forEach((key)=>{
        let value = data[key];
        Object.defineProperty(data, key,{
            get: function(){
                console.log('gettting', key, value);
                return value;
            },
            set: function(newValue){
                console.log("setting", key, newValue);
                value = newValue;
                if(typeof value === "object"){
                    defineReactive(value);
                }
            }
        })
        if(typeof value === "object"){
            defineReactive(value);
        }
    })
}

defineReactive(person);
person.a.b= 'good';
```
由于defineProperty只能依据进行key值处理，所以如果数据对象存在过深的结构层级，一开始我们就会执行大量的递归调用，来保证响应式。
所以这个问题上如果存在大量数据的初始化场景下，会存在极大的性能问题。


2. proxy
```js
function isObject (obj){
    return obj !== null && typeof obj === 'object'
}
const obj = {
    world: {
        person: "min"
    }
};
function reactive(obj){
    return new Proxy(obj,{
        get(target,key, receiver){
            console.log(`getting: key ${key}`);
            const res = Reflect.get(target,key);
            return isObject(res)? reactive(res): res
        },
        set(target, key, value){
            console.log(`setting: key ${key}, value: ${value}`);
            return Reflect.set(target, key, value)
        }
    })
}
const newObj = reactive(obj);
//已被注释 console.log(newObj.world.person);
newObj.world.person = {min: {age: 23}};
```
上面的过程是是惰性的，newObj.world.person = {min: {age: 23}};会先触发world属性的get,从而又会触发person的set。
区别defineProperty一开始就递归对子数据响应式定义，Proxy是获取到深层数据时，再利用reactive进一步定义响应式。
