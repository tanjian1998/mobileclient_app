var accountctr=angular.module('starter.controllers');
accountctr.controller('allPersonsCtrl', function($scope,$rootScope,$state,$ionicScrollDelegate,$timeout, $ionicBackdrop,$ionicPopup, $http,$ionicModal) {
  var viewScroll = $ionicScrollDelegate.$getByHandle('allPersonsScroll');
  $scope.doRefresh=function () {

    //下拉刷新单位和人员
    if($rootScope.mapEngine && $rootScope.mapEngine.engineInitialise )
    $rootScope.mapEngine.engineInitialise();

    $timeout(function() {
      // viewScroll.scrollBottom();
      $scope.$broadcast('scroll.refreshComplete');
      viewScroll.scrollTop();
    }, 800);
  }

  $scope.mapDetil=function (personObj) {
    //广播需要在地图上显示并定位此人
    $rootScope.$broadcast('needLocatedAPerson',personObj);
    $state.go("tab.dash");
  }

							})
