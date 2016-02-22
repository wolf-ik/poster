(function () {
  'use strict';

  angular
    .module('poster.layout.controllers')
    .controller('NavbarController', NavbarController);

  NavbarController.$inject = ['$scope', 'Authentication', 'Account', 'Snackbar', '$state'];

  function NavbarController($scope, Authentication, Account, Snackbar, $state) {
    $scope.isAuthenticated = Authentication.isAuthenticated;
    $scope.account = Authentication.getAuthenticatedAccount();
    $scope.themes = ['slate', 'spacelab'];
    $scope.languages = ['en', 'ru'];
    $scope.searchQuery = '';

    $scope.search = search;
    $scope.getTheme = getTheme;
    $scope.getLanguage = getLanguage;
    $scope.changeTheme = changeTheme;
    $scope.changeLanguage = changeLanguage;
    $scope.logout = logout;


    function search() {
      $state.go('app.search', {'query': $scope.searchQuery});
      $scope.searchQuery = '';
    }

    function getTheme() {
      if (!$scope.account) {
        return $scope.themes[0];
      }
      return $scope.account.theme;
    }

    function getLanguage() {
      if (!$scope.account) {
        return $scope.languages[0];
      }
      return $scope.account.language;
    }

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
      Snackbar.show(data.data);
    }

    function logout() {
      Authentication.logout();
    }
  }
})();
