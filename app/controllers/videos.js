'use strict';

var mongoose = require('mongoose');
var Video = mongoose.model('Video');
var Tag = mongoose.model('Tag');
var BatchRemove = require('./utils/batch-remove');
var BatchUpdate = require('./utils/batch-update');
var _ = require('lodash');

var saveNewTags = function (video) {
  if (!video.tags) { return; }
  video.tags.forEach(function (newTag) {
    Tag.load(newTag, function (err, tag) {
      if (tag) {
        tag.videos = _.union(tag.videos, video._id);
      } else {
        tag = new Tag({ name: newTag, videos: [video._id], hidden: false });
      }
      tag.save();
    });
  });
};

/**
 * Remove unused tags
 */
var purgeTags = function () {
  var video;
  Tag.find().exec(function (err, tags) {
    tags.forEach(function (tag) {
      video = Video.findOne({ tags: { $all: [tag.name] } }).
        exec(function (err, video) {
          if (!video) { tag.remove(); }
        });
    });
  });
};

/**
 * Find video by id
 */
exports.video = function (req, res, next, id) {
  Video.load(id, function (err, video) {
    if (err) { return next(err); }
    if (!video) { return next(new Error('Failed to load video ' + id)); }
    req.video = video;
    next();
  });
};

/**
 * Get a video
 */
exports.get = function (req, res) {
  res.json(req.video);
};

/**
 * List of videos for website (visible only)
 */
exports.query = function (req, res) {
  Video.find({ hidden: false }).sort('order').exec(function (err, videos) {
    if (err) {
      res.send(500);
      console.log(err);
    } else {
      res.json(videos);
    }
  });
};

/**
 * List of videos for admin panel (incl. hidden)
 */
exports.queryAdmin = function (req, res) {
  Video.find().sort('order').exec(function (err, videos) {
    if (err) {
      res.send(500);
      console.log(err);
    } else {
      res.json(videos);
    }
  });
};

/**
 * List of videos inside a given category
 */
exports.queryCategory = function (req, res) {
  Video.find({ tags: { $all: [ req.params.tag ] }, hidden: false })
    .sort('order')
    .exec(function (err, videos) {
      if (err) {
        res.send(500);
        console.log(err);
      } else {
        res.json(videos);
      }
    });
};

/**
 * Save a video
 */
exports.save = function (req, res) {
  var video = new Video(req.body);
  video.tags.forEach(function (tag) { tag = tag.toLowerCase(); });
  video.save(function (err) {
    if (err) {
      res.send(500);
      console.log(err);
    } else {
      saveNewTags(video);
      res.json(video);
    }
  });
};

/**
 * Update a video
 */
exports.update = function (req, res) {
  var video = req.video;
  video = _.extend(video, req.query);
  video.tags.forEach(function (tag) { tag = tag.toLowerCase(); });
  video.save(function (err) {
    if (err) {
      res.send(500);
      console.log(err);
    } else {
      saveNewTags(video);
      purgeTags();
      res.json(video);
    }
  });
};

/**
 * Delete a video
 */
exports.remove = function (req, res) {
  var video = req.video;
  video.remove(function (err) {
    if (err) {
      res.send(500);
      console.log(err);
    } else {
      purgeTags();
      res.json(video);
    }
  });
};

/**
 * Delete a batch of videos 
 */
exports.batchRemove = function (req, res) {
  var batch = req.query.batch || []; // List of video ids
  batch = typeof batch === 'string' ? [ batch ] : batch;
  var batchRemove = new BatchRemove(Video);
  batchRemove.process(batch).then(function (results) {
    purgeTags();
    res.json({ results: results });
  });
};

/**
 * Update a batch of videos
 */
exports.batchUpdate = function (req, res) {
  var batch = req.body.batch || []; // List of video ids with matching patch
  var batchUpdate = new BatchUpdate(Video);
  batchUpdate.process(batch).then(function (results) {
    res.json({ results: results });
  });
};
