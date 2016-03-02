//$(function () { plusReady(); })

function plusReady() {
    var holdcardperson = getUrlParam("u");
    var bankcardno = getUrlParam("c");
    var bank = getUrlParam("b");
    $("#cardinfo").html("<h2>持卡人：" + holdcardperson + "</h2><h2 id='cardbank'>开户行：" + bank + "</h2><h2>卡号：" + bankcardno + "</h2>");

    // 返回到管理页
    $("#btnnext").on("click", function () {
        // 跳转到银行管理页
        clicked('manager.html');
    });

    $("#back").on("click", function () {
        // 跳转到银行管理页
        clicked('manager.html');
    });
}

if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}