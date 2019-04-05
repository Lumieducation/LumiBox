const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/boot.tsx',
    mode: 'production',
    devServer: {
        contentBase: './build',
        historyApiFallback: true,
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'client.js',
        path: path.resolve(__dirname, '../../build')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new CopyPlugin([{ from: 'src/assets', to: 'assets' }])
    ]
};
