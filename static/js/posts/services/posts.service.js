(function () {
  'use strict';

  angular
    .module('poster.posts.services')
    .factory('Post', Post);

  Post.$inject = ['$http', 'Snackbar'];

  function Post($http, Snackbar) {

    var Post = {
      list: list,
      create: create,
      retrieve: retrieve,
      update: update,
      partial_update: partial_update,
      destroy: destroy,
      loadTagList: loadTagList,
    };

    return Post;

    /////////////////////

    function list(params) {
      return $http({
        url: '/api/v1/posts/',
        method: 'GET',
        params: params,
      });
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

    function loadTagList(tagList) {
      $http.get('/api/v1/tags/').then(getSuccessFn, getErrorFn);

      function getSuccessFn(data) {
        for (var i in data.data) {
          tagList.push(data.data[i]);
        }
      }

      function getErrorFn(data) {
        Snackbar.show(JSON.stringify(data.data));
      }
    }
  }
})();
