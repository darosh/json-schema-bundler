/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

var path = require('path');


var babelOptions = {
    "presets": [
        [
            "es2015",
            {
                "modules": false
            }
        ],
        "es2016"
    ]
};

module.exports = {
    cache: true,
    entry: {
        main: './src/schema.ts'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'schema-bundler.js',
        chunkFilename: '[chunkhash].js',
        library: 'schemaBundler',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                options: {/* Loader options go here */}
            },
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: babelOptions
                    },
                    {
                        loader: 'ts-loader'
                    }
                ]
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: babelOptions
                    }
                ]
            }
        ]
    },
    plugins: [],
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
};