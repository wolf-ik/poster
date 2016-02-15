(function() {
    'use strict';

    angular
        .module('poster.posts.controllers')
        .controller('PostsDetailController', PostsDetailController)

    PostsDetailController.$inject = ['$scope', 'Post', 'Snackbar', '$stateParams', 'Permissions'];

    function PostsDetailController($scope, Post, Snackbar, $stateParams, Permissions) {
        $scope.isAccountOwnerOrAdmin = false;
        $scope.post = undefined;

        activate()

        function activate() {
            var id = $stateParams.id;

            Post.retrieve(id).then(getSuccessFn, getErrorFn);

            function getSuccessFn(data) {
                $scope.post = data.data;
                $scope.isAccountOwnerOrAdmin = Permissions.isAccountOwnerOrAdmin($scope.post.owner.username);
            }

            function getErrorFn(data) {
                Snackbar.show(JSON.stringify(data.data));
            }
        }
    }
})();