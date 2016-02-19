(function () {
  'use strict';

  angular
    .module('poster.config')
    .config(config);

  config.$inject = ['$locationProvider', '$authProvider'];

  function config($locationProvider, $authProvider) {

    $authProvider.facebook({
      name: 'facebook',
      clientId: '1667998946784328',
      url: '/api/v1/oauth/social/session/facebook',
      authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
      redirectUri: window.location.origin + '/',
      requiredUrlParams: ['display', 'scope'],
      scope: ['email'],
      scopeDelimiter: ',',
      display: 'popup',
      type: '2.0',
      popupOptions: { width: 580, height: 400 }
    });

    $authProvider.twitter({
      name: 'twitter',
      url: '/api/v1/oauth/social/session/twitter',
      //authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
      redirectUri: window.location.origin,
      type: '1.0',
      popupOptions: { width: 495, height: 645 }
    });

    $authProvider.oauth2({
        name: 'vk-oauth2',
        url: '/api/v1/oauth/social/session/vk-oauth2',
        authorizationEndpoint: 'https://oauth.vk.com/authorize',
        redirectUri: 'http://localhost/',
        display: 'page',
        clientId: '5304589',
    });


    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
  }
})();
