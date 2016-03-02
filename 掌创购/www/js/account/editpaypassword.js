
var user;
function plusReady() {
	user = userLogin();
	var opener = plus.webview.currentWebview().opener();
//	console.log(JSON.stringify(opener));
    //初始化
    init();
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

function init() { 
    var postorder = { "userid": user.id, "token": user.token };
    $.ajax({
        type: "POST",
        url: configManager.RequstUrl + "api/user/checksetpaypass",
        async: false,
        data: postorder
    }).done(function(data){
    	
		if( 1 == data.code ){
			$("#h2_editpaypass").html("修改支付密码");
			$("#div_current_paypass").show();
			$("#p_forget").show();
			user.setpaypass = 1;
		}
    	
    });


    $("#updatepaypassword").on("click", function () {
    	
//  	console.log(JSON.stringify(user));
    	
    	if( !$("#div_current_paypass").is(":hidden") ){
	        if ("" == $("#pay_password").val().trim()) {
	            plus.nativeUI.alert("请输入当前密码");
	            return false;
	        }
       	}
        if ("" == $("#new_pay_password").val().trim()) {
            plus.nativeUI.alert("请输入新密码");
            return false;
        }
        if (!isPayPassword($("#new_pay_password").val().trim())) {
            plus.nativeUI.alert("新密码必须是6位数字");
            return false;
        }
        if ("" == $("#confirm_new_pay_password").val().trim()) {
            plus.nativeUI.alert("请输入确认新密码");
            return false;
        }
        if ($("#new_pay_password").val().trim() != $("#confirm_new_pay_password").val().trim()) {
            plus.nativeUI.alert("两次输入的密码不一致");
            return false;
        }
		var postdata = {
                "userid": user.id,
                "type": "pay_password",
                "newpassword": $("#new_pay_password").val().trim(),
                "token": user.token };
        if( 1 == user.setpaypass ){
        	postdata.oldpassword = $("#pay_password").val().trim()
        }

        $.ajax({
            type: "POST",
            url: configManager.RequstUrl + "api/user/updatepassword",
            async: true,
            data: postdata
        }).done(function (data) {

            if ("success" == data.state) {
                user.token = data.token;
                user.setpaypass = 1;
                plus.storage.setItem(storageManager.user, JSON.stringify(user));
                
                var opener = plus.webview.currentWebview().opener();
                if(opener.id.indexOf("paybill.html") > -1){
                	opener.evalJS("getCurrentUser()");
                }
				plus.webview.currentWebview().close();
				
            }
            else {
                plus.nativeUI.alert(data.message);
            }
        });

    });

}
