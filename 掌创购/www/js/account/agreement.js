function plusReady() {
    var mark = getUrlParam("mark");
    Init(mark);

}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}


function Init(mark) {
    $.ajax({
        type: "get",
        url: configManager.RequstUrl + "api/content/show",
        async: true,
        data: { "mark": mark }
    }).done(function (data) {
        if ("success" == data.state) {
            $(".title, .hd-tit-h2").html(data.data.title);
            $("#acontent").html(data.data.content);
            $("#agreement").height($("#acontent").height() + 50);
        } else {
            console.log(data.message);
        }
    });

}
