(function () {
  'use strict';

  angular
    .module('poster.posts.services')
    .factory('Post', Post);

  Post.$inject = ['$http'];

  function Post($http) {

    var Post = {
      list: list,
      create: create,
      retrieve: retrieve,
      update: update,
      partial_update: partial_update,
      destroy: destroy,
    };

    return Post;

    /////////////////////

    function list() {
      return $http.get('/api/v1/posts/');
    }

    function create(post) {
      return $http.post('/api/v1/posts/', post);
    }

    function retrieve(id) {
      return $http.get('/api/v1/posts/' + id + '/');
    }

    function update(id, post) {
      return $http.put('/api/v1/posts/' + id + '/', post);
    }

    function partial_update(id, post) {
      return $http.patch('/api/v1/posts/' + id + '/', post);
    }

    function destroy(id) {
      return $http.delete('/api/v1/posts/' + id + '/');
    }
  }
})();
