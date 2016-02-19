(function() {
    'user strict';

    angular
        .module('poster.accounts.services')
        .factory('Permissions', Permissions);

    Permissions.$inject = ['Authentication'];

    function Permissions(Authentication) {

        var Permissions = {
            isAuthenticated: isAuthenticated,
            isAccountOwner: isAccountOwner,
            isAdmin: isAdmin,
            isAccountOwnerOrAdmin: isAccountOwnerOrAdmin,
        }
        return Permissions;

        //////////////////////

        function isAuthenticated() {
            return Authentication.isAuthenticated();
        }

        function isAccountOwner(username) {
            if (!isAuthenticated()) return false;
            return Authentication.getAuthenticatedAccount().username === username;
        }

        function isAdmin() {
            if (!isAuthenticated()) return false;
            return Authentication.getAuthenticatedAccount().is_staff;
        }

        function isAccountOwnerOrAdmin(username) {
            return isAccountOwner(username) || isAdmin();
        }

    }
})();