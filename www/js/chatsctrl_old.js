
var mainctr=angular.module('starter.controllers');
mainctr.controller('ChatsCtrl', function($scope, $ionicBackdrop,$ionicPopup, $http, Chats) {

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
	});
	
