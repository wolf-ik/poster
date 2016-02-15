(function() {
    'use strict';

    angular
        .module('poster', [
            'poster.layout',
            'poster.authentication',
            'poster.route',
            'poster.config',
            'poster.accounts',
            'poster.utils',
            'poster.posts',
        ]);

    angular
        .module('poster.route', ['ui.router']);

    angular
        .module('poster.config', []);

    angular
        .module('poster')
        .run(run)

    run.$inject = ['$http', 'Authentication'];

    function run($http, Authentication) {
        //Authentication.getAuthenticatedAccountFromServer();
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
    }

})();