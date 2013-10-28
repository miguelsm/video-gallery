'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Video Schema
 */
var VideoSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true
  },
  url: {
    type: String,
    default: '',
    trim: true
  },
  youtubeId: {
    type: String,
    default: '',
    trim: true
  },
  info: {
    type: String,
    default: '',
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  hidden: Boolean,
  order: Number
});

/**
 * Validations
 */
VideoSchema.path('title').validate(function(title) {
  return title.length;
}, 'Title cannot be blank');

/**
 * Statics
 */
VideoSchema.statics = {
  load: function(id, cb) {
    this.findOne({
      _id: id
    }).exec(cb);
  }
};

mongoose.model('Video', VideoSchema);
