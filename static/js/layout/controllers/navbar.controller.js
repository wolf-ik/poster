(function () {
  'use strict';

  angular
    .module('poster.layout.controllers')
    .controller('NavbarController', NavbarController);

  NavbarController.$inject = ['$scope', 'Authentication'];

  function NavbarController($scope, Authentication) {
    $scope.isAuthenticated = Authentication.isAuthenticated;
    $scope.logout = logout;

    function logout() {
      Authentication.logout();
    }
  }
})();