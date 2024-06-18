
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3d1e0fd6f424514afb16d138e285372~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1100&h=619&s=381673&e=png&b=fc938b)

### 前言
在本文中，我们将深入探索 `React Compiler`，这是一个旨在优化React应用性能的先进工具。通过阅读，您将获得全面的见解，包括：
1.  **React Compiler的背景与应用场景**：介绍其发展历程、核心功能以及在现代Web开发中的应用。
2.  **环境搭建与编译选择**：详解如何为新旧项目配置环境，以及如何根据项目需求选择合适的编译策略。
3.  **渲染原理及其对项目的影响**：分析React Compiler的工作机制，探讨其如何影响项目结构和性能。

### React Compiler 是什么
React Compiler 最初在 [React Conf 2021](https://www.youtube.com/watch?v=lGEMwh32soc) 作为 “React Froget” 概念首次提出，并于 [React Conf 2024](https://conf.react.dev/) 后正式开源。这是一个用 Rust 编写的 **“自动记忆编译器”**，能够解析和分析 React 代码，并自动缓存代码。开发者无需任何额外操作，便可获得高性能的组件代码。

### React Compiler 的应用场景
在介绍 `react compiler` 之前，先简单介绍一下 react 的常用优化手段。我们知道引起组件render 的原因主要有以下三种
- props 发生变化
- state 发生变化
- context 发生变化

我们常说的减少不必要的 `re-render`，主要是为了解决 props 变更带来的不必要的渲染。例如直接传递匿名函数：

```javaScript
function App() {
  const [x, setX] = useState(0)
  return (
      <div>
        <div onClick={() => setX(Math.random())}>哈哈哈哈{x}</div>
        <Link onCountClick={(count) => { console.log('====', count)}} />
        <div>hello，react compiler</div>
      </div>
  )
}
```
当 `APP` 重新渲染，会重新执行 App 函数，在渲染 JSX时，会再次创建一个匿名函数传递给 `Link` 组件，尽管这个时候 `Link` 组件不需要重新渲染，但是由于 `onCountClick` 前后函数地址不一致，导致 Link 组件重新渲染。为了规避这种问题，我们可以使用 `useCallback` 对上述代码进行改造，同时使用 `React.memo` 对 `Link` 组件进行包裹。代码如下
```javaScript
function App() {
  const [x, setX] = useState(0)
  const = onCountClick = useCallback((count) => { console.log('====', count }, [])
  return (
      <div>
        <div onClick={() => setX(Math.random())}>哈哈哈哈{x}</div>
        <Link onCountClick={(count) => { console.log('====', count)}} />
        <div>hello，react compiler</div>
      </div>
  )
}
```
通过 `useCallback`，只有当依赖变化时才会重新创建函数。这样，当 App 重新渲染时，如果 `useCallback` 的依赖未变，它会返回上次缓存的函数，避免了 Link 组件的不必要渲染。此外，API 如 `useMemo` 和 `React.memo` 也可以告诉 React，如果依赖未变，则无需重新计算缓存的内容，从而减少更新的工作量。

在实际开发中，虽然这些 API 可以帮助我们优化代码，但容易遗忘或错误地使用它们。如果组件未进行缓存优化，组件更新时的大量计算可能导致性能问题。错误的处理，虽然可以避免重复渲染，但可能严重影响代码质量，尤其是在依赖嵌套时：
```javaScript
const App = ({x, y, z}) => {
    const handleX = useCallback(() => {
        console.log(x);
    }, [x])

    const handleY = useCallback(() => {
        handleX();
        console.log(y)
    }, [y, handleX]);

    // 表面上只跟 z, handleY 有关，实际上，当 x 发生变化时，handleZ 也会出现变更，当代码量大的时候，很难直观的发现这一点
    const handleZ = useCallback(() => {
        handleY();
        console.log(z)
    }, [z, handleY])
}
```

> **`那有没有一种办法能够在保障代码可读性的同时，又能有效规避这些不必要的渲染与一些额外的处理呢？`**

`React Compiler` 提供了这样的解决方案。通过对 JavaScript 和 React 规则的深入了解，它对组件渲染节点进行分析，并自动对组件和钩子中的值或值组进行记忆化，从而细粒度控制组件渲染。



### 实操
接下来，我们将通过一个实例来介绍如何搭建 React Compiler 环境，逐步揭开它的神秘面纱。建议大家在本地配置环境，并亲自查看编译后的源码。相关代码已上传至 [github](https://github.com/xiaoTuiMao/react-compiler-guide)，可下载体验。

#### 新项目搭建
新项目会以 vite 的 react 模板进行演示，更多项目模板及配置请参考：[react compiler 使用](https://react.dev/learn/react-compiler#installation)
##### 1. react 模板下载
```shell
pnpm create vite my-react-app --template react-ts
```

##### 2. 编译器配置
编译配置，为了方便查看编译后的代码，这里暂时将`hmr` 与 `sourcemap` 关闭了，**切勿在真实项目中这么处理！**

```JavaScript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react({ babel: { plugins: ["babel-plugin-react-compiler"] }})],
	server: {
		hmr: false
	},
	esbuild: {
		sourcemap: false,
	}
})
```
 eslint 插件下载：

``` shell
pnpm install eslint-plugin-react-compiler
```

规则配置
```javaScript
module.exports = {
...
	plugins: ['eslint-plugin-react-compiler'],
	rules: {
		'react-compiler/react-compiler': "error",
	},
...
}
```
尽管 `react-compiler` 在检测到错误时，会跳过编译不做处理，但为了更好的前置发现问题语法限制，最好开启 `StrictMode` 与 eslint 插件。

#### 存量项目使用
**注意：由于  react compiler 会修改最后的输出产物，且目前发布的版本并非稳定版本，如需使用，建议采用局部编译的方式**。
##### 1. 使用 `react-compiler-healthcheck` 对老代码进行检查
```shell
npx react-compiler-healthcheck@latest
```
这个脚本对你的项目会做一下检查
- 检查可以成功优化多少组件：越多越好
- 检查 `<StrictMode>` 的使用情况：启用并遵循这一规则意味着优化成功率会更高。
- 检查不兼容的库使用：已知与编译器不兼容的库

以下是拿[ANT DESIGN PRO](https://pro.ant.design/zh-CN/)检测后的结果：

![Pasted image 20240617115126.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0faabd10955d4df79137c4a6abe18e00~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=386&h=73&s=13625&e=png&b=020202)


##### 2. 安装并配置上述的 eslint 插件 `eslint-plugin-react-compiler`

如果当 eslint 检测到这些错误，compiler 默认会跳过这些文件的编译，不阻塞编译。
##### 3. 安装 compiler 插件。
安装方式与上述一致，需要注意的是虽然 compiler 会在识别到有语法不支持时跳过，但是由于 JavaScript 的灵活性，无法保障捕获到所有的异常。所以对于存量项目比较推荐使用局部编译的方式，局部编译的方式有三种
- 在编译插件指定对应的编译文件内容，例如
	```javaScript
	import { defineConfig } from 'vite'
	import react from '@vitejs/plugin-react'

	const ReactCompilerConfig = {
		sources: (filename: string) => {
			return filename.indexOf('src/components') !== -1;
		},
	};

	export default defineConfig({
		plugins: [react({ babel: { plugins: ["babel-plugin-react-compiler", ReactCompilerConfig] }})],
	})
	```
	- 在源码侧使用按需编译
	```javaScript
	const ReactCompilerConfig = {
		compilationMode: "annotation",
	};

	// src/app.jsx
	export default function App() {

		"use memo";
		// ...
	}
	```
	- 在源码侧指定组件不编译

        在默认情况下，react-compiler 会进行全量编译，使用`use no memo`，可以告诉编译器，不要编译这个组件，但是需要注意的是：**这只是一个临时方案，并不会长期使用**
	```javaScript
		// src/app.jsx
		export default function App() {
			"use memo";
			// ...
		}
	```

配置完成后，使用 react-dev-tool 插件组件编译情况。React compiler 会给优化后的组件加上标记，效果如下：


![Pasted image 20240617115350.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1798a7417abb4806928ef86ecde269d4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=684&h=510&s=75482&e=png&b=fefefe)
### 工作原理
`React Compiler`并不仅仅是简单地对属性和变量添加`useMemo`和`useCallback`等API，而是通过依赖识别和数据缓存进行优化。与传统的React性能优化手段相比，它实现了更小的粒度和更好的效果，能够精确地实现最小化更新。

接下来我们看一段代码，有这样一个组件，它会获取当前链接的ID，然后根据 ID 去匹配到当前所需的要连接信息，然后将对应的信息传递给`Link`组件，`Link` 组件会拿到链接信息进行渲染，并且在点击链接时，会触发父组件传递的`onLinkClick` 回调，大致代码如下：

```javaScript
import { useState } from 'react';
import Link from './components/Link';
import './App.css'

const linkList = [{ id: 1, linkInfo: { text: '这是链接1', address: 'https://www.baidu.com/1' }}, { id: 2, linkInfo: { text: '这是链接2', address: 'https://www.baidu.com/2' }}];

function App() {
	console.log('APP render');
	const [linkId, setLinkId] = useState(1);
	const [random, setRandom] = useState(Math.random());
	const linkInfo = linkList.find((item) => item.id === linkId)?.linkInfo;

	return (
		<div id="container">
			<div id="text1" onClick={() => {
				setLinkId(linkId === 1 ? 2 : 1)
			}}>当前 linkId 为：{linkId}</div>
			<Link linkInfo={linkInfo} onLinkClick={(link: string) => { console.log('====', link)}} />
			<div id="text2" onClick={() => {
				setRandom(Math.random())
			}}>这是一个随机数：{random}</div>
			<div id="text3">这是一段关于 link Id 的介绍</div>
		</div>
	)
}
export default App
```
在不使用任何优化手段前，我们对比一下页面的`re-render`情况

| 优化前 | 优化后 |
| :-:| :--:|
| ![react-compiler-1.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d267c4f4213147cd8f954ef408ab45a3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=878&h=618&s=148272&e=gif&f=105&b=ffffff) | ![react-compiler-1.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/964eeb1c63d34202acb1929a31ef8fce~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=878&h=618&s=148272&e=gif&f=105&b=ffffff) |

在没有任何优化手段的情况下，每当组件状态变化时，整个组件树都会重新渲染。通过 `react-compiler` 处理后的组件，在随机数引起`App` 组件重现渲染时，`Link`组件并没有渲染，效果类似于使用`useCallback` 包裹`onLinkChange`匿名函数，同时对使用 `React.memo`对 `Link`组件进行包装。

那 `React-compiler`实际的处理是这样吗？，在此之前，先暂停两分钟，大家思考一下，在更细粒度的渲染过程中，APP组件中的 `div` 与`Link`组件，它们的渲染与什么有关？
<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61d17d2b06d74635ad61710222e08b15~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=300&h=300&s=34259&e=png&b=f5f2f2" alt="Pasted image 20240617100815.png"  /></p>


从子节点的渲染依赖分析：
1. id 为 text1 的`div`，当 `linkId` 与 匿名函数发生变化时，需要重新渲染，**`但是随机数发生变化时不需要`**
2. `Link` 组件，当`linkInfo` 与传递的匿名函数发生变化时需要重新渲染，**`但是随机数发生变化时不需要`**
3. id 为 text2 的 `div`，当随机数发生变化时需要重新渲染，**`但是 linkId 发生变化时，不需要`**
4. id 为 text3 的 `div`，它只需要初始化渲染一次即可。

接下来，看一下 `react compiler` 处理后的源码（注：可关闭`sourcemap` 与`hmr` 源码更简洁）：

![carbon (1).png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e87ced41eeb64ef48abc76e9b43f7d3b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2048&h=6076&s=1373584&e=png&b=151718)


`react-compiler` 根据代码静态识别生产了一个能够缓存20项内容的数组 `$`，以及 10 个跟 jsx 相关的 `template`。对源码的分析可得，`react-compiler` 将组件内部的渲染进行了更细粒度的拆分，每个子节点，均只跟自身渲染相关的元素有关，不再与组件本身绑定，如`div#text3`只会渲染一次，后续的渲染都会从`$` 数组中读取缓存，这也与我们上述细粒度分析一致，整体可以看出来，编译后的代码相对更复杂，但执行效率会更高。
![Pasted image 20240617113022.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/523196c5099845ad9feaa76ddf361a75~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1820&h=820&s=146895&e=png&b=ffffff)


同时从源码来看，编译后的代码量是有一定程度提升的，那么整体的体积与编译耗时大概有多大变化呢？
通过复杂项目组件 mock，来提升代码复杂度，简单对比了一下前后变化（项目代码并不大，数据仅供参考）：
| 使用 react-compiler | 不使用 react-compiler |
| :-: | :-: |
| ![Pasted image 20240617114429.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/69f6473fcfa749388c523387fc137167~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=443&h=73&s=19535&e=png&b=022b38) | ![Pasted image 20240617114358.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6266757cdab9459398abcc2dde50a0db~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=437&h=84&s=22221&e=png&b=022b38) |

从构建体积和时间的角度来看，使用React Compiler虽然略有增加，但与其带来的性能提升相比，这种增加显得微不足道。

### 总结

React Compiler的核心价值在于它提供了一种机制，通过细粒度的控制减少不必要的重新渲染，从而解决了由props、state 或 context 变更引起的性能问题。这一点在传统的React开发中是通过`useCallback`和`React.memo`等API手动实现的，而React Compiler自动化了这一过程。

实际应用中，React Compiler不仅帮助开发者避免了常见的性能陷阱，如错误地使用优化API导致的重复渲染，还提供了一个更为直观和可管理的方式来处理大规模应用中的复杂依赖关系。通过自动化分析组件渲染节点和值的依赖，React Compiler确保只有必要的组件在数据变化时才会更新。

但需要注意的是`React Compiler` 虽好，但其稳定性尚未得到全面认证，且官方建议 React 的版本在 React 19 RC以上，在实际的项目中，建议先采用局部优化的方式进行接入。


