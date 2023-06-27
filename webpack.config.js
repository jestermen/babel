const path = require('path')
const removeConsole = require('./src/babel-plugin/removeConsole')
const chainingPlugin = require('./src/babel-plugin/chainingPlugin')

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            removeConsole, 
                            // chainingPlugin
                        ]
                    }
                }
            }
        ]
    }
}