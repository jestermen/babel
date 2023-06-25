module.exports = function ({ types: t }) {
    return {
        visitor: {
            CallExpression(path) {
                console.log(path)
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

