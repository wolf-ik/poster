(function () {
  'use strict';

  angular
    .module('poster.accounts.services')
    .factory('Account', Account);

  Account.$inject = ['$http', 'Authentication'];

  function Account($http, Authentication) {

    var Account = {
      isAccountOwnerOrAdmin: isAccountOwnerOrAdmin,
      destroy: destroy,
      get: get,
      update: update,
    };

    return Account;

    /////////////////////

    function isAccountOwnerOrAdmin(username) {
      if (!Authentication.isAuthenticated()) return false;
      var authUser = Authentication.getAuthenticatedAccount();
      return authUser.username === username || authUser.is_admin
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
  }
})();
