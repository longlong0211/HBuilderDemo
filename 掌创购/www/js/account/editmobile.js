function plusReady() {
	console.log("初始化editmobile.html");
	//初始化   
	init();
}
if (window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}


//记住电话号码，发短信的时候需要
var user_mobile = "";
function init() {
	wait = configManager.senddelay;
	var user = userLogin();
	user_mobile = user.name;
	if (!isTelephone(user.name)) {
		plus.nativeUI.alert("请使用手机号注册账户名");
		clicked("personal.html");
	}
	$("#name").html(user.name.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'));
	
	//发送验证码
	$("#sendCode").on("click", function() { change_code(this, $("#hidvalidatecode"), user.name); });

	//验证
	$("#validate").on("click", function() {
		if ("" == $("#validatecode").val().trim()) {
			plus.nativeUI.alert("请输入验证码")
			return false;
		}
		if ("" == $("#hidvalidatecode").val().trim()) {
			plus.nativeUI.alert("正在发送，请等待")
			return false;
		}
		if ($("#validatecode").val().trim() != $("#hidvalidatecode").val().trim()) {
			plus.nativeUI.alert("验证码失败，请重新发送");
			return false;
		}
		clicked("bindmobile.html");
	});

	//密码验证
	$("#validatenow").on("click", function() {
		if ("" == $("#pay_password").val().trim()) {
			plus.nativeUI.alert("请输入支付密码");
			return false;
		}

		var postdata = {
			"userid": user.id,
			"password": $("#pay_password").val().trim(),
			"token": user.token,
			"type": "password"
		};

		$.ajax({
			type: "POST",
			url: configManager.RequstUrl + "api/user/verifypass",
			async: true,
			data: {
				"userid": user.id,
				"password": $("#pay_password").val().trim(),
				"token": user.token,
				"type": "pay_password"
			}
		}).done(function(data) {
			if ("success" == data.state) {
				clicked("bindmobile.html", false, false, "slide-in-right");
			} else {
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
	
	
	time(obj,hidobj,name);
	
	if( "" == name || undefined == name ){
		name = user_mobile;
	}
	var postdata = { "mobile":name };
	console.log(JSON.stringify(postdata));
	$.ajax({
		type	: "GET",
		url		: configManager.RequstUrl + "api/user/sendcode",
		data    : postdata,
		async	: true
	}).done(function(data){
		if("success" == data.state){
			plus.ui.alert("验证码发送成功请注意查收", function() {}, configManager.alerttip, configManager.alertCtip);
			$(hidobj).val(data.code);
		}
	});
}
var wait;
function time(obj, hidobj, name) {
    if (wait == 0) {
		$(obj).parent().css({"background":"#FFFFFF", 'border': '1px solid #f30'});
		$(obj).css('color', '#f30');
    	$(obj).html("获取验证码");
        wait = configManager.senddelay;
        $(obj).unbind();
        $(obj).click(function(){
        	change_code(obj, hidobj, name);
		});
    } else {
		$(obj).unbind();
		$(obj).parent().css({"background":"#DDDDDD", 'border': '1px solid #ddd'});
		$(obj).css('color', '#777');
		$(obj).html("发送中(" + wait + ")");
        wait--;
        setTimeout(function() {  time(obj); }, 1000);
    }
}