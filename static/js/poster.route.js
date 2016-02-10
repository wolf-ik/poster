(function () {
  'use strict';

  angular
    .module('poster.route')
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/')
    $stateProvider
        .state('app', {
          url: '/',
          views: {
            'header': {
              templateUrl: '/static/templates/layout/navbar.html',
              controller: 'NavbarController',
            },

            'content': {
              templateUrl: '/static/templates/layout/index.html',
              controller: 'IndexController',
            }
          }
        })

        .state('app.login', {
          url: 'login',
          views: {
            'content@': {
              templateUrl: '/static/templates/authentication/login.html',
              controller: 'LoginController',
              controllerAs: 'vm',
            }
          }
        })

        .state('app.register', {
          url: 'register',
          views: {
            'content@': {
              templateUrl: '/static/templates/authentication/register.html',
              controller: 'RegisterController',
              controllerAs: 'vm'
            }
          }
        })
  }
})();