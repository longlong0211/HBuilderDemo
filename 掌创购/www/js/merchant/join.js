var _currentloginuser;
function plusReady() {
    _currentloginuser = JSON.parse(plus.storage.getItem(storageManager.user));

    // 初始化
    init();

    // 绑定事件
    bindEvent();
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

// 初始化
function init() {
    var currentview = plus.webview.currentWebview();

    // 可用金币
    $("#validcoin").text(parseInt(_currentloginuser.account.coin));
    // 预付
    $("#totalprice").text(currentview.price);

	//价钱为0不显示抵用金币
	if(0 == currentview.price){
		$("#afterorder,#div_availablecoin").hide();
		$("#div_price").addClass("mt20");		
	}
    //店铺是否支持到店刷卡
    if (0 == currentview.is_paybycard) {
        $("#apayoffline").hide();
        $("#payonline").attr("checked", true);
    }
}

// 绑定事件
function bindEvent() {
    var price = plus.webview.currentWebview().price;
    //金币折扣
    $("#coin").on("keyup", function () {
        var uscoin = parseFloat($(this).val().trim());
        if ("" == $(this).val().trim()) { uscoin = 0; }
        else if (isNaN($(this).val().trim())) { $(this).val(0); uscoin = 0; }

        //输入金币个数抵用的钱大于小计总和
        if ((uscoin / configManager.coinrate) >= price) {
            $(this).val(price * configManager.coinrate);
        }
        if (uscoin > validcoin) {
            $(this).val(validcoin);
        }

        // 计算预付金额
        calcGroupPrice(price);
    }).on("change", function () {
        var uscoin = parseInt($("#coin").val().trim());
        var validcoin = parseInt(_currentloginuser.account.coin);
        if (uscoin > validcoin) {
            plus.ui.alert("金币数不足", function () { }, configManager.alerttip, configManager.alertCtip);
            return;
        }
    });

    // 参与报名
    $("#join").on("click", function () {
        var coin = $("#coin").val();
        var paymenttype = $("input[name='payment']:checked").val();
        var currentview = plus.webview.currentWebview();
        var postdata = { "lunch": currentview.lunchid, "goods": currentview.goodsid, "payment": paymenttype, "coin": coin, "userid": _currentloginuser.id, "token": _currentloginuser.token };
        $.ajax({
            type: "GET",
            url: configManager.RequstUrl + "api/freelunch/join",
            data: postdata
        }).done(function (data) {
            if ("success" != data.state) { console.log(data.message); plus.nativeUI.alert(data.message); return; }
            plus.nativeUI.alert("感谢您的参与！\n中奖信息将会以短信方式通知到您", function () {
                // 完成问卷返回首页
                var mainview = plus.webview.getWebviewById(pageName.main);
                mainview.evalJS("gohome()");
                plus.webview.currentWebview().close();
            });
        });
    });

}


// 计算购物车价格
function calcGroupPrice(totalprice) {
    totalprice = totalprice - calcDiscount();
    totalprice = totalprice.toFixed(2);
    $("#totalprice").text(totalprice);
}

// 计算抵用金额
function calcDiscount() {
    var coinamount = parseInt($("#coin").val().trim());
    var discount = 0;
    if (coinamount) {
        var discount = (coinamount / configManager.coinrate).toFixed(2);
        $("#discount").text(discount);
    } else {
        discount = 0;
        $("#discount").text(0);
    }

    return discount;
}