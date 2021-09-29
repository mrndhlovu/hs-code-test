const { merge } = require("webpack-merge");

const shared = require("./webpack.common");

module.exports = merge(shared, {
  mode: "development",
  output: {
    filename: "[name].js",
    hotUpdateChunkFilename: ".hot/[id].hot-update.js",
    hotUpdateMainFilename: ".hot/.hot-update.json",
  },
  module: {
    rules: [
      {
        test: /\.s(a|c)ss$/,
        exclude: /\.module.(s(a|c)ss)$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
          },
        ],
      },
    ],
  },

  devServer: {
    watchFiles: ["./src"],
    port: 1234,
  },
});
