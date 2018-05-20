const path = require('path');

function ts_webpack_config(src, out) {
    return {
        entry: [src],
        mode: 'development',
        devtool: 'source-map',
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
            extensions: ['.ts', '.js']
        },
        output: {
            filename: out,
            path: path.resolve(__dirname, 'dist')
        }
    }
}

module.exports = [
    ts_webpack_config('./src/viewer.ts', 'viewer.js'),
    ts_webpack_config('./src/controller.ts', 'controller.js'),
];
