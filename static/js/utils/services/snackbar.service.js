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

        function display(content) {
            $.snackbar({
                'content': content,
                'style': 'toast',
                'timeout': 3000,
            })
        }

        function show(content) {
            if (typeof(content) === 'string') {
                display(content);
            } else {
                for (var key in content) {
                    display("".concat(key, ': ', content[key]));
                }
            }
        }
    }
})();