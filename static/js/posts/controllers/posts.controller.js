(function() {
    'use strict';

    angular
        .module('poster.posts.controllers')
        .controller('PostsController', PostsController)

    PostsController.$inject = ['$scope', 'Post', 'Permissions'];

    function PostsController($scope, Post, Permissions) {
        $scope.isAuthenticated = Permissions.isAuthenticated();
        $scope.posts = [];
        $scope.page = 0;
        $scope.scrollDisabled = false;

        $scope.loadMore = loadMore;


        function loadMore() {
            getPosts(++$scope.page);
        }

        function getPosts(page) {
            Post.list({'sort_by': 'all', 'page': page}).then(getSuccessFn, getErrorFn);

            function getSuccessFn(data) {
                $scope.posts = $scope.posts.concat(data.data.results);
            }

            function getErrorFn(data) {
                $scope.scrollDisabled = true;
            }
        }

        activate()

        function activate() {
            getPosts(++$scope.page);
        }
    }
})();
