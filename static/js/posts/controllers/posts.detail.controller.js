(function() {
    'use strict';

    angular
        .module('poster.posts.controllers')
        .controller('PostsDetailController', PostsDetailController)

    PostsDetailController.$inject = ['Authentication', '$http', '$scope', '$sce', 'Post', 'Comment', 'Snackbar', '$stateParams', '$state', 'Permissions', 'Like'];

    function PostsDetailController(Authentication, $http, $scope, $sce, Post, Comment, Snackbar, $stateParams, $state, Permissions, Like) {
        $scope.sce = $sce;
        $scope.isAuthenticated = Permissions.isAuthenticated();
        $scope.isPostOwnerOrAdmin = false;
        $scope.isCommentOwnerOrAdmin = Permissions.isAccountOwnerOrAdmin;
        $scope.post = undefined;
        $scope.comments = [];
        $scope.newComment = '';
        $scope.editComment = undefined;
        $scope.editCommentIndex = 0;
        $scope.createNewComment = createNewComment;
        $scope.startEditComment = startEditComment;
        $scope.saveEditComment = saveEditComment;
        $scope.deleteComment = deleteComment;
        $scope.deletePost = deletePost;
        $scope.showLike = showLike;
        $scope.like = like;
        $scope.unlike = unlike;
        $scope.setRating = setRating;
        $scope.canPostRating = false;
        $scope.socket = null;


        function createNewComment() {
            Comment.create({
                'content': $scope.newComment,
                'post_id': $stateParams.id
            }).then(createSuccessFn, createErrorFn);

            function createSuccessFn(data) {
                $scope.socket.send(JSON.stringify(data.data));
                Snackbar.show('Created!');
            }

            function createErrorFn(data) {
                Snackbar.show(JSON.stringify(data.data));
            }
        }

        function startEditComment(index){
            $scope.editCommentIndex = index;
            $scope.editComment = jQuery.extend({}, $scope.comments[index]);
        }

        function saveEditComment() {
            Comment.update($scope.editComment.id, $scope.editComment).then(updateSuccessFn, updateErrorFn);

            function updateSuccessFn(data) {
                $scope.comments[$scope.editCommentIndex] = data.data;
                $scope.editComment = undefined;
                $scope.editCommentIndex = 0;
                Snackbar.show('Updated.');
            }

            function updateErrorFn(data) {
                Snackbar.show(JSON.stringify(data.data));
            }
        }

        function deleteComment(index) {
            Comment.destroy($scope.comments[index].id).then(destroySuccessFn, destroyErrorFn);

            function destroySuccessFn(data) {
                $scope.comments.splice(index, 1);
                Snackbar.show('Deleted.');
            }

            function destroyErrorFn(data) {
                Snackbar.show(JSON.stringify(data.data));
            }
        }

        function deletePost() {
            Post.destroy($stateParams.id).then(destroySuccessFn, destroyErrorFn)

            function destroySuccessFn(data) {
                $state.go('app.home');
                Snackbar.show('Deleted.');
            }

            function destroyErrorFn(data) {
                Snackbar.show(JSON.stringify(data.data));
            }
        }

        function getPostFromId(id) {
            Post.retrieve(id).then(getSuccessFn, getErrorFn);

            function getSuccessFn(data) {
                $scope.post = data.data;
                $scope.isPostOwnerOrAdmin = Permissions.isAccountOwnerOrAdmin($scope.post.owner.username);
                $scope.canPostRating = canPostRating();
                $scope.socket.send(JSON.stringify({'post_id': $scope.post.id}));
            }

            function getErrorFn(data) {
                Snackbar.show(JSON.stringify(data.data));
            }
        }

        function getCommentsForPost(id) {
            Comment.list(id).then(getSuccessFn, getErrorFn);

            function getSuccessFn(data) {
                $scope.comments = data.data;
            }

            function getErrorFn(data) {
                Snackbar.show(JSON.stringify(data.data));
            }
        }

        function showLike(index) {
            return Like.showLike($scope.comments[index].likes);
        }

        function like(index) {
            Like.like($scope.comments[index].likes, $scope.comments[index].id);
        }

        function unlike(index) {
            Like.unlike($scope.comments[index].likes);
        }

        function setRating(value) {
            $http.post('/api/v1/ratings/', {
                post_id: $scope.post.id,
                value: value,
            }).then(postSuccessFn, postErrorFn);

            function postSuccessFn(data) {
                var rating = $scope.post.rating;
                var count = $scope.post.ratings_count;
                var newRating = (rating * count + value) / (count + 1);
                $scope.post.rating = newRating;
                $scope.post.ratings_count += 1;
                $scope.canPostRating = false;
            }

            function postErrorFn(data) {
                Snackbar.show(JSON.stringify(data.data));
            }
        }

        function canPostRating() {
            if (!$scope.isAuthenticated) return false;
            var user_id = Authentication.getAuthenticatedAccount().id;
            var ratings = $scope.post.ratings;
            for (var i in ratings) {
                if (ratings[i].owner == user_id) return false;
            }
            return true;
        }


        var Socket = {
            ws: null,

            init: function () {
                this.ws = new WebSocket('ws://localhost:8888/websocket');
                this.ws.onopen = function () {
                    //console.log('Socket opened');
                };

                this.ws.onclose = function () {
                    //console.log('Socket close');
                };

                this.ws.onmessage = function (e) {
                    var data = JSON.parse(e.data)
                    $scope.comments.push(data);
                    $scope.newComment = '';
                    $scope.$apply();
                };
            }
        };


        $scope.$on('$destroy', function() {
            $scope.socket.close();
        });


        activate()

        function activate() {
            var id = $stateParams.id;

            getPostFromId(id);
            getCommentsForPost(id);

            Socket.init();
            $scope.socket = Socket.ws;
        }
    }
})();