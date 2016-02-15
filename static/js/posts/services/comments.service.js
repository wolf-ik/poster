(function () {
  'use strict';

  angular
    .module('poster.posts.services')
    .factory('Comment', Comment);

  Comment.$inject = ['$http'];

  function Comment($http) {

    var Comment = {
      list: list,
      create: create,
      update: update,
      destroy: destroy,
    };

    return Comment;

    /////////////////////

    function list(id) {
      return $http({
                url: '/api/v1/comments/',
                method: 'GET',
                params: {post_id: id}
            });
    }

    function create(comment) {
      return $http.post('/api/v1/comments/', comment);
    }

    function update(id, comment) {
      return $http.put('/api/v1/comments/' + id + '/', comment);
    }

    function destroy(id) {
      return $http.delete('/api/v1/comments/' + id + '/');
    }
  }
})();
