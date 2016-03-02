//$(function () { plusReady(); })

function plusReady() {
    paintPage();
    bindEvent();
}

if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}
// 银行卡列表
function paintPage() {
    $.ajax({
        type: "Get",
        url: configManager.RequstUrl + "api/common/noticelist?page=1&limit=15",
    }).done(function (data) {
        if ("success" != data.state) { console.log(data.message); return; }
        var html = [];

        for (var i = 0; i < data.data.length; i++) {
            var msg = data.data[i];

            html.push("<div name='msgitem' tip='" + msg.id + "' class='message' style='margin:8px 5px'>");
            html.push("<div class='msgcontent' style='border:1px solid #ddd;padding:0.5em;'><p style='font-size:1.2em; border-bottom:1px dashed #ddd; line-height:2em; height:2em;'><span style='font-size:1em; color:#555; float:right';>阅读<i class='angle right icon'></i></span>" + msg.title + "</p><p style='color:#777; font-size:0.9em; line-height:1.2em;margin-top: 0.5em;'>" + msg.description + "......</p>");
            html.push("<div class='time' style='font-size:0.9em;color:#ccc; text-align:right;'>" + msg.created_at + "</div></div></div>");
        }
        if (html.length == 0) {
            $("#messagelist").html("<div style='vertical-align: middle;text-align: center;padding-top: 30%;'>暂时没有新消息</div>");
        } else {
            $("#messagelist").html(html.join(""));
        }
    });
}

// 消息列表
function bindEvent() {
    $("#messagelist").on("click", "div[name=msgitem]", function () {
        var id = $(this).attr("tip");
        clicked("detail.html?id=" + id, false, false, "slide-in-right");
    });
}
