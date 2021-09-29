const HtmlWebPackPlugin = require("html-webpack-plugin");

const path = require("path");

module.exports = {
  entry: {
    main: ["./src/js/index.js", "./src/styles/scss/index.scss"],
  },
  output: {
    path: path.join(__dirname, "build"),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: path.resolve(__dirname, "node_modules"),
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.html$/,

        use: [
          {
            loader: "html-loader",
            options: { minimize: true },
          },
        ],
      },
      {
        test: /\.jpg$/,
        use: [{ loader: "url-loader" }],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".scss"],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/static/template.html",
      filename: "./index.html",
      favicon: "./src/static/favicon.ico",
    }),
  ],
};
