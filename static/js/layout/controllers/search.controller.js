(function() {
    'use strict';

    angular
        .module('poster.layout.controllers')
        .controller('SearchController', SearchsController)

    SearchsController.$inject = ['$scope', '$http', 'Snackbar', '$stateParams'];

    function SearchsController($scope, $http, Snackbar, $stateParams) {
        $scope.posts = [];
        $scope.query = $stateParams.query;

        function getPostsFromSearch(query) {
            $http({
                url: '/api/v1/search/',
                method: 'GET',
                params: {query: query}
            }).then(getSuccessFn,getErrorFn);

            function getSuccessFn(data) {
                $scope.posts = data.data;
            }

            function getErrorFn(data) {
                Snackbar.show(data.data);
            }
        }

        activate()

        function activate() {
            getPostsFromSearch($scope.query);
        }
    }
})();