(function () {
  'use static';

  angular
    .module('poster.authentication.controllers')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$location', '$scope', 'Authentication', '$auth', 'Snackbar'];

  function LoginController($location, $scope, Authentication, $auth, Snackbar) {
    var vm = this;

    vm.login = login;
    vm.oauthLogin = function(provider) {
      $auth.authenticate(provider).then(oauthSuccessFn, oauthErrorFn);

      function oauthSuccessFn(data) {
        Authentication.setAuthenticatedAccount(data.data);
        window.location = '/';
      }
      function oauthErrorFn(data) {
        Snackbar.show(data.data);
      }
    }

    activate();

    function activate() {
      // If the user is authenticated, they should not be here.
      if (Authentication.isAuthenticated()) {
        $location.url('/');
      }
    }

    function login() {
      Authentication.login(vm.email, vm.password);
    }
  }
})();
