## 函数声明
```
function f() {} //声明一个函数，脚本在执行之前会做预编译处理。
```
## 函数表达式
```
var Fun = f () {} //在预编译处理阶段，只会给变量分配一个内存空间，不会做初始化。初始化过程中会在执行时执行。
```

 1. 代码
 ```
f();
n();
function f(){
    console.log('f');
}
var n = function(){
    console.log('n');
}
输出 f；报错n is not a function
```

## 变量名冲突


**如果是函数与函数冲突，预解析会解析后面的函数，也就是会覆盖**

```
console.log(f);

function f(){
    console.log('first');
};

function f(){
    console.log('second');
};

//输出 ƒ f(){
    console.log('second');
}
```
**如果是函数与变量冲突，预解析会解析函数，忽略变量**


```
function f() {}

var f;

console.log(typeof f)//结果为function
```
**函数声明会覆盖变量声明，但不会覆盖变量赋值**
```
function f() {}

var f = 1;

console.log(typeof f)//结果为number


```
