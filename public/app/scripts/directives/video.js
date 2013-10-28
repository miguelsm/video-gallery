'use strict';

app.directive('video', function() {
  return {
    restrict: 'A',
    scope: {
      video: '=',
      playButton: '=',
      disablePlay: '='
    },
    link: function (scope, element) {

      scope.$watch('video', function () {
        element.html('<img src="http://i.ytimg.com/vi/' + scope.video +
                     '/hqdefault.jpg" class="thumb"/>');

        if (scope.disablePlay) { return; }

        var playButton = angular.element('<div/>');
        playButton.addClass(scope.playButton);
        element.append(playButton);

        element.on('click', function() {
          var iframe = angular.element('<iframe/>');

          iframe.attr({
            src: 'https://www.youtube.com/embed/' + scope.video +
                 '?autoplay=1&autohide=1&border=0&wmode=opaque&enablejsapi=1&fs=1',
            frameborder: 0,
            allowfullscreen: 1
          })
          .height(element.height())
          .width(element.width());

          element.html(iframe).fitVids();
          iframe.css({ width: '100%', height: '100%' });
        });
      });
    }
  };
});
