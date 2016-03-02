var _user;
function plusReady(){
	init();
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

function init(){
	_user = userLogin();
	console.log(JSON.stringify(_user));
	$("#storemobile").val(_user.store.store_mobile);
	
	$("#editMobile").on("click",function(){
		if( !isPhone( $("#storemobile").val() ) ){
			plus.ui.alert("请输入正确的手机号", function() {  }, configManager.alerttip, configManager.alertCtip);
			return false;
		}
		
		var postdata = { "userid":_user.id, "mobile":$("#storemobile").val().trim(), "token":_user.token };
		console.log(JSON.stringify(postdata));
		$.ajax({
			type:"POST",
			url: configManager.RequstUrl + "api/store/updatemobile",
			async:true,
			data:postdata
		}).done(function(data){
			if( "success" == data.state ){
				plus.ui.alert(data.message, function() { 	
				 	_user.store.store_mobile = postdata.mobile;
					plus.storage.setItem(storageManager.user, JSON.stringify(_user));
					plus.webview.currentWebview().close();
				}, configManager.alerttip, configManager.alertCtip);
			}else{
				plus.ui.alert(data.message, function() {}, configManager.alerttip, configManager.alertCtip);				
			}
		}).fail(function(){
			plus.webview.toast();
		});
	});
}
