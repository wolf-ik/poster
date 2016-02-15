(function() {
    'use strict';

    angular
        .module('poster.posts.controllers')
        .controller('PostsCreateController', PostsCreateController)

    PostsCreateController.$inject = ['$scope', 'Post', 'Snackbar', '$state', 'Permissions'];

    function PostsCreateController($scope, Post, Snackbar, $state, Permissions) {
        $scope.post = undefined;
        $scope.save = save;

        function save() {
            Post.create($scope.post).then(postSuccessFn, postErrorFn);

            function postSuccessFn(data) {
                $state.go('app.home');
                Snackbar.show('Saved');

            }

            function postErrorFn(data) {
                Snackbar.show(JSON.stringify(data.data))
            }
        }


        activate()

        function activate() {
            if (!Permissions.isAuthenticated()) {
                $state.go('app.home');
                Snackbar.show('You need LogIn or SignUp.');
            }
        }
    }
})();