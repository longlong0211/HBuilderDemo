function plusReady(){
	//初始化   
	init();
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}
////
//$(document).ready(function(){
//	init();
//});

function init(){
	var user = userLogin();
	wait = configManager.senddelay;
	//发送验证码
	$("#sendCode").on("click", function(){
		if("" == $("#name").val().trim()){
			plus.nativeUI.alert("请输入手机号");
			return false;
		}
		if(!isTelephone($("#name").val().trim())){
			plus.nativeUI.alert("输入的手机号格式不正确");
			return false;
		}
		
		change_code(this, $("#hidvalidatecode"), $("#name").val().trim());
		
	});
	
	
	$("#confimrnewmobile").on("click", function(){

		if("" == $("#name").val().trim()){
			plus.nativeUI.alert("请输入手机号");
			return false;
		}
		if(!isTelephone($("#name").val().trim())){
			plus.nativeUI.alert("输入的手机号格式不正确");
			return false;
		}
		if("" == $("#validatecode").val().trim()){
			plus.nativeUI.alert("请输入验证码");
			return false;
		}
		if($("#validatecode").val().trim() != $("#hidvalidatecode").val().trim()){
			plus.nativeUI.alert("验证码失败，请重新发送");
			return false;
		}
	    if ($("#name").val().trim() != $("#hidvalidatemobile").val()) {
	        plus.nativeUI.alert("你输入的手机号不一致");
	        return false;
	    }
		$.ajax({
			type:"POST",
			url: configManager.RequstUrl + "/api/user/updatemobile",
			async:true,
			data:{"userid":user.id, "mobile":$("#name").val().trim(), "token":user.token },
		}).done(function(data){
			if("success" == data.state){
				user.name = $("#name").val().trim();
				plus.storage.setItem(storageManager.user, JSON.stringify(user));
				plus.nativeUI.alert("绑定成功");
				clicked("personal.html");
			}
			else{
				plus.nativeUI.alert(data.message);
			}
		});		
	});

	
}

/*
 * obj 		: 发送按钮，是一个超链接
 * hidobj 	: 隐藏域
 * name		: 要发送验证码的手机号
 */
function change_code(obj, hidobj, name) {
	
	time(obj, hidobj, name);
	if( "" == name || undefined == name ){
		name = $("#name").val().trim();
	}
	var postdata = { "mobile":name };
	$.ajax({
		type	: "GET",
		url		: configManager.RequstUrl + "api/user/sendcode",
		data    : postdata,
		async	: true
	}).done(function(data){
		if("success" == data.state){
			plus.ui.alert("验证码发送成功请注意查收", function() {}, configManager.alerttip, configManager.alertCtip);
			$(hidobj).val(data.code);
			$("#hidvalidatemobile").val(data.mobile);
		}
	});
}
var wait;
function time(obj, hidobj, name) {
    if (wait == 0) {
		$(obj).parent().css("background","#FFFFFF");
    	$(obj).html("获取验证码");
        wait = configManager.senddelay;
        $(obj).unbind();
        $(obj).click(function(){
        	change_code(obj, hidobj, name);
		});
    } else {
		$(obj).unbind();
		$(obj).parent().css("background","#DDDDDD");
		$(obj).html("发送中(" + wait + ")");
        wait--;
        setTimeout(function() {  time(obj); }, 1000);
    }
}
