'use strict';

app.controller('EditVideoCtrl',

function ($scope, $modalInstance, tags, video) {

  $scope.tags = tags;
  $scope.video = video;

  $scope.ok = function () {

    $scope.video.youtubeId = getYoutubeId($scope.video.url);
    $scope.video.tags = _.map($scope.video.tags, function (tag) {
      return tag.toLowerCase();
    });
    $scope.video.tags = _.sortBy(_.uniq($scope.video.tags));

    $modalInstance.close($scope.video);
  };

  $scope.cancel = function () { $modalInstance.close(); };

  /**
   * Retrieve youtube video id from video url
   */
  function getYoutubeId(url) {
    url = url || '';

    var matches = url.match(/.*?youtu.be\/([^\/]+)\/*/i);
    if (matches) {
      return matches[1];
    }

    matches = url.match(/.*?youtube\.com\/watch\?v=([^\/]+)\/*.*/i);
    if (matches) {
      return matches[1];
    }

    return '';
  }

});
