(function() {
    'use strict';

    angular
        .module('poster.posts.controllers')
        .controller('PostsDetailController', PostsDetailController)

    PostsDetailController.$inject = ['$http', '$scope', '$sce', 'Post', 'Comment', 'Snackbar', '$stateParams', '$state', 'Permissions', 'Authentication'];

    function PostsDetailController($http, $scope, $sce, Post, Comment, Snackbar, $stateParams, $state, Permissions, Authentication) {
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

        function findLikeIndexFromUserId(likes, user_id){
            for (var i = 0; i < likes.length; i++) {
                if (likes[i].owner == user_id) return i;
            }
            return -1;
        }

        function showLike(index) {
            if (!$scope.isAuthenticated) return false;
            var user_id = Authentication.getAuthenticatedAccount().id;
            var likes = $scope.comments[index].likes;
            if (findLikeIndexFromUserId(likes, user_id) == -1) return true;
            return false;


        }

        function like(index) {
            $http.post('/api/v1/likes/', {
                comment_id: $scope.comments[index].id,
            }).then(likeSuccessFn, likeErrorFn);

            function likeSuccessFn(data) {
                $scope.comments[index].likes.push(data.data);
            }

            function likeErrorFn(data) {
                Snackbar.show(JSON.stringify(data.data));
            }
        }

        function unlike(index) {
            var user_id = Authentication.getAuthenticatedAccount().id;
            var likes = $scope.comments[index].likes;
            var likeIndex = findLikeIndexFromUserId(likes, user_id);
            $http.delete('/api/v1/likes/' + likes[likeIndex].id + '/').then(deleteSuccessFn, deleteErrorFn);

            function deleteSuccessFn(data) {
                likes.splice(likeIndex, 1);
            }

            function deleteErrorFn(data) {
                Snackbar.show(JSON.stringify(data.data));
            }
        }


        activate()

        function activate() {
            var id = $stateParams.id;

            getPostFromId(id);
            getCommentsForPost(id);
        }
    }
})();