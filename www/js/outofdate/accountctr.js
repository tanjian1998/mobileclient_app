var accountctr=angular.module('starter.controllers');
accountctr.controller('AccountCtrl', function($scope, $ionicBackdrop,$ionicPopup, $http) {
	 $scope.settings = {
    enableFriends: true
  };
		//右上角的地图设置
		$scope.mapSetting=function(){
		$scope.coverAction();
		var popOptions={
		template: '<input type="password" ng-model="data.wifi">',
     title: 'Enter'+$scope.resMsg,
     subTitle: 'Please use normal things',
     scope: $scope,
     buttons: [
       { text: 'Cancel' },
       {
         text: '<b>Save</b>',
         type: 'button-positive',
         onTap: function(e) {
           if ($scope.movieTestData) {
             // 不允许用户关闭，除非有movie测试数据 
             //e.preventDefault();
             $scope.uploadMovieTestData($scope.movieTestData);
           } else {
             return $scope.data.wifi;
           }
         }
       },
     ]
			};
			$ionicPopup.show(popOptions)
			.then(function(){
				//这个函数在弹出框关闭时被调用
				$scope.coverAction();
			});
		};



})