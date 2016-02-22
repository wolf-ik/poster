(function () {
    'use strict';

    angular
        .module('poster.layout.services')
        .factory('TopPost', TopPost);

    TopPost.$inject = ['Snackbar', 'Post'];

    function TopPost(Snackbar, Post) {
        var self = this;
        self.posts = [];

        function loadPosts() {
            Post.list({'sort_by': 'top'}).then(listSuccessFn, listErrorFn);

            function listSuccessFn(data){
                for (var i in data.data) {
                    self.posts.push(data.data[i]);
                }
            }

            function listErrorFn(data) {
                Snackbar.show(data.data);
            }
        }

        function getExistPost(id) {
            for (var i in self.posts) {
                if (self.posts[i].id === id) return self.posts[i];
            }
            return false;
        }

        //////////////////////////

        return {
            getExistPost: getExistPost,
            loadPosts: loadPosts,
            posts: self.posts,
        }
    };
})();
