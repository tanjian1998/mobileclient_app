var accountctr=angular.module('starter.controllers');
accountctr.controller('IntroCtrl', ['$rootScope','$scope', '$state','$ionicLoading','localStorageService', function($rootScope,$scope, $state,$ionicLoading,localStorageService) {
    $scope.step1 = {};
    $scope.step2 = {};
    $scope.step3 = {};

  // 将查询本地有没有缓存用户，，，用户不缓存
  // $rootScope.curUser=localStorageService.get('curUser',30);
  if($rootScope.curUser && $rootScope.curUser._id){
    //进入注册页面应该看不到tab的按钮，不能进入地图等页面
    $rootScope.hideAccountTab=($rootScope.curUser && $rootScope.curUser._id)?false:true;
    $state.go($rootScope.afterSigninTopage);
  }


  // 等到系统用户刷新成功后，跳转到地图页面
  //appjs负责一开始就运行刷新用户
  $scope.$on('rootUserReady', function(event,data) {

    // console.log('登录页面已确认用户 curUser：', data._id);		 //子级能得到值
    // $rootScope.curUser=localStorageService.get('curUser',30);

    if($rootScope.curUser && $rootScope.curUser._id){
      //进入注册页面应该看不到tab的按钮，不能进入地图等页面
      $rootScope.hideAccountTab=($rootScope.curUser && $rootScope.curUser._id)?false:true;
      $state.go($rootScope.afterSigninTopage);
    }
  });



  $scope.$on('$stateNotFound', function(event, redirect, state, params) {

    // alert(JSON.stringify(redirect)+'《页面状态未找到》'+' $state'+ JSON.stringify(state));
  });
  $scope.$on('$stateChangeSuccess', function(event, toself, toParams, from, fromParams) {

    // alert(JSON.stringify(toself)+'《页面跳转已经执行》'+' $state'+ JSON.stringify(from));
  });
  $scope.$on('$stateChangeSuccess', function(event, toself, toParams, from, fromParams) {

    // alert(JSON.stringify(toself)+'《页面模板已经解析》'+' $state'+ JSON.stringify(from));
  });


  $scope.start = function(ff) {
      //有id表示是从服务器取回的用户
    	if ($rootScope.curUser && $rootScope.curUser._id) {
        $state.go($rootScope.afterSigninTopage);
    	}else {
    	  //点开始使用的时候还是要刷新一下
        $rootScope.refreshCurUser();
        // alert($rootScope.curUser+'tab.account-login-step1'+' $state'+ $state);
        // $ionicLoading.hide();
   		// 	$state.go('tab.chats');
        $state.go('tab.account-login-step1');
    	}
    };

    //测试用开始使用
    $scope.startCondition = function() {
      // alert($rootScope.curUser._id+'startCondition tab.account-login-step1'+' $state'+ $state);
        //return angular.isDefined($scope.step3.something);
      //如果是在桌面做测试，就进入tab页面，如果不是
      //   if ($rootScope.dstpTest) {
      //   	$state.go($rootScope.afterSigninTopage);
      //   }else {
    	//   	 $rootScope.refreshCurUser($scope.start);
      //     //$state.go('tab.account-login-step1');
      //
      //   }
    };
//
//     $scope.listenbackbutton = function() {
//     document.addEventListener("plusready", onPlusReady, false);
//         function onPlusReady() {
//             plus.key.addEventListener("backbutton", function() {
//                 if ($location.path() == '/tab/dash') {
//                     if (plus.os.name == "Android") {
//                         $ionicLoading.show({
//                             template: "再次点击返回键退出应用"
//                         });
//                             $timeout(function() {
//                             $ionicLoading.hide();
//                         plus.key.removeEventListener("backbutton", function() {});
//                             return;
//                             }, 1000);
//                         plus.key.addEventListener("backbutton", function() {
//                             plus.runtime.quit();
//                         });
//                 } else {
//                     outSet("此平台不支持直接退出程序，请按Home键切换应用");
//                     }
//                 } else {
//                     $ionicHistory.goBack();
//             }
//         });
//     }
// };

}]);
