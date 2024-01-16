const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackPartialsPlugin = require('html-webpack-partials-plugin');

const path = require('path');
const pages = ["index"];


module.exports = {
  mode: 'development',
  entry: pages.reduce((config, page) => {

    config[page] = `./src/index.js`;
    return config;
    }, {}),
    
  output: {
    path: path.resolve(__dirname, './www'),
    filename: 'js/bundle-[contenthash].js',
    clean: true,
    assetModuleFilename: 'assets/[name][ext]'
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, './www')
    },
    port: 8000,
    open: true,
    hot: true,
    compress: true
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg|jpeg|pdf|glb|gltf)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          { loader: "style-loader"},
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
            },
          },
          { loader: "css-loader" },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
  plugins: [
    /* this is for the css bundle */
    new MiniCssExtractPlugin({
      filename: "css/bundle.css"
    }),
    /* this is the Header partial include */
    new HtmlWebpackPartialsPlugin({
      path: './src/inc/header.html',
      location: 'header',
    }),
  ].concat( /* this is for the html 'template' bundle */
    pages.map(
      (page) =>
        new HtmlWebpackPlugin({
          inject: true,
          template: `./src/template.html`,
          filename: `${page}.html`,
          chunks: [page],
          inject: 'head',
          title:['clear-components Demo - ' + page],
        
        })
    )
  ),
  
};


