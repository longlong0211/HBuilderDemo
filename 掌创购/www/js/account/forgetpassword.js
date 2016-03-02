var _type = "";
function plusReady() {
    //类型 type： password:重置登录密码， pay_password:重置支付密码
    _type = getUrlParam("type");
    BindEvent();
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

function BindEvent() {
    //	console.log(_type);
    var h2text = ("password" == _type) ? "忘记登录密码" : "忘记支付密码";
    $("#h2_forgetpass").html(h2text);

    //发送验证码
    $("#sendvalidatecode").on("click", function () {
        change_code(this,
        			$("#mobile"),
        			$("#hidvalidatecode"),
        			$("#hidvalidatemobile"),
        			$("#hidsid"));

    });

    //验证
    $("#commit").on("click", function () {
		
        if ("" == $("#mobile").val()) {
            plus.nativeUI.alert("请输入验证码");
            return false;
        }
        if (!is_positiveinteger($("#mobile").val())) {
            plus.ui.alert("请输入正确验证码", function () { }, configManager.alerttip, configManager.alertCtip);
            return false;
        }
        if ($("#hidvalidatecode").val() != $("#validatecode").val()) {
            plus.nativeUI.alert("验证码错误，请重新发送");
            return false;
        }
        if ($("#mobile").val().trim() != $("#hidvalidatemobile").val()) {
            plus.nativeUI.alert("你输入的手机号不一致");
            return false;
        }
        if ("" == $("#hidsid").val()) {
            plus.nativeUI.alert("您还没有注册");
            return false;
        }
        
		var w = plus.ui.createWaiting();
		sleep(1000);
        $("#reset").show();
        $("#validateuser").hide();
        w.close();
    });

    //重置密码
    $("#resetpassword").on("click", function () {

        if ("" == $("#newpassword").val().trim()) {
            plus.nativeUI.alert("请填写新密码");
            return false;
        }
        if ("password" == _type && !isPasswd($("#newpassword").val().trim())) {
            plus.nativeUI.alert("密码必须为6至15位数字，字母或下划线组成");
            return false;
        }
        if ("pay_password" == _type && !isPayPassword($("#newpassword").val().trim())) {
            plus.nativeUI.alert("密码必须为6位数字");
            return false;
        }
        if ("" == $("#confimrnewmobile").val().trim()) {
            plus.nativeUI.alert("请再次填写新密码");
            return false;
        }
        if ($("#newpassword").val().trim() != $("#confimrnewmobile").val().trim()) {
            plus.nativeUI.alert("两次输入的密码不一致");
            return false;
        }

        var postdata = {
            "mobile": $("#hidvalidatemobile").val(),
            "code": $("#hidvalidatecode").val(),
            "newpassword": $("#newpassword").val(),
            "sid": $("#hidsid").val()
        };
        postdata.type = _type;
        //  	console.log(JSON.stringify(postdata));
        $.ajax({
            type: "POST",
            url: configManager.RequstUrl + "api/user/repass",
            async: true,
            data: postdata,
            beforeSend: function () { plus.nativeUI.showWaiting(); }
        }).done(function (data) {
            if ("success" == data.state) {
                if ("pay_password" == _type) {
                    var user = JSON.parse(plus.storage.getItem(storageManager.user));
                    user.setpaypass = 1;
                    plus.storage.setItem(storageManager.user, JSON.stringify(user));
                    plus.webview.currentWebview().close();
                } else {
                    plus.nativeUI.alert("密码更新成功，请重新登录！", function () { plus.webview.currentWebview().close(); });
                }
            } else {
                plus.ui.alert(data.message, function () { }, configManager.alerttip, configManager.alertCtip);
            }
        }).always(function () {
            plus.nativeUI.closeWaiting();
        });

    });

}

/*
 * obj 			: 发送按钮，是一个超链接
 * name			: 要发送验证码的手机号
 * hidobj 		: 隐藏域，存放验证码
 * hidmobile	: 隐藏域，存放填写接口返回的手机号
 * hidsid		: SID用来验证用户是否存在
 */
function change_code(obj, nameobj, hidobj, hidmobile, hidsid) {
    var name = "";
    if ("" == $(nameobj).val()) {
        plus.ui.alert("请输入手机号码", function () { }, configManager.alerttip, configManager.alertCtip);
        return false;
    }
    else if (!isTelephone($(nameobj).val())) {
        plus.ui.alert("请输入正确的手机号", function () { }, configManager.alerttip, configManager.alertCtip);
        return false;
    }
    else {
        name = $(nameobj).val();
    }

    time(obj, nameobj, hidobj, hidmobile, hidsid);

    var requesturl = configManager.RequstUrl + "api/user/sendcode?mobile=" + name;
    console.log(requesturl);
    $.ajax({
        type: "GET",
        url: requesturl,
        async: true
    }).done(function (data) {
        if ("success" == data.state) {
            $(hidobj).val(data.code);
            $(hidmobile).val(data.mobile);
            $(hidsid).val(data.sid);
        }
    });
}
var wait = configManager.senddelay;
function time(obj, nameobj, hidobj, hidmobile, hidsid) {
    if (wait == 0) {
        $(obj).attr('disabled', false);
        $(obj).css("background", "#FF6634");
        $(obj).css("color", "#fff");
        $(obj).val("获取验证码");
        wait = configManager.senddelay;
        $(obj).unbind();
        $(obj).on("click", function () {
            change_code(obj, nameobj, hidobj, hidmobile, hidsid);
        });
    } else {
        $(obj).attr('disabled', true);
        $(obj).css("background", "#DDDDDD");
        $(obj).css("color", "#ff6633");
        $(obj).val(wait + "s");
        wait--;
        setTimeout(function () { time(obj, nameobj, hidobj, hidmobile, hidsid); }, 1000);
    }
}
