const webpack = require('webpack');
const path = require('path');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const now = Date.now();
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: [
        '@babel/polyfill', './src/index.js'
    ],
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: 'bundle.js?v=' + now,
        chunkFilename: '[name].js?v=' + now,
        publicPath: '/'
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM'
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
        new MiniCssExtractPlugin(
            {
                filename: 'style.css?v=' + now,
                chunkFilename: '[id].css?v=' + now
            }
        ),
        new HtmlWebpackPlugin(
            {
                title: '#Test',
                template: path.resolve(__dirname, 'public/index.html')

            }
        ),
        new MomentLocalesPlugin(
            {
                localesToKeep: [
                    'es',
                    'fr',
                    'ja',
                    'ko',
                    'vi',
                    'zh-cn'
                ]
            }
        ),
        new CopyWebpackPlugin(
            [
                {
                    from: 'public/images',
                    to: 'images'
                }, {
                    from: 'public/locales',
                    to: 'locales'
                }, {
                    from: 'public/font',
                    to: 'font'
                }, {
                    from: 'public/service-worker.js',
                    to: ''
                }

            ]
        ),
        new webpack.EnvironmentPlugin(['NODE_ENV'])
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin(
                {
                    cache: true,
                    parallel: true,
                    sourceMap: devMode ? true : false
                }
            ),
            new OptimizeCSSAssetsPlugin({})
        ],
        splitChunks: {
            cacheGroups: {
                'vendor-bootstrap': {
                    name: 'vendor-bootstrap',
                    test: /[\\/]node_modules[\\/]bootstrap[\\/]/,
                    chunks: 'initial',
                    priority: 2
                },
                'vendor-moment': {
                    name: 'vendor-moment',
                    test: /[\\/]node_modules[\\/]moment[\\/]/,
                    chunks: 'initial',
                    priority: 2
                },
                'vendor-react': {
                    name: 'vendor-react',
                    test: /[\\/]node_modules[\\/](?!reactstrap)(react.*?)[\\/]/,
                    chunks: 'initial',
                    priority: 2
                },
                'vendor-all': {
                    name: 'vendor-all',
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'initial',
                    priority: 1
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/env']
                }
            },
            {
                enforce: 'pre',
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader, {
                        loader: 'css-loader',
                        options: {
                            sourceMap: devMode ? true : false
                        }
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: devMode ? true : false,
                            plugins: [autoprefixer(
                                    {browsers: ['last 7 versions']}
                                )]
                        }
                    }, {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: devMode ? true : false
                        }
                    }
                ]
            }, {
                test: /\.(jpg|png|gif|svg|ico)$/,
                use: [
                    {
                        loader: 'file-loader'
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: [
            '.js', '.jsx'
        ],
        modules: [
            path.resolve('./src'), path.resolve('./node_modules')
        ],
        plugins: [new DirectoryNamedWebpackPlugin(true)]
    },
    node: {
        fs: 'empty',
        net: 'empty'
    }
};
