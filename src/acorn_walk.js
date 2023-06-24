const acorn = require('acorn')
const walk = require('acorn-walk')
const fs = require('fs')

const code = fs.readFileSync('./acorn_code.js')

const ast = acorn.parse(code)

// console.log(ast)

walk.simple(ast, {
    Literal(node) {
        console.log(node)
        node.value = 100
        console.log(node)
    }
})

// console.dir(ast)