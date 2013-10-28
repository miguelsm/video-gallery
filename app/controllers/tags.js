'use strict';

var mongoose = require('mongoose');
var Tag = mongoose.model('Tag');

/**
 * List of tags
 */
exports.query = function (req, res) {
  Tag.find().sort('name').exec(function (err, tags) {
    if (err) {
      res.send(500);
      console.log(err);
    } else {
      res.json(tags);
    }
  });
};
