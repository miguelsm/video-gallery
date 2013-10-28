'use strict';

module.exports = function(app) {
  // Tag Routes
  var tags = require('../controllers/tags');

  app.get('/tags', tags.query);

  // Video Routes
  var videos = require('../controllers/videos');

  app.get('/videos', videos.query);
  app.get('/videos/category/:tag', videos.queryCategory);
  app.get('/videos/admin-videos', videos.queryAdmin);
  app.post('/videos', videos.save);
  app.del('/videos', videos.batchRemove);
  app.post('/videos/batch-update', videos.batchUpdate);
  app.get('/videos/:videoId', videos.get);
  app.put('/videos/:videoId', videos.update);
  app.del('/videos/:videoId', videos.remove);

  app.param('videoId', videos.video);
};
