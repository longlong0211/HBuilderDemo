//$(document).ready(function(){
//	plusReady();
//});
function plusReady() {
    
    var user = userLogin();
//  var user = {};
    
    //初始化页面
    InitPage(user);
    
    //绑定事件
    BindEvent(user);
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

function InitPage(user){
	$("#name").val(user.real_name);
	$("#mobile").val(user.name);
	
	
}

function BindEvent(user){
	
	
	$("#confirmloan").on("click", function(){
		if("" == $("#money").val().trim()){
			plus.ui.alert("请输入借贷额度", function() { }, configManager.alerttip, configManager.alertCtip);
			return false;
		}
		if( !is_positivefloat($("#money").val().trim()) ){
			plus.ui.alert("请输入正确的借贷额度", function() { }, configManager.alerttip, configManager.alertCtip);
			return false;
		}
		if("" == $("#name").val().trim()){
			plus.ui.alert("请输入借贷人姓名", function() { }, configManager.alerttip, configManager.alertCtip);
			return false;
		}
		if("" == $("#mobile").val().trim()){
			plus.ui.alert("请输入联系电话", function() { }, configManager.alerttip, configManager.alertCtip);
			return false;
		}
		if( !isPhone($("#mobile").val().trim()) ){
			plus.ui.alert("请输入正确的联系电话", function() { }, configManager.alerttip, configManager.alertCtip);
			return false;
		}
		
		var postdata = {
			"userid"	: user.id,
			"token"		: user.token,
			"money"		: $("#money").val().trim(),
			"type"		: $("#type").val(),
			"name"		: $("#name").val().trim(),
			"mobile"	: $("#mobile").val().trim(),
		};
		
		console.log(JSON.stringify(postdata));
		
		$.ajax({
			type	:"POST",
			url		:configManager.RequstUrl + "api/account/loan",
			async	:true,
			data	:postdata
		}).done(function(data){
			if("success" == data.state){
				$("#money").val("");
				plus.ui.alert(data.message, function() { }, configManager.alerttip, configManager.alertCtip);
			}else{
				plus.ui.alert(data.message, function() { }, configManager.alerttip, configManager.alertCtip);
			}
		});
		
		
	});
	
	
}
