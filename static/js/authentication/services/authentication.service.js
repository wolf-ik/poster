(function () {
  'use strict';

  angular
    .module('poster.authentication.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$cookies', '$http'];

  function Authentication($cookies, $http) {

    var Authentication = {
      getAuthenticatedAccount: getAuthenticatedAccount,
      isAuthenticated: isAuthenticated,
      login: login,
      logout: logout,
      register: register,
      setAuthenticatedAccount: setAuthenticatedAccount,
      unauthenticate: unauthenticate,
    };

    return Authentication;

    ///////////////////

    function getAuthenticatedAccount() {
      if (!$cookies.get("authenticatedAccount")) {
        return;
      }

      return JSON.parse($cookies.get("authenticatedAccount"));
    }


    function isAuthenticated() {
      return !!$cookies.get("authenticatedAccount");
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

    function setAuthenticatedAccount(account) {
      //$cookies.authenticatedAccount = JSON.stringify(account); THIS SHIT DON'T WORKING, HATE THIS
      $cookies.put("authenticatedAccount", JSON.stringify(account));
    }

    function unauthenticate() {
      //delete $cookies.authenticatedAccount;
      $cookies.remove("authenticatedAccount");
    }
  }
})();
