var accountctr=angular.module('starter.controllers');
accountctr.controller('AccountLoginCtrl', function(
  $scope,$rootScope,$ionicBackdrop,$ionicPopup,$cordovaDevice,$ionicModal,departmentAndPersonsService,$state,$cordovaCapture,$ionicLoading,$http,$ionicActionSheet,$cordovaCamera,$cordovaImagePicker,$ionicLoading, CameraService,$timeout,localStorageService
)
        {
          // alert("AccountLoginCtrl");
						$scope.image = '';
						//是否显示编辑用户框
						$rootScope.hideAccountEditForm=true;
            //进入注册页面应该看不到tab的按钮，不能进入地图等页面
            $rootScope.hideAccountTab=($rootScope.curUser && $rootScope.curUser._id)?false:true;
            // 该人员的单位是否设置好了
            $scope.departMentSetRight=false;

            $ionicLoading.hide();

            $scope.initAllDepartments=function () {
              // 得到所有部门为用户注册做准备，30分钟内有效
              // localStorageService.clear("allDepartments");
              // alert("AccountLoginCtrl");
              $rootScope.alldepartments=localStorageService.get("allDepartments", 30);
              if(!$rootScope.alldepartments)
              {
                departmentAndPersonsService.getAllDepartment($rootScope.applicationServer);
                return;
              }
              // if( $rootScope.alldepartments &&  $rootScope.alldepartments.length>0){
              //
              //     for(var index=0;index< $rootScope.alldepartments.length;index++)
              //     {
              //       $rootScope.alldepartments[index].role=
              //         $rootScope.roleInDepartment[0];
              //     }
              // }
              localStorageService.update("allDepartments", $rootScope.alldepartments);
              console.log("initAllDepartments选择完之后的部门及权限"+JSON.stringify($rootScope.alldepartments));
            }
          $scope.initAllDepartments();
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
          $scope.$on('allDepartmentsRefreshed', function(event,data) {
            console.log("allDepartmentsRefreshed之后的部门及权限"+JSON.stringify($rootScope.alldepartments));

            $scope.initAllDepartments();

          });

          $scope.selectDepartment=function () {
            console.log("allDepartmentsRefreshed之后的部门及权限"+JSON.stringify($rootScope.alldepartments));
            $ionicModal.fromTemplateUrl('templates/selectDepartmentModal.html', {
              scope: $scope
            }).then(function(modal) {
              $scope.modal = modal;
              $scope.modal.show();
            });
        };

          $scope.selectedDepartment = function(u) {
            console.log("选择完之后的部门及权限"+JSON.stringify($rootScope.alldepartments));
            // $scope.contacts.push({ name: u.firstName + ' ' + u.lastName });
            if( $rootScope.alldepartments &&  $rootScope.alldepartments.length>0){
              $rootScope.curUser.departments=new Array();
              $scope.departMentSetRight=false;
              for(var index=0;index< $rootScope.alldepartments.length;index++)
              {
               if($rootScope.alldepartments[index].checked && $rootScope.alldepartments[index].role && $rootScope.alldepartments[index].role.name)
               {
                 $scope.departMentSetRight=true;
                 $rootScope.curUser.departments.push({
                   "role" :$rootScope.alldepartments[index].role.role,
                   "department" : $rootScope.alldepartments[index]._id
                 });
               }
              }
            if(!$scope.departMentSetRight){
                $rootScope.curUser.departments=null;
              }
            }
            $scope.modal.hide();
          };



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
					    	alert(videopath);
								$scope.uploadfile(videopath,uploadDir,"video/mp4");
					      // Success! Video data is here
					    }, function(err) {
					      // An error occurred. Show a message to the user
					    });
					  }
          $scope.takephoto =  function () {
            console.log(44);
            var options = {
              quality: 50,
              destinationType: Camera.DestinationType.DATA_URL,
              sourceType: Camera.PictureSourceType.CAMERA,
              allowEdit: true,
              encodingType: Camera.EncodingType.JPEG,
              targetWidth: 100,
              targetHeight: 100,
              popoverOptions: CameraPopoverOptions,
              saveToPhotoAlbum: true

            };
            $cordovaCamera.getPicture(options).then(function(imageData) {
              // var image = document.getElementById('myImage');
              // image.src = "data:image/jpeg;base64," + imageData;

              console.log("拍照数据："+imageData);
            }, function(err) {
              // error
              console.log("拍照错误："+err);
            });

          };
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
								$scope.uploadfile(imageURI,uploadDir);

							}, function(err) {
							alert(err);

//							$ionicLoading.show({
//													template: '拍照出错，请确认设备完好并重试...'
//												});
//
//							$timeout($ionicLoading.hide(),2000);

							});

						}

						// 上传服务器,后面是上传的类型，普通图片commonImge和身份证IDCard
						$scope.uploadfile = function(uri, uploadDir, mimetype) {
              // alert('请在真机环境中使用拍照上传。'+uploadDir)
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

							var ft = new FileTransfer();
							$ionicLoading.show({
								template: '上传中...'
							});
              // alert('2。')

							//这里将图片上传到指定网址
							ft.upload(fileURL,uploadDir , function(data) {
								// 设置图片新地址
								var resp = data.response;
								console.log(resp);
                // alert('3。')
//								alert(resp);
								//alert("上传后返回值："+resp+"\n"+(resp.fileType=='IDCard'));
								//必须得parse一下，否则就会变成字符串
								var pit=JSON.parse(resp);
								// alert("上传后返回值："+pit+"\n"+(pit.fileType=='IDCard'));
								if (pit.fileType&&pit.fileType=='IDCard') {
									// alert("上传后ok");
									$scope.processIDcard(pit.filename);

								}else {
									$ionicLoading.hide();
								}
							}, function(error) {
								// alert(error);
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
						         url:$rootScope.applicationServer+'processID/IDCard',
						         data:{"fileURL":fileURL},
						        //params:[data:$scope.movieTestData ],
						         headers: {'Content-Type': 'application/json;charset=utf-8'},
						         dataType:'JSON'
						         })
								.success(function(data,status,headers,config){
													//alert("从服务器端获取来的身份证信息！");
													//curUser=$scope.curUser;
						              //$scope.resMsg=data;
						              if(status==200){
						              		//alert("服务器解析出来了数据："+data+"<>"+data.name+"<>"+data.idNum);
                              if(data.idNum)
                              {$ionicLoading.show({
																	template: "服务器解析出来了数据："+data+"<>"+data.name+"<>"+data.idNum
																});
                              }else {
                                $ionicLoading.show({
                                  template: "服务器解析身份证失败，请确认照片清晰并重试"
                                });
                                $state.go('tab.account-login-step1');
                              }
																//将身份证解析来的用户信息赋给本地全局对象
						              			$rootScope.curUser=data;
                                //得到app一启动时获取的手机号
                                $rootScope.curUser.mobile=$rootScope.phoneNum;
						              			var uuid = $cordovaDevice.getUUID();
																$rootScope.curUser.mobileUUid=uuid;

                                // $rootScope.curUser.
																//alert("$rootScope.curUser："+$rootScope.curUser+"<>"+$rootScope.curUser.name+"<>"+$rootScope.curUser.idNum);
                                // window.plugins.base64ToPNG.saveImage($root.curUser.coverSmall, {filename:"./userHead.png", overwrite: true},
                                //   function(result) {
                                //     alert(result);
                                //   }, function(error) {
                                //     alert(error);
                                //   });

																//然后显示编辑框准备提交

															$ionicLoading.hide();
   															$state.go('tab.account-login-step2');


						              	}else {
						              		alert("服务器解析不成功，请重试:"+status);
						              	};

													$ionicLoading.hide();
						         }).error(function(data,status,headers,config){

													$ionicLoading.hide();
                          $ionicPopup.alert({
                            title:'网络中断',
                            template: "<br><h4>网络中断导致未能识别，请稍后再试！</h4>",
                            okText: '确认'
                          });
						         });

					};

        $scope.gobacktoIDpic= function() {
          $state.go('tab.account-login-step1');
        };

          $scope.$on('userRegistedOk', function(event,data) {
            $ionicPopup.alert({
              title:'已注册',
              template: "<br><h4>用户注册成功，您可以正常使用了！</h4>",
              okText: '确认'
            });
            $ionicLoading.hide();
            // console.log("用户注册成功！data._id:"+data._id);
            //进入注册页面应该看不到tab的按钮，不能进入地图等页面
            $rootScope.hideAccountTab=($rootScope.curUser && $rootScope.curUser._id)?false:true;
            $state.go($rootScope.afterSigninTopage);

          });
          $scope.errText="";
		//编辑当前用户
		$scope.editcurPerson= function() {

			// alert("保存提交用户到服务器!");
      $ionicPopup.confirm({
        title:'确认注册到指挥中心',
        template: "<br><h4>请确认身份信息正确后，再提交注册信息</h4>",
        okText: '确认',
        cancelText: '取消'
      }).then(function(res){
        //这个函数在弹出框关闭时被调用;
        if(res) {
          console.log('You are sure');
          if(!($rootScope.curUser.name&&$rootScope.curUser.idNum && $scope.departMentSetRight)) {
            $scope.errText= "";
            $ionicPopup.alert({
              title:'确认注册到指挥中心',
              template: "<br><h4>用户名或身份证号码为空，或者没有选择相关单位，请确认并重试</h4>",
              okText: '确认'
            })
            return;
            // $state.go('tab.account-login-step1');
          }else{
            $scope.errText="";
            $ionicLoading.show({
              template: "用户正在注册!"
            });
            //保存提交到服务器
            $http({
              method:'POST',
              url:$rootScope.applicationServer+'person/registerByIdcard',
              data:$rootScope.curUser,
              //params:[data:$scope.movieTestData ],
              headers: {'Content-Type': 'application/json;charset=utf-8'},
              dataType:'JSON'
            })
              .success(function(data,status,headers,config){

                if(status==200)
                {
                  if(data && data._id){
                    $rootScope.curUser._id=data._id;
                    // 用户已经有id了，说明服务器有了，将用户存入缓存
                    localStorageService.update("curUser" , $rootScope.curUser);
                    // alert("用户注册成功！data._id:"+data._id);
                    $rootScope.$broadcast('userRegistedOk',data);
                  }else {
                    $ionicLoading.hide();
                  }
                };
              }).error(function(data,status,headers,config){
                $ionicLoading.hide();
            });
          }
        } else {
          console.log('You are not sure');
          return;
        }
      });


		};
		});
