
var mainctr=angular.module('starter.controllers');
mainctr.controller('messageDetailCtrl', ['$scope', '$ionicBackdrop','$ionicPopup','$ionicViewSwitcher', '$http','$state','localToolService', 'userService','Upyun', 'localStorageService','CameraService', 'messageService','$rootScope','$ionicModal','departmentAndPersonsService', '$cordovaCapture','$ionicLoading','$cordovaCamera','$cordovaImagePicker','$ionicScrollDelegate', '$timeout','$stateParams','$ionicActionSheet',
  function($scope, $ionicBackdrop,$ionicPopup,$ionicViewSwitcher, $http,$state,localToolService,userService, Upyun, localStorageService,CameraService, messageService,$rootScope,$ionicModal,departmentAndPersonsService, $cordovaCapture,$ionicLoading,$cordovaCamera,$cordovaImagePicker,$ionicScrollDelegate, $timeout,$stateParams,$ionicActionSheet) {
    var viewScroll = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');
    //console.log("enter messageDetailCtrl");
    //把id、姓名和图片存到缓存中{name:sender.name,pic:sender.images.coverSmall}
    $scope.curSender= {
      _id:$stateParams.senderId,
      name:$stateParams.senderName
    };
    //当路由跳转的时候，判断是不是到手工添加了返回按钮的页面，在某些情况下禁止手工按钮
    $scope.showMauualBackBtn=true;
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });
    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams){
        // console.log("event:"+event.name+'《页面view进入》'+' toState.name:'+toState.name+' fromState.name:'+fromState.name);
        if(fromState.name!="tab.chats"){

          console.log("event:"+event.name+'《页面view进入没有botton》'+' toState.name:'+toState.name+' fromState.name:'+fromState.name+"event.targetScope:"+(event.targetScope.doRefresh));
          // toParams.showBackBotton=false;
          $scope.showMauualBackBtn=true;
        }else {
          console.log("event:"+event.name+'《页面view进入有botton》'+' toState.name:'+toState.name+' fromState.name:'+fromState.name+"event.targetScope:"+(event.targetScope.doRefresh));
          $scope.showMauualBackBtn=false;
        }
      });

    $scope.messageDetils;//当前显示的消息记录
    $scope.allMessageDetils;//全部的消息记录
    $scope.isRecVoice=false;
    $scope.unSendMessage={};
    $scope.unSendMessage.text='';
    $scope.messageFirstRun =true;
    // 当前是否在向服务器查询大批数据中
    $scope.isRefreshLongListFromServer=false;
      $scope.doRefresh = function() {
      // //console.log("ok");
      $scope.messageNum += 5;
      $timeout(function() {
        $scope.messageDetils = messageService.getAmountMessageByBothId($scope.messageNum,
          $stateParams.senderId,$rootScope.curUser._id);
        $scope.$broadcast('scroll.refreshComplete');
        viewScroll.scrollTop();
      }, 200);
    };
    $scope.back = function() {
      $ionicViewSwitcher.nextDirection('back');
      $state.go($stateParams.back?$stateParams.back:'tab.chats');
    };

    // localStorageService.clear("messagesListboth" + $stateParams.senderId+'_'+$rootScope.curUser._id);
    $scope.refreshMessages=function() {
      //这是为了得到头像之类的玩意
      $rootScope.getUserPicById($stateParams.senderId,function (id,picData) {
        $scope.curSender.pic=picData;
      });
      if(!$rootScope.curUser){$rootScope.refreshCurUser(); return;};
      // 这是得到缓存中的消息记录数据
      $scope.allMessageDetils = messageService.getMessageByBothId($stateParams.senderId,$rootScope.curUser._id);
      // 缓存中的消息记录按生产时间排序

      // //console.log($rootScope.curUser._id+" 看看传过来的参数messageDetailCtrl $ionicView.beforeEnter"+'<>'+$stateParams.senderId+$stateParams.startTime+'<>'+$scope.messageDetils);
      //设置当前显示数量为4
      $scope.messageNum = $scope.messageFirstRun ?4:$scope.messageNum ;
      $scope.messageFirstRun=false;//不是第一次刷新了，可显示消息数量不再直接设为4条
      $scope.messageDetils = messageService.getAmountMessageByBothId($scope.messageNum,
        $stateParams.senderId,$rootScope.curUser._id);
      // $timeout(function() {
      //   viewScroll.scrollBottom();
      // }, 0);


      var curTime=new Date();
      // 如果没有消息记录
      if(!$scope.messageDetils){
        var startTime=new Date($stateParams.startTime);
        // 按天太不精确了
        var stTime=startTime.formate("yyyy-MM-dd");
        var crTime=curTime.formate("yyyy-MM-dd");
        // 如果起止日期是同一天，就把起始日期挪到昨天，这样才能取到今天的消息
        startTime= new Date(startTime.getDate()-10);
        stTime=stTime==crTime?startTime.formate("yyyy-MM-dd"):stTime;
        // 就去找10天以内的消息
        if(!$scope.isRefreshLongListFromServer){
          messageService.initMessageListInTimeSpanByPersonIds($stateParams.senderId,$rootScope.curUser._id,stTime,curTime,$rootScope.applicationServer);
          $scope.isRefreshLongListFromServer=true;
        }
        return;
      }else if(Date.parse(curTime)-Date.parse($scope.allMessageDetils[$scope.allMessageDetils.length-1].create_date)>3*1000)//距今有3秒
      {
        if(!$scope.isRefreshLongListFromServer){
        messageService.initMessageListInTimeSpanByPersonIds($stateParams.senderId,$rootScope.curUser._id,$scope.allMessageDetils[$scope.allMessageDetils.length-1].create_date,curTime,$rootScope.applicationServer);
        // $scope.isRefreshFromServer=true;
        }
        return;
      }

      //判断已读的事情交给插入一条聊天记录的方法
      // for (var index=0;index<$scope.allMessageDetils.length;index++){
      //   var item=$scope.allMessageDetils[index];
      //   // 判断是不是发给当前用户的
      //   if(item.receiver==$rootScope.curUser._id && item.status==0)
      //   // 设置这个消息状态为已读，发到服务器端
      //   messageService.readMessageByID(item._id,$rootScope.applicationServer);
      // }

    };

    // 等到系统用户刷新成功后，刷新可见部门
    $scope.$on('rootUserReady', function(event,data) {
      $rootScope.messageDetailEngine.engineStop();
      $rootScope.messageDetailEngine.engineRun();
    });

    $scope.$on("$ionicView.beforeEnter",$scope.refreshMessages() );

    // 如果接到通知，刷新了某人的消息列表
    $scope.$on('bothMessageListRefreshed', function(event,bothid) {
      //console.log("on messagesListboth"+bothid+'<>'+bothid.receiver_id+'<>'+bothid.sender_id);

      $scope.isRefreshLongListFromServer=false;
      if(!($rootScope.curUser && $rootScope.curUser._id))return;
      //如果是当前sender，就加载
      if(bothid.sender_id==$stateParams.senderId && bothid.receiver_id==$rootScope.curUser._id)
        // $scope.refreshMessages();
      {

        $rootScope.messageDetailEngine.engineStop();
        $rootScope.messageDetailEngine.engineRun();
      }
    });

    window.addEventListener("native.keyboardshow", function(e){
      viewScroll.scrollBottom();
    }
    );

    // 图片显示
    $scope.showImage = function(imageUrl) {
      console.log("展示的图片路径："+imageUrl);
      $scope.curImage = imageUrl;
      $scope.showModal('templates/imagehover.html');
    };

    // 视频播放
    $scope.playVideo = function(videoUrl) {
      $scope.curVideo = videoUrl;
      $scope.showModal('templates/videohover.html');
    };

    $scope.showModal = function(templateUrl) {
      $ionicModal.fromTemplateUrl(templateUrl, {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    }

    // Close the modal
    $scope.closeModal = function() {
      $scope.modal.hide();
      $scope.modal.remove()
    };


    //上传之后，得到返回值，给消息对应的字段赋值
    $scope.sendMessage=function () {
      // 正在刷新列表的时候，不能发送数据
      if($scope.isRefreshLongListFromServer){return;}
      // 只要30分钟内获取过位置
      var curlocation=localStorageService.get('LatestLocation_'+$rootScope.curUser._id,30);

      //console.log("取当前地理位置："+JSON.stringify(curlocation));
      $scope.unSendMessage = {
        text:$scope.unSendMessage.text,
        video:$scope.unSendMessage.video,
        voice:$scope.unSendMessage.voice,
        image:$scope.unSendMessage.image
        // ,
        // location: {geolocation: [116.385029, 39.992495]}
      };
      $scope.unSendMessage.location=curlocation?{geolocation: [curlocation.Location[0],curlocation.Location[1]]}:null;
      // var senderId = "58cb2031e68197ec0c7b935b";
      // var receiverId = "58c043cc40cbb100091c640d";

      $ionicLoading.show({
        template: '消息发送中...'
      });
      console.log("取当前消息unSendMessage："+JSON.stringify($scope.unSendMessage));
      // if(!$scope.isRefreshFromServer){
        messageService.sendMessage($scope.unSendMessage,$rootScope.curUser._id,$stateParams.senderId,$rootScope.applicationServer);
        // $scope.isRefreshFromServer=true;
      // }
      $timeout(function() {
      $ionicLoading.hide();//60秒后，不管成不成功，都取消进度栏
      }, 60000);
    }

    // 等到消息发送成功之后，刷新消息界面，并重置未发送消息
    $scope.renew = function (newMessage) {
      // $scope.messageDetils=$scope.messageDetils?$scope.messageDetils:new Array();
      if(!newMessage.sender._id && newMessage.sender==$rootScope.curUser._id){
        newMessage.sender={
          _id:newMessage.sender,
          name:$rootScope.curUser.name
        };
      }
      localToolService.insertANewMessageToMessageList(newMessage.receiver,newMessage.sender._id,newMessage);
      // 把时间格式化一下
      newMessage.create_date=new Date(newMessage.create_date).formate('yyyy-MM-dd HH:mm:ss');
      // $scope.allMessageDetils=localStorageService.get("messagesListboth" + newMessage.receiver+'_'+newMessage.sender._id,60*24);
      $scope.messageNum+=1;
      $scope.messageDetils= messageService.getAmountMessageByBothId($scope.messageNum,
        $stateParams.senderId,$rootScope.curUser._id);
      $timeout(function() {
        viewScroll.scrollBottom();
      }, 0);
      $scope.unSendMessage={};
      // //console.log("取当前消息列表："+JSON.stringify($scope.messageDetils));
      $ionicLoading.hide();
    };

    $scope.$on('sendMessageOK', function(event,newMessage) {
      // $scope.isRefreshFromServer=false;
      $scope.renew(newMessage);
    });

    //上传之后，得到返回值，给消息对应的字段赋值
    $scope.afterUpload=function (fileResponse) {
      // fileResponse.fileType
      // fileResponse.filename
      console.log("上传完成后文件名："+fileResponse.filename);
      //
      $ionicLoading.hide();
      switch(fileResponse.fileType)
      {
        case 'video':
          $scope.unSendMessage.video=fileResponse.filename;
          break;
        case 'commentImg':
          $scope.unSendMessage.image=fileResponse.filename;
          break;
        case 'voice':
          $scope.unSendMessage.voice=fileResponse.filename;
          break;
        default:
          break;
      }
      var unsendM=$scope.unSendMessage;
      //自动上传
      if((unsendM.text && unsendM.text != '')||(unsendM.video && unsendM.video != '')||(unsendM.image && unsendM.image != '')||(unsendM.voice && unsendM.voice != ''))
      {
        // 自动上传，类似微信
        $scope.sendMessage()
      }
    }

    // 图片选择项
    $scope.showImageUploadChoices = function(prop) {
      var hideSheet = $ionicActionSheet.show({
        buttons: [{
          text: '<i class="icon ion-android-camera"></i><b style="align-content: center">拍照上传</b> '
        }, {
          text: '<i class="icon ion-videocamera"></i><b style="align-content: center">拍短视频上传</b>  '
        }
        // ,{
        //     text: '<i class="icon ion-mic-a"></i><b style="align-content: center">录音上传(待完成)</b>'
        //   }
          ,{
            text: '......'
          }
        ],
        titleText: '多媒体消息',
        cancelText: '取 消',
        cancel: function() {
          // add cancel code..
        },
        buttonClicked: function(index) {
          // 相册文件选择上传
          if (index == 5) {
            $scope.readalbum(prop);
          } else if (index == 0) {
            // 拍照上传普通图片commonImge和身份证IDCard
            $scope.taskPicture('commonImge');
          }else if (index == 1) {
            // 拍照上传小视屏
            $scope.captureVideo();
          }
          return true;
        }
      });

    };


    // 读用户相册
    $scope.readalbum = function(prop) {
      if (!window.imagePicker) {
        alert('目前您的环境不支持相册上传。')
        return;
      }

      var options = $rootScope.CommonImgOptions;

      $cordovaImagePicker.getPictures(options).then(function(results) {
        var uri = results[0],
          name = uri;
        if (name.indexOf('/')) {
          var i = name.lastIndexOf('/');
          name = name.substring(i + 1);
        }

        // 获取UPYUN的token数据
        Upyun.token(name, 1000).then(function(resp) {
          localStorage.setItem('STREAM_UPLOAD_UPYUN', JSON.stringify(resp.data));
          $scope.uploadfile(uri, prop);
        }).finally(function() {
        });
      }, function(error) {
        alert(error);
      });
    };


    //录像
    $scope.captureVideo = function() {

      if (!navigator.camera) {
        alert('请在真机环境中使用拍照上传。')
        return;
      }
      var options = { limit: 1, duration: 5 };

      var uploadDir=$rootScope.applicationServer+"filedirectupload/video";
      $cordovaCapture.captureVideo(options).then(function(videoData) {
        var videopath = videoData[0].fullPath;
        // alert(videopath);
        console.log(" CameraService.录像返回videoData了"+videopath+"<>"+JSON.stringify(videoData));
        $scope.uploadfile(videopath,uploadDir,"video/mp4");
        // Success! Video data is here
      }, function(err) {
        // An error occurred. Show a message to the user
        console.log(" CameraService.录像返回err了"+err+"<>"+JSON.stringify(err));
        $ionicPopup.alert({
          title:'录像出错',
          template: "<br><h4>'请确认设备完好并重试...'</h4>",
          okText: '确认'
        });
      });
    }

    // 拍照
    $scope.taskPicture = function(prop) {
      if (!navigator.camera) {
        alert('请在真机环境中使用拍照上传。')
        return;
      }


      var options = $rootScope.CommonImgOptions;
      //alert(ft.upload);
      //"http://120.76.228.172:2000/filedirectupload/photo",//这是采用手机端直接上传的
      //"http://120.76.228.172:2000/fileupload/uploadIcon"//这是采用HTML5的form封装上传
      var uploadDir=$rootScope.applicationServer+"filedirectupload/photo";
      switch (prop) {
        case 'commonImge':
          // statements
          uploadDir=$rootScope.applicationServer+"filedirectupload/photo";
          options = $rootScope.CommonImgOptions;
          break;
        case 'IDCard':
          // statements
          uploadDir=$rootScope.applicationServer+"filedirectupload/IDCard";
          options = $rootScope.IDCardOptions;
          break;
        default:
          // default statements
          break;
      }
      //alert(options.targetWidth);

      console.log("拍照设置："+JSON.stringify(options));
      CameraService.getPicture(options).then(function(imageURI) {
//							alert(imageURI);
        console.log(" CameraService.getPicture返回值了"+imageURI+"<>"+uploadDir);
        $scope.uploadfile(imageURI,uploadDir);

      }, function(err) {
        console.log(" CameraService.getPicture返回err了"+err+"<>"+JSON.stringify(err));
         $ionicPopup.alert({
          title:'拍照出错',
          template: "<br><h4>'请确认设备完好并重试...'"+"</h4>",
          okText: '确认'
        });
      });

    }
    $scope.isrec=false;
    //開始錄音
    $scope.rec_voice = function(prop) {
      console.log('開開始錄音:rec_voice ');
      $scope.isrec = true;
      window.plugins.audioRecorderAPI.record(function(msg) {
        // complete
        console.log('開始錄音ok: ' + msg);
        }, function(msg) {
        // failed
        console.log('ko: ' + msg);
        $ionicPopup.alert({
          title:'录音出错',
          template: "<br><h4>'请确认设备完好且有权限并重试 ...'</h4>",
          okText: '确认'
        });
        }, 60); // 录音最长 60 seconds
      }

    //释放按钮，上传录音文件
  $scope.endrec_voice = function(){
    console.log('開開始endrec_voice: ' );
    window.plugins.audioRecorderAPI.stop(
    function(file)
       {
           // success
          console.log('结束录音ok，本地文件名: ' + file);
          var options = new FileUploadOptions();
          options.fileKey="file";
          options.fileName=file.substr(file.lastIndexOf('/')+1);
          var voiceUri=file;//'file:///'+
          var uploadDir=$rootScope.applicationServer+"filedirectupload/voice";
          var mimetype;
          if(!mimetype){mimetype="audio/m4a";}
          $scope.uploadfile(voiceUri, uploadDir,mimetype);
          $scope.isrec=false;
      }
    )
    };


        //播放录音
      $scope.playVoice = function(vFile){
        console.log(vFile);
        $scope.voice = vFile;
        if( $scope.recres ){
          $scope.recres.stop();
          $scope.recres.release();
          $scope.recres=null;
        }else {
          $scope.recres = new Media($scope.voice,
            function () { console.log("playAudio():Audio Success"); },
// error callback
            function (err) { console.log("playAudio():Audio Error: " + err); });
          $scope.recres.play();
        }
      }


    // 上传服务器,后面是上传的类型，普通图片commonImge和身份证IDCard
    $scope.uploadfile = function(uri, uploadDir, mimetype) {
      // alert('请在真机环境中使用拍照上传。'+uploadDir)
      // console.log("拍照后："+uri+"<1>"+uploadDir+"<>"+mimetype);
      //默认是图片
      if(!mimetype){mimetype="image/jpg";}
      // 注意此处设置的fileKey，Express服务端中也需要这个
      var fileURL = uri;
      var options = new FileUploadOptions();
      options.fileKey = "file";
      options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
      options.mimeType = mimetype;//注意身份证识别只认jpg，而文件上传服务器是根据这里的mimttype确定文件扩展名的，所以从jpeg改为jpg
      options.chunkedMode = true;
      // alert('1。')
      // console.log("拍照后："+uri+"<2>"+uploadDir+"<>"+mimetype);

      var ft = new FileTransfer();
      $ionicLoading.show({
        template: '上传中...'
      });
      // alert('2。')
      console.log("准备上传："+fileURL+"<3>"+uploadDir+"<>"+mimetype);

      //这里将图片上传到指定网址
      ft.upload(fileURL,uploadDir , function(data) {
        // 设置图片新地址
        var resp = data.response;
        // console.log("拍照后的返回值："+"<4>"+JSON.stringify(resp));
        // alert('3。')
//								alert(resp);
        //alert("上传后返回值："+resp+"\n"+(resp.fileType=='IDCard'));
        //必须得parse一下，否则就会变成字符串
        var pit=JSON.parse(resp);
        // console.log("拍照后的返回值："+"<5>"+JSON.stringify(pit)+">filename:"+pit.filename);
        // alert("上传后返回值："+pit+"\n"+(pit.fileType=='IDCard'));
        if (pit.filename) {
          // alert("上传后ok");
          $scope.afterUpload(pit);

        }else {
          $ionicLoading.hide();
        }
      }, function(error) {
        // console.log("拍照后上传中error："+error+"<6>");
        // alert(error);
        $ionicLoading.hide();
      }, options);
    };

    /***
     * 引擎运行
     */
    $rootScope.messageDetailEngine.engineRun =function(params) {
      //引擎设置好就开始运行
      // alert( '中文试试');
      // alert( $scope.engineRun);
      // alert( '中文试试2');
      $rootScope.messageDetailEngine.engineInitialise();

      // $scope.checkDepartmentAndPersonJsonObj();
      //在地图页面启动周期性函数
      $rootScope.messageDetailEngineTimer=window.setInterval(
        function(){
          // alert('ok');
          // 只有有用户的时候，才开始地图循环
          if($rootScope.curUser && $rootScope.curUser._id)
          //开始定位刷新地图
          {
            $scope.refreshMessages();
        }



        }
        ,$rootScope.messageDetailRefreshTime);
    };

    $rootScope.messageDetailEngine.engineInitialise =function(params) {

      // $scope.alldepartmentsAndPersonMessages=localStorageService.get('alldepartmentsAndPersonMessages',30);

    }
    $rootScope.messageDetailEngine.enginePause =function(params) {

    }

    $rootScope.messageDetailEngine.engineResum =function(params) {

    }

    $rootScope.messageDetailEngine.engineStop =function(params) {
      if($rootScope.messageDetailEngineTimer)
        window.clearInterval($rootScope.messageDetailEngineTimer);
      $rootScope.messageDetailEngineTimer=null;
    }
  }
])
