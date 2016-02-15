(function() {
    'use strict';

    angular
        .module('poster.posts.controllers')
        .controller('PostsEditController', PostsEditController)

    PostsEditController.$inject = ['$scope', 'Post', 'Snackbar', '$state', '$stateParams', 'Permissions'];

    function PostsEditController($scope, Post, Snackbar, $state, $stateParams, Permissions) {
        $scope.post = undefined;
        $scope.save = save;

        function save() {
            Post.update($scope.post.id, $scope.post).then(putSuccessFn, putErrorFn);

            function putSuccessFn(data) {
                $state.go('app.home');
                Snackbar.show('Saved');

            }

            function putErrorFn(data) {
                Snackbar.show(JSON.stringify(data.data))
            }
        }


        activate()

        function activate() {
            var id = $stateParams.id;

            Post.retrieve(id).then(getSuccessFn, getErrorFn);

            function getSuccessFn(data) {
                $scope.post = data.data;
                if (!Permissions.isAccountOwnerOrAdmin($scope.post.owner.username)) {
                    $state.go('app.home');
                    Snackbar.show('Permissions denied.');
                }
            }

            function getErrorFn(data) {
                Snackbar.show(JSON.stringify(data.data));
            }
        }
    }
})();