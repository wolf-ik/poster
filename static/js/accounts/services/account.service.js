(function () {
  'use strict';

  angular
    .module('poster.accounts.services')
    .factory('Account', Account);

  Account.$inject = ['$http', 'Authentication'];

  function Account($http, Authentication) {

    var Account = {
      isAccountOwner: isAccountOwner,
      isAccountOwnerOrAdmin: isAccountOwnerOrAdmin,
      destroy: destroy,
      get: get,
      update: update,
      partial_update: partial_update,
    };

    return Account;

    /////////////////////

    function isAccountOwner(username) {
      if (!Authentication.isAuthenticated()) return false;
      return Authentication.getAuthenticatedAccount().username === username;
    }

    function isAccountOwnerOrAdmin(username) {
      return isAccountOwner(username) || Authentication.getAuthenticatedAccount().is_admin;
    }

    function destroy(username) {
      return $http.delete('/api/v1/accounts/' + username + '/');
    }


    function get(username) {
      return $http.get('/api/v1/accounts/' + username + '/');
    }

    function update(username, account) {
      return $http.put('/api/v1/accounts/' + username + '/', account);
    }

    function partial_update(username, account) {
      return $http.patch('/api/v1/accounts/' + username + '/', account);
    }
  }
})();
