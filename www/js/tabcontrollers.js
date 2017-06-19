var mainctr=angular.module('starter.controllers');
mainctr.controller('TabCtrl', function($scope, $rootScope,$state, $ionicLoading) {
	// 	$scope.isHideCss=  $rootScope.hideAccountTab;
   //  $scope.refresh=function () {
   //    alert('change!');
   //    $scope.isHideCss=  $rootScope.hideAccountTab;
   //  };
   // $rootScope.$watch("rootScope.hideAccountTab",$scope.refresh);
$scope.gotoChats=function(){
  $state.go("tab.chats");
}
});
