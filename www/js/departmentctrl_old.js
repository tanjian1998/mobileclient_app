var accountctr=angular.module('starter.controllers');
accountctr.controller('DepartmentCtrl', function($scope,$rootScope,$state, $ionicBackdrop,$ionicPopup, $http,$ionicModal) {
	  $scope.departments = [
    {
      name: '城市管理局（综合行政执法局）',
      checked: false,
      clapse:true,
      persons:[
      {name:'赵新天',chatid:0},
      {name:'刘文光',chatid:1},
      {name:'吴兴学',chatid:2}
      ],
      tree: [
        {
          name: '执法一队',
          checked: true,
          clapse:false,
          persons:[
			      {name:'盛来运',chatid:0},
			      {name:'顾莫言',chatid:1},
			      {name:'张小五',chatid:2}
			      ]
        },
        {
          name: '执法二队',
          checked: true,
          clapse:false
        },        {
          name: '执法三队',
          checked: true,
          clapse:false
        },        {
          name: '执法机动队',
          checked: true,
          clapse:false
        },        {
          name: '市容督察大队',
          checked: true,
          clapse:false
        }
      ]
    },
    {
      name: '水务局',
      checked: true
    }
  ];

	$scope.$on('$ionTreeList:ItemClicked', function(event, item) {
	  // process 'item'
	  item.clapse=!item.clapse;
	  console.log(item);
	});

	$scope.$on('$ionTreeList:LoadComplete', function(event, items) {
	  // process 'items'
	  console.log(items);
	});

});
