var _currentuser, _usertype;
function plusReady() {
    _currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
    _usertype = getUrlParam("type");
    init();
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

function init() {
    //提交
    $("#addsubaccount").on("click", function () {
        if ("" == $("#name").val().trim()) {
            plus.nativeUI.alert("请输入子账号姓名");
            return false;
        }
        if ("" == $("#password").val().trim()) {
            plus.nativeUI.alert("请输入子账号密码");
            return false;
        }
        if (!isPasswd($("#password").val().trim())) {
            plus.nativeUI.alert("密码必须由6到15位数字或字母组成");
            return false;
        }
        if ("" == $("#mobile").val().trim()) {
            plus.nativeUI.alert("请输入子账户手机号");
            return false;
        }
        if (!isTelephone($("#mobile").val().trim())) {
            plus.nativeUI.alert("请输入正确的手机号");
            return false;
        }

        var postdata = {
            "userid": _currentuser.id,
            "token": _currentuser.token,
            "mobile": $("#mobile").val().trim(),
            "password": $("#password").val().trim(),
            "name": $("#name").val().trim()
        };

        // 代理
        if ("a" == _usertype) {
            addAgentSubAccount(postdata);
        } else {
            addStoreSubAccount(postdata);
        }
    });

}

// 添加商户子账号
function addStoreSubAccount(postdata) {
    $.ajax({
        type: "POST",
        url: configManager.RequstUrl + "/api/store/addsub",
        async: true,
        data: postdata
    }).done(function (data) {
        if ("success" == data.state) {
            plus.nativeUI.alert(data.message);
           // 商户更新列表
            plus.webview.currentWebview().opener().evalJS("loadSubAccountList()");
            back();
        }
        else {
            plus.nativeUI.alert(data.errors.name[0]);
        }
    });
}

// 添加代理子账号
function addAgentSubAccount(postdata) {
    $.ajax({
        type: "POST",
        url: configManager.RequstUrl + "/api/agent/addsub",
        async: true,
        data: postdata
    }).done(function (data) {
        if ("success" == data.state) {
            plus.nativeUI.alert(data.message);
           // 更新代理列表
            plus.webview.currentWebview().opener().evalJS("loadSubAccountList()");
            back();
        }
        else {
            plus.nativeUI.alert(data.errors.name[0]);
        }
    });
}
