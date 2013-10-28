'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Tag Schema
 */
var TagSchema = new Schema({
  name: {
    type: String,
    default: '',
    trim: true
  },
  videos: {
    type: [String],
    default: []
  },
  hidden: Boolean
});

/**
 * Validations
 */
TagSchema.path('name').validate(function(name) {
  return name.length;
}, 'Name cannot be blank');

/**
 * Statics
 */
TagSchema.statics = {
  load: function(name, cb) {
    this.findOne({
      name: name
    }).exec(cb);
  }
};

mongoose.model('Tag', TagSchema);
