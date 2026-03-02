# React 常见 Hooks 使用实例

## 简介

Hooks 是 React 函数组件里最常用的一套能力。

实际开发中，最常见的通常是这些：

- `useState`
- `useEffect`
- `useRef`
- `useMemo`
- `useCallback`
- `useContext`
- `useReducer`

这篇文章不讲概念堆砌，直接看常见用法。

## 1. `useState`

`useState` 用来给组件添加本地状态。

### 计数器示例

```jsx
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>当前计数：{count}</p>
      <button onClick={() => setCount(count + 1)}>加 1</button>
      <button onClick={() => setCount(count - 1)}>减 1</button>
    </div>
  );
}
```

### 表单输入示例

```jsx
import { useState } from "react";

export default function InputDemo() {
  const [keyword, setKeyword] = useState("");

  return (
    <div>
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="请输入关键字"
      />
      <p>当前输入：{keyword}</p>
    </div>
  );
}
```

## 2. `useEffect`

`useEffect` 用来处理副作用，比如：

- 请求数据
- 监听事件
- 操作标题
- 清理定时器

### 页面标题同步示例

```jsx
import { useEffect, useState } from "react";

export default function TitleDemo() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `点击了 ${count} 次`;
  }, [count]);

  return <button onClick={() => setCount(count + 1)}>点击</button>;
}
```

### 请求数据示例

```jsx
import { useEffect, useState } from "react";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        const data = await res.json();
        setUsers(data);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) return <p>加载中...</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### 监听和清理示例

```jsx
import { useEffect, useState } from "react";

export default function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <p>当前窗口宽度：{width}</p>;
}
```

## 3. `useRef`

`useRef` 常见有两个用途：

- 获取 DOM
- 保存不会触发重新渲染的值

### 获取输入框 DOM 并自动聚焦

```jsx
import { useEffect, useRef } from "react";

export default function FocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} placeholder="页面加载后自动聚焦" />;
}
```

### 保存上一次的值

```jsx
import { useEffect, useRef, useState } from "react";

export default function PreviousValue() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef(0);

  useEffect(() => {
    prevCountRef.current = count;
  }, [count]);

  return (
    <div>
      <p>当前值：{count}</p>
      <p>上一次的值：{prevCountRef.current}</p>
      <button onClick={() => setCount(count + 1)}>加 1</button>
    </div>
  );
}
```

## 4. `useMemo`

`useMemo` 用来缓存计算结果，避免重复执行昂贵计算。

### 商品总价计算

```jsx
import { useMemo, useState } from "react";

export default function CartTotal() {
  const [keyword, setKeyword] = useState("");
  const [products] = useState([
    { id: 1, name: "iPhone", price: 5999, count: 1 },
    { id: 2, name: "iPad", price: 3999, count: 2 },
  ]);

  const totalPrice = useMemo(() => {
    console.log("重新计算总价");
    return products.reduce((sum, item) => sum + item.price * item.count, 0);
  }, [products]);

  return (
    <div>
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="修改这里不会触发总价重算"
      />
      <p>关键字：{keyword}</p>
      <p>总价：{totalPrice}</p>
    </div>
  );
}
```

适合场景：

- 列表过滤
- 排序
- 大量数据计算

不适合场景：

- 很简单的计算
- 为了“看起来高级”而乱加缓存

## 5. `useCallback`

`useCallback` 用来缓存函数引用，常见场景是把函数传给子组件时，减少不必要的重复创建。

### 搭配 `React.memo` 示例

```jsx
import { memo, useCallback, useState } from "react";

const Child = memo(function Child({ onAdd }) {
  console.log("Child render");
  return <button onClick={onAdd}>子组件加 1</button>;
});

export default function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");

  const handleAdd = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <p>count: {count}</p>
      <Child onAdd={handleAdd} />
    </div>
  );
}
```

这里如果不使用 `useCallback`，父组件每次重新渲染都会生成新的函数引用，子组件即使包了 `memo` 也可能继续渲染。

## 6. `useContext`

`useContext` 用来跨层级共享数据，避免一层层传 props。

### 主题切换示例

```jsx
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext(null);

function Toolbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div>
      <p>当前主题：{theme}</p>
      <button onClick={toggleTheme}>切换主题</button>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState("light");

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}
```

适合场景：

- 主题
- 用户信息
- 语言配置

如果共享状态非常复杂，通常会进一步搭配 `useReducer` 或状态管理库。

## 7. `useReducer`

当状态更新逻辑比较多、比较集中时，`useReducer` 往往比多个 `useState` 更清晰。

### Todo 示例

```jsx
import { useReducer, useState } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "add":
      return [
        ...state,
        { id: Date.now(), text: action.payload, done: false },
      ];
    case "toggle":
      return state.map((item) =>
        item.id === action.payload
          ? { ...item, done: !item.done }
          : item
      );
    case "remove":
      return state.filter((item) => item.id !== action.payload);
    default:
      return state;
  }
}

export default function TodoApp() {
  const [text, setText] = useState("");
  const [todos, dispatch] = useReducer(reducer, []);

  function handleAdd() {
    if (!text.trim()) return;
    dispatch({ type: "add", payload: text });
    setText("");
  }

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleAdd}>添加</button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span
              onClick={() => dispatch({ type: "toggle", payload: todo.id })}
              style={{
                textDecoration: todo.done ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => dispatch({ type: "remove", payload: todo.id })}>
              删除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## 8. 实战里怎么选

可以简单这样理解：

- `useState`：单个简单状态
- `useEffect`：处理副作用
- `useRef`：拿 DOM 或保存可变值
- `useMemo`：缓存计算结果
- `useCallback`：缓存函数引用
- `useContext`：跨层级共享数据
- `useReducer`：复杂状态逻辑

## 9. 总结

React 开发里最常见的 Hooks，核心就是这几个：

- `useState`
- `useEffect`
- `useRef`
- `useMemo`
- `useCallback`
- `useContext`
- `useReducer`

真正写项目时，不是每个组件都要把 Hooks 用全，而是按场景选：

- 有状态，用 `useState`
- 有副作用，用 `useEffect`
- 有 DOM 操作，用 `useRef`
- 有性能优化需要，再考虑 `useMemo` 和 `useCallback`
- 有跨组件共享数据，用 `useContext`
- 有复杂状态流转，用 `useReducer`

先把这些最常用的 Hooks 用熟，再去扩展自定义 Hooks，会更顺。

## 10. 常用自定义 Hooks

实际项目里，很多逻辑都会被抽成自定义 Hooks，方便复用。

比较常见的方向有两类：

- 公共方法类
- 组件交互类

下面是几个很常用的例子。

## 11. `useToggle`

`useToggle` 很适合处理开关状态，比如：

- 弹窗显示隐藏
- 抽屉展开收起
- loading 状态切换

### 实现

```jsx
import { useCallback, useState } from "react";

export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const open = useCallback(() => {
    setValue(true);
  }, []);

  const close = useCallback(() => {
    setValue(false);
  }, []);

  return {
    value,
    toggle,
    open,
    close,
  };
}
```

### 使用示例

```jsx
import { useToggle } from "./useToggle";

export default function DialogDemo() {
  const { value: visible, open, close } = useToggle(false);

  return (
    <div>
      <button onClick={open}>打开弹窗</button>
      {visible && (
        <div>
          <p>这是一个弹窗</p>
          <button onClick={close}>关闭</button>
        </div>
      )}
    </div>
  );
}
```

## 12. `useDebounce`

`useDebounce` 常见于：

- 搜索输入框
- 接口防抖请求
- 高频输入处理

### 实现

```jsx
import { useEffect, useState } from "react";

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

### 使用示例

```jsx
import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";

export default function SearchDemo() {
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);

  useEffect(() => {
    if (!debouncedKeyword) return;
    console.log("发起搜索请求：", debouncedKeyword);
  }, [debouncedKeyword]);

  return (
    <input
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      placeholder="输入关键字搜索"
    />
  );
}
```

## 13. `useLocalStorage`

这个 Hook 很常用，适合把状态和浏览器本地缓存同步起来。

常见场景：

- 记住主题
- 记住登录信息
- 记住筛选条件

### 实现

```jsx
import { useEffect, useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
```

### 使用示例

```jsx
import { useLocalStorage } from "./useLocalStorage";

export default function ThemeDemo() {
  const [theme, setTheme] = useLocalStorage("theme", "light");

  return (
    <div>
      <p>当前主题：{theme}</p>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        切换主题
      </button>
    </div>
  );
}
```

## 14. `useClickOutside`

这个 Hook 在组件交互里非常常见，适合：

- 下拉菜单
- 弹层
- 气泡卡片
- 右键菜单

### 实现

```jsx
import { useEffect } from "react";

export function useClickOutside(ref, handler) {
  useEffect(() => {
    function handleClick(event) {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    }

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, handler]);
}
```

### 使用示例

```jsx
import { useRef, useState } from "react";
import { useClickOutside } from "./useClickOutside";

export default function Dropdown() {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useClickOutside(boxRef, () => {
    setOpen(false);
  });

  return (
    <div ref={boxRef}>
      <button onClick={() => setOpen(!open)}>切换菜单</button>
      {open && (
        <ul>
          <li>个人中心</li>
          <li>设置</li>
          <li>退出登录</li>
        </ul>
      )}
    </div>
  );
}
```

## 15. `useTitle`

这是一个很简单但很实用的公共 Hook，用来统一设置页面标题。

### 实现

```jsx
import { useEffect } from "react";

export function useTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
```

### 使用示例

```jsx
import { useTitle } from "./useTitle";

export default function UserPage() {
  useTitle("用户中心");

  return <div>用户中心页面</div>;
}
```

## 16. `usePrevious`

有些时候我们需要拿到“上一次的值”，比如做对比动画、表单变化检测、价格变化提示。

### 实现

```jsx
import { useEffect, useRef } from "react";

export function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
```

### 使用示例

```jsx
import { useState } from "react";
import { usePrevious } from "./usePrevious";

export default function PriceCompare() {
  const [price, setPrice] = useState(100);
  const prevPrice = usePrevious(price);

  return (
    <div>
      <p>当前价格：{price}</p>
      <p>上一次价格：{prevPrice ?? "暂无"}</p>
      <button onClick={() => setPrice(price + 10)}>涨价</button>
    </div>
  );
}
```

## 17. `useMount`

这个 Hook 用来封装“组件挂载后执行一次”的逻辑。

虽然本质上还是 `useEffect(() => {}, [])`，但抽出来后可读性会更好。

### 实现

```jsx
import { useEffect } from "react";

export function useMount(callback) {
  useEffect(() => {
    callback();
  }, [callback]);
}
```

### 使用示例

```jsx
import { useMount } from "./useMount";

export default function InitDemo() {
  useMount(() => {
    console.log("组件初始化");
  });

  return <div>初始化完成</div>;
}
```

如果你不希望 `callback` 变化时重新执行，也可以约定只传稳定函数，或者直接在 Hook 内部忽略依赖，但那样要更谨慎。

## 18. 自定义 Hooks 的设计建议

写自定义 Hooks 时，通常注意这几点：

- 名称以 `use` 开头
- 只封装一类明确职责
- 输入和输出尽量稳定
- 副作用要记得清理
- 不要为了封装而封装

例如：

- `useToggle` 负责布尔切换
- `useDebounce` 负责值防抖
- `useClickOutside` 负责点击外部关闭

这样职责清楚，后续维护会轻松很多。

## 19. 总结

除了 React 内置 Hooks，项目里最常见的一批自定义 Hooks 也很固定：

- `useToggle`
- `useDebounce`
- `useLocalStorage`
- `useClickOutside`
- `useTitle`
- `usePrevious`
- `useMount`

这些 Hook 的价值不是“语法高级”，而是把重复逻辑抽离出来，让组件更干净。

如果组件里开始出现下面这些情况，就可以考虑抽 Hook：

- 一段逻辑在多个页面重复出现
- 一个组件里副作用太多
- 状态和事件处理混在一起过长
- 某类交互可以沉淀成公共能力

先从这些最常用的自定义 Hooks 开始，基本就能覆盖大部分业务开发场景。
