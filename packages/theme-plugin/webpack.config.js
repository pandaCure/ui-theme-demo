const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Theme = require("./theme");
module.exports = {
  mode: "development",
  entry: "./index.js",
  output: {
    path: path.join(process.cwd(), "dist"),
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 4,
              modules: {
                mode: "icss",
              },
              import: {
                filter: (url) => {
                  console.log("----->", url);
                  return true;
                },
              },
            },
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              postcssOptions: {
                ident: "postcss",
              },
            },
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
                modifyVars: {
                  "@prefix": "ve-o",
                },
              },
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin(), new MiniCssExtractPlugin(), new Theme()],
  devtool: "source-map",
};
