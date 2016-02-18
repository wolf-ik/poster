(function() {
    'use strict';

    angular
        .module('poster.posts.controllers')
        .controller('PostsCreateController', PostsCreateController)

    PostsCreateController.$inject = ['$scope', 'Post', 'Snackbar', '$state', 'Permissions'];

    function PostsCreateController($scope, Post, Snackbar, $state, Permissions) {
        $scope.post = {content: ''};
        $scope.tagList = [];
        $scope.save = save;
        $scope.loadTags = loadTags;
        $scope.ck = CKEDITOR.replace('post-edit__content');

        function save() {
            $scope.post.content = $scope.ck.getData();
            Post.create($scope.post).then(postSuccessFn, postErrorFn);

            function postSuccessFn(data) {
                $state.go('app.home');
                Snackbar.show('Saved');

            }

            function postErrorFn(data) {
                Snackbar.show(JSON.stringify(data.data))
            }
        }

        function loadTags(q) {
            if (!$scope.tagList) return false;
            return $scope.tagList.filter(function(tag) {
                return tag.text.toLowerCase().indexOf(q.toLowerCase()) != -1;
            });
        }


        activate()

        function activate() {
            if (!Permissions.isAuthenticated()) {
                $state.go('app.home');
                Snackbar.show('You need LogIn or SignUp.');
            }
            Post.loadTagList($scope.tagList);

        }
    }
})();