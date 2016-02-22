(function() {
    'use strict';

    angular
        .module('poster.comments.controllers')
        .controller('CommentsController', CommentsController);

    CommentsController.$inject = ['$scope', 'Permissions', 'Comment', 'Like', 'Snackbar', '$stateParams'];

    function CommentsController($scope, Permissions, Comment, Like, Snackbar, $stateParams) {
        $scope.postId = $stateParams.id;
        $scope.isAuthenticated = Permissions.isAuthenticated();
        $scope.isCommentOwnerOrAdmin = Permissions.isAccountOwnerOrAdmin;
        $scope.comments = [];
        $scope.newComment = {'content' : ''};
        $scope.editComment = undefined;
        $scope.editCommentIndex = 0;
        $scope.createNewComment = createNewComment;
        $scope.startEditComment = startEditComment;
        $scope.saveEditComment = saveEditComment;
        $scope.deleteComment = deleteComment;
        $scope.showLike = showLike;
        $scope.like = like;
        $scope.unlike = unlike;
        $scope.socket = null;



        function createNewComment() {
            Comment.create({
                'content': $scope.newComment.content,
                'post_id': $scope.postId,
            }).then(createSuccessFn, createErrorFn);

            function createSuccessFn(data) {
                $scope.socket.send(JSON.stringify(data.data));
                $scope.newComment.content = '';
            }

            function createErrorFn(data) {
                Snackbar.show(data.data);
            }
        }

        function startEditComment(index){
            $scope.editCommentIndex = index;
            $scope.editComment = jQuery.extend({}, $scope.comments[index]);
        }

        function saveEditComment() {
            Comment.update($scope.editComment.id, $scope.editComment).then(updateSuccessFn, updateErrorFn);

            function updateSuccessFn(data) {
                $scope.socket.send(JSON.stringify(data.data));
                $scope.editComment = undefined;
                $scope.editCommentIndex = 0;
            }

            function updateErrorFn(data) {
                Snackbar.show(data.data);
            }
        }

        function deleteComment(index) {
            Comment.destroy($scope.comments[index].id).then(destroySuccessFn, destroyErrorFn);

            function destroySuccessFn(data) {
                $scope.socket.send(JSON.stringify({
                    'remove': $scope.comments[index].id,
                    'post': $scope.postId,
                }));
            }

            function destroyErrorFn(data) {
                Snackbar.show(data.data);
            }
        }

        function getCommentsForPost(id) {
            Comment.list(id).then(getSuccessFn, getErrorFn);

            function getSuccessFn(data) {
                $scope.comments = data.data;
            }

            function getErrorFn(data) {
                Snackbar.show(data.data);
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

        function refreshComments(comment){
            if (comment.remove) {
                var id = comment.remove;
                for (var i in $scope.comments) {
                    if ($scope.comments[i].id === id) {
                        $scope.comments.splice(i, 1);
                    }
                }
                return;
            }
            for (var i in $scope.comments) {
                if (comment.id === $scope.comments[i].id) {
                    $scope.comments[i] = comment;
                    return;
                }
            }
            $scope.comments.push(comment);
        }

        var Socket = {
            ws: null,

            init: function () {
                this.ws = new WebSocket('ws://localhost:8888/websocket');
                this.ws.onopen = function () {
                    //console.log('Socket opened');
                    $scope.socket.send(JSON.stringify({'post_id': $scope.postId}));
                };

                this.ws.onclose = function () {
                    //console.log('Socket close');
                };

                this.ws.onmessage = function (e) {
                    var data = JSON.parse(e.data)
                    refreshComments(data);
                    $scope.$apply();
                };
            }
        };


        $scope.$on('$destroy', function() {
            $scope.socket.close();
        });


        activate();

        function activate() {
            getCommentsForPost($scope.postId);

            Socket.init();
            $scope.socket = Socket.ws;
        }
    }
})();