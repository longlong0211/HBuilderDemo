function plusReady(){
	console.log("初始化editshopinfo.html");
	var user = userLogin();
	//初始化
	init(user);
	//绑定
	bind(user);
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

//$(document).ready(function(){
//	init();
//	bind();
//});

function init(user){
	
//	console.log(JSON.stringify(user));
//	console.log(configManager.storeImgurl.format(user.store.store_pic, ""));
	if(user.store.store_pic){ 
		$("#storepic").attr("title",user.store.store_pic).attr("src", configManager.storeImgurl.format(user.store.store_pic, ""));
	}
	if(user.store.store_name){
		$("#store_name").val(user.store.store_name);
	}
}

function bind(user){
	
	
	//点击弹出摄像或相册
	$("#invok").on("click", function(){
		$("#heisebg").removeClass("heisebghid").addClass("heisebg");
	});
	//取消
	$("#cancel").on("click", function(){
		$("#heisebg").removeClass("heisebg").addClass("heisebghid");
	});
	
	//相册选择
	$("#album").on("click", function(){
		
		
			plus.gallery.pick(
				function(path){
					$("#heisebg").removeClass("heisebg").addClass("heisebghid");
					$("#waitingupload").removeClass("heisebghid").addClass("heisebg");
				
					var task = plus.uploader.createUpload( configManager.RequstUrl + "/api/common/upload", 
						{ method:"POST",blocksize:102400,priority:100 },
						function ( upload, status ) {
							// 上传完成
							if ( status == 200 ) {
								var data = JSON.parse(upload.responseText);
								var src =  configManager.storeImgurl.format(data.id, "");
								$("#parentpic").html('<img title="'+ data.id +'" onclick="javascript:$(this).remove();" style="width:100%;height: 100%;" id="storepic" src="'+ src +'" title="" />');
								$("#storepic").attr("title", data.id).attr("src", src).css("width","100%").css("height", "100%");
								$("#waitingupload").removeClass("heisebg").addClass("heisebghid");
							} else {
								console.log( "Upload failed: " + status );
							}
						}
					);
					task.addFile( path, {key:"file"} );
					task.addData( "dir", "store" );
					task.start();
				},
				function(e){
					console.log(e);
				},
				{filter:"image"}
			);
	});
	//摄像头拍照
	$("#camera").on("click", function(){
		var cmr = plus.camera.getCamera(1);
		if(null != cmr){
			//拍照
		    cmr.captureImage(function(p) {
		        plus.io.resolveLocalFileSystemURL(
	        	p,
	        	function(entry) {
					$("#heisebg").removeClass("heisebg").addClass("heisebghid");
					$("#waitingupload").removeClass("heisebghid").addClass("heisebg");	        		
	        		//上传图片
					var task = plus.uploader.createUpload( configManager.RequstUrl + "/api/common/upload", 
						{ method:"POST",blocksize:102400,priority:100 },
						function ( upload, status ) {
							// 上传完成
							if ( status == 200 ) {
								var data = JSON.parse(upload.responseText);
								var src =  configManager.storeImgurl.format(data.id, "120-80");
//								console.log( "Upload success: responseText = " + upload.responseText  + " src=" + src  );
								$("#storepic").attr("title", data.id).attr("src", src);
								$("#waitingupload").removeClass("heisebg").addClass("heisebghid");
							} else {
								console.log( "Upload failed: " + status );
							}
						}
					);
					task.addFile( "file://" + entry.fullPath,{key:"file"} );
					task.addData( "dir", "store" );
					task.start();
	        		
	        	},
		        function(e){ plus.nativeUI.alert(e.message);}  
		        );
		    }, 
		    function(e){}, 
		    { filename: "_doc/camera/" });
			
		}
		else{
			plus.nativeUI.alert("没有找到摄像头");
		}
		
	});
	
	
	//提交
	$("#commit").on("click", function(){
		if( !$("#storepic").attr("title") ){
			plus.nativeUI.alert("请选择店铺图片");
			return false;
		}
		if( "" == $("#store_name").val().trim() ){
			plus.nativeUI.alert("请填写店铺名称");
			return false;
		}
		
		var postdata = { "userid": user.id, "token": user.token, "name": $("#store_name").val().trim(), "pic": $("#storepic").attr("title") };
		console.log(postdata);
		$.ajax({
			type	: "POST",
			url		: configManager.RequstUrl + "/api/store/update",
			data	: postdata
		}).done(function(data){
			if("success" == data.state){
				user.store.store_name = $("#store_name").val().trim().toString();
				user.store.store_pic  = $("#storepic").attr("title").toString();
				plus.storage.setItem(storageManager.user, JSON.stringify(user));
				plus.nativeUI.alert(data.message);
				clicked("myshop.html");
			}
			else{
				plus.nativeUI.alert(data.message);
			}
		});
		
	});
	
	
}
