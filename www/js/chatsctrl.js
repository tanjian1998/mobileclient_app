
var mainctr=angular.module('starter.controllers');
mainctr.controller('ChatsCtrl', function($scope, $ionicBackdrop,$ionicPopup, $http,$state,$ionicScrollDelegate,$timeout,  localStorageService, messageService,$rootScope,$ionicModal,departmentAndPersonsService) {

  var viewScroll = $ionicScrollDelegate.$getByHandle('messageScroll');
  //所有的单位
  $scope.isNeedRefreshDepartmentsAuto=true;
  $scope.doRefresh=function () {
    var isNeedRefreshPersons=true;
    //下拉刷新单位和人员
    $scope.refreshDepartments($rootScope.curUser,isNeedRefreshPersons);
    $timeout(function() {
      // viewScroll.scrollBottom();
      $scope.$broadcast('scroll.refreshComplete');
      viewScroll.scrollTop();
    }, 800);
  }

  //测试一下加载人员后的单位树
  //console.log('测试一下从缓存读出的人员消息后');
  var str = JSON.stringify($scope.alldepartmentsAndPersonMessages);
  //console.log(str);
  //抓获动态页面
  // http://www.cnblogs.com/xinzhyu/p/4214669.html
  /**
   * 引擎初始化,读取和应用一些设置
   */
  $rootScope.messageEngine.engineInitialise =function(params) {
    if($scope.isNeedRefreshDepartmentsAuto)
    // 刷新部门和人员
    {
      var isNeedRefreshPersons=true;
      $scope.refreshDepartments($rootScope.curUser,isNeedRefreshPersons);
    }
    // $scope.refreshDepartmentPersons()

  }


  /***
   * 引擎运行
   */
  $rootScope.messageEngine.engineRun =function(params) {
    //引擎设置好就开始运行
    // alert( '中文试试');
    // alert( $rootScope.messageEngine.engineRun);
    // alert( '中文试试2');
    $rootScope.messageEngine.engineInitialise();

    $scope.checkDepartmentAndPersonJsonObj();
    //在地图页面启动周期性函数
    $rootScope.messageEngineTimer=window.setInterval(
      function(){
        // alert('ok');
        // 只有有用户的时候，才开始地图循环
        if($rootScope.curUser && $rootScope.curUser._id)
        //开始定位刷新地图
        {
          $scope.refreshAllMessageList();
        }



      }
      ,$rootScope.messageRefreshTime);
  }

  $rootScope.messageEngine.enginePause =function(params) {

  }

  $rootScope.messageEngine.engineResum =function(params) {

  }

  $rootScope.messageEngine.engineStop =function(params) {
    if($rootScope.messageEngineTimer)
      window.clearInterval($rootScope.messageEngineTimer);
    $rootScope.messageEngineTimer=null;
  }



  //根据各异步返回值组装数据对象
  $scope.checkDepartmentAndPersonJsonObj=function () {
    //console.log('调用了 checkDepartmentAndPersonJsonObj');
    $scope.alldepartmentsAndPersonMessages=localStorageService.get("allInvolvedDepartments",30);
    if(!$scope.alldepartmentsAndPersonMessages){
      $scope.refreshDepartments($rootScope.curUser);
        //组装单位人员nvolvedDepartmentsList($rootScope.curUser,$rootScope.applicationServer);
        return;
      }
      var isWaitingforIO=false;
    //组装单位
    for(var indd=0;indd<$scope.alldepartmentsAndPersonMessages.length;indd++){
      var did=$scope.alldepartmentsAndPersonMessages[indd]._id;
        // localStorageService.clear("allPersonsUkSeeInDepartment"+did);
        $scope.alldepartmentsAndPersonMessages[indd].persons=localStorageService.get("allPersonsUkSeeInDepartment"+did,30);
        if(!$scope.alldepartmentsAndPersonMessages[indd].persons){
          $scope.refreshDepartmentPersons($scope.alldepartmentsAndPersonMessages[indd]);
          isWaitingforIO=true;
          continue;
        }
      }

      if(isWaitingforIO)return;
    //测试一下加载人员后的单位树
    //console.log('通过广播测试一下人员后的单位树');
    // var str = JSON.stringify($scope.alldepartmentsAndPersonMessages);
    //console.log(str);
  };

  //每次循环必须执行的函数，刷新人员列表中的所有人员
  $scope.refreshAllMessageList=function(){

    if(!($scope.alldepartmentsAndPersonMessages && $scope.alldepartmentsAndPersonMessages.length>0))return;
    //组装单位
    for(var indd=0;indd<$scope.alldepartmentsAndPersonMessages.length;indd++){
      if($scope.alldepartmentsAndPersonMessages[indd].isDeleted)continue;//如果已经被标识为被删除，即最近一次刷新部门时，不在服务器部门列表里
      if(!($scope.alldepartmentsAndPersonMessages[indd].persons && $scope.alldepartmentsAndPersonMessages[indd].persons.length>0))continue;//这个单位下属没有人员，不用装配
      for(var inddt=0;inddt<$scope.alldepartmentsAndPersonMessages[indd].persons.length;inddt++){
        var sender=$scope.alldepartmentsAndPersonMessages[indd].persons[inddt].person;
          $scope.refreshMessageListByPersonID(sender._id);//无脑怒刷
      }
    }
}

  //装配部门
  $scope.assembleDepartments=function () {
    var cacheDpts=localStorageService.get("allInvolvedDepartments",60*24);
    //console.log("装配部门 assembleDepartments started：" + cacheDpts+"<部门数量>");
    if(!(cacheDpts && cacheDpts.length))return;//没有装配的必要
    // 下面就是装配部门到本页面需要的数据列表中
    //console.log("装配部门 assembleDepartments started：" + cacheDpts.length+"<直接赋值>");
    if(!($scope.alldepartmentsAndPersonMessages && $scope.alldepartmentsAndPersonMessages.length)){
      $scope.alldepartmentsAndPersonMessages=new Array();
      $scope.alldepartmentsAndPersonMessages=cacheDpts;//直接赋值

      //console.log("装配部门 assembleDepartments ended：" + cacheDpts.length+"<直接赋值>");
      return;
    }
    //组装单位
    for(var indd=0;indd<$scope.alldepartmentsAndPersonMessages.length;indd++){
      var tempDpt=$scope.alldepartmentsAndPersonMessages[indd];
      var did=$scope.alldepartmentsAndPersonMessages[indd]._id;
      var isDeleted=true;
      for(var index=0;index<cacheDpts.length;index++){
        if(cacheDpts[index]._id==did)
        {
          for(var name in cacheDpts[index]){
            if(name!="persons") //就是整体替换persons的时候导致的白屏
            tempDpt[name]=cacheDpts[index][name];//只更新重合的属性
            else {
              var newPersons=cacheDpts[index].persons;
              var oldPersons=tempDpt[name].persons;
              if(!oldPersons) tempDpt[name].persons=newPersons;
              else {
                if(!newPersons)tempDpt[name].persons=newPersons;
                else{
                  for(var ddsd=oldPersons.length-1;ddsd>-1;ddsd--){
                    var ispeleted=true;
                    for(var dds=0;dds<newPersons.length;dds++){
                      if(newPersons[dds].person._id==oldPersons[ddsd].person._id){
                        ispeleted=false;
                        for(var att in newPersons[dds].person){
                          oldPersons[ddsd].person[att]=newPersons[dds].person[att];
                        }
                      }
                    }
                    if(ispeleted){
                      oldPersons.slice(ddsd,1);
                    }
                  }
                }
              }
            }
          }
          isDeleted=false;//说明这个单位还没有废弃,还在服务器返回的单位列表中
        }
      }
      if(isDeleted){
        tempDpt.isDeleted=isDeleted;//并不真的删掉，而是作为显示和判断的标志
      }
    }

    //console.log("装配部门 assembleDepartments ended：" + cacheDpts.length+"<逐个更新>");
  }

  //刷新就是刷新，装配交给装配，这是刷新部门
  $scope.refreshDepartments=function (curUser,isNeedRefreshPersons ){
    // localStorageService.clear("allInvolvedDepartments");
    // $scope.alldepartmentsAndPersonMessages=cacheDpts;
    var cacheDpts;
    if(!cacheDpts){
      departmentAndPersonsService.refreshInvolvedDepartmentsList(curUser,$rootScope.applicationServer,isNeedRefreshPersons);
      return;
    }
  };


  //装配部门下属人员
  $scope.assemblePersonsInDepartments=function (departID) {
    //console.log("装配部门下属人员 assemblePersonsInDepartments started：" + departID+"<>");
    var cachePersons=$scope.alldepartmentsAndPersonMessages;//本controller的数据对象是从其他缓存对象中拼接出来的，所以不用后面这个，避免混乱localStorageService.get("allPersonsUkSeeInDepartment"+departID,60*24);
    if(cachePersons && cachePersons.length<1)return;//没有装配的必要
    // 下面就是装配部门的人员到本页面需要的数据列表中
    if(!($scope.alldepartmentsAndPersonMessages && $scope.alldepartmentsAndPersonMessages.length>0))return;//没有单位，不用装配
    for(var indd=0;indd<$scope.alldepartmentsAndPersonMessages.length;indd++){
      if($scope.alldepartmentsAndPersonMessages[indd].isDeleted)continue;//如果已经被标识为被删除，即最近一次刷新部门时，不在服务器部门列表里
      var did=$scope.alldepartmentsAndPersonMessages[indd]._id;
      // localStorageService.clear("allPersonsUkSeeInDepartment"+did);
      if(did==departID)
      {
        var newPersons=localStorageService.get("allPersonsUkSeeInDepartment"+departID,60*24);
        // var oldpersons=
          $scope.alldepartmentsAndPersonMessages[indd].persons=newPersons;
        // 继续更新人员的详细信息，尤其是照片
        // for(var index=0;index<oldpersons.length;index++){
        //   if(oldpersons[index].person._id== newPersons[0].person._id)
        //   {
        //     /*for in 可以用于数组或者对象*/
        //     for(var name in newPersons[0]){
        //       oldpersons[index][name]=newPersons[0][name];
        //     }
        //   }
        // }
      }
    }

    //console.log("装配部门下属人员 assemblePersonsInDepartments ended departID：" + departID+"<>");
  }

  // 得到并刷新部门的人员
  $scope.refreshDepartmentPersons=function (curDid) {
    // localStorageService.clear("allPersonsUkSeeInDepartment"+curDid._id);
    var cachePersons;
    if(!cachePersons){
      departmentAndPersonsService.loadAllInvolvedChildrenByDid(curDid,$rootScope.applicationServer);
      return;
    }
  };

  //装配部门下属人员的消息列表
  $scope.assemblePersonMessagelistInDepartments=function (senderID) {
    //注意，消息列表里有什么呢？
    // sender.messageabstract=data.abstract; 文字摘要
    // sender.messagecount=data.count; 未读消息总数
    // sender.messagelastTime=data.lastTime; 最近一条消息的时间startTime
    var cachePersonMessageList=localStorageService.get("messagesAbstractBySenderID"+senderID,60*24);
    if(!(cachePersonMessageList && cachePersonMessageList.abstract))return;//没有装配的必要
    //console.log("装配部门下属人员的消息列表 assemblePersonMessagelistInDepartments started：" + cachePersonMessageList+"<1>");
    // 下面就是装配下属人员的消息列表到本页面需要的数据列表中
    if(!($scope.alldepartmentsAndPersonMessages && $scope.alldepartmentsAndPersonMessages.length>0))return;//没有单位，不用装配
    //console.log("装配部门下属人员的消息列表 assemblePersonMessagelistInDepartments started：" + cachePersonMessageList+"<2>");
    //遍历单位
    for(var indd=0;indd<$scope.alldepartmentsAndPersonMessages.length;indd++){
      if($scope.alldepartmentsAndPersonMessages[indd].isDeleted){
        //console.log(" 如果已经被标识为被删除，即最近一次刷新部门时，不在服务器部门列表里 ");
        continue;//如果已经被标识为被删除，即最近一次刷新部门时，不在服务器部门列表里
      }
      if(!($scope.alldepartmentsAndPersonMessages[indd].persons && $scope.alldepartmentsAndPersonMessages[indd].persons.length>0))
      {
        //console.log(" 这个单位下属没有人员，不用装配 ");
        continue;//这个单位下属没有人员，不用装配
      }
      for(var inddt=0;inddt<$scope.alldepartmentsAndPersonMessages[indd].persons.length;inddt++){
        var sender=$scope.alldepartmentsAndPersonMessages[indd].persons[inddt].person;
        // var personwithmessagelists=localStorageService.get("$messagesAbstractBySenderID"+sender._id,1);
        if(sender._id==senderID)
        //   // 如果消息列表不为空，就更新此人，否则还是原来这个人
        {
          console.log("比较是否要更新这个人的消息列表：" + sender._id+"<>"+sender.name+JSON.stringify(sender)+"<>"+cachePersonMessageList.count+"<>"+cachePersonMessageList.abstract);
          // var temp=localStorageService.get("$messagesAbstractBySenderID"+sender._id);
          //console.log("消息列表 这个人" + cachePersonMessageList.abstract+"<>"+cachePersonMessageList.count+"<>"+cachePersonMessageList.lastTime);
          $scope.alldepartmentsAndPersonMessages[indd].persons[inddt].person.messageabstract=cachePersonMessageList.abstract;
          $scope.alldepartmentsAndPersonMessages[indd].persons[inddt].person.messagecount=cachePersonMessageList.count;
          $scope.alldepartmentsAndPersonMessages[indd].persons[inddt].person.messagelastTime=cachePersonMessageList.lastTime;
          $scope.alldepartmentsAndPersonMessages[indd].persons[inddt].person.messagestartTime=cachePersonMessageList.startTime;
        }
        if(!$scope.alldepartmentsAndPersonMessages[indd].persons[inddt].person.images)$scope.alldepartmentsAndPersonMessages[indd].persons[inddt].person.images={};
        if(!$scope.alldepartmentsAndPersonMessages[indd].persons[inddt].person.images.coverSmall) $scope.alldepartmentsAndPersonMessages[indd].persons[inddt].person.images.coverSmall=$rootScope.getUserPicById(sender._id);

      }
    }
    //console.log("装配部门下属人员的消息列表 assemblePersonMessagelistInDepartments curSender：" + senderID+"<3>");
  }

  // 刷新指定人员的消息列表
  $scope.refreshMessageListByPersonID=function (senderID) {
    if(senderID){
      //console.log("发送服务消息 refreshMessageListByPersonIds curSender：" + senderID+"<>");
      messageService.refreshMessageListByPersonIds(senderID,$rootScope.curUser._id,$rootScope.applicationServer);
      return;
    }
  };

  // 等到系统用户刷新成功后，开始运行引擎
  $scope.$on('rootUserReady', function(event,data) {

    //console.log('engineRun curUser：', data._id);		 //子级能得到值
    $rootScope.messageEngine.engineStop();
    $rootScope.messageEngine.engineRun();
  });

  // 如果得到需要连锁刷新部门下属人员的消息，再刷新部门下属人员
  $scope.$on('needRefreshDepartmentPersons', function(event,departmentObj) {
    $scope.refreshDepartmentPersons(departmentObj);
  });
  // 如果刷新部门失败，就2秒后再刷新
  $scope.$on('allInvolvedDepartmentsRefreshFail', function(event,data) {
    //console.log('curUser：', $rootScope.curUser);		 //子级能得到值    ;
    setTimeout($scope.refreshDepartments($rootScope.curUser),2000);
  });

  // 如果可见部门刷新后，组装部门到本页面的datalist
  $scope.$on('allInvolvedDepartmentsRefreshed', function(event,data) {
    $scope.assembleDepartments();
  });

  // 如果下属人员刷新了，就组装他们
  $scope.$on('allPersonsUkSeeInADepartmentRefreshed', function(event,departmentId) {
    //console.log("消息 allPersonsUkSeeInADepartmentRefreshed在部门"+departmentId+"的人员已经刷新");
    $scope.assemblePersonsInDepartments(departmentId);
  });

  // 如果接到通知，刷新了某人的消息列表
  $scope.$on('messageListRefreshed', function(event,senderId) {
    //console.log("服务器返回消息 messageListRefreshed："+JSON.stringify(senderId));
        $scope.assemblePersonMessagelistInDepartments(senderId);
  });
  // $scope.$on('messageListRefreshFail', function(event,sender) {
  //
  //   $scope.resembleJsonObj();
  // });
  // 如果接到通知，某人的消息列表刷新失败，2秒后接着刷
  $scope.$on('messageListRefreshFail', function(event,sender) {
    //console.log("消息 messageListRefreshFail");
    // setTimeout($scope.refreshPersonMessageList(sender),2000);
  });

  //启动本页面的循环
  if(!($rootScope.curUser && $rootScope.curUser._id))  {
    $rootScope.refreshCurUser();
  }
  else {
    $rootScope.messageEngine.engineStop();
    $rootScope.messageEngine.engineRun();
  }

  //console.log($scope.messages);
  // 左拖朋友条的时候跳转到什么位置
  $scope.onSwipeLeft = function() {
    $state.go("tab.friends");
  };
  $scope.popupMessageOpthins = function(message) {
    $scope.popup.index = $scope.messages.indexOf(message);
    $scope.popup.optionsPopup = $ionicPopup.show({
      templateUrl: "templates/message_popup.html",
      scope: $scope,
    });
    $scope.popup.isPopup = true;
  };
  $scope.markMessage = function() {
    var index = $scope.popup.index;
    var message = $scope.messages[index];
    if (message.showHints) {
      message.showHints = false;
      message.noReadMessages = 0;
    } else {
      message.showHints = true;
      message.noReadMessages = 1;
    }
    $scope.popup.optionsPopup.close();
    $scope.popup.isPopup = false;
    messageService.updateMessage(message);
  };
  $scope.deleteMessage = function() {
    var index = $scope.popup.index;
    var message = $scope.messages[index];
    $scope.messages.splice(index, 1);
    $scope.popup.optionsPopup.close();
    $scope.popup.isPopup = false;
    messageService.deleteMessageId(message.id);
    messageService.clearMessage(message);
  };
  $scope.topMessage = function() {
    var index = $scope.popup.index;
    var message = $scope.messages[index];
    if (message.isTop) {
      message.isTop = 0;
    } else {
      message.isTop = new Date().getTime();
    }
    $scope.popup.optionsPopup.close();
    $scope.popup.isPopup = false;
    messageService.updateMessage(message);
  };

  // 切换到对应人员的详细消息记录
  $scope.messageDetils = function(sender) {
    console.log("一个人的详细消息记录.messageDetail："+ sender.name+"<>"+sender.messagestartTime);
    sender.messagecount=0;
    $state.go("tab.chat-messageDetail", {
      "senderId": sender._id,
      "senderName": sender.name,
      "startTime":sender.messagestartTime
    });
    //把id、姓名和图片存到缓存中,不这么简单存了，改用系统服务
    // localStorageService.update("messagedetail"+sender._id,{name:sender.name,pic:sender.images.coverSmall});
  };


	});

