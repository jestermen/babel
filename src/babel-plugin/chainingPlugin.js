module.exports = function (babel) {
    const { types: t } = babel;

    return {
        visitor: {
            MemberExpression(path) {
                const { node } = path
                // 不是可选链式且是一个标识符
                if (!node.optional && t.isIdentifier(node.property)) {
                    // 创建一个可选链式调用的 ast 节点
                    const optionalMemberExpression = t.optionalMemberExpression(
                        node.object,
                        node.property,
                        true,
                        true
                    );
                    // 替换对应节点
                    path.replaceWith(optionalMemberExpression);
                }
            }
        }
    };
};