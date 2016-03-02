function plusReady(){
	console.log("初始化editnick.html");
	init();
	
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

function init(){
	var user = userLogin();
	$("#nick").val(user.nick);


	
	$("#editNick").on("click", function(){
		
		if("" == $("#nick").val().trim()){
			plus.nativeUI.alert("请输入新昵称");
			return false;
		}
		var postdata = {"userid":user.id, "nick":$("#nick").val().trim(), "token":user.token };
		$.ajax({
			type:"POST",
			url:configManager.RequstUrl + "/api/user/updatenick",
			data:postdata
		}).done(function(data){
			if("success" == data.state){
				user.nick = postdata.nick;
				plus.storage.setItem(storageManager.user, JSON.stringify(user));
				plus.ui.alert(data.message, function() { 
					plus.webview.currentWebview().opener().evalJS("getUserInfo()");
					plus.webview.currentWebview().close(); 
				}, configManager.alerttip, configManager.alertCtip);
			}
			else{
				plus.nativeUI.alert(data.message);
			}
		});
	});
	
}


