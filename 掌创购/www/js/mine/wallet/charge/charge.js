//$(function () { plusReady(); })

var _currentuser, _cardinfo;
function plusReady() {
    // 获取当前用户
    _currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
    _cardinfo = JSON.parse(plus.storage.getItem(storageManager.bankcardinfo));
    plus.storage.removeItem(storageManager.bankcardinfo);
    PaintPage();
    BindEvent();
}

if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}
// 银行卡列表
function PaintPage() {
    var html = [];
    html.push("<label><img src='../../../../images/bank/" + _cardinfo.bank_code + ".jpg' width='50' height='40' /></label>");
    html.push(" <span><h2>" + _cardinfo.bank + "</h2><p>尾号" + _cardinfo.last4num + _cardinfo.card_type + "</p></span>");

    $("#cardinfo").html(html.join(""));
    $("#limitamount").text("本日限额：3500.00元");
}

function BindEvent() {
    // 充值
    $("#btncharge").on("click", function () {
        charge();
    });


    $("#chargeAmount").on("keyup", function () {
        var chargeAmount = $(this).val();
        if (chargeAmount && chargeAmount.trim()) {
            if ($("#btncharge").hasClass("gray-bg")) { $("#btncharge").removeClass("gray-bg"); }
        } else {
            if (!$("#btncharge").hasClass("gray-bg")) { $("#btncharge").addClass("gray-bg"); }
        }
    });
}

// 充值
function charge() {
    var money = $("#chargeAmount").val();
    var type = $("#chargetype").val() == "0" ? 0 : 1;
    $.ajax({
        type: "POST",
        async: true,
        url: configManager.RequstUrl + "api/account/recharge",
        data: { "userid": _currentuser.id, "token": _currentuser.token, "type": type, "card": _cardinfo.id, "money": money }
    }).done(function (data) {
        if ("success" != data.state) { plus.nativeUI.alert(data.message); return; }
        plus.nativeUI.alert(data.message);

        plus.webview.currentWebview().opener().close("none");
        plus.webview.currentWebview().close("none");
        plus.webview.getWebviewById("wallet/wallet.html").evalJS("plusReady()");
    });
}

// 取银行卡后4位
function GetLast4Num(cardno) {
    var fournum = cardno;
    if (cardno && cardno.length > 4) {
        fournum = cardno.substr(cardno.length - 4);
    }

    return fournum;
}