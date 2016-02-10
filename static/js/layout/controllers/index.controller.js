(function() {
    'use strict';

    angular
        .module('poster.layout.controllers')
        .controller('IndexController', IndexController);

    IndexController.$inject = ['$scope', 'Authentication'];

    function IndexController($scope, Authentication) {
        $scope.isAuthenticated = Authentication.isAuthenticated;
        $scope.user = Authentication.getAuthenticatedAccount();

        activate()

        function activate() {

        }

    }

})();