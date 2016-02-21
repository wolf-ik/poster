(function() {
    'use strict';

    angular
        .module('poster.posts.controllers')
        .controller('PostDetailMiniController', PostDetailMiniController)

    PostDetailMiniController.$inject = ['$scope'];

    function PostDetailMiniController($scope) {
        $scope.post = undefined;

        activate()

        function activate() {

        }
    }
})();