
(function () {
  'use strict';

  angular
    .module('poster.accounts.controllers')
    .controller('AccountSettingsController', AccountSettingsController);

  AccountSettingsController.$inject = ['$scope', '$location', '$stateParams', 'Authentication', 'Account',
                                      'Snackbar'];

  function AccountSettingsController($scope, $location, $stateParams, Authentication, Account, Snackbar) {
    $scope.destroy = destroy;
    $scope.update = update;
    $scope.account = undefined;
    $scope.username = $stateParams.username;

    activate();

    function activate() {
      if (!Account.isAccountOwnerOrAdmin($scope.username)) {
        $location.url('/');
        Snackbar.show("Permission denied");
      }

      Account.get($scope.username).then(accountSuccessFn, accountErrorFn);

      function accountSuccessFn(data, status, headers, config) {
        $scope.account = data.data;
      }

      function accountErrorFn(data, status, headers, config) {
        $location.url('/');
        Snackbar.show('That user does not exist.');
      }
    }

    function destroy() {
      Snackbar.show('tipo destroy');
      //Account.destroy($scope.account.username).then(accountSuccessFn, accountErrorFn);
      //
      //function accountSuccessFn(data, status, headers, config) {
      //  Authentication.unauthenticate();
      //  window.location = '/';
      //
      //  Snackbar.show('Account has been deleted.');
      //}
      //
      //function accountErrorFn(data, status, headers, config) {
      //  Snackbar.show(data.error);
      //}
    }


    function update() {
      Account.update($scope.username, $scope.account).then(accountSuccessFn, accountErrorFn);

      function accountSuccessFn(data, status, headers, config) {
        Snackbar.show('Account has been updated.');
      }

      function accountErrorFn(data, status, headers, config) {
        Snackbar.show(JSON.stringify(data.data));
      }
    }
  }
})();
