(function () {
  'use strict';

  angular
    .module('poster.posts.services')
    .factory('Like', Like);

  Like.$inject = ['$http', 'Authentication', 'Snackbar'];

  function Like($http, Authentication, Snackbar) {

    var Like = {
        showLike: showLike,
        like: like,
        unlike: unlike,
    };

    return Like;

    /////////////////////

      function findLikeIndexFromUserId(likes, user_id){
        for (var i = 0; i < likes.length; i++) {
          if (likes[i].owner == user_id) return i;
        }
        return -1;
      }

      function showLike(likes) {
        if (!Authentication.isAuthenticated()) return false;
        var user_id = Authentication.getAuthenticatedAccount().id;
        if (findLikeIndexFromUserId(likes, user_id) == -1) return true;
        return false;
      }

      function like(likes, comment_id) {
        $http.post('/api/v1/likes/', {
          comment_id: comment_id,
        }).then(likeSuccessFn, likeErrorFn);

        function likeSuccessFn(data) {
          likes.push(data.data);
        }

        function likeErrorFn(data) {
          Snackbar.show(JSON.stringify(data.data));
        }
      }

      function unlike(likes) {
        var user_id = Authentication.getAuthenticatedAccount().id;
        var likeIndex = findLikeIndexFromUserId(likes, user_id);
        $http.delete('/api/v1/likes/' + likes[likeIndex].id + '/').then(deleteSuccessFn, deleteErrorFn);

        function deleteSuccessFn(data) {
          likes.splice(likeIndex, 1);
        }

        function deleteErrorFn(data) {
          Snackbar.show(JSON.stringify(data.data));
        }
      }

  }
})();
