'use strict';

app.controller('VideosCtrl', function ($scope, videos, tags) {

  $scope.videos = videos;
  $scope.tags = tags;
  $scope.filter = { tag: '' };

  $scope.filterFn = function (video) {
    var i = 0;
    var length = video.tags.length;

    if (!$scope.filter.tag || $scope.filter.tag === '') {
      return true;
    }
    // Check if video contains the filter tag
    for (i; i < length; ++i) {
      if ($scope.filter.tag === video.tags[i]) {
        return true;
      }
    }

    return false;
  };

});
