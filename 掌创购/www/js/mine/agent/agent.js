if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}
function plusReady(){
	var user = userLogin();
	//代理子帐号不能管理子帐号
	if( 5 == user.user_type ){
		$("#sub_count").hide();
	}
	InitPage(user);
}


function InitPage(user){
	$.ajax({
		type:"POST",
		url: configManager.RequstUrl + "api/agent/count",
		async:true,
		data:{ "userid":user.id, "token":user.token }
	}).done(function(data){
		if("success" == data.state){
			var agent = data.data;
			$("#store_count").html(agent.store_count);
			$("#sub_count").html(agent.sub_count);
		}else{
			plus.ui.alert(data.message, function() { }, configManager.alerttip, configManager.alertCtip);
		}
	});
}
