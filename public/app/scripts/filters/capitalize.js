'use strict';

app.filter('capitalize', function () {
  return function (input) {
    return input.charAt(0).toUpperCase() +
      input.substring(1).toLowerCase().replace(/-/g, ' ');
  };
});
