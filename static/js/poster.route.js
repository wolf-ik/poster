(function () {
  'use strict';

  angular
    .module('poster.route')
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('app', {
          url: '/',
          views: {
            'header': {
              templateUrl: '/static/templates/layout/navbar.html',
              controller: 'NavbarController',
            },
            'content': {
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

        .state('app.login', {
          url: 'login',
          views: {
            'content@': {
              templateUrl: '/static/templates/authentication/login.html',
              controller: 'LoginController',
              controllerAs: 'vm',
            },
            'top-posts@': {},
            'tag-cloud@': {},
          }
        })

        .state('app.register', {
          url: 'register',
          views: {
            'content@': {
              templateUrl: '/static/templates/authentication/register.html',
              controller: 'RegisterController',
              controllerAs: 'vm',
            },
            'top-posts@': {},
            'tag-cloud@': {},
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
