const acorn = require('acorn')
const walk = require('acorn-walk')
const escodegen = require('escodegen')
const fs = require('fs')
const path = require('path')

const code = `
    const x = 10;
    console.log(x)
`

// 1. code 解析成 AST
const ast = acorn.parse(code)

// 2. 遍历 ast
walk.simple(ast, {
    Literal(node) {
        node.value = 'modified value'
    }
})

// 3. 生成 code
const generateCode = escodegen.generate(ast)
console.log(generateCode)
// fs.writeFileSync('./generateCode.js', generateCode)




const folderName = path.resolve(__dirname, 'dist')
if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
}
fs.writeFileSync(path.join(folderName, 'generateCode.js'), generateCode)