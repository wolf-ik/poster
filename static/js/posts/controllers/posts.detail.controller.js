(function() {
    'use strict';

    angular
        .module('poster.posts.controllers')
        .controller('PostsDetailController', PostsDetailController)

    PostsDetailController.$inject = ['Authentication', '$http', '$scope', '$sce', 'Post', 'Snackbar', '$stateParams', '$state', 'Permissions'];

    function PostsDetailController(Authentication, $http, $scope, $sce, Post, Snackbar, $stateParams, $state, Permissions) {
        $scope.sce = $sce;
        $scope.isAuthenticated = Permissions.isAuthenticated();
        $scope.isPostOwnerOrAdmin = false;
        $scope.post = undefined;
        $scope.deletePost = deletePost;
        $scope.setRating = setRating;
        $scope.canPostRating = false;


        function deletePost() {
            Post.destroy($stateParams.id).then(destroySuccessFn, destroyErrorFn)

            function destroySuccessFn(data) {
                $state.go('app');
                Snackbar.show('Deleted.');
            }

            function destroyErrorFn(data) {
                Snackbar.show(data.data);
            }
        }

        function setRating(value) {
            $http.post('/api/v1/ratings/', {
                post_id: $scope.post.id,
                value: value,
            }).then(postSuccessFn, postErrorFn);

            function postSuccessFn(data) {
                var rating = $scope.post.rating;
                var count = $scope.post.ratings_count;
                var newRating = (rating * count + value) / (count + 1);
                $scope.post.rating = newRating;
                $scope.post.ratings_count += 1;
                $scope.canPostRating = false;
            }

            function postErrorFn(data) {
                Snackbar.show(data.data);
            }
        }

        function canPostRating() {
            if (!$scope.isAuthenticated) return false;
            var user_id = Authentication.getAuthenticatedAccount().id;
            var ratings = $scope.post.ratings;
            for (var i in ratings) {
                if (ratings[i].owner == user_id) return false;
            }
            return true;
        }

        function getPostFromId(id) {
            Post.retrieve(id).then(getSuccessFn, getErrorFn);

            function getSuccessFn(data) {
                $scope.post = data.data;
                $scope.isPostOwnerOrAdmin = Permissions.isAccountOwnerOrAdmin($scope.post.owner.username);
                $scope.canPostRating = canPostRating();
            }

            function getErrorFn(data) {
                Snackbar.show(data.data);
            }
        }


        activate()

        function activate() {
            var id = $stateParams.id;

            getPostFromId(id);
        }
    }
})();