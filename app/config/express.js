'use strict';

var config = require('./config');
var express = require('express');

module.exports = function(app) {
  app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    // Allow origin
    app.use(function (req, res, next) {
      res.header('access-control-allow-origin', config.allowOrigin);
      res.header('access-control-allow-methods',
                 'get,put,post,delete,GET,PUT,POST,DELETE');
      res.header('access-control-allow-headers',
                 'content-type, authorization, x-requested-with');

      if (['OPTIONS', 'options'].indexOf(req.method) > -1) {
        res.send(200);
      } else {
        next();
      }
    });

    // routes should be at the last
    app.use(app.router);
  });
};
