  $scope.items = [
    { id: 0,img:'about.jpg',title:'中国旅游地理',description:'古寺曾经是槽户乡人集散敬神的场所。过去每年农历三月初十为蔡翁会。每至会期，槽户乡人醵资演戏酬神，褒扬、纪念蔡伦发明造纸功绩。是日香火不断，热闹非常。古寺遗址处有一块四方形石碑，四面均有叙述文字，碑高1.7米，四边宽0.38米，上有雨盖，保存完好，碑名为”蔡翁碑叙“ ，由槽户等相议，于清代道光十九年（1840年）八月十五公立，由邑庠张潜修撰书。其文美誉盛赞蔡伦发明造纸功德，碑叙刻有”造纸张轻便非天生，蔡翁聪明神化造为纸张。……溯造纸之由，凡布絮、藤楮皆为可用。而其巧妙之初，莫过于竹。吾乡中惜竹造纸者也，砍其麻，去其青、渍以灰、煮以火、洗以水，舂以臼、抄以廉、刷以壁，纸之法。备纸之张成，于是乎。“ 此碑实为夹江手工造纸文明历史不可多得的宝贵文物。' },
    { id: 1,img:'temple.jpg',title:'中国旅游地理',description:'古寺摩崖造像是夹江县级文物保护单位。前人凿石为窟，镌刻佛像于窟内以图永存。分别在程品字形的巨石上凿刻古佛三窟，其中一窟高3.2米，宽5米，镌刻释迦牟尼身披袈裟，足立莲台石像，高达3米。其余两处为布袋罗汉。石像造型古朴，工艺精美，比例匀称，神态慈祥；每尊佛像两旁分别刻有力士、金刚、云童、飞天等伴相，手持兵器，身披甲胄，神气秀逸，威武健壮，形态各异，气韵生动。石窟造像场景恢宏，耀显气势，立体感受强烈，匠心独具，造诣高深，颇有观赏价值。造像的时间推测应该明朝宏治年代以早，其风格特色与毗连的金像寺石刻造像相近。巨石上前人有诸多题刻，因岩石为松散红沙岩，风蚀剥落严重，现仅存“凭虚御风”、不二仙愰“楷书斗大八字。《夹江县志》载：”寺前原有明代嘉靖戊申年（1548年）建石坊一座，刻题‘松云静境’，左右对联为‘石径通天窟，松风奏晓琴’，与寺具毁。' },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 }
   
  ];

$scope.infoWindow;
//关闭信息窗体
$scope.closeInfoWindow=function () {
    $scope.map.clearInfoWindow();
};
 //构建自定义信息窗体
$scope.createInfoWindow=function (name,img,infotxt,descontent,panocontent) {
    var info = document.createElement("div");
    info.className = "info";

    //可以通过下面的方式修改自定义窗体的宽高
    //info.style.width = "400px";
    // 定义顶部标题
    var top = document.createElement("div");
    var titleD = document.createElement("div");
    var closeX = document.createElement("img");
    top.className = "info-top";
    titleD.innerHTML = name;
    closeX.setAttribute("onclick",'alert("123");');
    closeX.id="closeinfo";
    closeX.src = "http://webapi.amap.com/images/close2.gif";
    //closeX.onclick =$scope.closeInfoWindow;
		//closeX.addEventListener("click",function () {
   // $scope.map.clearInfoWindow();
		//},true)
		 // Stop the side bar from dragging when mousedown/tapdown on the map


    top.appendChild(titleD);
    top.appendChild(closeX);
    info.appendChild(top);

    // 定义中部内容
    var middle = document.createElement("div");
    middle.className = "info-middle";
    middle.style.backgroundColor = 'white';
    var content = [];
    content.push("<table><tr><td><img src='"+img+"'></td></tr><tr><td>"+infotxt+"</td></tr></table>");
    //alert(info);//+info
    //content.push("<a href='#' onclick='alert(\""+descontent+"\")'>详细信息</a>");
    content.push("<a href='#' onclick='alert(2)'>详细信息</a>");
    content.push("<a href='#' onclick='window.open(\"../pano/panoview.html?panourl="+panocontent+"\")'>全景展示</a>");
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
};

 $scope.initInfoWindow=function(hp){
	//实例化信息窗体       
    infoWindow = new AMap.InfoWindow({
        isCustom: true,  //使用自定义窗体
        content: $scope.createInfoWindow(hp.name,hp.icon,hp.info,hp.des,hp.panolist[0].url),
        offset: new AMap.Pixel(16, -45)
    });
	};
	
	 $scope.markerClick=function(e) {
		var hp=e.target.content;
    $scope.initInfoWindow(hp);
    $scope.curHp=hp;
    infoWindow.open($scope.map, e.target.getPosition());
    alert(123);
};