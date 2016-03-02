// 扫描二维码
function scaned(t, r, f) {
    console.log("扫描结果：" + r);
    if (!r) { return; }

    // 订单号
    var orderid = getUrlParam("order", r);
    // 获取用户Code
    var scancode = getUrlParam("code", r); //"3EDF" ;
    // 是否用户二维码
    var isInvitebarcodeType = (r.toLowerCase().indexOf("register") >= 0 && (scancode && scancode.trim() != ""));
    // 是否订单二维码
    var isOrderbarcodeType = (r.toLowerCase().indexOf("done.html") >= 0 && (orderid && orderid.trim() != ""));

    // 根据Code获取用信息
    var scanuser = null;
    if (isInvitebarcodeType) {
        $.ajax({
            type: "GET", url: configManager.RequstUrl + "api/user/profile?code=" + scancode,
            async: false
        }).done(function (data) {
            console.log(JSON.stringify(data));
            if ("success" != data.state) { console.log(data.message); plus.nativeUI.alert(data.message); return; }
            scanuser = data.data;
            if (!scanuser) { plus.nativeUI.alert("不存在该用户！"); return; }
            dealResult(orderid, scancode, isInvitebarcodeType, isOrderbarcodeType, scanuser);
        });
    } else {
        dealResult(orderid, scancode, isInvitebarcodeType, isOrderbarcodeType, scanuser);
    }
}

function dealResult(orderid, scancode, isInvitebarcodeType, isOrderbarcodeType, scanuser) {
    // 当前登录用户（空表示未登录）
    var currentloginuser = JSON.parse(plus.storage.getItem(storageManager.user));

    // 是否用户二维码
    if (isInvitebarcodeType) {
        // 登录跳转支付/未登录跳转注册
        if (currentloginuser) {
            // 用户自己二维码不允许扫描
            if (currentloginuser.code == scanuser.code) { plus.nativeUI.alert("用户不允许扫描自己的二维码！"); return; }
            if ([2, 3].indexOf(scanuser.user_type) != -1) {
                var param = "storeid=" + scanuser.store.id;
                plus.webview.open("../../view/merchant/detail.html?" + param, "../../view/merchant/detail.html", {}, "zoom-out", 100, {});

            } else {
            	if( [2, 3].indexOf(currentloginuser.user_type) == -1 ){
                	var param = "code=" + scancode;
                	plus.webview.open("../../view/payment/direct.html?" + param, "../../view/payment/direct.html", {}, "zoom-out", 100, {});
               }else{
               		plus.nativeUI.alert("当前帐号不可转账"); return;
               }
            }
        } else {
            var param = "type=" + scanuser.user_type + "&code=" + scancode;
            plus.webview.open("../../view/account/register.html?" + param, "../../view/account/register.html", {}, "zoom-out", 100, {});
        }
    } else if (isOrderbarcodeType) {
        // 只有商家才可以扫描订单码
        // 用户类型 1：普通用户； 2：商家； 3：商家子账号； 4：代理； 5：代理子账号； 6：后台管理人员
        if (currentloginuser && [2, 3].indexOf(currentloginuser.user_type) == -1) {
            plus.nativeUI.alert("对不起，您不是商家不可扫描！"); return;
        }

        // 登录跳转到订单二维码/未登录跳转到登录
        if (currentloginuser) {
            var param = "id=" + orderid;
            plus.webview.open("../../view/mine/order/confirmorder.html?" + param, "../../view/mine/order/confirmorder.html", {}, "zoom-out", 100, {});
        } else {
            // 跳转到登录
            plus.webview.open("../../view/account/login.html", "../../view/account/login.html", {}, "slide-in-bottom", 100, {});
        }
    } else {
        // 判断是否有效的URL
        var expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
        var objExp = new RegExp(expression);
        if (objExp.test(r) == true) {
            plus.runtime.openURL(r);
        } else {
            plus.nativeUI.alert("无效链接！");
        }
    }

}