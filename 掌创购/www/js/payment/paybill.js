var _currentloginuser, _store, _seller;
var channels = null;
function plusReady() {
    _store = getUrlParam("store");
    _seller = getUrlParam("seller");

    getCurrentUser();
    //初始化页面
    init();
    //绑定事件
    bindEvent();
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

//获取当前用户
function getCurrentUser() {
    _currentloginuser = JSON.parse(plus.storage.getItem(storageManager.user));
    //	console.log(JSON.stringify(_currentloginuser));
}

// 初始化页面
function init() {
    $("#validcoin").html(parseInt( _currentloginuser.account.coin ));

    $.ajax({
        type: 'Get',
        url: configManager.RequstUrl + "api/store/info?store=" + _store
    }).done(function (data) {
        if ("success" == data.state) {
            var storeinfor = data.data;
            //判断店铺是否支持到店刷卡
            if( 0 == storeinfor.is_paybycard ){ $("#payoffline").hide(); }
            //输入总消费金额
            $("#amount,#coin").on("keyup", function () {
                calculateAvailablecoin(storeinfor);
            });
            //切换支付方式计算获得的金币
            $(".mt20 ul li a.check-a").on("click", function () {
                if (!$(this).hasClass("current")) {
                    $("ul.select-pay-block li a.check-a").removeClass("current");
                    $(this).addClass("current");
                    calculateAvailablecoin(storeinfor);
                }
            });
        } else {
            plus.ui.alert(data.message, function () { }, configManager.alerttip, configManager.alertCtip);
        }
    });

    //获取微信支付通道
    plus.payment.getChannels(function (ch) {
        channels = ch;
        //console.log(JSON.stringify(channels));
    }, function (e) {
        console.log("获取支付通道失败：" + e.message);
    });
}

// 事件绑定
function bindEvent() {

    //确认支付
    $("#confirmpay").on("click", function () {
        if ("" == $("#amount").val() || parseFloat($("#amount").val()) <= 0) {
            plus.ui.alert("请输入消费金额", function () { }, configManager.alerttip, configManager.alertCtip);
            return false;
        }
        if ("" != $("#amount").val() && !is_positivefloat($("#amount").val())) {
            plus.ui.alert("请输入正确格式的消费金额", function () { }, configManager.alerttip, configManager.alertCtip);
            return false;
        }
        if ("" != $("#coin").val() && !is_integer($("#coin").val().trim())) {
            plus.ui.alert("请输入正确的金币格式", function () { }, configManager.alerttip, configManager.alertCtip);
            return false;
        }
        var payment = $("ul.select-pay-block li a.current").attr("title");

        switch (payment) {
            case "0": //到店刷卡
                payOrder("0");
                break;
            case "1": // 掌创购会员支付
                accountPay();
                break;
            case "5":
                payOnlineorder(payment);
                break;
            default:
                break;
        }
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

//支付订单
function payOrder(payment) {
    if ("" == $("#amount").val() || parseFloat($("#amount").val()) < 0) {
        plus.ui.alert("请输入消费金额", function () { }, configManager.alerttip, configManager.alertCtip);
        return false;
    }
    if (parseFloat($("#total").val()) < 0) {
        plus.ui.alert("请重新输入抵用金币", function () { }, configManager.alerttip, configManager.alertCtip);
        return false;
    }
    // 创建订单
    var postorder = {
        "userid": _currentloginuser.id,
        "store": _store, "seller": _seller,
        "amount": $("#amount").val(),
        "coin": $("#coin").val(),
        "payment": payment,
        "is_checkpay": "1",
        "token": _currentloginuser.token
    };
    $.ajax({
        type: "POST",
        url: configManager.RequstUrl + "api/order/create",
        async: true,
        data: postorder
    }).done(function (data) {
        if ("fail" == data.state) { plus.nativeUI.closeWaiting(); plus.ui.alert(pdata.message, function () { }, configManager.alerttip, configManager.alertCtip); return false; }
        var order = data.data;
        //到店刷卡，金币全额抵扣，不用支付直接跳到二维码
        if ("0" == payment || 1 == order.status) {
        	plus.nativeUI.closeWaiting();
            clicked("../mine/order/finish.html?id=" + order.id.toString(), false, false, "slide-in-right");
            return;
        }

        // 创建支付单
        var postpay = { "userid": _currentloginuser.id, "token": _currentloginuser.token, "order": order.id, "payment": payment };
        $.ajax({
            type: "POST",
            url: configManager.RequstUrl + "api/order/pay",
            data: postpay
        }).done(function (pdata) {
            if ("success" == pdata.state) {
                clicked("../mine/order/finish.html?id={0}".format(pdata.data.id), false, false, "slide-in-right");
            } else {
                plus.ui.alert(pdata.message, function () { }, configManager.alerttip, configManager.alertCtip);
            }
        }).always(function () {
            plus.nativeUI.closeWaiting();
        });

    }).always(function () {
        plus.nativeUI.closeWaiting();
    });


}

function calculateAvailablecoin(store) {
    //总金额
    var amount =  $("#amount").val().trim();
    //console.log(parseFloat(amount));
    if ("" == $("#amount").val()) { amount = 0; }
    else if (isNaN(amount) || parseFloat(amount) < 0) {
        $("#amount").val(0); amount = 0;
    } else {
        if (amount.indexOf(".") > -1) {
            amount = amount.substring(0, amount.indexOf(".") + 3);
            $("#amount").val(amount);
        }
    }
    //金币
    var uscoin = parseInt($("#coin").val());
    if ("" == $("#coin").val()) { uscoin = 0; }
    else if (!is_integer($("#coin").val())) { $("#coin").val(0); uscoin = 0; }
    else { $("#coin").val(uscoin); }

	if ((uscoin / configManager.coinrate) >= amount){
		uscoin = ( amount*configManager.coinrate );
		$("#coin").val(uscoin);
	}
    //可用金币
    var validcoin = parseInt( _currentloginuser.account.coin );
    //输入金币个数大于可用个数
    if (uscoin >= validcoin) {
        uscoin = validcoin;
        $("#coin").val(uscoin);
    }

    //金币折扣
    var discount = (uscoin / configManager.coinrate).toFixed(2);
    //本次消费获得的金币
    var availablecoin = parseFloat((uscoin * store.coin_pay_fee) / configManager.coinrate);
    //实际许需要支付金额
    var total = amount - discount;

    //支付方式
    var paytype = $("ul.select-pay-block li a.current").attr("title");

    console.log(JSON.stringify(store));

    switch (paytype) {
        case "5": 			//微信支付
        case "1": 			//余额支付
            //console.log(store.online_pay_fee);
            availablecoin = (uscoin * store.coin_pay_fee) / configManager.coinrate + (total * store.online_pay_fee * 100) / 100;
            break;
        case "0":			//到店刷卡支付
            //console.log(store.offline_pay_fee);
            availablecoin = (uscoin * store.coin_pay_fee) / configManager.coinrate + (total * store.offline_pay_fee * 100) / 100;
            break;
        default:
            break;
    }
	
    $("#discount").text(parseFloat(discount).toFixed(2));
    $("#availablecoin").html(Math.round(availablecoin));
    $("#total").text(total.toFixed(2));
}

// 掌创购会员支付
function accountPay() {
    //判断是否设置过支付密码
    var postorder = { "userid": _currentloginuser.id, "token": _currentloginuser.token };
    $.ajax({
        type: "POST",
        url: configManager.RequstUrl + "api/user/checksetpaypass",
        async: false,
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
            return;
        } else {
            // 更新缓存
            _currentloginuser.setpaypass = 1;
            plus.storage.setItem(JSON.stringify(_currentloginuser));
            // 清空密码框
            $("#paypop i[name=pwdchar]").removeClass("icon-circle");
            $("#paypop").show();
            $("#paypopfocus").val("").focus();
        }
    });


}

// 支付密码验证
function verifypass() {
    var password = $("#paypopfocus").val().trim().substr(0, 6);
    if (password.length < 6) { plus.nativeUI.alert("请输入6位数字密码！"); return; }

    $("#paypop").hide();
    plus.nativeUI.showWaiting("  付款中...  ");

    var postorder = { "userid": _currentloginuser.id, "password": password, "token": _currentloginuser.token, "type": "pay_password" };
    // 验证支付密码
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
                clicked("../aaccount/editpaypassword.html");
            } else {
                plus.nativeUI.alert(data.message);
                $("#paypopfocus").val($("#paypopfocus").val()).focus();
            }
            return;
        }
        if (data.code == 1) {
            // 创建支付单
            payOrder("1");
        }

    }).fail(function () {
        plus.nativeUI.closeWaiting();
    });
}

//在线支付
var w = null; //等待动画
function payOnlineorder(payment) {
	w = plus.nativeUI.showWaiting();
    //  // 创建订单
    var postorder = {
        "userid": _currentloginuser.id,
        "store": _store, "seller": _seller,
        "amount": $("#amount").val(),
        "coin": $("#coin").val(),
        "payment": payment,
        "is_checkpay": "1",
        "token": _currentloginuser.token
    };
    //console.log(JSON.stringify(postorder));
    $.ajax({
        type: "POST",
        url: configManager.RequstUrl + "api/order/create",
        async: true,
        data: postorder,
    }).done(function (data) {
        if ("fail" == data.state) { plus.ui.alert(pdata.message, function () { }, configManager.alerttip, configManager.alertCtip); return false; }
        var order = data.data;
        var codeUrl = "../mine/order/finish.html?id=" + order.id.toString();
        //金币全额抵扣不用支付
        if( 1 == order.status ){
            plus.nativeUI.alert("支付成功！", function () {
            	plus.nativeUI.closeWaiting();
                clicked(codeUrl);
            });
        }else{
        	onlinePay(payment, order);
        }
    });
}

//微信支付，支付宝支付
function onlinePay(payment, order) {
    //if(w){return;}//检查是否请求订单中

    var curChannel = null, PAYSERVER = "";
    $.each(channels, function (i, channel) {
        switch (payment) {
            case "5":
                if ("wxpay" == channel.id) {
                    curChannel = channel;
                    PAYSERVER = configManager.wexinpayurl;
                }
                break;
            default: break;
        }
    });

    PAYSERVER += "?id=" + order.id + "&userid=" + _currentloginuser.id + "&token=" + _currentloginuser.token;

    //console.log(JSON.stringify(curChannel) + "  " + PAYSERVER + " " + payment);
    //return;
    var codeUrl = "../mine/order/finish.html?id=" + order.id.toString();

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        switch (xhr.readyState) {
            case 4:
                if (xhr.status == 200) {
                	w.close(); w = null;
                    plus.payment.request(curChannel, xhr.responseText,
                    function (result) {
                        plus.nativeUI.alert("支付成功！", function () {
                            clicked(codeUrl);
                        });
                    },
                    function (e) {
                        //plus.nativeUI.alert(JSON.stringify(xhr.responseText));
                        //plus.nativeUI.alert(JSON.stringify(e));
                        //plus.nativeUI.toast("支付失败：" + e.message);
                        console.log(JSON.stringify(xhr.responseText));
                        console.log(JSON.stringify(e));
	                    plus.nativeUI.alert(e.message,function(){
	                	clicked(codeUrl);
	                    }, "支付信息", "确定");
                    });
                } else {
                    plus.nativeUI.alert("获取订单信息失败！");
                }
                break;
            default:
                break;
        }
    }
    xhr.open('GET', PAYSERVER);
    xhr.send();
}
