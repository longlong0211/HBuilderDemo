// 霸王餐活动
//$(function () {
//    plusReady();
//})
var _currentcityInfo;
function plusReady() {
    _currentcityInfo = JSON.parse(plus.storage.getItem(storageManager.currentcity));

    init();
    bindEvent();
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

// 初始化
function init() {
    // 折扣列表
    loadDisCountTab();
}
// 绑定事件
function bindEvent() {
    // 折扣切换
    $("#zkbt").on("click", "li a", function () {
        $("#zkbt li a[class=hover]").removeClass();
        $(this).addClass("hover");
        $("#discountgoodlist").html("<div style='text-align:center;padding-top:2em;font-size:16px'>加载中...</div>");
        // 加载打折商品
        loadGoodsList($(this).attr("tip"));
    });

    // 商品详情
    $("#discountgoodlist").on("click", "div[name=goodsitem]", function () {
        var page = '../mine/goods/detail.html?goodsid=' + $(this).attr("tip") + "&l=" + $("#zkbt li a[class=hover]").attr("tip");
        clicked(page, false, false, "slide-in-right");
    });

    // 滚动实现懒加载
    $("div[class=main]").scroll(function () {
        $('img[name=imgitem]').lazyload();
    }).trigger('scroll');
}

// 折扣列表
function loadDisCountTab() {
    $.ajax({
        type: 'Get',
        url: configManager.RequstUrl + "api/freelunch/list?city=" + _currentcityInfo.id
    }).done(function (data) {
        if (data.state != "success") { console.log(data.message); return; }
        var discountlist = data.data;

        // 无打折活动
        if (discountlist.length == 0) {
            $("#discountgoodlist").html("<div class='wuchengshi'><p><img src='../../images/chengshi2.gif'/>当前城市没有霸王餐活动</p></div>");
            $("#zkbt").remove();
            return;
        }

        discountlist.sort(function (a, b) { return b.sort - a.sort; });

        // 计算tab宽度
        var tabwidth = 100 / discountlist.length;

        // 画折扣导航
        var html = [];
        for (var i = 0; i < discountlist.length; i++) {
            var disdata = discountlist[i];
            var activeClass = (i == 0) ? "class='hover'" : "";
            html.push("<li style='width:" + tabwidth + "%'><a " + activeClass + " tip='" + disdata.id + "'>" + disdata.name + "</a></li>");
        }
        $("#zkbt").html(html.join(""));

        // 加载第一个活动
        loadGoodsList(discountlist[0].id);
    });
}


// 加载霸王餐商品列表
function loadGoodsList(lunch) {
    // 当前城市
    $.ajax({
        type: 'Get',
        url: configManager.RequstUrl + "api/freelunch/goodslist?lunch=" + lunch
    }).done(function (data) {
        if (data.state != "success") { console.log(data.message); return; }
        var goodslist = data.data.list;
        var lunchitem = data.data.lunch;

        if (goodslist && goodslist.length > 0) {
            var html = [];
            for (var i = 0; i < goodslist.length; i++) {
                var goodsitem = goodslist[i];
                html.push("<div class='item-01-wrap1' name='goodsitem' tip='" + goodsitem.goods.id + "'><ul class='item-01-block1'>");
                html.push("<li class='img-part1'> <img name='imgitem' class='img' src='../../images/defaultpic.jpg' data-src='" + configManager.goodsImgurl.format(goodsitem.goods.pic, configManager.imgwid + "-" + configManager.imghei) + "'> </li>");
                html.push("<li class='text-part1'><p class='bwbtm'><a>" + goodsitem.goods.title + "</a></p><p><a>[" + lunchitem.city.name + "]</a>" + lunchitem.intro + "</p>");
                html.push("<p class='bwysx'><span>已参与" + goodsitem.count + "</span><b>" + (parseFloat(goodsitem.price) * lunchitem.discount).toFixed(2) + "元</b><em>" + goodsitem.price + "元</em></p></li>");
                html.push("</ul></div>");
            }
            $("#discountgoodlist").html(html.join(""));
        } else {
            $("#discountgoodlist").html("<div style='text-align:center;padding-top:2em;font-size:16px'>暂无折扣商品</div>");
        }

        $('img[name=imgitem]').lazyload();
    }).fail(function () {
        plus.nativeUI.alert(errorMessage.interface);
        $("#discountgoodlist").html("<div style='text-align:center;padding-top:2em;font-size:16px'>暂无折扣商品</div>");
    });
}
