# lab

不管 webpack 2 还是 rollup，tree-shaking 的实现都是因为 ES6 modules 的静态特性才得以实现。

`.babelrc` 文件

```
presets: [
  ["es2015", { "modules": false } ]
  // webpack

  webpack understands the native import syntax, and uses it for tree shaking
]
```
