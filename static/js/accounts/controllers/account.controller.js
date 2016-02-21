(function () {
    'use strict';

    angular
        .module('poster.accounts.controllers')
        .controller('AccountController', AccountController);

    AccountController.$inject = ['$scope', '$location', '$stateParams', 'Account', 'Snackbar', 'Permissions', 'Post'];

    function AccountController($scope, $location, $stateParams, Account, Snackbar, Permissions, Post) {
        $scope.account = undefined;
        $scope.username = $stateParams.username;
        $scope.isAccountOwnerOrAdmin = Permissions.isAccountOwnerOrAdmin($scope.username);
        $scope.posts = [];
        $scope.sortField = 'created_at';
        $scope.reverse = true;

        $scope.setSortField = setSortField;

        function setSortField(field) {
            if ($scope.sortField === field) {
              $scope.reverse = !$scope.reverse;
            }
            $scope.sortField = field;
        }


        function getUser() {
            Account.retrieve($scope.username).then(getSuccessFn, getErrorFn);

            function getSuccessFn(data, status, headers, config) {
                $scope.account = data.data;
            }

            function getErrorFn(data, status, headers, config) {
                $location.url('/');
                //Snackbar.show('That user does not exist.');
                Snackbar.show(data.data);
            }

        }

        function getUserPosts(){
            Post.list({
                'sort_by': 'user',
                'username': $scope.username,
            }).then(listSuccessFn, listErrorFn);

            function listSuccessFn(data) {
              $scope.posts = data.data;
            }

            function listErrorFn(data) {
                Snackbar.show(data.data);
            }
        }

        activate();

        function activate() {
            getUser();
            getUserPosts();
        }
    }
})();
