//$(function () { plusReady(); })

var _currentuser;
function plusReady() {
    // 获取当前用户
    _currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
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
	
    $.ajax({
        type: "POST",
        async: true,
        url: configManager.RequstUrl + "api/card/list",
        data: { "userid": _currentuser.id, "token": _currentuser.token }
    }).done(function (data) {
        if ("success" != data.state) { console.log(data.message); return; }
        var html = [];

        for (var i = 0; i < data.data.length; i++) {
            var card = data.data[i];
            var carddata = card.id + "|" + card.bank + "|" + card.card_type + "|" + GetLast4Num(card.cardno) + "|" + card.bank_code;
            // 银行卡列表
            html.push("<div class='item-03-wrap  mt20' name='carditem'>");
            html.push("<ul class='select-pay-block'>");
            html.push("<li><a class='check-a" + ((i == 0) ? " current" : "") + "' name='check'></a><input type='hidden' value='" + carddata + "'/><div class='pay-item'>");
            html.push("<label><img src='../../../../images/bank/" + card.bank_code + ".jpg' width='50' height='40' /></label><span><h2>" + card.bank + "</h2><p>尾号" + GetLast4Num(card.cardno) + card.card_type + "</p></span>");
            html.push("</div></li></ul></div>");
        }
        if (data.data.length > 0) {
            html.push(" <div class='item-02-wrap'>");
            html.push("<input type='button' id='btnnext' value='下一步' class='base-btn-inp t-c' />");
            html.push("</div>");
        }
        $("#bankcardlist").html(html.join(""));
    });
}


function BindEvent() {
    // 跳转充值
    $("#bankcardlist").on("click", "div[name=carditem]", function () {
        // 设置按键选择样式
        $("a[name=check][class='check-a current']").removeClass("current");
        $(this).find("a[name=check]").addClass("current");
    });

    // 添加银行卡
    $("#bankcardlist").on("click", "#btnnext", function () {
        var hiddendata = $("a[name=check][class='check-a current']").next().val().split('|');
        var carddata = { "id": hiddendata[0], "bank": hiddendata[1], "card_type": hiddendata[2], "last4num": hiddendata[3], "bank_code": hiddendata[4] };
        plus.storage.setItem(storageManager.bankcardinfo, JSON.stringify(carddata));
        clicked('transfer.html', false, false, "slide-in-right");
    });

    // 添加银行卡
    $("#addcard").on("click", function () {
        clicked('../bankcard/addcard.html', false, false, "slide-in-right");
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
