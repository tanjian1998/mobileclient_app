var accountctr=angular.module('starter.controllers');
accountctr.controller('DepartmentCtrl', function($scope,$rootScope,$state, $ionicBackdrop,$ionicPopup, $http,$ionicModal) {

  //所有的单位
  $scope.alldepartments={};
  // $scope.collapsed=true;

  $scope.chatTo=function (personID) {
    console.log("要跟指定id的人聊天："+personID);

  }

  $scope.groupchat=function (personID) {
    console.log("要跟指定id的人聊天："+personID);
  }

  $scope.groupLocating=function (personID) {
    console.log("要定位指定的人群："+personID);
  }

  $scope.toggle=function (personID) {
    console.log("关闭对应的节点："+personID);
  }

  $scope.loadAllInvolvedChildrenByDid=function(didobj){
    if(didobj){
      //保存提交到服务器
      $http({
        method:'POST',
        url:$rootScope.applicationServer+'department/getAllpersonsByDepartIdOneStep',
        //params:{personid:curUserId},
        data:{_id:didobj._id},
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        dataType:'JSON'
      })
        .success(function(data,status,headers,config){
          //alert("用户定位点修改成功！");
          // curUser=$scope.curUser;
          // $scope.resMsg=data;
          // console.log(data+"<loadAllInvolvedChildrenByDid>"+status);
          if(status==200){
            //其实也可以得到部门，但是部门暂时没有用

            //如果人员关联的单位下属人员不为空
            if(data.persons && data.persons.length>0){
              // 继续列出来
              for(var index=0;index<data.persons.length;index++){
                console.log("下属部门："+data.persons[index]);
              }
              didobj.persons=data.persons;
              //测试一下加载人员后的单位树
              console.log('测试一下加载人员后的单位树');
              var str = JSON.stringify($scope.alldepartments);
              console.log(str);
            }
          };
        }).error(function(data,status,headers,config){

      });
    }
  };

  $scope.refreshPersonsUksee=function(group,dids){
    if(group.Departments && group.Departments.length>0){
      for(var indexdd=0;indexdd<group.Departments.length;indexdd++){
        var dobj = group.Departments[indexdd];
        //把这个单位的下属人员置为空
        dobj.persons={};
        console.log(group+"部门id");
        console.log(dobj._id);

        // 对单位树的每个节点，都遍历用户的相关单位进行比较
        var isIntheList=false;
        for(var index=0;index<dids.length;index++){

          console.log(dobj._id+'<>'+dids[index]);
          if(dobj._id==dids[index])isIntheList=true;
        }
        //说明这是用户相关的单位
        if(isIntheList){
          console.log('加载以下单位的人员：');
          console.log(dobj);
          $scope.loadAllInvolvedChildrenByDid(dobj);
        }
        //不管是否需要取人员，总之这个单位节点仍然需要递归遍历下去
        $scope.refreshPersonsUksee(dobj,dids);
      }
    }else {
      return;
    }
  }

  $scope.loadAllInvolvedDepartments = function () {
      // alert('ok');
      // 当服务器
	    if($rootScope.curUser && $rootScope.curUser._id){
        //保存提交到服务器
        $http({
          method:'POST',
          url:$rootScope.applicationServer+'department/getAllInvolvedDepartmentsByUserid',
          //params:{personid:curUserId},
          data:{_id:$rootScope.curUser._id},
          headers: {'Content-Type': 'application/json;charset=utf-8'},
          dataType:'JSON'
        })
          .success(function(data,status,headers,config){
            //alert("用户定位点修改成功！");
            // curUser=$scope.curUser;
            // $scope.resMsg=data;
            if(status==200){
              //说明服务器端获得当前用户所在部门成功
              // console.log(data+"<>"+data.length);
              //如果人员关联的单位不为空
              if(data.length>0){
                var dids=new Array();
                // 继续列出来
                for(var index=0;index<data.length;index++){
                  console.log(data[index]+"部门id"+data[index].department._id);
                  dids.push(data[index].department._id);
                  // $scope.loadAllInvolvedChildrenByDid(data[index].department._id);
                }
                console.log('测试一下准备刷新人员时的单位树');
                console.log($scope.alldepartments);
                $scope.refreshPersonsUksee($scope.alldepartments,dids);
              }
            };
          }).error(function(data,status,headers,config){

        });
      }
    };

  $scope.loadAllDepartments = function (parentgroup,id) {
    // alert('loadAllDepartments ok'+parentgroup+"<>"+id);
    var groupss=parentgroup?parentgroup:$scope.alldepartments;
    //当服务器
    // if($rootScope.curUser && $rootScope.curUser._id){
      //保存提交到服务器
      $http({
        method:'POST',
        url:$rootScope.applicationServer+'department/getAllchildrenDepartments',
        data:id?{_id:id}:{_id:''},
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        dataType:'JSON'
      })
        .success(function(data,status,headers,config){
          //alert("用户定位点修改成功！");
          // curUser=$scope.curUser;
          // $scope.resMsg=data;
          if(status==200){
            //说明服务器端获得当前用户所在部门成功
            // console.log(data.Departments+"<>"+data.Departments.length);
            groupss.Departments=new Array();
            //如果人员关联的单位不为空
            if(data.Departments && data.Departments.length>0){
              // 继续列出来
              for(var index=0;index<data.Departments.length;index++){
                // console.log(data.Departments[index]+"部门id"+data.Departments[index].name);
                groupss.Departments.push(data.Departments[index]);
              }

            }
            if(groupss.Departments.length>0){
              for(var indexd=0;indexd<groupss.Departments.length;indexd++){
                $scope.loadAllDepartments(groupss.Departments[indexd],groupss.Departments[indexd]._id);
              }
            }else{
              console.log('测试一下加载所有单位后的单位树');
              console.log($scope.alldepartments);
              //如果像下面这么调用的话，会把变化的值传回来，作为后面callback的参数
              $rootScope.$watch("curUser",$scope.loadAllInvolvedDepartments);
            }
          };
        }).error(function(data,status,headers,config){

      });
    // }
  };

  $scope.loadAllDepartments();

  // $scope.loadAllInvolvedDepartments();
});
