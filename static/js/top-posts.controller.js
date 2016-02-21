(function() {
    'use strict';

    angular
        .module('poster')
        .controller('TopPostsController', TopPostsController);

    TopPostsController.$inject = ['$scope', 'Post', 'Snackbar'];

    function TopPostsController($scope, Post, Snackbar) {
        $scope.posts = [];

        activate();

        function loadPosts() {
            Post.list({'sort_by': 'top'}).then(listSuccessFn, listErrorFn);

            function listSuccessFn(data){
                $scope.posts = data.data;
            }

            function listErrorFn(data) {
                Snackbar.show(data.data);
            }
        }

        function activate() {
            loadPosts();
        }

    }
})();