var _currentloginuser, _temporder, _ordertype, channels,w=null;
function plusReady() {
    _currentloginuser = JSON.parse(plus.storage.getItem(storageManager.user));
    _temporder = JSON.parse(plus.storage.getItem(storageManager.temporder));
    //ordertype:购物车中的商品还是立即购买的商品
    _ordertype = undefined == getUrlParam("ordertype") ? "t" : "c";
    //初始化页面并
    var order = init();
    // 绑定事件
    bindEvent();
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}


function init() {
    if (null != _temporder) {
        $("#amount").html(_temporder.amount);
        $("#discount").html(_temporder.discount);
        $("#total").html(_temporder.total);
    }
    $.ajax({
        type: "get",
        url: configManager.RequstUrl + "api/store/info",
        async: true,
        data: { "store": _temporder.storeid }
    }).done(function (data) {
        if ("success" == data.state) {
            var store = data.data;
            var total = _temporder.total;
            var availablecoin = (_temporder.coin * store.coin_pay_fee) / configManager.coinrate + ((total * store.online_pay_fee) * 100) / 100;
            $("#availablecoin").html( Math.round(availablecoin) );

            //切换支付方式计算获得的金币
            $(".mt20 ul li a.check-a").on("click", function () {
                if (!$(this).hasClass("current")) {
                    $("ul.select-pay-block li a.check-a").removeClass("current");
                    $(this).addClass("current");

                    var paytype = $(this).attr("title");
                    var new_availablecoin = 0;

                    switch (paytype) {
                        case "5":			//微信支付
                        case "1": 			//掌创购会员支付
                            new_availablecoin = (_temporder.coin * store.coin_pay_fee) / configManager.coinrate + (total * store.online_pay_fee * 100) / 100;
                            break;
                        default:
                            break;
                    }

                    $("#availablecoin").html( Math.round(new_availablecoin) );
                }
            });

            //确认支付
            $("#confirmpay").on("click", function () {
                var payment = $("ul.select-pay-block li a.current").attr("title");
                // 掌创购会员支付
                if (payment == "1") {
                    _currentloginuser = JSON.parse(plus.storage.getItem(storageManager.user));
                    if (_currentloginuser.setpaypass != 1) {
                        checkSettingPwd();
                    } else {
                        accountPay();
                    }
                } else {
                    //console.log("postpay=" + JSON.stringify(postpay));
                    //plus.ui.alert("线上支付暂未开启，敬请期待", function () { }, configManager.alerttip, configManager.alertCtip);
                    //return false;
	                onlinePay(payment);             
                }
            });

        }
        else {
            console.log(data.message);
        }
    });
    
    //获取微信支付通道
    plus.payment.getChannels(function(ch){
    	channels = ch;
        //console.log(JSON.stringify(channels));
    },function(e){
        console.log("获取支付通道失败："+e.message);
    });
}

// 创建支付单,余额支付
function pay() {
    var payment = $("ul.select-pay-block li a.current").attr("title");
    var postpay = { "userid": _currentloginuser.id, "token": _currentloginuser.token, "order": _temporder.id, "payment": payment };
    $.ajax({
        type: "POST",
        url: configManager.RequstUrl + "api/order/pay",
        data: postpay
    }).done(function (pdata) {
        //  	console.log(JSON.stringify(pdata));
        if ("success" == pdata.state) {
            clicked("finish.html?id={0}&ordertype={1}".format(pdata.data.id, _ordertype), false, false, "slide-in-right");
        } else {
            plus.ui.alert(pdata.message, function () { }, configManager.alerttip, configManager.alertCtip);
        }
    }).always(function () {
        plus.nativeUI.closeWaiting();
    });
}

// 事件绑定
function bindEvent() {
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

// 掌创购会员支付
function accountPay() {
    // 清空密码框
    $("#paypop i[name=pwdchar]").removeClass("icon-circle");
    $("#paypop").show();
    $("#paypopfocus").val("").focus();
}

// 支付密码验证
function verifypass() {
    var password = $("#paypopfocus").val().trim().substr(0, 6);
    if (password.length < 6) { plus.nativeUI.alert("请输入6位数字密码！"); return; }

    $("#paypop").hide();
    plus.nativeUI.showWaiting("  付款中...  ");

    var postorder = { "userid": _currentloginuser.id, "password": password, "token": _currentloginuser.token, "type": "pay_password" };
    // 验证密码
    $.ajax({
        type: "POST",
        url: configManager.RequstUrl + "api/user/verifypass",
        async: true,
        data: postorder
    }).done(function (data) {
        if ("success" != data.state) {
            plus.nativeUI.closeWaiting();
            console.log(data.message);
            //plus.nativeUI.closeWaiting();
            if (data.code == -1) {
                // 设置支付密码
                clicked("../../account/editpaypassword.html");
            } else {
                plus.nativeUI.alert(data.message);
            }

            return;
        }

        // 创建支付单
        pay();
    }).fail(function () {
        plus.nativeUI.closeWaiting();
    });
}

// 是否设置过初始密码
function checkSettingPwd() {
    var postorder = { "userid": _currentloginuser.id, "token": _currentloginuser.token };
    // 判断是否设置初始密码
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
                    clicked("../../account/editpaypassword.html", false, false, 'slide-in-right');
                }
            }, "提示", ["稍后", "马上"]);
        } else {
            // 更新缓存
            _currentloginuser.setpaypass = 1;
            plus.storage.setItem(JSON.stringify(_currentloginuser));
        }
    });
}

//微信支付，支付宝支付
function onlinePay(payment){
	//if(w){return;}//检查是否请求订单中
	var curChannel=null,PAYSERVER="",w=plus.nativeUI.showWaiting();;
	$.each(channels, function(i,channel) {
		switch(payment){
			case "5": 
				if( "wxpay"==channel.id ){ 
					curChannel = channel; 
					PAYSERVER = configManager.wexinpayurl;	} 
				break;
			default:break;
		}
	});
	
	PAYSERVER += "?id="+_temporder.id + "&userid=" + _currentloginuser.id + "&token=" + _currentloginuser.token;
	
	console.log( JSON.stringify(curChannel) + "  " + PAYSERVER + " " + payment);
	//return;
	var codeUrl = "finish.html?id=" + _temporder.id;
	
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
        switch(xhr.readyState){
            case 4:
            if(xhr.status==200){
            	w.close();w=null;
                plus.payment.request(curChannel, xhr.responseText,            	
            	function(result){                	
                    plus.nativeUI.alert("支付成功！",function(){
                        clicked(codeUrl);
                    });
                },
                function(e){                	
                	//plus.nativeUI.alert(JSON.stringify(xhr.responseText));
                	//plus.nativeUI.alert(JSON.stringify(e));
                    console.log(JSON.stringify(xhr.responseText));
                    console.log(JSON.stringify(e));
                    plus.nativeUI.alert(e.message,function(){
                	clicked(codeUrl);
                    }, "支付信息", "确定");
                });
            }else{
                plus.nativeUI.alert("获取订单信息失败！");
            }
            break;
            default:
            break;
        }		
	}
    xhr.open('GET',PAYSERVER);
    xhr.send();	
}
