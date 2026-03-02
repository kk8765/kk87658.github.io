# Vue 最新语法示例：`useTemplateRef` 和 `defineModel`

## 简介

这两个 API 都是 Vue 3 新阶段里很实用的语法糖：

- `defineModel()`：用于组件内声明 `v-model`
- `useTemplateRef()`：用于在 `script setup` 中获取模板 ref

如果按官方推荐写法：

- `defineModel` 适用于 Vue 3.4+
- `useTemplateRef` 适用于 Vue 3.5+

这两个 API 的目标都很明确：

- 让组件通信更直观
- 让模板 ref 的写法更清晰
- 减少手写样板代码

## 1. `useTemplateRef` 的使用实例

`useTemplateRef()` 用来获取模板中的 `ref` 引用，适合访问 DOM，也适合拿到子组件实例。

相比以前手动写：

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <input ref="inputRef" />
</template>
```

现在 Vue 官方更推荐：

```vue
<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'

const inputRef = useTemplateRef<HTMLInputElement>('inputRef')

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <input ref="inputRef" placeholder="页面加载后自动聚焦" />
</template>
```

### 适用场景

- 输入框自动聚焦
- 获取元素尺寸
- 滚动到某个位置
- 调用子组件通过 `defineExpose` 暴露的方法

### 再看一个滚动示例

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'

const boxRef = useTemplateRef<HTMLDivElement>('boxRef')

function scrollToBottom() {
  const el = boxRef.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}
</script>

<template>
  <div
    ref="boxRef"
    style="height: 120px; overflow: auto; border: 1px solid #ccc;"
  >
    <p v-for="item in 20" :key="item">第 {{ item }} 行内容</p>
  </div>

  <button @click="scrollToBottom">滚动到底部</button>
</template>
```

### 注意点

- `useTemplateRef()` 只有在组件挂载后才能拿到真实元素
- 模板里的 `ref="boxRef"` 字符串，要和 `useTemplateRef('boxRef')` 保持一致
- 优先把它用于命令式操作，不要拿它代替 props 和 emits

## 2. `defineModel` 的使用实例

在 Vue 3.4 之前，组件想支持 `v-model`，通常要这样写：

```vue
<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <input :value="props.modelValue" @input="onInput" />
</template>
```

现在可以直接使用 `defineModel()`：

```vue
<script setup lang="ts">
const model = defineModel<string>()
</script>

<template>
  <input v-model="model" />
</template>
```

这个写法本质上就是把：

- `modelValue`
- `update:modelValue`

这套固定模式直接收敛成一个 API。

## 3. 完整示例：封装一个支持 `v-model` 的输入框

下面是一个更接近实际项目的例子。

### 子组件 `CustomInput.vue`

```vue
<script setup lang="ts">
const model = defineModel<string>({ default: '' })
</script>

<template>
  <input
    v-model="model"
    class="custom-input"
    placeholder="请输入内容"
  />
</template>

<style scoped>
.custom-input {
  width: 240px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
}
</style>
```

### 父组件 `Parent.vue`

```vue
<script setup lang="ts">
import { ref } from 'vue'
import CustomInput from './CustomInput.vue'

const text = ref('hello vue')
</script>

<template>
  <CustomInput v-model="text" />
  <p>当前输入内容：{{ text }}</p>
</template>
```

### 这段代码做了什么

- 父组件通过 `v-model="text"` 把数据传给子组件
- 子组件内部使用 `defineModel()` 接收并更新这个值
- 输入框变化时，父组件的 `text` 会自动同步

这就是 Vue 官方现在推荐的双向绑定写法。

## 4. 多个 `v-model` 的写法

`defineModel()` 还可以声明具名 model。

### 子组件

```vue
<script setup lang="ts">
const title = defineModel<string>('title', { default: '' })
const page = defineModel<number>('page', { default: 1 })
</script>

<template>
  <input v-model="title" placeholder="标题" />
  <input v-model="page" type="number" />
</template>
```

### 父组件

```vue
<script setup lang="ts">
import { ref } from 'vue'
import SearchPanel from './SearchPanel.vue'

const title = ref('Vue')
const page = ref(1)
</script>

<template>
  <SearchPanel v-model:title="title" v-model:page="page" />
</template>
```

这个场景非常适合：

- 查询表单
- 弹窗表单
- 复合筛选组件

## 5. `useTemplateRef` + `defineModel` 组合示例

这两个 API 很适合一起用，比如封装一个“可聚焦输入框”组件。

### 子组件 `FocusInput.vue`

```vue
<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'

const model = defineModel<string>({ default: '' })
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <input
    ref="inputRef"
    v-model="model"
    placeholder="组件挂载后自动聚焦"
  />
</template>
```

### 父组件

```vue
<script setup lang="ts">
import { ref } from 'vue'
import FocusInput from './FocusInput.vue'

const keyword = ref('')
</script>

<template>
  <FocusInput v-model="keyword" />
  <p>搜索词：{{ keyword }}</p>
</template>
```

## 6. 使用建议

### 什么时候用 `useTemplateRef`

- 你需要直接操作 DOM
- 你需要拿到子组件暴露的方法
- 你做的是聚焦、滚动、测量、播放这类命令式行为

不适合的情况：

- 组件通信
- 数据同步
- 父子状态传递

这些场景仍然优先使用 props、emits、`defineModel`

### 什么时候用 `defineModel`

- 自定义表单组件
- 包装原生输入框
- 需要和父组件做双向绑定的组件

不适合的情况：

- 普通只读 props
- 复杂联动逻辑全部塞进一个组件

`defineModel()` 是为了让 `v-model` 更清晰，不是让组件状态边界变模糊。

## 7. 总结

`useTemplateRef()` 和 `defineModel()` 都是在减少样板代码，但它们解决的问题不同：

- `useTemplateRef()` 解决模板 ref 获取问题
- `defineModel()` 解决组件 `v-model` 声明问题

可以直接这样记：

- 要拿 DOM 或组件实例，用 `useTemplateRef`
- 要写双向绑定组件，用 `defineModel`

在 Vue 3.4+ / 3.5+ 项目里，这已经是更现代、更推荐的写法。

## 8. 其他比较常用的 Vue 新语法

除了 `useTemplateRef()` 和 `defineModel()`，下面这些在新版本 Vue 里也很常用。

### 8.1 响应式 Props 解构

在 Vue 3.5+ 中，`defineProps()` 解构出来的变量已经是响应式的，写法会比以前更自然。

```vue
<script setup lang="ts">
import { watchEffect } from 'vue'

interface Props {
  title: string
  count?: number
}

const { title, count = 0 } = defineProps<Props>()

watchEffect(() => {
  console.log(title, count)
})
</script>
```

这个写法在 Vue 3.5+ 下是可以响应父组件更新的。

如果项目还是 Vue 3.4 或更早版本，就不要默认这样写，因为早期版本里解构后的变量不是响应式的。

### 8.2 `defineExpose`

默认情况下，`<script setup>` 里的变量不会暴露给父组件。

如果父组件要通过模板 ref 调用子组件方法，就需要 `defineExpose()`。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)

function open() {
  visible.value = true
}

function close() {
  visible.value = false
}

defineExpose({
  open,
  close
})
</script>

<template>
  <div v-if="visible">这是一个弹窗</div>
</template>
```

父组件：

```vue
<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import DialogPanel from './DialogPanel.vue'

const dialogRef = useTemplateRef<InstanceType<typeof DialogPanel>>('dialogRef')

onMounted(() => {
  dialogRef.value?.open()
})
</script>

<template>
  <DialogPanel ref="dialogRef" />
</template>
```

适合场景：

- 弹窗打开/关闭
- 表单重置
- 滚动容器暴露滚动方法

### 8.3 `defineSlots`

`defineSlots()` 主要用于 TypeScript 场景，给插槽增加类型提示。

它不会改变运行时逻辑，但对组件库或者中大型项目很有用。

```vue
<script setup lang="ts">
const slots = defineSlots<{
  default(props: { title: string; count: number }): any
  footer(props: { loading: boolean }): any
}>()
</script>

<template>
  <div class="card">
    <slot title="Vue" :count="3" />
    <slot name="footer" :loading="false" />
  </div>
</template>
```

父组件使用时，IDE 会更容易提示插槽参数。

### 8.4 `defineOptions`

以前在 `<script setup>` 里如果要写 `inheritAttrs: false`，往往还得额外写一个普通 `<script>`。

现在可以直接用 `defineOptions()`。

```vue
<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})
</script>

<template>
  <button class="btn">
    <slot />
  </button>
</template>
```

适合场景：

- 关闭默认属性继承
- 写组件级别的选项

注意：

- `defineOptions()` 是编译宏
- 它里的内容会被提升，不能依赖 `setup` 里临时声明的变量

### 8.5 `useId`

`useId()` 用来生成稳定且唯一的 id，尤其适合表单和无障碍属性。

```vue
<script setup lang="ts">
import { useId } from 'vue'

const inputId = useId()
const descId = useId()
</script>

<template>
  <div>
    <label :for="inputId">用户名</label>
    <input :id="inputId" :aria-describedby="descId" />
    <small :id="descId">请输入 4 到 16 位字符</small>
  </div>
</template>
```

这个 API 的优势是：

- 不需要手写随机字符串
- SSR 场景下也更稳定
- 更适合表单组件封装

注意不要把 `useId()` 放进 `computed()` 里调用，应该在顶层先声明。

## 9. 实战建议

如果你现在写的是 Vue 3 新项目，比较推荐优先掌握这些语法：

- `defineModel`
- `useTemplateRef`
- 响应式 Props 解构
- `defineExpose`
- `defineOptions`
- `defineSlots`
- `useId`

可以简单理解成：

- 和父组件双向绑定相关，用 `defineModel`
- 和模板 ref 相关，用 `useTemplateRef`
- 和组件 API 暴露相关，用 `defineExpose`
- 和组件选项相关，用 `defineOptions`
- 和插槽类型提示相关，用 `defineSlots`
- 和表单 id / 无障碍相关，用 `useId`

这些语法本质上都在做同一件事：减少样板代码，同时让组件边界更清晰。
