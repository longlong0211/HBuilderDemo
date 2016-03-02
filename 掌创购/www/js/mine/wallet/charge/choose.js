//$(function () { plusReady(); })

var _currentuser;
function plusReady() {
	plus.nativeUI.showWaiting();
    // 获取当前用户
    _currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
    //TODO
    //_currentuser = JSON.parse('{"id":2,"name":"15158884139","email":"","nick":"掌创0002","real_name":"谢霆锋","avatar_id":0,"code":"03EA","id_no":"330184198406201352","id_pic1":2,"id_pic2":3,"id_pic3":2,"user_type":1,"status":1,"auth_status":0,"parent_id":0,"remark":null,"created_at":"2015-06-14 11:28:24","updated_at":"2015-06-14 11:29:18","token":"MnwkMnkkMTAkNDgvMEgxSlQvWlpyOFU0bVZEcmpYdW1jVDUyNjZFWTB6OUVrR3pnL0xvL00zSlF3MnZSbld8OGEyMTViNjM1YjhhYTJmOTZhOTc4MTgwYmE1NzEyNDk=","account":{"id":2,"user_id":2,"used":"1573.96","all":"18476.04","cash":"10050.00","card":"8426.04","coin":"6896.00"}}');
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
            html.push("<div name='carditem' class='item-01-wrap  mt10'><div class='text-info-block'>");
            html.push("<h2>" + card.bank + card.card_type + "（" + GetLast4Num(card.cardno) + "）</h2>");
            html.push("<p>推荐支付宝用户使用</p>");
            html.push("<input type='hidden' value='" + carddata + "'/>");
            html.push("</div></div>");
        }

        $("#bankcardlist").html(html.join(""));
        plus.nativeUI.closeWaiting();
    });
}


function BindEvent() {
    // 跳转充值
    $("#bankcardlist").on("click", "div[name=carditem]", function () {
        var hiddendata = $(this).find("input[type=hidden]").val().split('|');
        var carddata = { "id": hiddendata[0], "bank": hiddendata[1], "card_type": hiddendata[2], "last4num": hiddendata[3], "bank_code": hiddendata[4] };
        plus.storage.setItem(storageManager.bankcardinfo, JSON.stringify(carddata));
        clicked('charge.html', false, false, "slide-in-right");
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
