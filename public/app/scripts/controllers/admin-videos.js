'use strict';

app.controller('AdminVideosCtrl',
               function ($rootScope, $scope, $window, $q, $modal, Videos,
                         videos, tags) {

  $scope.videos = videos;
  $scope.tags = tags;
  $scope.selection = [];
  $scope.filter = { title: '', tags: [] };

  /**
   * Filter
   */
  $scope.filterFn = function (video) {
    var i;
    var titlePass = video.title.toLowerCase().indexOf(
                      $scope.filter.title.toLowerCase()) > -1;
    // Check if any tag is selected
    if ($scope.filter.tags.length === 0) {
      return titlePass;
    }
    // Check if video contains any selected tags
    for (i = 0; i < video.tags.length; ++i) {
      if ($scope.filter.tags.indexOf(video.tags[i]) > -1) {
        return titlePass;
      }
    }
    return false;
  };

  /**
   * Video actions
   */
  $scope.select = function (video) {
    video.selected = !video.selected;
    if (!video.selected) {
      _.pull($scope.selection, video);
      return;
    }
    $scope.selection.push(video);
  };

  $scope.selectAll = function () {
    $scope.selection = [];
    $scope.videos.forEach(function (video) {
      video.selected = true;
      $scope.selection.push(video);
    });
  };

  $scope.deselectAll = function () {
    $scope.selection.forEach(function (video) { video.selected = false; });
    $scope.selection = [];
  };

  // Create video editing modal window
  function openEditModal(video) {
    return $modal.open({
      templateUrl: '/views/edit-video.html',
      controller: 'EditVideoCtrl',
      backdrop: 'static',
      resolve: {
        tags: function () { return $scope.tags; },
        video: function () { return angular.copy(video); }
      }
    });
  }

  $scope.add = function () {
    var firstVideo = $scope.videos[0];
    var video = {
      title: 'New Video',
      tags: [],
      hidden: false,
      order: firstVideo ? firstVideo.order - 1 : 0
    };
    var modal = openEditModal(video);
    modal.result.then(function (newVideo) {
      if (newVideo) {
        $rootScope.isSaving = true;
        Videos.save(newVideo, function (video) {
          $scope.videos.unshift(video);
          $scope.tags = _.union($scope.tags, video.tags);
          $rootScope.isSaving = false;
        });
      }
    });
  };

  $scope.edit = function (video) {
    var modal = openEditModal(video);
    modal.result.then(function (editedVideo) {
      if (editedVideo) {
        $rootScope.isSaving = true;
        video.$update(editedVideo, function (response) {
          _.extend(video, response);
          $scope.tags = _.union($scope.tags, video.tags);
          $rootScope.isSaving = false;
        });
      }
    });
  };

  $scope.hide = function (video, hidden) {
    $rootScope.isSaving = true;
    video.$update({ hidden: hidden }, function (response) {
      _.extend(video, response);
      $rootScope.isSaving = false;
    });
  };

  $scope.hideSelected = function (hidden) {
    var batch = [];
    $scope.selection.forEach(function (video) {
      batch.push({
        id: video._id,
        patch: { hidden: hidden }
      });
    });
    $scope.batchUpdate(batch);
  };

  $scope.remove = function (video) {
    $rootScope.isDeleting = true;
    video.$remove(function () {
      _.pull($scope.selection, video);
      _.pull($scope.videos, video);
      $rootScope.isDeleting = false;
    });
  };

  $scope.removeSelected = function () {
    $rootScope.isDeleting = true;
    Videos.batchRemove(
      { batch: _.pluck($scope.selection, '_id') },
      function (response) {
        var results = response.results || [];
        results.forEach(function (result, index) {
          if (result === 200) {
            _.pull($scope.videos, $scope.selection[index]);
          }
        });
        $scope.selection.length = 0;
        $rootScope.isDeleting = false;
      });
  };

  // Set properties for a batch of videos
  $scope.batchUpdate = function (batch) {
    var deferred = $q.defer();
    $rootScope.isSaving = true;
    batch = Array.isArray(batch) ? batch : [];
    Videos.batchUpdate(
      { batch: batch },
      function (response) {
        var results = response.results || [];
        var video;
        batch.forEach(function (item, i) {
          if (results[i] === 200) {
            video = _.findWhere($scope.videos, { _id: item.id });
            if (typeof video !== 'undefined') { _.extend(video, item.patch); }
          }
        });
      }
    ).$promise.then(function () {
      $rootScope.isSaving = false;
      deferred.resolve();
    });
    return deferred.promise;
  };

  $scope.sort = function (e, ui) {
    var parent = ui.item.parent();
    var batch = [];
    var orderChanged = false;
    var id, video, aux, j;
    parent.sortable('disable');

    parent.children().each(function (i, elem) {
      // Sort videos array
      id = angular.element(elem).data('id');
      video = _.findWhere($scope.videos, { _id: id });
      j = $scope.videos.indexOf(video);
      orderChanged = orderChanged || i !== j;
      if (orderChanged) {
        aux = $scope.videos[i];
        $scope.videos[i] = video;
        $scope.videos[j] = aux;
        // Add video to to-be-updated batch
        batch.push({
          id: video._id,
          patch: { order: i }
        });
      }
    });

    if (orderChanged) {
      // Update videos order
      $scope.batchUpdate(batch).then(function () {
        parent.sortable('enable');
      });
    } else {
      parent.sortable('enable');
    }
  };

  $scope.preview = function () {
    $window.open('/#/videos');
  };

});
