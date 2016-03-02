function plusReady() {
    var goodsid = getUrlParam("goodsid");
    //加载订单详情
    InitPage(goodsid);
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

function InitPage(goodsid) {
    $.ajax({
        type: 'GET',
        url: configManager.RequstUrl + "api/goods/info?goods=" + goodsid
    }).done(function (data) {
        if ("success" == data.state) {
            LoadDetail(data.data);
        } else {
            plus.ui.alert(data.message, function () { }, configManager.alerttip, configManager.alertCtip);
        }
    });
}

//加载图文详情
function LoadDetail(goods) {
    var store = goods.store;
    var html = [];
    if (goods.notice) {
        html.push('<div class="sjxqbkbg sjxqckxq"><h2>购买须知</h2><p><b class="zcd">购买须知：</b>' + goods.notice + '</p></div>');
    }
    html.push('<div class="sjxqbkbg sjxqckxq"><h2>本单详情</h2>');
    html.push('<p><b class="zcd">商家名称：</b>' + store.store_name + '</p>  ');
    html.push('<p><b class="zcd">商品数量：</b>1</p>');
    html.push('<p><b class="zcd">商品总价：</b>' + goods.price + '元  </p>');
    html.push('<div class="sjxqckxqtu"><h2>本单图片详情</h2>');
    var src = "";
    $.each(goods.pics, function (id, pic) {
        src = configManager.goodsImgurl.format(pic, "398-301");
        html.push('<p><img width="398px" height="301px" src="' + src + '"></p>');
    });
    html.push('</div>');
    html.push('</div>');

    $("#imagetext").html(html.join(""));
}
