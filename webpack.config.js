const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'src/client');



var config = {
    entry : APP_DIR+ '/index.js',
    output :{
        path :BUILD_DIR,
        filename : 'bundle.js'

    },
    module : {
        rules :[
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test : /\.html$/,
                use : {
                    loader : "html-loader",
                    options : {minimize :true}
                }
            },
            {
                test : /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins :[
        new HtmlWebPackPlugin({
            template : "./src/client/index.html",
            filename : "./index.html"
        })
    ],

    resolve: {
        extensions: ['.js', '.jsx']
    }
};

module.exports = config;