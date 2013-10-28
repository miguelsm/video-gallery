'use strict';

var app = angular.module('videoGalleryApp', [
  'config',
  'ngRoute',
  'ngResource',
  'ui.bootstrap',
  'decipher.tags',
  'chieffancypants.loadingBar'
]);

app.config(function ($provide, $httpProvider, $routeProvider,
                     cfpLoadingBarProvider) {

  var interceptor = ['$q', '$rootScope', function ($q, $rootScope) {
    return {
      request: function (config) {
        $rootScope.isLoading = true;
        return config || $q.when(config);
      },
      requestError: function (rejection) {
        $rootScope.checkDoneLoading();
        return $q.reject(rejection);
      },
      response: function (response) {
        $rootScope.checkDoneLoading();
        return response || $q.when(response);
      },
      responseError: function (rejection) {
        $rootScope.checkDoneLoading();
        return $q.reject(rejection);
      }
    };
  }];

  $httpProvider.interceptors.push(interceptor);

  cfpLoadingBarProvider.includeSpinner = false;

  $routeProvider
  .when('/admin/videos', {
    templateUrl: 'views/admin-videos.html',
    controller: 'AdminVideosCtrl',
    resolve: {
      tags: ['$q', 'Tags', function ($q, Tags) {
        var deferred = $q.defer();
        Tags.query(function (tags) {
          deferred.resolve(_.map(tags, function (tag) { return tag.name; }));
        });
        return deferred.promise;
      }],
      videos: ['$q', 'Videos', function ($q, Videos) {
        var deferred = $q.defer();
        Videos.queryAdmin(function (videos) {
          deferred.resolve(videos);
        });
        return deferred.promise;
      }]
    }
  })
  .when('/videos', {
    templateUrl: 'views/videos.html',
    controller: 'VideosCtrl',
    resolve: {
      tags: ['$q', 'Tags', function ($q, Tags) {
        var deferred = $q.defer();
        Tags.query(function (tags) {
          deferred.resolve(_.map(tags, function (tag) { return tag.name; }));
        });
        return deferred.promise;
      }],
      videos: ['$q', 'Videos', function ($q, Videos) {
        var deferred = $q.defer();
        Videos.query(function (videos) {
          deferred.resolve(videos);
        });
        return deferred.promise;
      }]
    }
  })
  .when('/videos/category/:tag', {
    templateUrl: 'views/videos.html',
    controller: 'VideosCtrl',
    resolve: {
      tags: function () { return []; },
      videos: ['$q', '$route', 'Videos', function ($q, $route, Videos) {
        var deferred = $q.defer();
        Videos.queryCategory(
          { tag: $route.current.params.tag },
          function (videos) {
            deferred.resolve(videos);
          });
        return deferred.promise;
      }]
    }
  })
  .otherwise({
    redirectTo: '/'
  });

});

app.run(function ($rootScope, $http) {
  $rootScope.checkDoneLoading = function () {
    this.isLoading = $http.pendingRequests.length > 0;
  };
});
