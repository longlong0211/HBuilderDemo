//$(function () { plusReady(); })

var _currentuser;
function plusReady() {
    // 获取当前用户
    _currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
    //TODO
   // _currentuser = JSON.parse('{"id":2,"name":"15158884139","email":"","nick":"掌创0002","real_name":"谢霆锋","avatar_id":0,"code":"03EA","id_no":"330184198406201352","id_pic1":2,"id_pic2":3,"id_pic3":2,"user_type":1,"status":1,"auth_status":0,"parent_id":0,"remark":null,"created_at":"2015-06-14 11:28:24","updated_at":"2015-06-14 11:29:18","token":"MnwkMnkkMTAkNDgvMEgxSlQvWlpyOFU0bVZEcmpYdW1jVDUyNjZFWTB6OUVrR3pnL0xvL00zSlF3MnZSbld8OGEyMTViNjM1YjhhYTJmOTZhOTc4MTgwYmE1NzEyNDk=","account":{"id":2,"user_id":2,"used":"1573.96","all":"18476.04","cash":"10050.00","card":"8426.04","coin":"6896.00"}}');
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
            html.push("<div class='item-03-wrap  mt20'><ul class='select-pay-block'><li><div class='pay-item'>");
            html.push("<label><img src='../../../../images/bank/" + card.bank_code + ".jpg' width='50' height='40' /></label>");
            html.push("<span><h2>" + card.bank + "</h2><p>尾号" + GetLast4Num(card.cardno) + card.card_type + "</p></span>");
            html.push("</div></li></ul></div>");
        }

        $("#bankcardlist").html(html.join(""));

    });
}

// 添加银行卡
function BindEvent() {
    $("#addcard").on("click", function () {
        clicked('addcard.html', false, false, "slide-in-right");
    });
}

// 取银行卡后4位
function GetLast4Num(cardno) {
    var fournum = cardno;
    if (cardno && cardno.length > 4) {
        fournum = cardno.substr(cardno.length - 5);
    }

    return fournum;
}
// 绑定银行卡
function BindCard(cardid) {
    var holdcardperson = $("#holdcardperson").val();
    var bankcardno = $("#bankcardno").val();
    $.ajax({
        type: "POST",
        async: true,
        url: configManager.RequstUrl + "api/card/bind",
        data: { "userid": _currentuser.id, "token": _currentuser.token, "card": cardno }
    }).done(function (data) {
        if ("success" != data.state) { plus.nativeUI.alert(data.message); return; }

        // 跳转到银行卡确认页
        var params = "?u" + holdcardperson.trim() + "&c" + bankcardno.trim() + "&b" + data.bank;
        clicked('cardconfirm.html' + params, false, false, "slide-in-right");
    });
}
