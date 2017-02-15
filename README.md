## 配置
在 `.babelrc` 文件添加 `{ "modules": false }`，另见 [Babel Config](https://webpack.js.org/guides/hmr-react/#babel-config)

```
presets: [
  ["es2015", { "modules": false } ]
  // webpack 能对 ES6 Module 做静态依赖解析，但 babel 转译时需要排除 babel-plugin-transform-es2015-modules-commonjs 插件，才能实现 tree shaking 功能
]
```

## 简述

[webpack 2](https://webpack.js.org) 与 [rollup](http://rollupjs.org/) 的 `tree-shaking` 的实现都是因为 `ES6 module` 的静态特性才得以实现。

`webpack 2` 默认是支持 `tree-shaking`，但由于现有的 production 环境，不得不使用 babel 语法转换器，在配置 `.babelrc` 时，跟 webpack 1 还是有所差别。

此项目只是对 `webpack tree-shaking` 技术的验证实验。

介于webpack2正式发布，官方也给出 [Tree-shaking](https://medium.com/webpack/webpack-2-and-beyond-40520af9067f#9640) 的解释

> Because ES6 import and export are statically analyzed, webpack can “mark” unused imports and allow minifiers such as UglifyJs, and Closure Compiler to remove the unused code. This may result in much smaller bundles! (Known as dead code elimination) – [Click here for more info!](https://github.com/webpack/webpack/tree/master/examples/harmony-unused)

### 构建

```
npm install
npm run build
```

### 源码文件
helpers.js

```
export function foo() {
    return 'foo';
}
export function bar() {
    return 'bar';
}
```

entry.js

```
import {foo} from './helpers';

let elem = document.getElementById('output');
elem.innerHTML = `Output: ${foo()}`;
```

### 实验结果对比
- 结论：`webpack 2` 默认是支持 `tree-shaking`

  验证：`webpack` 编译后，输出 `bundle.harmony.js` 中，可以从 helper 模块代码看出 exports 中没有了 bar 这个方法。

```
function(module, exports, __webpack_require__) {
  "use strict";

  /* harmony export (immutable) */ exports["a"] = foo;
  /* unused harmony export bar */

  function foo() {
    return 'foo';
  }

  function bar() {
    return 'bar';
  }
}
```

- 结论：`babel` 配置没做特殊处理，是无法实现 `tree shaking`

  验证：`webpack` + `babel:presets: ['es2015']` 编译后,输出 `bundle.normal.js` 中， helper 模块代码还是包含 bar 方法

```
function(module, exports, __webpack_require__) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.foo = foo;
  exports.bar = bar;
  function foo() {
    return 'foo';
  }

  function bar() {
    return 'bar';
  }
}
```

- 结论：`transform-es2015-modules-commonjs` 插件影响 `tree shaking` 的实现

  验证：`webpack` + `babel:presets: ['es2015', {'modules': false}]` 编译后，输出 `bundle.without-optimize.js` 中， helper 模块代码已经不包含 bar 方法了

```
function(module, exports, __webpack_require__) {
  "use strict";

  /* harmony export (immutable) */ exports["a"] = foo;
  /* unused harmony export bar */
  function foo() {
    return 'foo';
  }

  function bar() {
    return 'bar';
  }
}
```

- 结论：通过UglifyJs简单的代码压缩，过滤掉无用 DCE(无用代码消除)

  验证：`webpack` + `babel:presets: ['es2015', {'modules': false}]` 编译后，经过 `UglifyJs`压缩，输出 `bundle.with-optimize.js` 中，可以看到压缩代码 helper 模块代码已经不包含 bar 方法了

```
function(t,e,n){"use strict";function r(){return"foo"}e.a=r}
```

- 结论：只有es6模块才能使用webpack2做静态依赖解析

  验证：`webpack` 入口文件修改为 `entry.common.js`，编译后输出  `bundle.common.js`，里面还是包含 bar 方法，说明除了 ES6 Module 外，无法实现 tree-shaking

```
function(module, exports) {

  module.exports.foo = function foo () {
    return 'foo';
  }

  module.exports.bar = function bar () {
    return 'bar';
  }
}
```

### 其它阅读

[如何评价 Webpack 2 新引入的 Tree-shaking 代码优化技术？](https://www.zhihu.com/question/41922432)

[webpack2 的 tree-shaking 好用吗？](http://imweb.io/topic/58666d57b3ce6d8e3f9f99b0)

[How To Clean Up Your JavaScript Build With Tree Shaking](https://blog.engineyard.com/2016/tree-shaking)
