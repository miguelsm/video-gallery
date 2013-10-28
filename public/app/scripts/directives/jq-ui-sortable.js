'use strict';

app.directive('jqUiSortable', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var opts = scope.$eval(attrs.jqUiSortable);
      element.sortable(opts);
    }
  };
});
