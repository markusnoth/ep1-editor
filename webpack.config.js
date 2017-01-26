var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
    entry: {
        app: './src/app.js'
    },
    output: {
        path: 'dist',
        filename: '[name].js'
    },
    resolve: {
        extensions: ['', '.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ]
}

if (process.env.NODE_ENV === 'production') {
    config.plugins = config.plugins.concat([
        new webpack.EnvironmentPlugin(["NODE_ENV"]),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ])
}

module.exports = config