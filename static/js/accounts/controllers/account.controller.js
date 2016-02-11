(function () {
  'use strict';

  angular
    .module('poster.accounts.controllers')
    .controller('AccountController', AccountController);

  AccountController.$inject = ['$scope', '$location', '$stateParams', 'Account'];

  function AccountController($scope, $location, $stateParams, Account) {
    $scope.account = undefined;
    $scope.username = $stateParams.username;
    $scope.isAccountOwnerOrAdmin = Account.isAccountOwnerOrAdmin($scope.username);

    activate();

    function activate() {
      //var username = $routeParams.username.substr(1);

      Account.get($scope.username).then(getSuccessFn, getErrorFn);

      function getSuccessFn(data, status, headers, config) {
        $scope.account = data.data;
      }

      function getErrorFn(data, status, headers, config) {
        $location.url('/');
        //Snackbar.error('That user does not exist.');
      }
    }
  }
})();
