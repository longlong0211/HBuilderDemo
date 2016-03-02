//$(function () { plusReady(); })

var _sellerInfo; var _currentloginuser;
function plusReady() {
    var scancode = getUrlParam("code");
    _currentloginuser = JSON.parse(plus.storage.getItem(storageManager.user));

    // 收款者
    getSellerInfo(scancode);
    // 判断是否设置初始密码
    checkSettingPwd();
    // 绑定事件
    bindEvent();
}

if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

function bindEvent() {
    // 确认支付
    $("#btnpay").on("click", function () {
        _currentloginuser = JSON.parse(plus.storage.getItem(storageManager.user));
        if (_currentloginuser.setpaypass != 1) {
            plus.nativeUI.confirm("是否设置初始密码？", function (e) {
                if (e.index == 1) {
                    // 设置支付密码
                    clicked("../account/editpaypassword.html", false, false, 'slide-in-right');
                }
            }, "提示", ["稍后", "马上"]);
            return;
        }
        if (!$("#payamount").val()) { return; }
        if (!_sellerInfo) { return; }

        // 清空密码框
        $("#paypop i[name=pwdchar]").removeClass("icon-circle");
        $("#paypop").show();
        $("#paypopfocus").val("").focus();
    });

    // 支付取消
    $("#btncancle").on("click", function () {
        $("#paypop").hide();
    });

    // 支付确认
    $("#btnconfirm").on("click", function () {
        verifypass();
    });

    // 键盘输入
    $("#paypopfocus").on("input", function () {
        var paypwd = $(this).val();
        if (!isNaN(paypwd) && paypwd.length <= 6 && paypwd.trim() == paypwd) {
            setCircle(paypwd.length);
        } else {
            if (paypwd.length >= 1) {
                $(this).val(paypwd.substr(0, paypwd.length - 1));
            } else {
                $(this).val(null);
            }
        }
    });

    function setCircle(num) {
        if (num > 6 || num < 0) { return; }
        var len = $("#paypop i[name=pwdchar][class=icon-circle]").length;
        if (len == num) { return; }

        var className = "icon-circle";
        var circlelist = $("#paypop i[name=pwdchar]");
        // 输入
        if (len < num) {
            for (var i = len  ; i < num ; i++) {
                $(circlelist[i]).addClass(className);
            }
        } else {
            for (var i = num  ; i < len ; i++) {
                $(circlelist[i]).removeClass(className);
            }
        }
    }

    // 密码输入框
    $("#pwdinputboard").on("click", function () {
        $("#paypopfocus").val($("#paypopfocus").val()).focus();
    });
}

// 获取收款者信息
function getSellerInfo(scancode) {
    // 根据Code获取用信息
    $.ajax({
        type: "GET", url: configManager.RequstUrl + "api/user/profile?code=" + scancode
    }).done(function (data) {
        if ("success" != data.state) {
            console.log(data.message);
        }
        var scanuser = data.data;
        if (!scanuser) { plus.nativeUI.alert("不存在该用户！"); return; }

        _sellerInfo = scanuser;

        $("#userpic").attr("src", configManager.avatarImgurl.format(scanuser.avatar_id, "50-50"));
        $("#username").html("<p>收款：" + scanuser.name + "</p>");
    });
}

// 支付密码验证
function verifypass() {
    var password = $("#paypopfocus").val().trim().substr(0, 6);
    if (password.length < 6) { plus.nativeUI.alert("请输入6位数字密码！"); return; }

    $("#paypop").hide();
    plus.nativeUI.showWaiting("  付款中...  ");

    var postorder = { "userid": _currentloginuser.id, "password": password, "token": _currentloginuser.token, "type": "pay_password" };
    // 提交订单
    $.ajax({
        type: "POST",
        url: configManager.RequstUrl + "api/user/verifypass",
        async: true,
        data: postorder
    }).done(function (data) {
        if ("success" != data.state) {
            plus.nativeUI.closeWaiting();
            console.log(data.message);
            if (data.code == -1) {
                // 设置支付密码
                clicked("../account/editpaypassword.html");
            } else {
                plus.nativeUI.alert(data.message);
                $("#paypopfocus").val($("#paypopfocus").val()).focus();
            }
            return false;
        } else {
	        // 创建订单
	        commitorder();
        }
    }).fail(function () {
        plus.nativeUI.closeWaiting();
    });
}

// 生成一个临时订单号
function commitorder() {
    var amount = $("#payamount").val().trim();
    var postorder = { "userid": _currentloginuser.id,"is_qrcodepay":1, "token": _currentloginuser.token, "seller": _sellerInfo.id, "amount": amount, "payment": 1 };
	
    // 如果对方是商家
    if (_sellerInfo.store) { postorder["store"] = _sellerInfo.store.id; }
	//console.log(JSON.stringify(postorder));
    // 提交订单
    $.ajax({
        type: "POST",
        url: configManager.RequstUrl + "api/order/create",
        async: true,
        data: postorder
    }).done(function (data) {
        if ("success" != data.state) { plus.nativeUI.closeWaiting(); console.log(data.message); plus.nativeUI.alert(data.message); return; }
        var postpay = { "userid": _currentloginuser.id, "order": data.data.id, "token": _currentloginuser.token };
        //console.log(JSON.stringify(postpay));
        // 确认支付
        $.ajax({
            type: "POST",
            url: configManager.RequstUrl + "api/order/pay",
            data: postpay
        }).done(function (pdata) {
            if ("success" != pdata.state) { plus.nativeUI.closeWaiting(); console.log(pdata.message); plus.nativeUI.alert(pdata.message); return; }
            // 弹出系统提示对话框
            plus.nativeUI.alert("付款成功！", function () {
                plus.webview.currentWebview().close();
            }, "提示", "确认");
        }).always(function () {
            plus.nativeUI.closeWaiting();
        });
    }).fail(function () {
        plus.nativeUI.closeWaiting();
    });
}

// 是否设置过初始密码
function checkSettingPwd() {
    if (_currentloginuser.setpaypass != 1) {
        var postorder = { "userid": _currentloginuser.id, "token": _currentloginuser.token };
        // 判断是否设置初始密码
        $.ajax({
            type: "POST",
            url: configManager.RequstUrl + "api/user/checksetpaypass",
            async: true,
            data: postorder
        }).done(function (data) {
            if ("success" != data.state) { console.log(data.message); }
            if (data.code != 1) {
                plus.nativeUI.confirm("是否设置初始密码？", function (e) {
                    if (e.index == 1) {
                        // 设置支付密码
                        clicked("../account/editpaypassword.html", false, false, 'slide-in-right');
                    }
                }, "提示", ["稍后", "马上"]);
            } else {
                // 更新缓存
                _currentloginuser.setpaypass = 1;
                plus.storage.setItem(JSON.stringify(_currentloginuser));
            }
        });
    }

}