//$(function () { plusReady(); })

function plusReady() {
    var msgid = getUrlParam("id");
    paintPage(msgid);
    bindEvent();
}

if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}
// 消息详情
function paintPage(id) {
    $.ajax({
        type: "Get",
        url: configManager.RequstUrl + "api/common/notice?id=" + id,
    }).done(function (data) {
        if ("success" != data.state) { console.log(data.message); return; }
        $('#messagetitle').text(data.data.title);
        $('#messagetime').text(data.data.created_at);
        $("#messageinfo").html(data.data.content);
        try { myScroll.refresh(); } catch (err) { }
    });
}

// 绑定事件
function bindEvent() {
    $("#back").on("click", function () {
        plus.webview.close(plus.webview.currentWebview(), "pop-out", 200);
    });
}
