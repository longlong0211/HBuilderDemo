//$(function () { plusReady();})
function plusReady() {
    init();
    bindEvent();
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

var auths = {};
// 初始化
function init() {
    // 获取登录认证通道
    plus.oauth.getServices(function (services) {
        for (var i in services) {
            var service = services[i];
            console.log(service.id + ": " + service.authResult + ", " + service.userInfo);
            auths[service.id] = service;
            //var de = document.createElement('div');
            //de.setAttribute('class', 'button');
            //de.setAttribute('onclick', 'login(this.id)');
            //de.id = sevice.id;
            //de.innerText = service.description + "登录";
            //oauth.appendChild(de);
        }
    }, function (e) {
        console.log("获取登录认证失败：" + e.message);
    });
}


// 事件绑定
function bindEvent() {
    // 登录
    $("#login").on("click", function () {
        //login("qq");
        //return;
        //验证
        if ("" == $("#name").val()) {
            plus.nativeUI.alert("请填写用户名", function () { }, "提示", "好");
            return false;
        }
        if ("" == $("#password").val() || "请输入密码" == $("#password").val()) {
            plus.nativeUI.alert("请输入密码", function () { }, "提示", "好");
            return false;
        }

        var postdata = { "name": $("#name").val(), "password": $("#password").val() };
        console.log(JSON.stringify(postdata));
        //		return false;
        plus.nativeUI.showWaiting("  登录中...  ");
        $.ajax({
            type: 'POST',
            url: configManager.RequstUrl + 'api/user/login',
            data: postdata
        }).done(function (data) {
            plus.nativeUI.closeWaiting();
            if ("success" == data.state) {
                var loginuser = data.data;
                //if ([2, 3].indexOf(loginuser.user_type) > -1) {
                //// 完善用户店铺信息
                //GetUserStoreInfo(loginuser);
                //}

                console.log("用户登录:" + JSON.stringify(loginuser));
                if (!loginuser.token || loginuser.token.trim() == "") { plus.nativeUI.alert("注册失败（无效Token）"); return; }
                plus.storage.setItem(storageManager.user, JSON.stringify(loginuser));
                var opener = plus.webview.currentWebview().opener();
                if (opener.id == pageName.mine) {
                    // 更新我的
                    plus.webview.getWebviewById(pageName.mine).evalJS("plusReady()");
                } else {
                    // 更新我的
                    plus.webview.getWebviewById(pageName.mine).evalJS("plusReady()");
                    opener.reload(false);
                }

                back();
            } else {
                plus.nativeUI.alert(data.message, function () { }, "提示", "好");
            }
        }).fail(function () {
            plus.nativeUI.alert(errorMessage.interface);
        }).always(function () {
            plus.nativeUI.closeWaiting();
        });
    });
}

// 登录认证
function login(id) {
    var auth = auths[id];
    if (auth) {
        var w = plus.nativeUI.showWaiting();
        document.addEventListener("pause", function () {
            setTimeout(function () {
                w && w.close(); w = null;
            }, 2000);
        }, false);
        auth.login(function () {
            w && w.close(); w = null;
            console.log("登录认证成功：");
            console.log(JSON.stringify(auth.authResult));
            userinfo(auth);
        }, function (e) {
            w && w.close(); w = null;
            console.log("登录认证失败：");
            console.log("[" + e.code + "]：" + e.message);
            plus.nativeUI.alert("授权登录失败！", null, "登录失败[" + e.code + "]：" + e.message);
        });
    } else {
        console.log("无效的登录认证通道！");
        plus.nativeUI.alert("无效的登录认证通道！", null, "登录");
    }
}
// 获取用户信息
function userinfo(a) {
    console.log("----- 获取用户信息 -----");
    a.getUserInfo(function () {
        console.log("获取用户信息成功：");
        console.log(JSON.stringify(a.userInfo));
        var nickname = a.userInfo.nickname || a.userInfo.name;
        plus.nativeUI.alert("欢迎“" + nickname + "”登录！");
    }, function (e) {
        console.log("获取用户信息失败：");
        console.log("[" + e.code + "]：" + e.message);
        plus.nativeUI.alert("获取用户信息失败！", null, "登录");
    });
}
// 注销登录
function logoutAll() {
    for (var i in auths) {
        logout(auths[i]);
    }
}
function logout(auth) {
    auth.logout(function () {
        console.log("注销\"" + auth.description + "\"成功");
    }, function (e) {
        console.log("注销\"" + auth.description + "\"失败：" + e.message);
    });
}

// 获取用户店铺信息
function GetUserStoreInfo(loginuser) {
    $.ajax({
        type: "GET",
        async: false,
        url: configManager.RequstUrl + "api/user/profile",
        data: { "userid": loginuser.id, "account": "1" }
    }).done(function (data) {
        if ("success" == data.state) {
            loginuser.store = data.data.store;
        }
        else {
            console.log(data.message);
        }

    });
}
