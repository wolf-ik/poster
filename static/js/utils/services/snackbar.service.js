(function() {
    'use strict';

    angular
        .module('poster.utils.services')
        .factory('Snackbar', Snackbar);

    Snackbar.$inject = [];

    function Snackbar() {
        var Snackbar = {
            show: show,
        }

        return Snackbar;

        /////////////////////////////////

        function show(content) {
            $.snackbar({
                'content': content,
                'style': 'toast',
                'timeout': 3000,
            })
        }
    }
})();