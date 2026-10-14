const path = require('node:path');

module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devtool: 'cheap-module-source-map',
    entry: {
        l10n: './src/index.js',
        supportedLocales: './src/supported-locales.js',
        localeData: './src/locale-data.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            include: path.resolve(__dirname, 'src'),
            loader: 'builtin:swc-loader',
            options: {
                env: {
                    targets: ['last 3 versions', 'Safari >= 8', 'iOS >= 8']
                }
            },
            type: 'javascript/auto'
        }]
    },
    output: {
        clean: true,
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: {
            type: 'commonjs2'
        }
    }
};
