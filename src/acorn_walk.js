const acorn = require('acorn')
const walk = require('acorn-walk')
const fs = require('fs')

const code = fs.readFileSync('./acorn_code.js')

const ast = acorn.parse(code)

walk.simple(ast, {
    // 字面量
    Literal(node) {
        console.log(node)
        node.value = 100
        console.log(node)
    }
})
