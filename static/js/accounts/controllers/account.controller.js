(function () {
  'use strict';

  angular
    .module('poster.accounts.controllers')
    .controller('AccountController', AccountController);

  AccountController.$inject = ['$scope', '$location', '$stateParams', 'Account', 'Snackbar'];

  function AccountController($scope, $location, $stateParams, Account, Snackbar) {
    $scope.account = undefined;
    $scope.username = $stateParams.username;
    $scope.isAccountOwnerOrAdmin = Account.isAccountOwnerOrAdmin($scope.username);

    activate();

    function activate() {

      Account.get($scope.username).then(getSuccessFn, getErrorFn);

      function getSuccessFn(data, status, headers, config) {
        $scope.account = data.data;
      }

      function getErrorFn(data, status, headers, config) {
        $location.url('/');
        Snackbar.show('That user does not exist.');
        //Snackbar.show(data.data.detail);
      }
    }
  }
})();
