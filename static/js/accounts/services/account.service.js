(function () {
  'use strict';

  angular
    .module('poster.accounts.services')
    .factory('Account', Account);

  Account.$inject = ['$http'];

  function Account($http) {

    var Account = {
      retrieve: retrieve,
      update: update,
      partial_update: partial_update,
      destroy: destroy,
    };

    return Account;

    /////////////////////

    function retrieve(username) {
      return $http.get('/api/v1/accounts/' + username + '/');
    }

    function update(username, account) {
      return $http.put('/api/v1/accounts/' + username + '/', account);
    }

    function partial_update(username, account) {
      return $http.patch('/api/v1/accounts/' + username + '/', account);
    }

    function destroy(username) {
      return $http.delete('/api/v1/accounts/' + username + '/');
    }
  }
})();
