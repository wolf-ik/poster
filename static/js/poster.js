(function() {
    'use strict';

    angular
        .module('poster', [
            'poster.layout',
            'poster.authentication',
            'poster.route',
            'poster.config',
        ]);

    angular
        .module('poster.route', ['ui.router']);

    angular
        .module('poster.config', []);

    angular
        .module('poster')
        .run(run)

    run.$inject = ['$http'];

    function run($http) {
    $http.defaults.xsrfHeaderName = 'X-CSRFToken';
    $http.defaults.xsrfCookieName = 'csrftoken';
    }

})();