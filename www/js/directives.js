var maindictvs=angular.module('starter.directives',[]);
//
maindictvs.directive('gd-map', function ($timeout,$window) {
  return {
    restrict: 'EA',
    // scope: {
    //     point: '=?',
    // },
    template: '<div></div>',
    replace: true,
    link: function (scope, el, attr, ctrl) {

      scope.map = new AMap.Map(el[0], {
        resizeEnable: true,
        zoom: 12,
        zooms:[8,20]
      });
      for(var ooo in scope){
        console.log('map:'+ooo);
      }
      //自动最大化高度
      var winowHeight = $window.innerHeight; //获取窗口高度
      var headerHeight = 80;
      var footerHeight = 20;
      el.css('min-height',
        (winowHeight - headerHeight - footerHeight) + 'px');
      /*
       if (scope.point.lat && scope.point.lng) {
       var center = [scope.point.lng, scope.point.lat]
       scope.map.setCenter(center)
       scope.marker = new AMap.Marker({ map: scope.map })
       scope.marker.setPosition(center)
       }
       */

      //加入缩放工具栏
      scope.map.addControl(new AMap.ToolBar());
      //加入鹰眼
      scope.map.addControl(new AMap.OverView());

      // scope.map.on('click', function (e) {
      //     scope.$emit('map-click', e)
      //
      //     if (!scope.marker) {
      //         scope.marker = new AMap.Marker({ map: scope.map })
      //     }
      //
      //
      //     scope.marker.setPosition([e.lnglat.getLng(), e.lnglat.getLat()])
      // })
      //
      // scope.$on('setCenter', function (event, center) {
      //     if (!scope.map) return
      //     scope.map.setCenter(center)
      // })

    }
  }
});
maindictvs.directive('map', function() {
  return {
    restrict: 'E',
    // scope: {
    //   onCreate: '&',
    //   fdgdfg: '&'
    // },
    replace: true,
    link: function ($scope, $element, $attr) {
      function initialize() {

        // for(var ooo in $scope){
        //   console.log('map:'+ooo);
        // }

				var position=new AMap.LngLat(116.2736372882, 40.0641972545);
				//alert($element[0].id);

        var map = new AMap.Map($element[0].id, {

					view:new AMap.View2D({
					resizeEnable: false,

					center:position,

					zoom:14,

					rotation:0

					})});
				//alert($scope.curUser+"kk");
        $scope.mapCreated(map);
        // $scope.map=map;
				//加入缩放工具栏
				map.addControl(new AMap.ToolBar());
				//加入鹰眼
				map.addControl(new AMap.OverView());

        // //构建地图上自定义信息窗体中显示的内容<img src="{{curUser.images.coverSmall}}" class="rj-head-pic">
        // var html='<div > <button   class="button button-icon icon ion-image" ng-click="$scope.fdgdfg()">'+$scope.fdgdfg+'</button></div>';
        // // var template = angular.element(html);
        // // //编译模板
        // // var Element = $compile(template)($scope);
        // // var strr=JSON.stringify(Element);
        // // console.log(strr);
        // var  infowindow3 = new AMap.InfoWindow({
        //   // content: content,
        //   content: html,
        //   // placeSearch: false,
        //   // asDestination: false,
        //   offset: new AMap.Pixel(0, -30)
        // });
        // infowindow3.open($scope.map,[116.38585,39.99662]);


        // // Stop the side bar from dragging when mousedown/tapdown on the map
        // AMap.event.addDomListener($element[0], 'mousedown', function (e) {
        //   e.preventDefault();
        //   return false;
        // });
        // // Stop the side bar from dragging when mousedown/tapdown on the map
        // AMap.event.addDomListener($element[0], 'click', function (e) {
        //   $scope.$emit('map-click', e);
        //   e.preventDefault();
        //   return true;
        // });
      }



      if (document.readyState === "complete") {

        initialize();

      } else {
        AMap.event.addDomListener(window, 'load', initialize);
      }
    }
  }
});
maindictvs.directive('pano', function() {
  return {
    restrict: 'E',
    scope: false,
    link: function ($scope, $element, $attr) {
      function initializePano() {

				//var position=new AMap.LngLat(116.2736372882, 40.0641972545);
				/*var str="";
				for(var i in $scope){str+=i+">";};
				alert(str);*/

				var PSV = new PhotoSphereViewer({
					panorama: $scope.panourl,
					container: $element[0],
					time_anim: 3000,
					navbar: true,
					navbar_style: {
						backgroundColor: 'rgba(58, 67, 77, 0.7)'
					},
				});

				//alert($scope.panourl);
        $scope.panoCreated(PSV);
        // Stop the side bar from dragging when mousedown/tapdown on the map
        $element[0].addEventListener('mousedown', function (e) {
          e.preventDefault();
          return false;
        });
      };

      //这一句非常关键
			$scope.$watch("panourl",initializePano);

      if (document.readyState === "complete") {
        initializePano();
      } else {
        window.addEventListener('load', initializePano);
      }
    }
  }
});

maindictvs.directive('fileupload', function() {
  return {
    restrict: 'E',
    scope: false,//表示沿用所在controller的$scope对象
    templateUrl: 'templates/fileuploader.html',
    link: function ($scope, $element, $attr) {
      function initializePano() {

				//var position=new AMap.LngLat(116.2736372882, 40.0641972545);
				/**/
				/*var str="";
				var obj=$element[0].childNodes[9];//.childNodes[3]
				for(var i in obj){str+=i+">"+i.id+"<";};
				alert(obj.id+"\n"+str);*/
				var inpuffileNode=$element[0].childNodes[1].childNodes[3];
				var fileNameLabelNode=$element[0].childNodes[5];
				var fileSizeLabelNode=$element[0].childNodes[6];
				var fileTypeNode=$element[0].childNodes[7];
				var uploadBtm=$element[0].childNodes[9];

				var responseFun=$scope.uploadComplete;
				var uploadProgressFun=$scope.uploadProgress;
				//alert(inpuffileNode.id);
				var filedir=$attr.filedir;
				var fileuploader = new html5fileuploader(inpuffileNode,fileNameLabelNode,fileSizeLabelNode,
				fileTypeNode,responseFun,uploadProgressFun,filedir);
				//function test(){alert(1);};
				//alert($scope.panourl);
        //$scope.panoCreated(PSV);
        $scope.filenameNode=fileNameLabelNode;
        // Stop the side bar from dragging when mousedown/tapdown on the map
        inpuffileNode.addEventListener('change', fileuploader.fileSelected);

        uploadBtm.addEventListener('click', fileuploader.uploadFile);
        //fileuploader.okUrl();
        /**/
      }

      if (document.readyState === "complete") {

        initializePano();
      } else {
        window.addEventListener('load', initializePano);
      }
    }
  }
});
      	//alert(1);

maindictvs.directive('rjHoldActive', ['$ionicGesture', '$timeout', '$ionicBackdrop',
  function($ionicGesture, $timeout, $ionicBackdrop) {
    return {
      scope: false,
      restrict: 'A',
      replace: false,
      link: function(scope, iElm, iAttrs, controller) {
        $ionicGesture.on("hold", function() {
          iElm.addClass('active');
          $timeout(function() {
            iElm.removeClass('active');
          }, 300);
        }, iElm);
      }
    };
  }
]);
maindictvs.directive('rjCloseBackDrop', [function() {
    return {
      scope: false,
      restrict: 'A',
      replace: false,
      link: function(scope, iElm, iAttrs, controller) {
        var htmlEl = angular.element(document.querySelector('html'));
        htmlEl.on("click", function(event) {
          if (event.target.nodeName === "HTML" && scope.popup &&
            scope.popup.optionsPopup &&
            scope.popup.isPopup) {
            scope.popup.optionsPopup.close();
            scope.popup.isPopup = false;
          }
        });
      }
    };
  }])
;
maindictvs.directive('resizeFootBar', ['$ionicScrollDelegate', function($ionicScrollDelegate){
    // Runs during compile
    return {
      replace: false,
      link: function(scope, iElm, iAttrs, controller) {
        scope.$on("taResize", function(e, ta) {
          if (!ta) return;
          var scroll = document.body.querySelector("#message-detail-content");
          var scrollBar = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');
          // console.log(scroll);
          var taHeight = ta[0].offsetHeight;
          var newFooterHeight = taHeight + 10;
          newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;

          iElm[0].style.height = newFooterHeight + 'px';
          scroll.style.bottom = newFooterHeight + 'px';
          scrollBar.scrollBottom();
        });
      }
    };
  }])
;
maindictvs.directive('rjPositionMiddle', ['$window', function($window){
    return{
      replace: false,
      link: function(scope, iElm, iAttrs, controller){
        var height = $window.innerHeight - 44 - 49 - iElm[0].offsetHeight;
        if (height >= 0) {
          iElm[0].style.top = (height / 2 + 44) + 'px';
        }else{
          iElm[0].style.top = 44 + 'px';
        }
      }
    }
  }]);
