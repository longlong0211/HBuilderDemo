function plusReady() {
    //	console.log("初始化editpassword.html");
    //初始化   
    init();
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

//$(document).ready(function(){
//	bind();
//});

function init() {

    var user = userLogin();

    $("#updatepassword").on("click", function () {

        if ("" == $("#password").val().trim()) {
            plus.nativeUI.alert("请输入当前密码");
            return false;
        }
        if ("" == $("#newpassword").val().trim()) {
            plus.nativeUI.alert("请输入新密码");
            return false;
        }
        if (!isPasswd($("#newpassword").val().trim())) {
            plus.nativeUI.alert("新密码必须由6到15位数字或字母组成");
            return false;
        }
        if ("" == $("#confirmnewpassword").val().trim()) {
            plus.nativeUI.alert("请确认新密码");
            return false;
        }
        if ($("#confirmnewpassword").val().trim() != $("#newpassword").val().trim()) {
            plus.nativeUI.alert("两次输入的密码不一致");
            return false;
        }

        var postdata = {
            "userid": user.id,
            "type": "password",
            "oldpassword": $("#password").val().trim(),
            "newpassword": $("#newpassword").val().trim(),
            "token": user.token
        };
        console.log(JSON.stringify(postdata));
        $.ajax({
            type: "POST",
            url: configManager.RequstUrl + "api/user/updatepassword",
            async: true,
            data: postdata
        }).done(function (data) {
            console.log(JSON.stringify(data));
            if ("success" == data.state) {
                //
                user.token = data.token;
                plus.storage.setItem(storageManager.user, JSON.stringify(user));
                plus.nativeUI.alert(data.message, function () {
                    plus.webview.currentWebview().close();
                });
            }
            else {
                plus.nativeUI.alert(data.message);
            }
        });

    });
}

