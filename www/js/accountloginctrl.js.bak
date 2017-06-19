var accountctr=angular.module('starter.controllers');
accountctr.controller('AccountLoginCtrl', function($scope,$rootScope,$ionicBackdrop,$ionicPopup,$cordovaDevice,$state,$cordovaCapture,$ionicLoading,$http,$ionicActionSheet,$cordovaCamera,$cordovaImagePicker,$ionicLoading, Camera,$timeout) 
        {
						$scope.image = '';
						//是否显示编辑用户框
						$rootScope.hideAccountEditForm=true;
						
						// 图片选择项
						$scope.showImageUploadChoices = function(prop) {
							var hideSheet = $ionicActionSheet.show({
								buttons: [{
									text: '<b>拍照</b> 上传'
								}, {
									text: '<b>拍身份证</b> 上传'
								},{
									text: '<b>拍小视屏</b> 上传'
								},{
									text: '从 <b>相册</b> 中选'
								}],
								titleText: '图片上传',
								cancelText: '取 消',
								cancel: function() {
									// add cancel code..
								},
								buttonClicked: function(index) {
									// 相册文件选择上传
									if (index == 3) {
										$scope.readalbum(prop);
									} else if (index == 0) {
										// 拍照上传普通图片commonImge和身份证IDCard
										$scope.taskPicture('commonImge');
									}else if (index == 2) {
										// 拍照上传小视屏
										$scope.captureVideo();
									}else if (index == 1) {
										// 拍身份证上传
										$scope.taskPicture('IDCard');										
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
									$scope.uploadimage(uri, prop);
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
					    	alert(videopath);
								$scope.uploadimage(videopath,uploadDir,"video/mp4");
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
//							var uuid = $cordovaDevice.getUUID();
////							var simInfo=$cordovaSIM.getSimInfo(alert, alert);
//							alert("手机信息："+uuid);
							
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
								$scope.uploadimage(imageURI,uploadDir);

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
						$scope.uploadimage = function(uri, uploadDir,mimetype) {
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
								alert("上传后返回值："+resp+"\n"+(resp.fileType=='IDCard'));
								//必须得parse一下，否则就会变成字符串
								var pit=JSON.parse(resp);
								alert("上传后返回值："+pit+"\n"+(pit.fileType=='IDCard'));
								if (pit.fileType&&pit.fileType=='IDCard') {
									alert("上传后ok");
									$scope.processIDcard(pit.filename);
									
								}else {
									$ionicLoading.hide();
								}
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
													alert("从服务器端获取来的身份证信息！");
													//curUser=$scope.curUser;
						              //$scope.resMsg=data;
						              if(status==200){
						              		alert("服务器解析出来了数据："+data+"<>"+data.name+"<>"+data.idNum);
              								$ionicLoading.show({
																	template: "服务器解析出来了数据："+data+"<>"+data.name+"<>"+data.idNum
																});
																//将身份证解析来的用户信息赋给本地全局对象
						              			$rootScope.curUser=data;
						              			var uuid = $cordovaDevice.getUUID();
																$rootScope.curUser.mobileUUid=uuid;	
																alert("$rootScope.curUser："+$rootScope.curUser+"<>"+$rootScope.curUser.name+"<>"+$rootScope.curUser.idNum);			
																//然后显示编辑框准备提交
																
															$ionicLoading.hide();
   															$state.go('tab.account-login-step2'); 

																
						              	}else {
						              		alert("咋回事？"+status);
						              	};
						              	
													$ionicLoading.hide();
						         }).error(function(data,status,headers,config){  
						              alert("网络中断导致未能识别，请稍后再试！");
						              
													$ionicLoading.hide();
						         });
										
					};
					
					
		//编辑当前用户
		$scope.editcurPerson= function() {
			if(!($rootScope.curUser.name&&$rootScope.curUser.idNum)) {				
					alert("用户名或身份证号码为空，请重新拍摄身份证!");
   				$state.go('tab.account-login-step1'); 
			}
			alert("保存提交用户到服务器!");
			//保存提交到服务器	
			$http({  
	         method:'POST',
	         url:$rootScope.applicationServer+'/person/registerByIdcard',  
	         data:$rootScope.curUser,
	        //params:[data:$scope.movieTestData ],
	         headers: {'Content-Type': 'application/json;charset=utf-8'},
	         dataType:'JSON'
	         })
			.success(function(data,status,headers,config){ 
								
	              if(status==200)
	              {
									$rootScope.curUser._id=data._id;
 									$rootScope.hideAccountTab=true;
	              	alert("用户注册成功！data._id:"+data._id);
   								$state.go('tab.dash'); 
	              };
	         }).error(function(data,status,headers,config){  
	              
	         });  
			
		};
		});