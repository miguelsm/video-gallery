'use strict';

app.factory('Videos', function ($resource, API) {
  var url = API + '/videos/:id';

  return $resource(url, { id: '@_id', tag: '@tag' }, {
    queryAdmin: {
      method: 'GET',
      url: url + '/admin-videos',
      isArray: true
    },
    queryCategory: {
      method: 'GET',
      url: url + '/category/:tag',
      isArray: true
    },
    update: {
      method: 'PUT'
    },
    batchUpdate: {
      params: { batch: [] },
      method: 'POST',
      url: url + '/batch-update'
    },
    batchRemove: {
      params: { batch: [] },
      method: 'DELETE'
    }
  });
});
