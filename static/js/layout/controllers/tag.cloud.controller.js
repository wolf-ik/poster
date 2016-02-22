(function() {
    'use strict';

    angular
        .module('poster.layout.controllers')
        .controller('TagCloudController', TagCloudController);

    TagCloudController.$inject = ['$scope', 'Post', '$state'];

    function TagCloudController($scope, Post, $state) {
        $scope.tags = [];

        activate();

        function activate() {
            Post.loadTagList({'sort_by': 'random'}, setTags);

            function setTags(data) {
                var tags = data.data;
                for (var i in tags) {
                    tags[i] = {
                        'id': tags[i].id,
                        'text': tags[i].text,
                        'weight': Math.floor((Math.random()*100)+1),
                        'link': 'javascript:void(0)',
                        'handlers': {
                            click: function() {
                                var q = angular.copy(tags[i].text);
                                return function() {
                                    $state.go('app.search', {query:q});
                                }
                            }()
                        }
                    }
                }
                $scope.tags = tags;
            }
        }
    }
})();