//$(function () { plusReady(); })

var _currentuser;
function plusReady() {
    // 获取当前用户
    _currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
    //TODO
    //_currentuser = JSON.parse('{"id":2,"name":"15158884139","email":"","nick":"掌创0002","real_name":"谢霆锋","avatar_id":0,"code":"03EA","id_no":"330184198406201352","id_pic1":2,"id_pic2":3,"id_pic3":2,"user_type":1,"status":1,"auth_status":0,"parent_id":0,"remark":null,"created_at":"2015-06-14 11:28:24","updated_at":"2015-06-14 11:29:18","token":"MnwkMnkkMTAkNDgvMEgxSlQvWlpyOFU0bVZEcmpYdW1jVDUyNjZFWTB6OUVrR3pnL0xvL00zSlF3MnZSbld8OGEyMTViNjM1YjhhYTJmOTZhOTc4MTgwYmE1NzEyNDk=","account":{"id":2,"user_id":2,"used":"1573.96","all":"18476.04","cash":"10050.00","card":"8426.04","coin":"6896.00"}}');


    $("#btnnext").on("click", function () {
        if ($(this).hasClass("gray-bg")) {
            return;
        }
        var holdcardperson = $("#holdcardperson").val();
        var bankcardno = $("#bankcardno").val();
        // 银行卡验证
        if (!holdcardperson || !holdcardperson.trim()) {
          plus.nativeUI.alert("请输入用户名");
            return false;
        }

        if (!bankcardno || !is_integer(bankcardno.trim())) {
            plus.nativeUI.alert("银行卡号未能通过验证");
            return false;
        }

        // 绑定银行卡
        BindCard(holdcardperson, bankcardno);
    });

    $("#bankcardno").on("keyup", function () {
        var holdcardperson = $("#holdcardperson").val();
        var bankcardno = $("#bankcardno").val();
        if (holdcardperson && holdcardperson.trim() && bankcardno && bankcardno.trim()) {
            if ($("#btnnext").hasClass("gray-bg")) { $("#btnnext").removeClass("gray-bg"); }
        } else {
            if (!$("#btnnext").hasClass("gray-bg")) { $("#btnnext").addClass("gray-bg"); }
        }
    });

    $("#holdcardperson").on("keyup", function () {
        var holdcardperson = $("#holdcardperson").val();
        var bankcardno = $("#bankcardno").val();
        if (holdcardperson && holdcardperson.trim() && bankcardno && bankcardno.trim()) {
            if ($("#btnnext").hasClass("gray-bg")) { $("#btnnext").removeClass("gray-bg"); }
        } else {
            if (!$("#btnnext").hasClass("gray-bg")) { $("#btnnext").addClass("gray-bg"); }
        }
    });

}


if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

// 绑定银行卡
function BindCard(person, cardno) {
    var holdcardperson = $("#holdcardperson").val();
    var bankcardno = $("#bankcardno").val();
    $.ajax({
        type: "POST",
        async: true,
        url: configManager.RequstUrl + "api/card/bind",
        data: { "userid": _currentuser.id, "token": _currentuser.token, "person": person, "cardno": cardno }
    }).done(function (data) {
        if ("success" != data.state) { plus.nativeUI.alert(data.message); return; }
        // 通知银行卡管理页更新
        plus.webview.currentWebview().opener().evalJS("PaintPage()");
        
        back();
    });
}