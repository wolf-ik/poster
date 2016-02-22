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
            'poster.comments',
            'ngTagsInput',
            'angular-jqcloud',
            'infinite-scroll',
            'gettext',
        ]);

    angular
        .module('poster.route', ['ui.router']);

    angular
        .module('poster.config', ['satellizer']);

    angular
        .module('poster')
        .run(run)

    run.$inject = ['$http', 'gettextCatalog', 'Authentication'];

    function run($http, gettextCatalog, Authentication) {
        //Authentication.getAuthenticatedAccountFromServer();
        gettextCatalog.loadRemote('/static/translations/ru.json');
        gettextCatalog.loadRemote('/static/translations/en.json');
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
    }

})();