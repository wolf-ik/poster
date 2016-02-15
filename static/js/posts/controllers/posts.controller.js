(function() {
    'use strict';

    angular
        .module('poster.posts.controllers')
        .controller('PostsController', PostsController)

    PostsController.$inject = ['$scope', 'Post', 'Snackbar', 'Permissions'];

    function PostsController($scope, Post, Snackbar, Permissions) {
        $scope.isAuthenticated = Permissions.isAuthenticated();
        $scope.posts = [];

        activate()

        function activate() {
            Post.list().then(getSuccessFn, getErrorFn)

            function getSuccessFn(data) {
                $scope.posts = data.data;
            }

            function getErrorFn(data) {
                Snackbar.show(JSON.stringify(data.data));
            }
        }
    }
})();