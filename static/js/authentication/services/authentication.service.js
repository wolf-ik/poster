(function () {
  'use strict';

  angular
    .module('poster.authentication.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$http', '$rootScope', '$state'];

  function Authentication($http, $rootScope, $state) {

    var Authentication = {
      getAuthenticatedAccountFromServer: getAuthenticatedAccountFromServer,
      getAuthenticatedAccount: getAuthenticatedAccount,
      isAuthenticated: isAuthenticated,
      setAuthenticatedAccount: setAuthenticatedAccount,
      unauthenticate: unauthenticate,
      login: login,
      logout: logout,
      register: register,
    };

    return Authentication;

    ///////////////////

    function getAuthenticatedAccountFromServer() {
      $http.get('/api/v1/auth/session/').then(sessionSuccessFn, sessionErrorFn);

      function sessionSuccessFn(data, status, headers, config) {
        setAuthenticatedAccount(data.data)
        $state.go('app');
      }

      function sessionErrorFn(data, status, headers, config) {
        setAuthenticatedAccount(null)
      }
    }

    function getAuthenticatedAccount() {
      //if (!$cookies.get("authenticatedAccount")) {
      //  return;
      //}
      //
      //return JSON.parse($cookies.get("authenticatedAccount"));
      return $rootScope.user;
    }


    function isAuthenticated() {
      //return !!$cookies.get("authenticatedAccount");
      return !!$rootScope.user;
    }

    function setAuthenticatedAccount(account) {
      //$cookies.authenticatedAccount = JSON.stringify(account); THIS SHIT DON'T WORKING, HATE THIS
      //$cookies.put("authenticatedAccount", JSON.stringify(account));
      $rootScope.user = account;
    }

    function unauthenticate() {
      //delete $cookies.authenticatedAccount;
      //$cookies.remove("authenticatedAccount");
      $rootScope.user = null;
    }

    function login(email, password) {
      return $http.post('/api/v1/auth/login/', {
        email: email, password: password
      }).then(loginSuccessFn, loginErrorFn);

      function loginSuccessFn(data, status, headers, config) {
        Authentication.setAuthenticatedAccount(data.data);

        window.location = '/';
      }

      function loginErrorFn(data, status, headers, config) {
        $.snackbar({
          'content': data.data.message
        });
      }
    }

    function logout() {
      return $http.post('/api/v1/auth/logout/')
        .then(logoutSuccessFn, logoutErrorFn);

      function logoutSuccessFn(data, status, headers, config) {
        Authentication.unauthenticate();

        window.location = '/';
      }

      function logoutErrorFn(data, status, headers, config) {
        $.snackbar({
          'content': data.data.detail
        });
      }
    }


    function register(email, password, username) {
      return $http.post('/api/v1/accounts/', {
        username: username,
        password: password,
        email: email
      }).then(registerSuccessFn, registerErrorFn);

      function registerSuccessFn(data, status, headers, config) {
        Authentication.login(email, password);
      }

      function registerErrorFn(data, status, headers, config) {
        $.snackbar({
          'content': data.data.message
        });
      }
    }
  }
})();
