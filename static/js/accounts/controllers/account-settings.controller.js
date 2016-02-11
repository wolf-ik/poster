
(function () {
  'use strict';

  angular
    .module('poster.accounts.controllers')
    .controller('AccountSettingsController', AccountSettingsController);

  AccountSettingsController.$inject = ['$scope', '$location', '$stateParams', 'Authentication', 'Account'];

  function AccountSettingsController($scope, $location, $stateParams, Authentication, Account) {
    $scope.destroy = destroy;
    $scope.update = update;
    $scope.account = undefined;
    $scope.username = $stateParams.username;

    activate();

    function activate() {
      if (!Account.isAccountOwnerOrAdmin($scope.username)) {
        $location.url('/');
      }

      Account.get($scope.username).then(accountSuccessFn, accountErrorFn);

      function accountSuccessFn(data, status, headers, config) {
        $scope.account = data.data;
      }

      function accountErrorFn(data, status, headers, config) {
        $location.url('/');
        //Snackbar.error('That user does not exist.');
      }
    }

    function destroy() {
      Account.destroy($scope.account.username).then(accountSuccessFn, accountErrorFn);

      function accountSuccessFn(data, status, headers, config) {
        Authentication.unauthenticate();
        window.location = '/';

        //Snackbar.show('Your account has been deleted.');
      }

      function accountErrorFn(data, status, headers, config) {
        //Snackbar.error(data.error);
      }
    }


    function update() {
      Account.update($scope.username, $scope.account).then(accountSuccessFn, accountErrorFn);

      function accountSuccessFn(data, status, headers, config) {
        //Snackbar.show('Your account has been updated.');
      }

      function accountErrorFn(data, status, headers, config) {
        //Snackbar.error(data.error);
      }
    }
  }
})();
