(function() {
    'use strict';

    angular
        .module('poster.posts.controllers')
        .controller('PostsDetailController', PostsDetailController)

    PostsDetailController.$inject = ['$scope', '$sce', 'Post', 'Comment', 'Snackbar', '$stateParams', '$state', 'Permissions', 'Like'];

    function PostsDetailController($scope, $sce, Post, Comment, Snackbar, $stateParams, $state, Permissions, Like) {
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


        function createNewComment() {
            Comment.create({
                'content': $scope.newComment,
                'post_id': $stateParams.id
            }).then(createSuccessFn, createErrorFn);

            function createSuccessFn(data) {
                $scope.comments.push(data.data);
                $scope.newComment = '';
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


        activate()

        function activate() {
            var id = $stateParams.id;

            getPostFromId(id);
            getCommentsForPost(id);
        }
    }
})();