// Ionic Starter App
// var curUser='';



//angular tree空间的模块名
// ,'ui.tree'
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'chart.js', 'starter.directives', 'ionic.wizard','ngCordova','ui.tree', 'monospaced.elastic'])
// 'ion-tree-list'

.run(function($ionicPlatform, $rootScope,$timeout,$cordovaDevice,$ionicActionSheet,$ionicHistory, $timeout, $cordovaAppVersion,
$state,$http,HeritagePoints,$ionicPopup,
$ionicLoading, $cordovaFileTransfer, $cordovaFile, $cordovaFileOpener2,$location,userService,localStorageService,departmentAndPersonsService)
{
  // 用户的手机号，启动时就自动获取了，后面还可以判断有没有换手机（uuid）或者换手机号
  $rootScope.phoneNum='';
	$rootScope.editable=false;
  $rootScope.afterSigninTopage = 'tab.dash';
  // $rootScope.afterSigninTopage = 'tab.account-login-step2';
  // $rootScope.afterSigninTopage = 'tab.account-login';
  //当前用户，一切操作的基础
  $rootScope.curUser
    ={
    name:'',			//姓名
    sex:'',			//性别
    nation:'',		//民族
    birthday:'',		//生日
    residence:'',		//住所
    idNum:'',			//身份证号码
    side:'',		//值为'obverse'

    idUrl:'',			//身份证图片地址
    mobile:'',			//手机号码
    mobileUUid:'',		//手机UUID
    images :{
      coverSmall:'',
      coverBig:''
    }
  };
  $rootScope.roleInDepartment=[{
    role:'worker',
    name:"员工"
  },{
    role:'admn',
    name:"负责人"
  },{
    role:'dpadm',
    name:"副负责人"
  }
    // ,{
    //   role:1,
    //   name:"员工"
    // }
  ];

  //地图上的所有可移动目标
  $rootScope.movingObjs;
  //当路由跳转的时候，判断是不是到手工添加了返回按钮的页面，在某些情况下禁止手工按钮
  // $rootScope.showChatDetailsViewBackBotton=true;
	//true表示隐藏用户管理标签，显示其他功能标签，用于已经登录用户后的使用操作
	//false表示。。。
   $rootScope.hideAccountTab=($rootScope.curUser && $rootScope.curUser._id)?false:true;
  //$rootScope.hideAccountTab=false;
  // 15分钟内定位，视为在线
  $rootScope.onlineTime = 15;
  //应用服务器网址
  // $rootScope.applicationServer = 'http://120.76.228.172:2000';
  $rootScope.applicationServer = 'http://120.76.228.172:2000/';//nodejs应用服务器
  // $rootScope.applicationServer = 'http://localhost:2000/';//测试本机

  $rootScope.fileServer = 'http://120.76.228.172:80/';//静态文件服务器
  //发布服务器网址，自动更新app的地方
  $rootScope.publishServer = 'http://120.76.228.172:80';//apps升级文件静态文件服务器
  //true表示在桌面系统上测试，不用通过手机uuid获取用户了
  $rootScope.dstpTest=false;
  // $rootScope.dstpTest=true;
  //当前的地图跟踪对象
  $rootScope.focusMapObject;
  //当前用户的地图标注对象
  $rootScope.curUserMapIcon;


  $rootScope.locationRefreshTime=10000;//刷新定位数据的时段，默认10000，十秒
  $rootScope.messageRefreshTime=5000;//刷新消息列表数据的时段，默认6000，六秒
  $rootScope.messageDetailRefreshTime=2000;//刷新消息数据的时段，默认6000，六秒

  //在地图页面启动周期性函数
  $rootScope.mapEngineTimer;
  //在地图页面启动周期性函数
  $rootScope.mapEngine={};
  //在消息页面启动周期性函数
  $rootScope.messageEngineTimer;
  //在地图页面启动周期性函数
  $rootScope.messageEngine={};
  //在地图页面启动周期性函数
  $rootScope.messageDetailEngineTimer;
  //在地图页面启动周期性函数
  $rootScope.messageDetailEngine={};
  //调用手机相机拍身份证照片的配置
  $rootScope.IDCardOptions={
    quality: 100,
    targetWidth: 700,
    targetHeight: 440,
//		width: 700,
//		height: 440,
    //destinationType: navigator.camera.DestinationType.DATA_URL,//FILE_URI,//DATA_URL,//带navigator的这几句都容易报错
    //sourceType: navigator.camera.PictureSourceType.CAMERA,
    allowEdit: true,
    //encodingType: navigator.camera.EncodingType.JPEG,
    saveToPhotoAlbum: true,
    correctOrientation:true
  };
  //调用手机相机拍摄普通照片的配置
  $rootScope.CommonImgOptions = {
    quality: 75,
    targetWidth: 800,
    targetHeight: 1200,
    saveToPhotoAlbum: false,
    correctOrientation:true
  };


  localStorageService.clear('curUser');
	//根据设备uuid获得用户
  $rootScope.refreshCurUser=function(callback) {
    //将查询来的用户信息赋给本地全局对象
    $rootScope.curUser=localStorageService.get('curUser',60*24);//在缓存中得到24 hour 内的值了
    // console.log('根据设备uuid获得用户curUser：', $rootScope.curUser);		 //子级能得到值
    if(!$rootScope.curUser){
          var uuid;
          if(!$rootScope.dstpTest)//设置当前正在桌面测试
          {
            if($cordovaDevice)
            uuid = $cordovaDevice.getUUID();//说明手机设备存在
          }
          else//部署时必须删掉
            uuid ='';//桌面测试用测试的uuid
      // 调用服务进行用户查询，这个服务会广播两个消息，一个说用户查询失败，一个说用户查询成功，并且已经存入缓存
          userService.refreshCurUser(uuid,$rootScope.applicationServer);
        }else if($rootScope.curUser._id!=''){
          localStorageService.update('curUser',$rootScope.curUser);//刷新的意思也有刷新缓存的意思
          // console.log('根据设备uuid获得用户curUser：', $rootScope.curUser._id);		 //子级能得到值
          $rootScope.hideAccountTab=($rootScope.curUser && $rootScope.curUser._id)?false:true;
          $rootScope.$broadcast('rootUserReady', $rootScope.curUser);
        }
 	};

  //根据用户id获得用户照片
  $rootScope.getUserPicById=function(personId,callback) {
    //将查询来的用户信息赋给本地全局对象
    var personPic=localStorageService.get('UserPIc_'+personId,60*24);//在缓存中得到长期保存的照片
    // console.log('根据用户id获得用户照片curUser：', personId);		 //子级能得到值
    if(!personPic){
      //如果没有照片，就去服务器取
       userService.refreshUserPicById(personId,$rootScope.applicationServer,callback);
       return;
    }
   if(callback) {callback(personId,personPic);return;}
    return personPic;
  };


  $rootScope.$on('curUserRefreshFail', function(event,data) {
    // console.log('curUser：', data._id);		 //子级能得到值
    $rootScope.refreshCurUser();
  });

  $rootScope.$on('curUserReady', function(event,data) {
    // console.log('curUser：', data._id);		 //子级能得到值
    $rootScope.refreshCurUser();
  });

  $rootScope.$on('$stateChangeStart', function(event, toself, toParams, from, fromParams) {
    // alert(JSON.stringify(toself)+'《页面跳转》'+' $state'+ JSON.stringify(from));
    //如果是要去跟注册有关的页面
    if(toself.name=='main.intro'|| toself.name=='tab.account-login'|| toself.name=='tab.account-login-step1'|| toself.name=='tab.account-login-step2' ){
      //防止用户返回，多次注册
      //第一个值确保这是从服务器取回的用户
      if($rootScope.curUser && $rootScope.curUser._id && $rootScope.curUser.idNum && $rootScope.curUser.name && $rootScope.curUser.mobileUUid){
        event.preventDefault();
        // alert('防止用户返回，多次注册');
        //进入注册页面应该看不到tab的按钮，不能进入地图等页面
        $rootScope.hideAccountTab=($rootScope.curUser && $rootScope.curUser._id)?false:true;
        //只要有用户就进入地图
        $state.go($rootScope.afterSigninTopage);
      }
    }
  });


  //进入有引擎的地方要把它打开
  $rootScope.$on('$ionicView.enter', function( event, enteringData ) {

    if(enteringData.stateName=='tab.chat-messageDetail' && $rootScope.messageDetailEngine.engineStop)
    {
      // enteringData.showBack=false;
      $rootScope.messageDetailEngine.engineStop();
      $rootScope.messageDetailEngine.engineRun();
    }
    if(enteringData.stateName=='tab.chats' && $rootScope.messageEngine.engineStop)
    {
      $rootScope.messageEngine.engineStop();
      $rootScope.messageEngine.engineRun();
    }
    if(enteringData.stateName=='tab.dash' && $rootScope.mapEngine.engineStop)
    {//地图的刷新看样子是不能停了
      // $rootScope.mapEngine.engineStop();
      $rootScope.mapEngine.engineRun();
    }
  });
  // 离开有引擎的地方要把它关掉
  $rootScope.$on('$ionicView.leave', function( event, enteringData ) {
    if(enteringData.stateName=='tab.chats')
      {
        $rootScope.messageEngine.engineStop();
      }
    if(enteringData.stateName=='tab.dash')
    {//地图的刷新看样子是不能停了，否则同事位置之类的信息就没有了
      // $rootScope.mapEngine.engineStop();
    }
    if(enteringData.stateName=='tab.chat-messageDetail')
    {
      $rootScope.messageDetailEngine.engineStop();
    }
    // var str='';
    // for(var obj in enteringData)
    // {
    //   str+=obj+';';
    // }
    // str+='《下一个》';
    // for(var obj in event)
    // {
    //   str+=obj+';';
    // }
    // console.log("event:"+event.name+'《页面view离开》'+' enteringData:'+enteringData.stateName+"。str:"+str);
    // console.log(scopes+JSON.stringify(scopes)+'《页面view进入》');//+' $state'+ JSON.stringify(states)+states

  });

  //这个有意义，就是ionic的运行环境准备好了，跟cordova沟通好了，cordova跟硬件设备沟通好了
	//这之后，才能安全地调用硬件设备，这个想法大概是，缺乏全面测试
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

          }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    if (window.SignalStrength) {
      //获取信号强度，进行提示
      //需要在设施准备好之后才能实施
      window.SignalStrength.dbm(function(db){
        console.log(db);
      });
    };

    // 通过sim插件获取手机号，存到当前用户
    if(window.plugins){
        if(window.plugins.sim){
          window.plugins.sim.getSimInfo(function(res){
            $rootScope.phoneNum=res.phoneNumber;
              // alert( 'phone num:'+res.phoneNumber);
            }, function(){
            $rootScope.phoneNume ='';
            }
          );
        }
    };
//     //调用手机相机拍身份证照片的配置
//     $rootScope.IDCardOptions={
//       // quality: 100,
//       // targetWidth: 700,
//       // targetHeight: 450,
// //		width: 700,
// //		height: 440,
//       //destinationType: navigator.camera.DestinationType.DATA_URL,//FILE_URI,//DATA_URL,//带navigator的这几句都容易报错
//       //sourceType: navigator.camera.PictureSourceType.CAMERA,
//       // allowEdit: true,
//       //在桌面系统上测试时，需要注释这句
//       // encodingType:Camera.EncodingType.JPEG,
//       // destinationType:Camera.DestinationType.FILE_URI,
//       // mediaType: Camera.MediaType.PICTURE,
//       // saveToPhotoAlbum: true
//       // ,
//       // correctOrientation:true
//     };
//
//     //调用手机相机拍摄普通照片的配置
//     $rootScope.CommonImgOptions = {
//       quality: 75,
//       targetWidth: 800,
//       targetHeight: 1200,
//       // saveToPhotoAlbum: false
//       // destinationType:Camera.DestinationType.FILE_URI,
//       allowEdit: true,
//       //在桌面系统上测试时，需要注释这句
//       // encodingType:Camera.EncodingType.JPEG,
//       // mediaType: Camera.MediaType.PICTURE,
//       saveToPhotoAlbum: true,
//       correctOrientation:true
//     };


    $rootScope.checkConnection=function() {
      var networkState = navigator.connection.type;

      var states = {};
      states[Connection.UNKNOWN]  = 'Unknown connection';
      states[Connection.ETHERNET] = 'Ethernet connection';
      states[Connection.WIFI]     = 'WiFi connection';
      states[Connection.CELL_2G]  = 'Cell 2G connection';
      states[Connection.CELL_3G]  = 'Cell 3G connection';
      states[Connection.CELL_4G]  = 'Cell 4G connection';
      states[Connection.CELL]     = 'Cell generic connection';
      states[Connection.NONE]     = 'No network connection';

      alert('[Connection](connection.html) type: ' + states[networkState]);
    }

    //在启动周期性网络查询函数，周期与地图定位引擎两倍一致,没网络就掉线
    $rootScope.checkNetworkTimer=window.setInterval(
      function(){
        var networkState = navigator.connection.type;
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = false;
        if(!states[networkState]){
          $ionicPopup.alert({
            title:'<h4>无网络</h4>',
            template: "<br><h4>'当前没有网络连接或掉线.'</h4>",
            okText: '确认'
          });
          $timeout(function() {
            // 以前是掉线就退出
            // ionic.Platform.exitApp();
            //如果不在后台，那么就进入后台了
            if(!cordova.plugins.backgroundMode.isActive()){
              cordova.plugins.backgroundMode.moveToBackground();
            }
          }, 2000);
        }
      }
      ,$rootScope.locationRefreshTime*2);



    //启动时就刷新一下用户,通过调用服务进行查询，如果成功则不再调用，如果失败则继续查询调用
    $rootScope.refreshCurUser();
    //后台模式插件
    if(cordova && cordova.plugins.backgroundMode)
    {
      cordova.plugins.backgroundMode.setEnabled(true);
      // 取代后退键,结果就1键后退到后台了，使用感觉是不太好的
      // cordova.plugins.backgroundMode.overrideBackButton();
      // gps定位等系统api调用需要取消省电模式
      cordova.plugins.backgroundMode.on('activate', function() {
        cordova.plugins.backgroundMode.disableWebViewOptimizations();
      });
    }

    // 正常情况下的后退键
    $ionicPlatform.registerBackButtonAction(function (e) {
      e.preventDefault();
      function showConfirm() {
        var confirmPopup = $ionicPopup.confirm({
          title: '<strong>退出应用?</strong>',
          template: '你确定要退出应用吗?',
          okText: '退出',
          cancelText: '取消'
        });

        confirmPopup.then(function (res) {
          if (res) {
            // ionic.Platform.exitApp();
            cordova.plugins.backgroundMode.moveToBackground();
          }
          else {
            // Don't close
          }
        });
      }

      // Is there a page to go back to?
      if ($location.path() == '/tab/dash' ) {
        showConfirm();
      } else if ($ionicHistory.backView()) {
        $ionicHistory.goBack();
      } else {
        // This is the last page: Show confirmation popup
        showConfirm();
      }

      return false;
    }, 101);

		 //延迟splash screnn 隐藏时间,不然会有短暂的白屏出现
		 setTimeout(function () {
		   if(navigator && navigator.splashscreen)
		     navigator.splashscreen.hide();
		 }, 200);

		 try {
       if(!$rootScope.dstpTest){//如果不是在桌面测试，才获取新版本
         $http.get($rootScope.publishServer+'/app/ver.json').then(function(data){
           //alert("====>>服务器"+data+"<>");
           var serverAppVersion = data.data.verInfo;//服务器ver.json 版本verInfo
           //alert("====>>服务器"+serverAppVersion);
           //android平台中打开AndroidManifest.xml文件可以设置当前apk版本号
           $cordovaAppVersion.getVersionNumber().then(function(version) {
             //alert("version=====本机>>>"+version+"====>>服务器"+serverAppVersion);
             if (version != serverAppVersion) {
//                $ionicLoading.show({
//                    template: "已经下载：0%"
//                });
               var url = $rootScope.publishServer+"/app/"+data.data.apkName+".apk";     //服务器ver.json apk 文件名apkName
               var targetPath = "file:///mnt/sdcard/Download/android-debug.apk";
               var trustHosts = true
               var options = {};
               //alert("开始下载>>>"+ $cordovaFileTransfer+"<<====>>"+url+"<<====>>");
               $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
                 //alert("开始下载>>>"+result+"====>>服务器");
                 $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive'
                 ).then(function () {
                 }, function (err) {
                 });
//                    $ionicLoading.hide();
               }, function (err) {
                 alert('下载失败'+err);
               }, function (progress) {
                 $timeout(function () {
                   var downloadProgress = (progress.loaded / progress.total) * 100;
//                        $ionicLoading.show({
//                            template: "已经下载：" + Math.floor(downloadProgress) + "%"
//                        });
                   if (downloadProgress > 99) {
//                            $ionicLoading.hide();
                   }
                 })
               });
             }
           });
         });
       };
     }catch (err){
		   cousole.log('自动更新app版本出错:'+err);
     }

     //
    // 得到所有部门为用户注册做准备，30分钟内有效
    $rootScope.alldepartments=localStorageService.get("allDepartments", 30);
    if(!$rootScope.alldepartments)
    {
      departmentAndPersonsService.getAllDepartment($rootScope.applicationServer);
    }
     //服务器上保存版本信息,自动更新app
    //alert("====>>服务器"+$rootScope.publishServer+'/app/ver.json'+"<>");
    // localStorageService.clear('curUser');



  });



}).filter('trusted', ['$sce', function ($sce) {
  return function(url) {
    return $sce.trustAsResourceUrl(url);
  };}])
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider,$compileProvider) {
  // $compileProvider.imgSrcSanitizationWhitelist(/^\s*(blob):/);
    //编译时注意 img的src如果是data形式要编译，大概是这个意思,这样设置一下白名单之后，就可以显示base64的图片了
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https|http|ftp|mailto|file|tel|data|blob|video|mp4|jpg):|data:image\//);
		// Use x-www-form-urlencoded Content-Type
		//在客户端做跨域好像是没有用的
    //$httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';

    //把tabs的按钮放在app下面，否则默认在上面，不便操作
    $ionicConfigProvider.platform.ios.tabs.style('standard');
		$ionicConfigProvider.platform.ios.tabs.position('bottom');
		$ionicConfigProvider.platform.android.tabs.style('standard');
		$ionicConfigProvider.platform.android.tabs.position('bottom');
		$ionicConfigProvider.platform.ios.navBar.alignTitle('center');
		$ionicConfigProvider.platform.android.navBar.alignTitle('center');
		$ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
		$ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');
		$ionicConfigProvider.platform.ios.views.transition('ios');
		$ionicConfigProvider.platform.android.views.transition('android');
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  //开始的导航界面
      .state('main', {
          url: '/start',
          abstract: true,
          template: '<ion-nav-view></ion-nav-view>'
      })

      .state('main.intro', {
          url: '/intro',
          templateUrl: 'templates/intro.html',
          controller: 'IntroCtrl'
      })
  // setup an abstract state for the tabs directive
  //原始示例是虚状态，这里改成实的，就有controller了，可以设置一些状态。
    .state('tab', {
    url: '/tab',
    //cache: false,//貌似这个属性没有用
    //abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'TabCtrl'
  })

  // Each tab has its own nav history stack:
  // 就是地图页面
  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-map.html',
        controller: 'MapCtrl2'
      }
    }
  })
  //这个是用webgl看三维建筑物的页面
  .state('tab.dash-building', {
    url: '/dashbuilding',
    cache: false,
    views: {
      'tab-dash': {

        templateUrl: 'templates/tab-map-3dbuilding.html',
        controller: '3dbuildingCtrl'
      }
    }
  })
    //测试侧边栏
    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          // templateUrl: 'templates/tab-account.html',
          templateUrl: 'templates/tab-allPersons.html',
          // controller: 'MapCtrl2'
          controller: 'allPersonsCtrl'
        }
      }
    })
    .state('tab.account-login', {
      url: '/accountlogin',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account-login.html',
          controller: 'AccountLoginCtrl'
        }
      }
    })
    .state('tab.account-login-step1', {
      url: '/accountlogin1',
      cache: false,
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account-login1.html',
          controller: 'AccountLoginCtrl'
        }
      }
    })
    .state('tab.account-login-step2', {
      url: '/accountlogin2',
      cache: false,
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account-login2.html',
          controller: 'AccountLoginCtrl'
        }
      }
    })
    .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })/**/
    //  .state('tab.chat-detail', {
    //   url: '/chats/:chatId',
    //   cache: false,
    //   views: {
    //     'tab-chats': {
    //       templateUrl: 'templates/chat-detail.html',
    //       controller: 'ChatDetailCtrl'
    //     }
    //   }
    // })
    .state('tab.chat-messageDetail', {
      url: '/chats/:senderId/:senderName/:startTime',
      // templateUrl: "templates/message-detail.html",
      // controller: "messageDetailCtrl",
      views: {
        'tab-chats': {
          templateUrl: 'templates/message-detail.html',
          controller: 'messageDetailCtrl'
        }
      }
    })
  //政务管理
   .state('tab.management', {
    url: '/management',
    views: {
      'tab-management': {
        templateUrl: 'templates/tab-management.html',
        controller: 'ManagementCtrl'
      }
    }
  })
  //部门管理
  .state('tab.department', {
    url: '/department',
    views: {
      'tab-department': {
        templateUrl: 'templates/tab-department.html',
        controller: 'DepartmentCtrl'
      }
    }
  })
  .state('tab.management-schedule', {
    url: '/managementschedule',
    cache: false,
    views: {
      'tab-management': {
        templateUrl: 'templates/tab-management-schedule.html',
        controller: 'ManagementScheduleCtrl'
      }
    }
  })
  //各类事件的上报
  .state('tab.management-report', {
    url: '/managementreport',
    cache: false,
    views: {
      'tab-management': {
        templateUrl: 'templates/tab-management-report.html',
        controller: 'ManagementReportCtrl'
      }
    }
  })
  //行政管理，上报信息
  .state('tab.management-sendmessage', {
    url: '/managementsendmessage',
    cache: false,
    views: {
      'tab-management': {
        templateUrl: 'templates/tab-management-sendmessage.html',
        controller: 'ManagementReportCtrl'
      }
    }
  })
  .state('tab.management-installations', {
    url: '/managementinstallations',
    cache: false,
    views: {
      'tab-management': {
        templateUrl: 'templates/tab-management-installations.html',
        controller: 'ManagementInstallationsCtrl'
      }
    }
  })
  //本地要闻系列
   .state('tab.news', {
    url: '/news',
    views: {
      'tab-news': {
        templateUrl: 'templates/tab-news.html',
        controller: 'NewsCtrl'
      }
    }
  })
  //本地要闻系列的详细页面
  .state('tab.news-detail', {
      url: '/news/:hpdetailId',
      cache: false,
      views: {
      'tab-news': {
        templateUrl: 'templates/tab-news.html',
        controller: 'NewsCtrl'
      }
      }
    })
    .state('tab.news-item', {
    url: '/news/item/:itemid',
    cache: false,
     views: {
      'tab-news': {
        templateUrl: 'templates/tab-account.html',
        controller: 'ManagementCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/tab/dash');
    // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/start/intro');

});

Date.prototype.formate=function(fmt) {
  var o = {
    "M+" : this.getMonth()+1, //月份
    "d+" : this.getDate(), //日
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
    "H+" : this.getHours(), //小时
    "m+" : this.getMinutes(), //分
    "s+" : this.getSeconds(), //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S" : this.getMilliseconds() //毫秒
  };
  var week = {
    "0" : "\u65e5",
    "1" : "\u4e00",
    "2" : "\u4e8c",
    "3" : "\u4e09",
    "4" : "\u56db",
    "5" : "\u4e94",
    "6" : "\u516d"
  };
  if(/(y+)/.test(fmt)){
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
  if(/(E+)/.test(fmt)){
    fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[this.getDay()+""]);
  }
  for(var k in o){
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }
  return fmt;
} ;

