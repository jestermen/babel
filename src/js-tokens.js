const jsTokens = require('js-tokens')

const code = 'const num = x + 1'

// 返回的是一个 Generator 对象
const tokens = jsTokens(code)

console.log(Array.from(tokens))