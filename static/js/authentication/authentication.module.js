(function () {
  'use strict';

  angular
    .module('poster.authentication', [
      'poster.authentication.controllers',
      'poster.authentication.services'
    ]);

  angular
    .module('poster.authentication.controllers', []);

  angular
    .module('poster.authentication.services', ['ngCookies']);
})();
