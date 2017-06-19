
var mainctr=angular.module('starter.controllers');
mainctr.controller('ManagementCtrl', function($rootScope,$scope, $state, $ionicBackdrop,$ionicPopup, $http) {
	$scope.rowHeight=150;
	$scope.onClickSendMesBtn=function() {
	// alert("dianjile 1");
	// 	$state.go('tab.management-sendmessage');
	};
	})
.controller('ManagementScheduleCtrl', function ($rootScope,$scope, $state, $ionicBackdrop,$ionicPopup, $http, $ionicScrollDelegate) {

            var startHour = 7;
            var endHour = 21;
            var usehalfhour = true;

            $scope.timerleft = '0px';

            $scope.hours = getHours();
            $scope.rooms = getRooms();
            $scope.days = getDays();
            $scope.events = getEvents();

            function getHours()
            {
                var tmp = [];
                for (i = startHour; i <= endHour; i++)
                {
                    tmp.push(('0' + i).slice(-2) + ':00');
                    if (usehalfhour && i < endHour)
                    {
                        tmp.push(('0' + i).slice(-2) + ':30');
                    }
                }

                return tmp;
            }
            ;


            function getRooms()
            {
                var tmp = [];
                tmp.push({id: 1, name: '市委'});
                tmp.push({id: 2, name: '保平村现场'});
                tmp.push({id: 3, name: '市政府'});
                tmp.push({id: 4, name: '区建设局'});

                return tmp;
            }
            ;
            function getDays()
            {
                var tmp = [];
                var date1 = new Date();
                var date2 = new Date();
                date2.setDate(date2.getDate() + 1);
                var weekday = new Array(7);
                weekday[0] = "星期天";
                weekday[1] = "星期一";
                weekday[2] = "星期二";
                weekday[3] = "星期三";
                weekday[4] = "星期四";
                weekday[5] = "星期五";
                weekday[6] = "星期六";

                var monthname = new Array(12);
                monthname[0] = "一月份";
                monthname[1] = "二月份";
                monthname[2] = "三月份";
                monthname[3] = "四月份";
                monthname[4] = "五月份";
                monthname[5] = "六月份";
                monthname[6] = "七月份";
                monthname[7] = "八月份";
                monthname[8] = "九月份";
                monthname[9] = "十月份";
                monthname[10] = "十一月份";
                monthname[11] = "十二月份";


                tmp.push({day: weekday[date1.getDay()], longdate: weekday[date1.getDay()] + ', ' + monthname[date1.getMonth()] + ' ' + date1.getDate() + ', ' + date1.getFullYear(), datevalue: date1, dateformat: date1.toLocaleDateString()});
                tmp.push({day: weekday[date2.getDay()], longdate: weekday[date2.getDay()] + ', ' + monthname[date2.getMonth()] + ' ' + date2.getDate() + ', ' + date2.getFullYear(), datevalue: date2, dateformat: date2.toLocaleDateString()});
                console.log(tmp);
                return tmp;
            }

            $scope.gotScrolled = function () {

                $scope.timerleft = $ionicScrollDelegate.getScrollPosition().left + 'px';
                $scope.$apply();

            };
            //测试用函数，点击按钮后，跳转到聊天详细信息窗体
            $scope.onClickShowChatDetail=function(intd) {
              //alert("dianjile 1");
              // 	$state.go('tab.chat-detail',{parent: 'tab.management-report',chatId:intd});
              $state.go('tab.account');
            };
            function getEvents() {
                var tmp = [];
                var date1 = new Date();
                tmp.push({eventname: '工作报告1', starthour: '08:00', endhour: '09:30', eventtype: 'ion-mic-c', room: 'Morpheus', left: (60 + 0 * 120) + 'px', top: (23 + 1 * 100) + 'px', height: (1.5 * 100) + 'px', color: 'rgba(0,157,151,0.75)', dateformat: date1.toLocaleDateString()});
                tmp.push({eventname: '处理文件', starthour: '09:30', endhour: '10:00', eventtype: 'ion-coffee', room: 'Morpheus', left: (60 + 0 * 120) + 'px', top: (23 + 2.5 * 100) + 'px', height: (0.5 * 100) + 'px', color: 'rgba(255,169,0,0.75)', dateformat: date1.toLocaleDateString()});
                tmp.push({eventname: '工作报告 2', starthour: '10:00', endhour: '11:45', eventtype: 'ion-mic-c', room: 'Morpheus', left: (60 + 0 * 120) + 'px', top: (23 + 3 * 100) + 'px', height: (1.75 * 100) + 'px', color: 'rgba(0,157,151,0.75)', dateformat: date1.toLocaleDateString()});
                tmp.push({eventname: '勘察地形', starthour: '12:00', endhour: '14:00', eventtype: 'ion-chatbubbles', room: 'Morpheus', left: (60 + 0 * 120) + 'px', top: (23 + 5 * 100) + 'px', height: (1.75 * 100) + 'px', color: 'rgba(18,67,172,0.75)', dateformat: date1.toLocaleDateString()});
                tmp.push({eventname: '工作报告 3', starthour: '14:30', endhour: '18:00', eventtype: 'ion-mic-c', room: 'Morpheus', left: (60 + 0 * 120) + 'px', top: (23 + 7.5 * 100) + 'px', height: (2.5 * 100) + 'px', color: 'rgba(0,157,151,0.75)', dateformat: date1.toLocaleDateString()});
                tmp.push({eventname: '工作聚餐', starthour: '19:00', endhour: '21:00', eventtype: 'ion-wineglass', room: 'Morpheus', left: (60 + 0 * 120) + 'px', top: (23 + 12 * 100) + 'px', height: (2 * 100) + 'px', color: 'rgba(255,113,0,0.75)', dateformat: date1.toLocaleDateString()});

                tmp.push({eventname: '工作报告4', starthour: '08:00', endhour: '11:00', eventtype: 'ion-mic-c', room: 'Trinity', left: (60 + 2 * 120) + 'px', top: (23 + 1 * 100) + 'px', height: (3 * 100) + 'px', color: 'rgba(0,157,151,0.75)', dateformat: date1.toLocaleDateString()});
                tmp.push({eventname: '工作报告5', starthour: '11:00', endhour: '12:00', eventtype: 'ion-mic-c', room: 'Trinity', left: (60 + 2 * 120) + 'px', top: (23 + 4 * 100) + 'px', height: (1 * 100) + 'px', color: 'rgba(0,157,151,0.75)', dateformat: date1.toLocaleDateString()});
                tmp.push({eventname: '网络会议', starthour: '12:00', endhour: '14:00', eventtype: 'ion-chatbubbles', room: 'Trinity', left: (60 + 2 * 120) + 'px', top: (23 + 5 * 100) + 'px', height: (1.75 * 100) + 'px', color: 'rgba(18,67,172,0.75)', dateformat: date1.toLocaleDateString()});
                tmp.push({eventname: '工作报告 6', starthour: '14:30', endhour: '16:00', eventtype: 'ion-mic-c', room: 'Trinity', left: (60 + 2 * 120) + 'px', top: (23 + 7.5 * 100) + 'px', height: (1.5 * 100) + 'px', color: 'rgba(0,157,151,0.75)', dateformat: date1.toLocaleDateString()});
                //
                //
                //Presentation - 0,157,151 -- ion-mic-c
                //Networking 18,67,172 -- ion-chatbubbles
                //Coffee Break 255,169,0, --ion-coffee
                //Dinner 255,113,0 --ion-wineglass
                return tmp;
            }
            ;

        })
        /*
        //事件上报的controller
        .controller('ManagementReportCtrl', function($scope,$ionicBackdrop,$ionicPopup,$http,$ionicActionSheet,$cordovaCamera,$cordovaImagePicker) {

					$scope.images_list = [];

				  $scope.imgsrc ='';

				  // "添加附件"Event
				  $scope.addAttachment = function() {
				   //nonePopover();
				    $ionicActionSheet.show({
				     buttons: [
				       { text: '相机' },
				       { text: '图库' }
				     ],
				     cancelText: '关闭',
				     cancel: function() {
				       return true;
				     },
				     buttonClicked: function(index) {

				       switch (index){

				        case 0:appendByCamera();
				            break;
				        case 1:

				        		pickImage();
				            break;
				        default:
				            break;
				       }
				       return true;
				     }
				   });
				  };

				    var appendByCamera=function(){
				    			//这一段options可以不要
				            var options = {
				                maximumImagesCount: 1,
				                width: 800,
				                height: 800,
				                quality: 80
				            }; ///**
				            alert(navigator);
				            alert(navigator.CameraPopoverOptions);//这东西为空，咋回事
				            alert(navigator.camera);
				            var options = {
							      quality: 50,
							      destinationType: navigator.camera.DestinationType.DATA_URL,//FILE_URI,//DATA_URL,
							      sourceType: navigator.camera.PictureSourceType.CAMERA,
							      allowEdit: true,
							      encodingType: navigator.camera.EncodingType.JPEG,
							      targetWidth: 100,
							      targetHeight: 100,
							      popoverOptions: navigator.CameraPopoverOptions,
							      saveToPhotoAlbum: false,
								  correctOrientation:true
							    };

							    $cordovaCamera.getPicture(options).then(function(imageData) {

							      $scope.imgsrc = "data:image/jpeg;base64," + imageData;
							    }, function(err) {
							      // error
							    });
				    	};

				       //image picker
				   var pickImage = function () {



				            var options = {
				                maximumImagesCount: 1,
				                width: 800,
				                height: 800,
				                quality: 80
				            };

				            $cordovaImagePicker.getPictures(options)
				                .then(function (results) {

				                     $scope.images_list.push(results[0]);

				                }, function (error) {
				                    // error getting photos
				                });

				        };
		})*/
        //事件上报的controller
        .controller('ManagementReportCtrl', function($scope,$state,$rootScope,$ionicBackdrop,$ionicPopup,$cordovaDevice,$cordovaCapture,$ionicLoading,$http,$ionicActionSheet,$cordovaCamera,$cordovaImagePicker,$ionicLoading, Camera, Upyun,$timeout)
        {
						$scope.image = '';
						//测试用函数，点击按钮后，跳转到发送消息窗体
							$scope.onClickSendMesBtn=function() {
							//alert("dianjile 1");
								$state.go('tab.chats');
							};
						//测试用函数，点击按钮后，跳转到聊天详细信息窗体
							$scope.onClickShowChatDetail=function(intd) {
							//alert("dianjile 1");
							// 	$state.go('tab.chat-detail',{parent: 'tab.management-report',chatId:intd});
                $state.go('tab.account');
							};
						// 图片选择项
						$scope.showImageUploadChoices = function(prop) {
							var hideSheet = $ionicActionSheet.show({
								buttons: [{
									text: '<b>拍照</b> 上传'
								},
//								{
//									text: '<b>拍身份证</b> 上传'
//								},
								{
									text: '<b>拍小视屏</b> 上传'
								},{
									text: '从 <b>相册</b> 中选'
								}],
								titleText: '选择信息来源',
								cancelText: '取 消',
								cancel: function() {
									// add cancel code..
								},
								buttonClicked: function(index) {
									// 相册文件选择上传
									if (index == 2) {
										$scope.readalbum(prop);
									} else if (index == 0) {
										// 拍照上传普通图片commonImge和身份证IDCard
										$scope.taskPicture('commonImge');
									}else if (index == 1) {
										// 拍照上传小视屏
										$scope.captureVideo();
									}
//									else if (index == 1) {
//										// 拍身份证上传
//										$scope.taskPicture('IDCard');
//									}
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

							var uploadDir=$rootScope.applicationServer+"/filedirectupload/video";
					    $cordovaCapture.captureVideo(options).then(function(videoData) {
					    	var videopath = videoData[0].fullPath;
					    	//alert(videopath);
								$scope.uploadfile(videopath,uploadDir,"video/mp4");
					      // Success! Video data is here
					    }, function(err) {
					      // An error occurred. Show a message to the user
					    });
					  }

						// 拍照
						$scope.taskPicture = function(prop) {
							if (!navigator.camera) {
								alert('请在真机环境中使用拍照上传。')
								return;
							}
//							function successCallback(result) {
//							  alert(result);
//							}
//							,$cordovaSIM//sim卡好像还没有ngcordova的支持
//							function errorCallback(error) {
//							  alert(error);
//							}
							var uuid = $cordovaDevice.getUUID();
//							var simInfo=$cordovaSIM.getSimInfo(alert, alert);
							//alert("手机信息："+uuid);

							var options = $rootScope.CommonImgOptions;
							//alert(ft.upload);
							//"http://120.76.228.172:2000/filedirectupload/photo",//这是采用手机端直接上传的
							//"http://120.76.228.172:2000/fileupload/uploadIcon"//这是采用HTML5的form封装上传
							var uploadDir=$rootScope.applicationServer+"/filedirectupload/photo";
							switch (prop) {
								case 'commonImge':
									 // statements
									 uploadDir=$rootScope.applicationServer+"/filedirectupload/photo";
									 options = $rootScope.CommonImgOptions;
								break;
								case 'IDCard':
									 // statements
									 uploadDir=$rootScope.applicationServer+"/filedirectupload/IDCard";
									 options = $rootScope.IDCardOptions;
								break;
								default:
									// default statements
									break;
							}
							//alert(options.targetWidth);
							Camera.getPicture(options).then(function(imageURI) {
//							alert(imageURI);
								$scope.uploadfile(imageURI,uploadDir);

							}, function(err) {
							//alert(err);

//							$ionicLoading.show({
//													template: '拍照出错，请确认设备完好并重试...'
//												});
//
//							$timeout($ionicLoading.hide(),2000);

							});

						}

						// 上传服务器,后面是上传的类型，普通图片commonImge和身份证IDCard
						$scope.uploadfile = function(uri, uploadDir, mimetype) {
							//默认是图片
  						if(!mimetype){mimetype="image/jpg";}
						// 注意此处设置的fileKey，Express服务端中也需要这个
							var fileURL = uri;
							var options = new FileUploadOptions();
							options.fileKey = "file";
							options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
							options.mimeType = mimetype;//注意身份证识别只认jpg，而文件上传服务器是根据这里的mimttype确定文件扩展名的，所以从jpeg改为jpg
							options.chunkedMode = true;


							var ft = new FileTransfer();
							$ionicLoading.show({
								template: '上传中...'
							});

							//这里将图片上传到指定网址
							ft.upload(fileURL,uploadDir , function(data) {
								// 设置图片新地址
								var resp = data.response;
								console.log(resp);
//								alert(resp);
								//alert("上传后返回值："+resp+"\n"+(resp.fileType=='IDCard'));
								//必须得parse一下，否则就会变成字符串
								var pit=JSON.parse(resp);
								//alert("上传后返回值："+pit+"\n"+(pit.fileType=='IDCard'));
								if (pit.fileType&&pit.fileType=='IDCard') {
									//alert("上传后ok");
									$scope.processIDcard(pit.filename);

								}
								$ionicLoading.hide();
							}, function(error) {
//								alert(error);
								$ionicLoading.hide();
							}, options);
						};

				//从服务器端获取来的身份证信息，可以用来组装user对象了
				$scope.processIDcard =function(fileURL) {
								$ionicLoading.show({
								template: '身份识别中...'
								});
								$http({
						         method:'POST',
						         url:$rootScope.applicationServer+'/processID/IDCard',
						         data:{"fileURL":fileURL},
						        //params:[data:$scope.movieTestData ],
						         headers: {'Content-Type': 'application/json;charset=utf-8'},
						         dataType:'JSON'
						         })
								.success(function(data,status,headers,config){
													//alert("用户修改成功！");
													//curUser=$scope.curUser;
						              //$scope.resMsg=data;
						              if(status==200){
						              	//alert("服务器解析出来了数据："+data+"<>"+data.name+"<>"+data.idNum);

						              	}else {
						              		alert("服务器解析不成功，请重试"+status);
						              	};

													$ionicLoading.hide();
						         }).error(function(data,status,headers,config){
						              alert("网络中断导致未能识别，请稍后再试！");

													$ionicLoading.hide();
						         });

					}
		})
//设施统计的controller
.controller('ManagementInstallationsCtrl', function($scope, $ionicBackdrop,$ionicPopup, $http) {

		$scope.labels = ["一月", "二月", "三月", "四月", "五月", "六月", "七月"];
		$scope.series = ['路灯正常数量', '检修人次'];
		$scope.data = [
			[65, 59, 80, 81, 56, 55, 40],
			[28, 48, 40, 19, 86, 27, 90]
		];
		$scope.bardata = {
    labels: ["一月", "二月", "三月", "四月", "五月", "六月", "七月"],
    datasets: [
        {
            label: "井盖正常数量",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: "更换次数",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
		};/**/

	$scope.initChart=function(){
		// Get context with jQuery - using jQuery's .get() method.
		var ctx = document.getElementById('Bar').getContext("2d");
		// This will get the first returned node in the jQuery collection.
		var myNewChart = new Chart(ctx);
		myNewChart.Bar($scope.bardata, {showTooltips: true});};

	})
	;
