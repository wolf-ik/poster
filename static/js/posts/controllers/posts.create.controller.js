(function() {
    'use strict';

    angular
        .module('poster.posts.controllers')
        .controller('PostsCreateController', PostsCreateController)

    PostsCreateController.$inject = ['$scope', 'Post', 'Snackbar', '$state', 'Permissions'];

    function PostsCreateController($scope, Post, Snackbar, $state, Permissions) {
        $scope.post = {content: '', category: {id: 1}};
        $scope.tagList = [];
        $scope.categories = [];
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
                Snackbar.show(data.data)
            }
        }

        function loadTags(q) {
            if (!$scope.tagList) return false;
            return $scope.tagList.filter(function(tag) {
                return tag.text.toLowerCase().indexOf(q.toLowerCase()) != -1;
            });
        }

        function checkPermissions() {
            if (!Permissions.isAuthenticated()) {
                $state.go('app');
                Snackbar.show('You need LogIn or SignUp.');
            }
        }


        activate()

        function activate() {
            checkPermissions();
            Post.loadCategories($scope.categories);
            Post.loadTagList({'sort_by': 'all'}, setTags);

            function setTags(data){
                $scope.tagList = data.data;
            }
        }
    }
})();