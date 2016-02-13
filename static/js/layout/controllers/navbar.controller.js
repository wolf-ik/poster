(function () {
  'use strict';

  angular
    .module('poster.layout.controllers')
    .controller('NavbarController', NavbarController);

  NavbarController.$inject = ['$scope', 'Authentication', 'Account', 'Snackbar'];

  function NavbarController($scope, Authentication, Account, Snackbar) {
    $scope.isAuthenticated = Authentication.isAuthenticated;
    $scope.account = Authentication.getAuthenticatedAccount();
    $scope.logout = logout;
    $scope.changeTheme = changeTheme;
    $scope.changeLanguage = changeLanguage;
    $scope.themes = ['slate', 'spacelab'];
    $scope.languages = ['en', 'ru'];

    function changeTheme(theme) {
      $scope.account.theme = theme;
      Account.partial_update($scope.account.username, {
        'theme': theme,
      }).then(successUpdateFn, errorUpdateFn);

    }

    function changeLanguage(language) {
      $scope.account.language = language;
      Account.partial_update($scope.account.username, {
        'language': language,
      }).then(successUpdateFn, errorUpdateFn);
    }

    function successUpdateFn(data, status, headers, config) {
      Authentication.setAuthenticatedAccount(data.data);
    }

    function errorUpdateFn(data, status, headers, config) {
      Snackbar.show(JSON.stringify(data.data));
    }

    function logout() {
      Authentication.logout();
    }
  }
})();
