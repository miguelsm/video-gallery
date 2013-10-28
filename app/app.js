'use strict';

var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var config = require('./config/config');

// Bootstrap db connection
mongoose.connect(config.db);

// Bootstrap models
var walk = function (path) {
  fs.readdirSync(path).forEach(function(file) {
    var newPath = path + '/' + file;
    var stat = fs.statSync(newPath);
    if (stat.isFile()) {
      if (/(.*)\.(js|coffee)/.test(file)) {
        require(newPath);
      }
    } else if (stat.isDirectory()) {
      walk(newPath);
    }
  });
};

walk(__dirname + '/models');

var app = express();

// Express settings
require('./config/express')(app);

// Bootstrap routes
require('./config/routes')(app);

// Start the app by listening on <port>
var port = config.port;
app.listen(port);
console.log('Express app started on port ' + port);
