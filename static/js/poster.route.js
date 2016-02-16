(function () {
  'use strict';

  angular
    .module('poster.route')
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('app', {
          url: '/',
          abstract: true,
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
              controllerAs: 'vm',
            }
          }
        })

        .state('app.accounts', {
          url: 'accounts',
          abstract: true,
        })

        .state('app.accounts.detail', {
          url: '/:username',
          views: {
            'content@': {
              templateUrl: '/static/templates/accounts/account.html',
              controller: 'AccountController',
            }
          }
        })

        .state('app.accounts.detail.settings', {
          url: '/settings',
          views: {
            'content@': {
              templateUrl: '/static/templates/accounts/settings.html',
              controller: 'AccountSettingsController',
            }
          }
        })

        .state('app.home', {
          url: '',
          views: {
            'posts': {
              templateUrl: '/static/templates/posts/posts.html',
              controller: 'PostsController',
            },
            'top-posts': {
              templateUrl: '/static/templates/top-posts.html',
              controller: 'TopPostsController',
            },
            'tag-cloud': {
              templateUrl: '/static/templates/tag-cloud.html',
              controller: 'TagCloudController',
            }
          }
        })

        .state('app.search', {
          url: 'search/{query}',
          views: {
            'content@': {
              templateUrl: '/static/templates/layout/search.html',
              controller: 'SearchController',
            }
          }
        })

        .state('app.posts', {
          url: 'posts',
          abstract: true,
        })

        .state('app.posts.detail', {
          url: '/{id:int}',
          views: {
            'content@': {
              templateUrl: '/static/templates/posts/posts-detail.html',
              controller: 'PostsDetailController',
            }
          }
        })

        .state('app.posts.detail.edit', {
          url: '/edit',
          views: {
            'content@': {
              templateUrl: '/static/templates/posts/posts-edit.html',
              controller: 'PostsEditController',
            }
          }
        })

        .state('app.posts.create', {
          url: '/create',
          views: {
            'content@': {
              templateUrl: '/static/templates/posts/posts-edit.html',
              controller: 'PostsCreateController',
            }
          }
        })
  }
})();
