(function() {
    'use strict';

    angular
        .module('poster.posts.controllers')
        .controller('PostsEditController', PostsEditController)

    PostsEditController.$inject = ['$scope', 'Post', 'Snackbar', '$state', '$stateParams', 'Permissions'];

    function PostsEditController($scope, Post, Snackbar, $state, $stateParams, Permissions) {
        $scope.post = undefined;
        $scope.tagList = [];
        $scope.categories = [];
        $scope.save = save;
        $scope.loadTags = loadTags;

        function save() {
            $scope.post.content = $scope.ck.getData();
            Post.update($scope.post.id, $scope.post).then(putSuccessFn, putErrorFn);

            function putSuccessFn(data) {
                $state.go('app.home');
                Snackbar.show('Saved');

            }

            function putErrorFn(data) {
                Snackbar.show(data.data);
            }
        }

        function getPostFromId(id) {
            Post.retrieve(id).then(getSuccessFn, getErrorFn);

            function getSuccessFn(data) {
                $scope.post = data.data;
                $scope.ck = CKEDITOR.replace('post-edit__content');
                $scope.ck.setData($scope.post.content);
                if (!Permissions.isAccountOwnerOrAdmin($scope.post.owner.username)) {
                    $state.go('app.home');
                    Snackbar.show('Permissions denied.');
                }
            }

            function getErrorFn(data) {
                Snackbar.show(data.data);
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
            var id = $stateParams.id;

            getPostFromId(id);
            Post.loadCategories($scope.categories);
            Post.loadTagList({'sort_by': 'all'}, setTags);

            function setTags(data) {
                $scope.tagList = data.data;
            }
        }
    }
})();