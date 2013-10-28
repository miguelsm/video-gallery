'use strict';

app.factory('Tags', function ($resource, API) {
  var url = API + '/tags';
  return $resource(url, {}, {});
});
