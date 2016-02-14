(function () {
  'use strict';

  angular
    .module('poster.authentication.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$http', '$cookies', 'Snackbar'];

  function Authentication($http, $cookies, Snackbar) {

    var Authentication = {
      //getAuthenticatedAccountFromServer: getAuthenticatedAccountFromServer,
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

    //function getAuthenticatedAccountFromServer() {
    //  $http.get('/api/v1/auth/session/').then(sessionSuccessFn, sessionErrorFn);
    //
    //  function sessionSuccessFn(data, status, headers, config) {
    //    setAuthenticatedAccount(data.data)
    //  }
    //
    //  function sessionErrorFn(data, status, headers, config) {
    //    setAuthenticatedAccount(null)
    //  }
    //}

    function getAuthenticatedAccount() {
      if (!$cookies.get("authenticatedAccount")) {
        return;
      }

      return JSON.parse($cookies.get("authenticatedAccount"));


      //var bytes  = CryptoJS.AES.decrypt(raw, 'mySuperSecretKey', {iv: 'aabbaabbaabbaabb'});
      //var info = bytes.toString(CryptoJS.enc.Utf8);
      //var bytes = Crypto.SHA256.decrypt(raw);
      //var info = bytes.toString(CryptoJS.enc.Utf8);
      //console.log('raw: ' + raw);
      //console.log('bytes: ' + info);
      //return JSON.parse(info);

      //var raw = $cookies.get("authenticatedAccount");
      //var key = CryptoJS.enc.Hex.parse('01ab38d5e05c92aa098921d9d4626107133c7e2ab0e4849558921ebcc242bcb0');
      //var iv = CryptoJS.enc.Hex.parse('45654326565437624565432656543762');
      //
      //var cipher = CryptoJS.lib.CipherParams.create({
      //      ciphertext: CryptoJS.enc.Base64.parse(raw)})
      //
      //var res = CryptoJS.AES.decrypt(cipher, key, {iv: iv, mode: CryptoJS.mode.CFB});
      //return JSON.parse(res);
    }


    function isAuthenticated() {
      return !!$cookies.get("authenticatedAccount");
      //return !!$rootScope.user;
    }

    function setAuthenticatedAccount(account) {
      //$cookies.authenticatedAccount = JSON.stringify(account); THIS SHIT DON'T WORKING, HATE THIS
      $cookies.put("authenticatedAccount", JSON.stringify(account));
      // $rootScope.user = account;
    }

    function unauthenticate() {
      //delete $cookies.authenticatedAccount;
      $cookies.remove("authenticatedAccount");
      //$rootScope.user = null;
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
        Snackbar.show(data.data.message);
        //$.snackbar({
        //  'content': data.data.message
        //});
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
        Snackbar.show(data.data.detail);
        //$.snackbar({
        //  'content': data.data.detail
        //});
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
        Snackbar.show(data.data.message);
        //$.snackbar({
        //  'content': data.data.message
        //});
      }
    }
  }
})();
