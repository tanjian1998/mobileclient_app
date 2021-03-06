﻿
var mainctr=angular.module('starter.controllers');
//,$cordovaGeolocation暂时不可用
mainctr.controller('DashCtrl', function($scope, $ionicBackdrop,$ionicPopup, $http,$state,$ionicModal) {
			var AMapArea=document.getElementById('amap');

		AMapArea.parentNode.style.height="100%";

		$scope.AMapId='container';

		$scope.mapObj;//存放初始化的地图对象
		$scope.isInitialed=false;
		$scope.centerLong=116.2736372882;
		$scope.centerLat=40.0641972545;


		$scope.initAMap=function(){
		 //if($scope.isInitialed)
		// {alert("初始化地图");
		 	//return;
		// 	}
		var position=new AMap.LngLat($scope.centerLong,$scope.centerLat);

		$scope.mapObj=new AMap.Map($scope.AMapId,{

		view:new AMap.View2D({
		resizeEnable: false,

		center:position,

		zoom:14,

		rotation:0

		}),

		lang:'zh_cn'

		});
		//加入缩放工具栏
		$scope.mapObj.addControl(new AMap.ToolBar());
		//加入鹰眼
		$scope.mapObj.addControl(new AMap.OverView());
		}

		//背景层开关函数
		$scope.iscover=false;
		 $scope.coverAction = function() {
				  if(!$scope.iscover)
				  {$ionicBackdrop.retain();$scope.iscover=true;}else{
                   $ionicBackdrop.release();$scope.iscover=false;
                }

/**/
              };



     // 生成关于模态窗口
		$ionicModal.fromTemplateUrl('templates/demo-about.html', function(modal)
		{
		$scope.aboutModal = modal; // 创建模态窗口 personModal
		}, {
				scope: $scope,
				animation: 'slide-in-up'
		});

		// 全局方法：打开窗口
		$scope.newAbout = function() {
		if(!curUser)
		     $scope.aboutModal.show();
		};

		// 全局方法：关闭窗口
		$scope.closeAbout = function() {
		     $scope.aboutModal.hide();
		};


     // 生成景点模态窗口
		$ionicModal.fromTemplateUrl('templates/spot-detail.html', function(modal)
		{
		$scope.detailModal = modal; // 创建模态窗口 personModal
		}, {
				scope: $scope,
				animation: 'slide-in-up'
		});

		// 全局方法：打开窗口
		$scope.newSpotdetail = function() {
		if(!curUser)
		     $scope.detailModal.show();
		};

		// 全局方法：关闭窗口
		$scope.closeSpotdetail = function() {
		     $scope.detailModal.hide();
		};



    //右上角的地图设置
		$scope.mapSetting=function(){
			// $scope.map.setCenter([$scope.]);
		};
     //实例化信息窗体
    var title = '方恒假日酒店<span style="font-size:11px;color:#F00;">价格:318</span>',
        content = [];
    content.push("<img src='http://tpc.googlesyndication.com/simgad/5843493769827749134'>地址：北京市朝阳区阜通东大街6号院3号楼东北8.3公里");
    content.push("电话：010-64733333");
    content.push("<a href='http://ditu.amap.com/detail/B000A8URXB?citycode=110105'>详细信息</a>");
    var infoWindow = new AMap.InfoWindow({
        isCustom: true,  //使用自定义窗体
        content: createInfoWindow(title, content.join("<br/>")),
        offset: new AMap.Pixel(16, -45)
    });

    //构建自定义信息窗体
    function createInfoWindow(title, content) {
        var info = document.createElement("div");
        info.className = "info";

        //可以通过下面的方式修改自定义窗体的宽高
        //info.style.width = "400px";
        // 定义顶部标题
        var top = document.createElement("div");
        var titleD = document.createElement("div");
        var closeX = document.createElement("img");
        top.className = "info-top";
        titleD.innerHTML = title;
        closeX.src = "http://webapi.amap.com/images/close2.gif";
        closeX.onclick = closeInfoWindow;

        top.appendChild(titleD);
        top.appendChild(closeX);
        info.appendChild(top);

        // 定义中部内容
        var middle = document.createElement("div");
        middle.className = "info-middle";
        middle.style.backgroundColor = 'white';
        middle.innerHTML = content;
        info.appendChild(middle);

        // 定义底部内容
        var bottom = document.createElement("div");
        bottom.className = "info-bottom";
        bottom.style.position = 'relative';
        bottom.style.top = '0px';
        bottom.style.margin = '0 auto';
        var sharp = document.createElement("img");
        sharp.src = "http://webapi.amap.com/images/sharp.png";
        bottom.appendChild(sharp);
        info.appendChild(bottom);
        return info;
    }

    //关闭信息窗体
    function closeInfoWindow() {
        $scope.mapObj.clearInfoWindow();
    }

		$scope.addFixedIcons=function(){

		//初始化待编辑的圆实例
		var circle = new AMap.Circle({
		map: $scope.mapObj,
		center:new AMap.LngLat($scope.centerLong,$scope.centerLat),
		radius:1050,
		strokeColor:'#F33',
		mapStyle:'light',
		strokeOpacity:1,
		strokeWeight:3,
		fillColor:'#ee2200',
		fillOpacity:0.35
		});

		//转到三维模型显示
		$scope.goto3DModel=function() {
    	//#/tab/dashbuilding
    	//alert('转');
    	//$location.path("#/tab/dashbuilding");
    	$scope.closeSpotdetail();
    	$state.go('tab.dash-building');
    	//closeSpotdetail();
    }

		//$scope会在每一次的地图刷新中重构，导致信息窗口的关闭函数引用丢失
		//这段代码可以直观的反应重构的顺序，画完窗口后，标注的坐标就又变了，而且窗口的关闭函数也丢失了
		for(var i=0;i<10;i++){
		//添加点标记，并使用自己的icon
    var newicon=new AMap.Marker({
        map: $scope.mapObj,
				position: new AMap.LngLat($scope.centerLong+Math.random()/8,$scope.centerLat+Math.random()/8),
				draggable: true,
      	cursor: 'move',
      	raiseOnDrag: true,
        icon: new AMap.Icon({
            size: new AMap.Size(40, 40),  //图标大小
            image: '../img/map/heritageBuilding.png',
            imageOffset: new AMap.Pixel(0, 0)
        })
    });

    AMap.event.addListener(newicon, 'click', function() {
    	//#/tab/dashbuilding
    	//alert('转');
    	//$location.path("#/tab/dashbuilding");
    	$scope.newSpotdetail();
    });
    	/*
    //鼠标点击marker弹出自定义的信息窗体
    AMap.event.addListener(newicon, 'click', function() {
        infoWindow.open($scope.mapObj, newicon.getPosition());
    });

    */
	}
		 /*
		//加载圆编辑插件
		var circleEditor;
		$scope.mapObj.plugin(["AMap.CircleEditor"],function(){

		//实例化时指定地图对象
		circleEditor = new AMap.CircleEditor($scope.mapObj,circle);
		});
		*/
		}


		$scope.doSomething=function(){alert('ok');
		};

		$scope.drawingCustomIcon=function(lnglat,iconUrl,iconSize,iconID,iconType,iconSet){
			//添加点标记，并使用自己的icon
	    var newicon=new AMap.Marker({
	        map: $scope.mapObj,
					position: lnglat,
					draggable: true,
        	cursor: 'move',
        	raiseOnDrag: true,
	        icon: new AMap.Icon({
	            size: new AMap.Size(iconSize, iconSize),  //图标大小
	            image: iconUrl,
	            imageOffset: new AMap.Pixel(0, 0)
	        })
	    });
	    	//高德的图标之外需要一些属性来显示详细值
	    	var newLabel={
	    	ID:iconID,
	    	TYPE:iconType,
	    	Address:lnglat,
	    	Description:iconType,
	    	mapIcon:{
					position: lnglat,
					draggable: true,
        	cursor: 'move',
        	raiseOnDrag: true,
	        icon: {
	            size: new AMap.Size(iconSize, iconSize),  //图标大小
	            image: '../img/map/heritageBuilding.png',
	            imageOffset: new AMap.Pixel(0, 0)
	        }
	    	}};
	    	//将特定的图标加入到不同的图标集合
	    	iconSet.push(newLabel);
	    }

	 $scope.drawAllIcon=function(iconObj){
	 	for (var item in iconObj) {
	 		//alert(item);
	 		}
	    var newicon=new AMap.Marker({
		        map: $scope.mapObj,
						draggable: iconObj.draggable,
						position: iconObj.position,
	        	cursor: iconObj.cursor,
	        	raiseOnDrag: iconObj.raiseOnDrag,
		        icon: new AMap.Icon({
		            size: new AMap.Size(iconObj.icon.size, iconObj.icon.size),  //图标大小
		            image: iconObj.icon.image,
		            imageOffset: new AMap.Pixel(0, 0)
		        })
		    });
	    };

		$scope.drawingHeritage=false;//绘制时用
		$scope.drawHeritage=true;//显示时用
		$scope.HeritageSet=new Array;
		$scope.drawingPersonMale=false;
		$scope.drawPersonMale=true;
		$scope.PersonMaleSet=new Array;
		$scope.drawPersonFemale=true;
		$scope.drawingPersonFemale=false;
		$scope.PersonFemaleSet=new Array;
		$scope.drawingInstallation=false;
		$scope.drawInstallation=true;
		$scope.InstallationSet=new Array;
		$scope.drawTruckers=true;
		$scope.drawingTruckers=false;
		$scope.TruckersSet=new Array;

		//地图刷新事件注册
		$scope.MapRefresh=function(){
			if($scope.isInitialed)return;
			/* //高德地图的点击事件
			//高德的图标之外需要一些属性来显示详细值
	    	var newLabel={
	    	ID:iconID,
	    	TYPE:iconType,
	    	Address:lnglat,
	    	Description:iconType,
	    	mapIcon:newicon
	    	};
			*/
			AMap.event.addListener($scope.mapObj,'complete',function() {
       //alert("地图图块加载完毕！当前地图中心点为：" + $scope.mapObj.getCenter());;

			if($scope.drawHeritage){
				var iconUrl='../img/map/heritageBuilding.png';
				for (var item in $scope.HeritageSet) {
					 // code to be executed
					$scope.drawAllIcon(item.mapIcon);
				}
				}
			else if ( $scope.drawPersonMale) {
				var iconUrl='../img/map/man.png';
				for (var item in $scope.PersonMaleSet) {
					 // code to be executed
					$scope.drawAllIcon(item.mapIcon);
				}
				}
			else if ( $scope.drawPersonFemale) {
				var iconUrl='../img/map/woman.png';
				for (var item in $scope.PersonFemaleSet) {
					 // code to be executed
					$scope.drawAllIcon(item.mapIcon);
				}
				}
			else if (	$scope.drawInstallation) {
				var iconUrl='../img/map/installation.png';
				for (var item in $scope.InstallationSet) {
					 // code to be executed
					$scope.drawAllIcon(item.mapIcon);
				}
				}
			else if (	$scope.drawTruckers) {
				var iconUrl='../img/map/engineering_truck.png';
				for (var item in $scope.TruckersSet) {
					 // code to be executed
					$scope.drawAllIcon(item.mapIcon);
				}
				}

    	});

		};

		//鼠标点击事件注册
		$scope.ListenClick=function(){
			/* //高德地图的点击事件
			AMap.event.addListener($scope.mapObj,'click',function(e){
			var lnglat=e.lnglat;
			marker=new AMap.Marker({
			map:$scope.mapObj,
			position:e.lnglat,
			icon:"http://webapi.amap.com/images/0.png",
			offset:new AMap.Pixel(-10,-34)
			// content:m
			});
			$scope.mapObj.setCenter(lnglat);
			});*/
			if($scope.isInitialed)return;
			AMap.event.addListener($scope.mapObj,'click',function(e){
				var lnglat=e.lnglat;
				var iconSize=40;
			if($scope.drawingHeritage){
				var iconUrl='../img/map/heritageBuilding.png';
				$scope.drawingCustomIcon(lnglat,iconUrl,iconSize,123,'heritage',$scope.HeritageSet);
				}
			else if ( $scope.drawingPersonMale) {
				var iconUrl='../img/map/man.png';
				$scope.drawingCustomIcon(lnglat,iconUrl,iconSize,123,'Male',$scope.PersonMaleSet);
				}
			else if ( $scope.drawingPersonFemale) {
				var iconUrl='../img/map/woman.png';
				$scope.drawingCustomIcon(lnglat,iconUrl,iconSize,123,'Female',$scope.PersonFemaleSet);
				}
			else if (	$scope.drawingInstallation) {
				var iconUrl='../img/map/installation.png';
				$scope.drawingCustomIcon(lnglat,iconUrl,iconSize,123,'Installation',$scope.InstallationSet);
				}
			else if (	$scope.drawingTruckers) {
				var iconUrl='../img/map/engineering_truck.png';
				$scope.drawingCustomIcon(lnglat,iconUrl,iconSize,123,'Truckers',$scope.TruckersSet);
				}
			});
		};

		//标注响应事件，
		$scope.beginDraw=function(type){
				$scope.drawingHeritage=false;
				$scope.drawingPersonMale=false;
				$scope.drawingPersonFemale=false;
				$scope.drawingInstallation=false;
				$scope.drawingTruckers=false;
				//alert($scope.HeritageSet.length);
		if(type=='H'){
						$scope.drawingHeritage=true;
				}
			else if ( type=='M') {
						$scope.drawingPersonMale=true;
				}
			else if ( type=='W') {
						$scope.drawingPersonFemale=true;
				}
			else if (	type=='I') {
						$scope.drawingInstallation=true;
				}
			else if (	type=='T') {
						$scope.drawingTruckers=true;
				}


		//$scope.ListenClick();

		};


		$scope.btnBarShow=false;
		//左上角的应用设置
		$scope.locationAppSetting=function(){
			//$scope.btnBarShow=true;
			//alert('1');
			$scope.btnBarShow=!($scope.btnBarShow);
			};


		$scope.movieTestData={
			"name": "未来警察23188",
			"alias": ["Future X-Cops ","Mei loi ging chaat"],
			"publish": "2010-04-29",
			"images":{
			"coverBig":"/img/movie/1_big.jpg",
			"coverSmall":"/img/movie/1_small.jpg"
			},
			"source":[{
			"source":"优酷",
			"link":"http://www.youku.com",
			"swfLink":"http://player.youku.com/player.php/sid/XMTY4NzM5ODc2/v.swf",
			"quality":"高清",
			"version":"正片",
			"lang":"汉语",
			"subtitle":"中文字幕"
			},{
			"source":"搜狐",
			"link":"http://tv.sohu.com",
			"swfLink":"http://share.vrs.sohu.com/75837/v.swf&topBar=1&autoplay=false&plid=3860&pub_catecode=",
			"quality":"高清",
			"version":"正片",
			"lang":"汉语",
			"subtitle":"中文字幕"
			}]
			};

		$scope.resMsg='';
		$scope.uploadMovieTestData=function(movieData){
		//在服务器端做完跨域之后，这两种post方式就一样了
		//$http.post( 'http://localhost:3000/movie/add', $scope.movieTestData);//
		//在服务器端做完跨域之后，这两种post方式就一样了
		$http({
         method:'POST',
         url:'http://127.0.0.1:3000/movie/add',
         data:$scope.movieTestData,
        //params:[data:$scope.movieTestData ],
         headers: {'Content-Type': 'application/json;charset=utf-8'},
         dataType:'JSON'

         })
		.success(function(data,status,headers,config){
              $scope.resMsg=data;
         }).error(function(data,status,headers,config){

         });
		};/* */




	/*
			//获取手机位置
		$scope.location = function () {
        //获取地理位置
        document.addEventListener("deviceready", function (success) {
            var posOptions = { timeout: 10000, enableHighAccuracy: false };
            $cordovaGeolocation
              .getCurrentPosition(posOptions)
              .then(function (position) {
                  var lat = position.coords.latitude;
                  var long = position.coords.longitude;
                  alert("已经成功定位."+long+"<>"+lat);
              }, function (err) {
                 alert("无法获取地理位置.");
                  return;
              });
        }, false);
    };
	*/

   //拍照片函数
		$scope.takePhoto=function(){
    var options = {
                                                                 //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
        quality: 100,                                            //相片质量0-100
        destinationType: Camera.DestinationType.FILE_URI,        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
        sourceType: Camera.PictureSourceType.CAMERA,             //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是景区图库
        allowEdit: false,                                        //在选择之前允许修改截图
        encodingType:Camera.EncodingType.JPEG,                   //保存的图片格式： JPEG = 0, PNG = 1
        targetWidth: 200,                                        //照片宽度
        targetHeight: 200,                                       //照片高度
        mediaType:0,                                             //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
        cameraDirection:0,                                       //枪后摄像头类型：Back= 0,Front-facing = 1
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true                                   //保存进手机相册
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
        CommonJs.AlertPopup(imageData);
        var image = document.getElementById('myImage');
        image.src=imageData;
        //image.src = "data:image/jpeg;base64," + imageData;
    }, function(err) {
        // error
        CommonJs.AlertPopup(err.message);
    });

};
	});

mainctr.controller('3dbuildingCtrl', function($scope, $ionicBackdrop,$ionicPopup, $http) {
	$scope.height=800;
	$scope.width=800
	;
});
