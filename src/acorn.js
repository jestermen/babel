const acorn = require('acorn')
const fs = require('fs')

const code = fs.readFileSync('./acorn_code.js')

const ast = acorn.parse(code)

console.log(ast)