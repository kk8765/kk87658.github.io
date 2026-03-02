# `structuredClone` 使用文档

## 简介

`structuredClone()` 是浏览器和 Node.js 提供的原生深拷贝方法，用于创建一个对象的完整副本。

它比 `JSON.parse(JSON.stringify(obj))` 更可靠，能正确处理更多数据类型，例如：

- `Date`
- `Map`
- `Set`
- `ArrayBuffer`
- `Blob`
- `File`
- `RegExp`
- 循环引用对象

## 语法

```js
const cloned = structuredClone(value)
```

也可以传递第二个参数用于转移可转移对象：

```js
const cloned = structuredClone(value, { transfer: [transferable] })
```

## 基本示例

### 深拷贝普通对象

```js
const user = {
  name: "Tom",
  profile: {
    age: 18
  }
}

const copied = structuredClone(user)

copied.profile.age = 20

console.log(user.profile.age) // 18
console.log(copied.profile.age) // 20
```

## 支持的数据类型示例

### 拷贝 `Date`

```js
const obj = {
  createdAt: new Date()
}

const copied = structuredClone(obj)

console.log(copied.createdAt instanceof Date) // true
```

### 拷贝 `Map`

```js
const map = new Map([
  ["name", "Alice"],
  ["age", 25]
])

const copied = structuredClone(map)

console.log(copied instanceof Map) // true
console.log(copied.get("name")) // Alice
```

### 拷贝 `Set`

```js
const set = new Set([1, 2, 3])

const copied = structuredClone(set)

console.log(copied instanceof Set) // true
console.log(copied.has(2)) // true
```

### 处理循环引用

```js
const obj = { name: "loop" }
obj.self = obj

const copied = structuredClone(obj)

console.log(copied.self === copied) // true
```

## transfer 用法

某些对象可以在克隆时直接“转移”给新对象，而不是复制，例如 `ArrayBuffer`。

### 示例

```js
const buffer = new ArrayBuffer(8)

const copied = structuredClone(buffer, {
  transfer: [buffer]
})

console.log(buffer.byteLength) // 0
console.log(copied.byteLength) // 8
```

> 转移后，原对象通常不可再使用。

## 不能拷贝的内容

`structuredClone()` 不能拷贝以下内容：

- 函数
- DOM 节点
- `WeakMap`
- `WeakSet`
- 某些带有宿主环境限制的对象

### 错误示例

```js
const obj = {
  fn() {
    console.log("hello")
  }
}

structuredClone(obj) // 抛出异常
```

## 与 JSON 深拷贝的区别

| 对比项 | `structuredClone()` | `JSON.parse(JSON.stringify())` |
| --- | --- | --- |
| 深拷贝 | 支持 | 支持 |
| `Date` | 支持 | 会变成字符串 |
| `Map` / `Set` | 支持 | 不支持 |
| 循环引用 | 支持 | 报错 |
| 函数 | 不支持 | 会丢失 |
| `undefined` | 保留 | 会丢失 |

## 使用建议

适合使用 `structuredClone()` 的场景：

- 需要深拷贝复杂对象
- 数据中包含 `Map`、`Set`、`Date`
- 对象存在循环引用
- 需要替代不稳定的 JSON 深拷贝方式

不适合的场景：

- 对象中包含函数
- 需要保留原型链上的自定义方法
- 需要兼容非常老的运行环境

## 浏览器与 Node.js 支持

- 现代浏览器基本支持
- Node.js 17+ 支持较好

如果运行环境较旧，需要先确认兼容性。

## 总结

`structuredClone()` 是原生的深拷贝方案，适合绝大多数现代 JavaScript 深拷贝需求。

它的优点是：

- 写法简单
- 支持更多数据类型
- 能处理循环引用
- 比 JSON 深拷贝更可靠

推荐在现代项目中优先使用。
