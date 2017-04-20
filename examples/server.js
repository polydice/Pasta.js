/* eslint-disable no-console, no-var */

var fs = require('fs');
var path = require('path');
var express = require('express');
var rewrite = require('express-urlrewrite');
var bodyParser = require('body-parser');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var WebpackConfig = require('./webpack.config');

var app = express();

app.use(webpackDevMiddleware(webpack(WebpackConfig), {
  publicPath: '/__build__/',
  stats: {
    colors: true,
  },
}));

fs.readdirSync(__dirname).forEach(function (file) {
  if (fs.statSync(path.join(__dirname, file)).isDirectory()) {
    app.use(rewrite('/' + file + '/*', '/' + file + '/index.html'));
  }
});

app.use(express.static(__dirname));
app.use(bodyParser.text());
app.use(function(req, res, next) {
  if(req.method.toLowerCase() === 'post') {
    console.log(req.body);
    res.status(200).send({ ok: true });
  }
});

app.listen(8000, function () {
  console.log('Server listening on http://localhost:8000, Ctrl+C to stop');
});
