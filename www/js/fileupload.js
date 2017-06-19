  var html5fileuploader=function(inpuffileNode2,fileNameLabelNode,fileSizeLabelNode,fileTypeNode,responseFun,uploadProgressFun,filedir){
  var xhr = new XMLHttpRequest();
   var inpuffileNode= inpuffileNode2;
   var fileNameLabel=fileNameLabelNode;
   var fileSizeLabel=fileSizeLabelNode;
   var fileType=fileTypeNode;
    //监听选择文件信息
   this.fileSelected= function() {
   		//alert(1);
    	//HTML5文件API操作
    	  var file = inpuffileNode.files[0];
    	  if (file) {
    	    var fileSize = 0;
    	    if (file.size > 1024 * 1024)
    	      fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
    	    else
    	      fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';

    	    inpuffileNode.innerHTML = 'Name: ' + file.name;
    	    fileSizeLabel.innerHTML = 'Size: ' + fileSize;
    	    fileType.innerHTML = 'Type: ' + file.type;
    	  }
    	}
        
    html5fileuploader.prototype.okUrl= function() {
    	alert("文件已上传");
    	return this.fileNameLabel.value;
    }
    
    //上传文件
    this.uploadFile=function() {
    	//alert(3);
    	  var fd = new FormData();
    	  if(!inpuffileNode.files[0]){alert("请选择文件！");return;}
    	  else{alert("开始上传，请等待");};
    	  //关联表单数据,可以是自定义参数
    	  fd.append("name", fileNameLabel.value);
    	  fd.append("inputFile", inpuffileNode.files[0]);

				//this.okUrl();
    	  //监听事件
    	  xhr.upload.addEventListener("progress", uploadProgressFun, false);
    	  xhr.addEventListener("load", responseFun, false);//uploadComplete
    	  xhr.addEventListener("error", uploadFailed, false);
    	  xhr.addEventListener("abort", uploadCanceled, false);
    	  //发送文件和表单自定义参数
    	  xhr.open("POST", "http://58.64.149.165:2000/fileupload/"+filedir);
    	  xhr.send(fd);
    	}
    //取消上传
	var cancleUploadFile=function(){
		xhr.abort();
	}
    
    //上传进度
    var uploadProgress=function(evt) {
    	  if (evt.lengthComputable) {
    	    var percentComplete = Math.round(evt.loaded * 100 / evt.total);
    	    //document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
    	  }
    	  else {
    	    //document.getElementById('progressNumber').innerHTML = 'unable to compute';
    	  }
    }

    //上传成功响应
    var uploadComplete=function(evt) {
    	//服务断接收完文件返回的结果
    	//alert(evt.target.responseText);
    	alert("文件已上传");
    	this.okUrl();
    }
		
    //上传失败
    var uploadFailed=function(evt) {
    	 alert("上传失败");
    }
	//取消上传
    var uploadCanceled=function(evt) {
    	alert("您取消了本次上传.");
    }
    

}