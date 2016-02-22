(function() {
    'use strict';

    angular
        .module('poster.layout.controllers')
        .controller('TopPostsController', TopPostsController);

    TopPostsController.$inject = ['$scope', 'TopPost'];

    function TopPostsController($scope, TopPost) {
        $scope.posts = TopPost.posts;

        activate();


        function activate() {
            TopPost.loadPosts();
        }

    }
})();