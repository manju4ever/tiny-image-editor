let HtmlWebpackPlugin = require('html-webpack-plugin');
let WebpackCleanupPlugin = require('webpack-cleanup-plugin');

module.exports = {
    
    mode: 'none', //Defaults to production - Remove this for production builds

    entry: __dirname + "/src/index.js",
    output: {
        path: __dirname + "/dist",
        filename: "bundle-[hash].js",
    },
    devtool: 'eval',  // Remove this for production builds
    devServer: {
        contentBase: __dirname + "/dist",
        port: 8081,
        inline: true,
        hot: true,
        historyApiFallback: true, //Support SPA routes e.g: react-router
    },
    module: {
        rules: [
            { 
                test: /\.jsx?$/, 
                use: 'babel-loader', 
                exclude: ["/node_modules/"] 
            },
            { 
                test: /\.css?$/, 
                use: [
                    'style-loader', //Ability for webpack to bundle css files
                    {
                        loader: 'css-loader', //Resolve @import and url() in css properly
                        options: {
                            modules: true,  //Use CSS like modules
                            importLoaders: 1, //Number of loaders to run before css-loader
                        }
                    },
                    'postcss-loader', //Use Future CSS today - picks configuration from postcss.config.js
                ],
            },
        ]
    },
    plugins:[
        new WebpackCleanupPlugin(), //Cleanup old files in output.path and create new files everytime
        new HtmlWebpackPlugin({
            title: 'Next Big Thing 🎉',
            template: __dirname + "/src/index.tpl.html",
            filename: "index.html",
        }),
    ],
};