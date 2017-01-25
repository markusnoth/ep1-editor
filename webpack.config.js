module.exports = {
    entry: {
        app: './src/app.js'
    },
    output: {
        path: 'assets',
        publicPath: 'assets',
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
    }
}