# webpack 工程化基石 - AST

## AST 是什么

抽象语法树（Abstract Syntax Tree）是源代码语法结构的一种表现形式。

以树状的形式表现语言的语法结构，树里面的每个节点都是代码的一种结构。

在代码语法的检查、代码格式化、转换语言类型等都可以应用，比如 ESLint。

## babel 是什么，能做什么

Babel 是一个 JavaScript 编译器，主要用于将采用 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。

同时现在babel还支持编译转换jsx。

## 编译器流程

编译器的整体执行过程，三个步骤：
1. Parsing（解析）
2. Transform（转换）
3. Generator（代码生成）

整体流程图：

![babel.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9dee36e19c564869ba3525d73e18af03~tplv-k3u1fbpfcp-watermark.image?)

### Parsing

parsing 过程是将代码转换成 AST 对象。

解析工具：[acorn](https://www.npmjs.com/package/acorn)

解析过程分为 2 个步骤：词法分析、语法分析。

#### 词法分析

使用 tokenizer（分词器）将源码拆分为 tokens。

-  tokens 就是一个对象数组，每一个对象就是一个单元信息，比如数字、标签、操作符等等。

-  分词器：大致思路就是通过遍历字符串，对每个字符按照一定的规则进行匹配

tokenizer 工具：[js-tokens](https://www.npmjs.com/package/js-tokens)

使用 js-tokens 生成的 tokens。

```js
[
  { type: 'IdentifierName', value: 'const' },
  { type: 'WhiteSpace', value: ' ' },
  { type: 'IdentifierName', value: 'num' },
  { type: 'WhiteSpace', value: ' ' },
  { type: 'Punctuator', value: '=' },
  { type: 'WhiteSpace', value: ' ' },
  { type: 'NumericLiteral', value: '10' },
  { type: 'WhiteSpace', value: ' ' },
  { type: 'Punctuator', value: '+' },
  { type: 'WhiteSpace', value: ' ' },
  { type: 'NumericLiteral', value: '20' }
]
```

#### 语法分析

将 tokens 重新整理成语法相互关联的表达式，也就是 AST。

通过遍历 tokens，根据不同 type 类型的节点生成不同的节点对象。

#### AST

使用 acorn 来生成 AST。

![acorn.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2f2a2c3252c4c53875bcba4f4a23a7d~tplv-k3u1fbpfcp-watermark.image?)

### Transform

这个过程主要是通过递归遍历 AST 节点，改写 AST，或者根据当前 AST 生成一个新的 AST。可以是相同语言，也可以将 AST 改写为其他语言。

工具：[acorn-walk](https://www.npmjs.com/package/acorn-walk)

acorn-walk 提供了多种遍历方法：simple、ancestor 等等。

需提供一个访问器对象Visitors。

#### visitors 对象

属性名是节点类型，遵循 [estree](https://github.com/estree/estree) 规范，这里其实可以看 AST。

值为一个函数，不同的节点类型函数处理对应的节点。

在线解析：可以在 [AST explorer](https://astexplorer.net/) 查看 Type 类型，它用的就是 acorn。

使用 acorn-walk 来改写 ast 节点。

```
const visitors = {
    Liternal(){},  // 字面量
    Identifier(){},  // 标识符
    CallExpression(){}, // 调用表达式
    ...
}
```

### Generator

这个过程就是将生成的 AST 重新转换为代码。

遍历每一个节点，按照指定规则，生成对应的字符进行拼接。

工具：[escodegen](https://www.npmjs.com/package/escodegen)

```
const acorn = require('acorn')
const walk = require('acorn-walk')
const escodegen = require('escodegen')
const fs = require('fs')


// 1. code 解析成 AST
const code = `
    const x = 10;
    console.log(x)
`

const ast = acorn.parse(code)

console.log(ast)


// 2. 遍历 ast
walk.simple(ast, {
    Literal(node) {
        console.log(node)
        node.value = 'modified value'
    }
})


// 3. 生成 code
const generateCode = escodegen.generate(ast)

console.log(generateCode)

fs.writeFileSync('./generateCode.js', generateCode)
```

## webpack 中 babel 插件


webpack 中的 babel 使用的解析引擎是 babylon，它是 fork 的 acorn 项目。

因为 babel 是一个工具链，所谓工具链就是 babel 是依赖于它的插件，而其转换过程的操作是需要别的插件来实现的，没有插件的 babel 只是将源码生成 AST，然后通过生成器生成和原来的源码一样的代码（只是多了一些属性，相当于什么也没做）。

### 流程图

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/deaeca509d4940c6bab52dc332ebe9d5~tplv-k3u1fbpfcp-watermark.image?)


- [@babel/parser](https://www.babeljs.cn/docs/babel-parser)：将源码转换为 AST 

- [@babel/traverse](https://www.babeljs.cn/docs/babel-traverse)：遍历 AST，在此进行替换、删除、添加节点

- [@babel/generator](https://www.babeljs.cn/docs/babel-generator)：将 AST 生成源码

- [@babel/types](https://www.babeljs.cn/docs/babel-types)：用于 AST 节点的方法工具库，比如验证、变换等；比如 isIdentifier 验证是否是标识符

- [@babel/core](https://www.babeljs.cn/docs/babel-core)：Babel 的编译器，核心 API 都在这里面，比如 parse、transform 等

可以单独使用，也可以直接使用 @babel/core，它集成了 babel 编译的整体。

使用 @babel/core 修改函数名

```
const babel = require('@babel/core')
const fs = require('fs')

const code = `
   function func() {
    return 'babel-core'
   }
`

// 修改函数名
const transformCode = babel.transform(code, {
    plugins: [
        {
            visitor: {
                Identifier(path) {
                    const { node } = path
                    if (node.name === 'func') {
                        node.name = 'babelCoreFunc'
                    }
                }
            }
        }
    ]
})

console.log(transformCode.code)
```

### webpack 中如何开发自定义 babel 插件

在 Webpack 中自定义 Babel 插件，只需编写一个函数并将其导出。

#### 移除 console

```
module.exports = function ({ types: t }) {
    return {
        visitor: {
            CallExpression(path) {
                const { callee } = path.node
                if (t.isMemberExpression(callee)) {
                    if (t.isIdentifier(callee.object, { name: 'console' })) {
                        path.remove()
                    }
                }
            }
        },
    };
}
```

#### ES5 代码转换为可选链操作符的形式

```
module.exports = function(babel) {
  const { types: t } = babel;

  return {
    visitor: {
      MemberExpression(path) {
        if (!path.node.optional && t.isIdentifier(path.node.property)) {
          const optionalMemberExpression = t.optionalMemberExpression(
            path.node.object,
            path.node.property,
            true,
            true
          );
          path.replaceWith(optionalMemberExpression);
        }
      }
    }
  };
};

```

推荐：[@babel/plugin-transform-optional-chaining](https://babeljs.io/docs/babel-plugin-transform-optional-chaining)