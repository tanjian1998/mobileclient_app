var accountctr=angular.module('starter.controllers');
accountctr.controller('IntroCtrl', ['$rootScope','$scope', '$state', function($rootScope,$scope, $state) {
    $scope.step1 = {};
    $scope.step2 = {};
    $scope.step3 = {};

    $scope.start = function(ff) {
    	if ($rootScope.curUser.mobileUUid) {
        $state.go('tab.dash');    		
    	}else {
   			$state.go('tab.account-login-step1');  		
    	}
    };
    

    $scope.startCondition = function() {
        //return angular.isDefined($scope.step3.something);
        
    		$rootScope.refreshCurUser($scope.start);
    };
    
    $scope.listenbackbutton = function() {
    document.addEventListener("plusready", onPlusReady, false);
        function onPlusReady() {
            plus.key.addEventListener("backbutton", function() {
                if ($location.path() == '/tab/dash') {
                    if (plus.os.name == "Android") {
                        $ionicLoading.show({
                            template: "再次点击返回键退出应用"
                        });
                            $timeout(function() {
                            $ionicLoading.hide();
                        plus.key.removeEventListener("backbutton", function() {});
                            return;
                            }, 1000);
                        plus.key.addEventListener("backbutton", function() {
                            plus.runtime.quit();
                        });
                } else {
                    outSet("此平台不支持直接退出程序，请按Home键切换应用");
                    }
                } else {
                    $ionicHistory.goBack();
            }
        });
    }
};

}])