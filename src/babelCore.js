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


// fs.writeFileSync('./dist/babelCoreTransform.js', transformCode.code)