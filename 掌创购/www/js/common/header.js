
$(function () {
    var html = [];
    html.push("<div id='headerstyle1'>");
    html.push("<span class=' tab_mune tab_a' id='areaspan'><a href='javascript:void(0)' class='hd-city' id='currentcity'><span id='currentcityname' style='font-size:1.2em; margin-right:0.15em;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><i class=\"icon iconfont icon-unfold\" style=\"font-size:1.6em; margin:0;top:1px; position:absolute;\"></i></a></span>");
    html.push("<span class=' tab_mune tab_b'><div id='searchtext' style='width:90%;margin-left:6%'><div class=' tab-seacr-bg' style='background: #ff926E;position:relative;' ><i class='icon iconfont icon-search' style='font-size:1em;line-height:30px;height:30px;top:3px;color:#fff;margin-left:2em'></i><span style='color:#FFFFFF !important;margin-left:0.2em' id='searchvalue'>搜索商家/商圈/商品</span> </div></div></span>");
    html.push("<span class=' tab_mune tab_a'><a id='headertalk' style='padding-top:12px' class='hd-ma'><i id='messageicon' class=\"icon iconfont icon-message\" style=\"font-size:1.2em; margin:0; margin-top:3px;\"></i><span id='hascount' class='hascount'>1</span></p><p style=\"font-size:0.9em\">消息</p></a></span>");
    html.push("</div>");
    $("#header").html(html.join(""));
})

function plusReady() {
    // 缓存是否有数据
    var cachecity = plus.storage.getItem("storagekeycurrentcity");
    if (cachecity) {
        $("#currentcityname").text(JSON.parse(cachecity).name);
    }
    // 城市切换
    $("#header").on("click", "#currentcity", function () {
        var citypage = plus.webview.getWebviewById(pageName.city);
        if (citypage) {
            citypage.show("slide-in-bottom");
        }
        else {
            clicked(pageName.city, false, false, "slide-in-bottom");
        }
    });

    // 搜索    
    $("#header").on("click", "#searchtext", function () {
        clicked("../home/search.html", false, false, "slide-in-right");
    });

    // 消息
    $("#header").on("click", "#headertalk", function () {
        // 最新查看时间
        var currentdate = new Date().getTime();
        plus.storage.setItem("latestMsgTime", currentdate.toString());
        $("#hascount").hide();

        clicked("../message/message.html", false, false, "slide-in-right");
    });
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}