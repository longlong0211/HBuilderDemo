// TODO
//$(function () { plusReady(); });

var _storeDetailInfo = null;
var _currentloginuser = null;
var _storeid = 0;
function plusReady() {
    Init();
}

if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

function Init() {
    _storeid = getUrlParam("storeid");
    _currentloginuser = JSON.parse(plus.storage.getItem(storageManager.user));

    //店铺详情
    PaintPage();

    //团购商品取出50条，带店铺信息
    var requestdata = { "store": _storeid, "type": "groupbuy,presell,normal", "group": 1, "onlysell": 1, "limit": 50, "page": 1 };
    $.ajax({
        type: "GET",
        url: configManager.RequstUrl + "api/goods/list",
        async: true,
        data: requestdata
    }).done(function (data) {
        if ("success" != data.state) { console.log(data.message); return false; }
        var goods = data.data;
        //商家的团购商品
        if (goods.groupbuy && goods.groupbuy.length > 0) {
            PaintDisCountProudct(goods.groupbuy, data.store_pic);
        }

        // 预售商品
        if (goods.presell && goods.presell.length > 0) {
            PaintPreSellProudct(goods.presell, data.store_pic);
        }

        // 普通商品
        if (goods.normal && goods.normal.length > 0) {
            PaintProductList(goods.normal, data.store_pic);
        }

        $('img[name=imgitem]').lazyload();
    }).fail(function () {

    });

    BindEvent();
    IsCollecteShop();
}

// 店铺详情
function PaintPage() {
    plus.nativeUI.showWaiting();
    $.ajax({
        type: 'Get',
        url: configManager.RequstUrl + "api/store/info?store=" + _storeid
    }).done(function (data) {
        if (data.state != "success") { console.log(data.message); return; }
        var shopbaseinfo = data.data;
        _storeDetailInfo = shopbaseinfo;

        //显示商铺轮播图片
        showSliderStorepic(shopbaseinfo);

        html = [];
        // 营业时间
        html.push("<div  class='grxinxis'>");
        html.push("<p class='sjxqbddd'><span><a href='tel:" + shopbaseinfo.store_phone + "'><i class=\"phone sign icon\" style='font-size:3.2em; color: green;left:1.0em'></i></a></span><i class='map marker icon' style='font-size: 1.8em;position: absolute; padding: 0.4em; margin-left: 0.2em;color: #ff6634' id='storeaddressmark'></i><b id='storeaddress'>" + shopbaseinfo.store_address + "</b></p>");
        html.push("<p class='sjxqyysj'>营业时间：" + shopbaseinfo.store_hours + "</p>");
        html.push("</div>");

        // 优惠买单
        html.push("<div class='grxinxis'>");

        html.push("<p class='sjxqmdkxyh' id='buynow'><span><a href='javascript:void(0);' style='display: initial;'>买单</a></span><b><img src='../../images/sjxqtu3.png' /></b>买单可享优惠</p>");

        html.push("<p class='sjxqxffl'>线上支付返" + shopbaseinfo.online_pay_fee + "% &nbsp;&nbsp;线下刷卡返" + shopbaseinfo.offline_pay_fee + "%&nbsp;&nbsp;金币支付奖励" + shopbaseinfo.coin_pay_fee + "%  </p>");
        html.push("</div>");

        // 商铺介绍
        html.push("<div class='sjxqbkbg'>");
        html.push("<h2>店铺介绍</h2>");
        html.push("<p>" + shopbaseinfo.store_intro + "</p>");
        html.push("<p class='sjxqsst'>");
        if (shopbaseinfo.is_refund == 1) {
            html.push("<span><i class=\"checked checkbox icon\"></i>随时退</span>");
        }
        if (shopbaseinfo.is_noreserve == 1) {
            html.push("<span><i class=\"checked checkbox icon\"></i>免预约</span>");
        }
        if (shopbaseinfo.is_takeaway == 1) {
            html.push("<span><i class=\"checked checkbox icon\"></i>外送</span>");
        }
        html.push("</p>");

        html.push("</div>");
        html.push("<div class='sjxqbkbg'>");
        html.push("<p name='p_apparaise' class='sjxqsjpf'><span>商家评价 (" + shopbaseinfo.reviews + ") <i class=\"angle right icon\"></i></span>" + DrawScore(shopbaseinfo.store_score) + "</p>");
        html.push("</div>");
        $("#storebaseInfo").html(html.join(""));
        plus.nativeUI.closeWaiting();

        //点击买单跳转到立即买单页面
        $("#storebaseInfo").on("click", "#buynow", function () {
            //判断是否停止营业
            if (0 == _storeDetailInfo.store_pause) {
                plus.nativeUI.alert("本店已暂停营业");
                return;
            }

            if (!_currentloginuser) {
                clicked('../account/login.html', false, false, 'slide-in-bottom');
                return;
            }
            //商家，商家子帐号，代理子帐号，不能购买商品
            if (2 == _currentloginuser.user_type ||
	    		3 == _currentloginuser.user_type ||
	    		5 == _currentloginuser.user_type) {
                plus.ui.alert("帐号不能购买商品", function () { }, configManager.alerttip, configManager.alertCtip);
                return false;
            }
            if (_currentloginuser.id == shopbaseinfo.user_id) {
                plus.ui.alert("不能给自己买单", function () { }, configManager.alerttip, configManager.alertCtip);
            } else {
                //clicked('../payment/direct.html?code=' + shopbaseinfo.code);
                var page = "../payment/paybill.html?store=" + shopbaseinfo.id + "&seller=" + shopbaseinfo.user_id;
                clicked(page, false, false, 'slide-in-right');
            }
        });

        $('img[name=imgitem]').lazyload();
    }).fail(function () {
        plus.nativeUI.closeWaiting();
        plus.nativeUI.alert(errorMessage.interface);
    });
}

// 团购产品
function PaintDisCountProudct(goodslist, store_pic) {
    var html = [];
    html.push('<div style="border-bottom: 1px solid #e5e5e5;"><h2><span class="icon orangered_icon" style="padding:0.2em 0.3em;color:#fff">团</span><a style="display:initial">本店团购</a></h2></div>');
    $.each(goodslist, function (i, goods) {
        if (i > 1) { html.push("<div id='hidegroupbygoodslist' style='display:none'>"); }

        //商品信息
        html.push("<div style='padding:5px 15px; background:#fff;border-bottom: 1px solid #e5e5e5; ' name='groupbygoodsItem' tip=" + goods.id + ">");
        var src = (0 == goods.pic) ? configManager.storeImgurl.format(store_pic, "90-90") : configManager.goodsImgurl.format(goods.pic, "90-90");
        html.push("<div style='float:left; width:25%;'><img width='60' height='60'  name='imgitem' src='../../images/defaultpic.jpg'  data-src='" + src + "'' alt='' /></div>");
        html.push("<div style='float:left; width:75%'><p style='font-size:1.3em; color:#555; width:100%; line-height:1.5em;'><span style='float:right; font-size:0.8em; color:green;'><i class=\"truck icon\"></i>已售：" + goods.selled + "件</span>" + goods.title + "</p>");
        html.push("<p style='line-height:1.8em; margin-top:0.7em;width:100%'><span style='font-size:1.2em;color:#f60;float:left'>￥" + goods.price + " &nbsp;&nbsp;&nbsp; <span style='color:#777; font-size:0.8em; text-decoration:line-through'>￥" + goods.market_price + "</span></p>");
        html.push("</div>");
        html.push("<br style='clear:both'></div>");
        if (i > 1 && i == (goodslist.length - 1)) {
            html.push("</div>");
        }
    });

    if (goodslist.length > 2) {
        html.push('<div id="showallgoods"><p style="text-align:center;"><a><span class="title" style="float:none">更多' + (goodslist.length - 2) + '个团购</span><span class="tghandler" style="float:none"><i class=\"angle down icon\"></i></span></a> </p></div>');
    }

    $("#groupbuying").html(html.join(""));
    $("#groupbuying").show();

    // 跳转商品详情
    $("#groupbuying div[name=groupbygoodsItem]").on("click", function () {
        var page = '../mine/goods/detail.html?goodsid=' + $(this).attr("tip");
        clicked(page, false, false, "slide-in-right");
    });

}

// 预售产品
function PaintPreSellProudct(goodslist, store_pic) {
    var html = [];
    html.push('<div style="border-bottom: 1px solid #e5e5e5;"><h2><span class="icon orangered_icon" style="padding:0.2em 0.3em;color:#fff">预</span><a style="display:initial">本店预售</a></h2></div>');
    $.each(goodslist, function (i, goods) {
        if (i > 1) { html.push("<div id='hidepresellgoodslist' style='display:none'>"); }

        //商品信息
        html.push("<div style='padding:5px 15px; background:#fff;border-bottom: 1px solid #e5e5e5;' name='presellgoodsItem' tip=" + goods.id + ">");
        var src = (0 == goods.pic) ? configManager.storeImgurl.format(store_pic, "90-90") : configManager.goodsImgurl.format(goods.pic, "90-90");
        html.push("<div style='float:left; width:25%;'><img width='60' height='60' name='imgitem' src='../../images/defaultpic.jpg'  data-src='" + src + "'' alt='' /></div>");
        html.push("<div style='float:left; width:75%'><p style='font-size:1.3em; color:#555; width:100%; line-height:1.5em;'><span style='float:right; font-size:0.8em; color:green;'><i class=\"truck icon\"></i>已售：" + goods.selled + "件</span>" + goods.title + "</p>");
        html.push("<p style='line-height:1.8em; margin-top:0.7em;width:100%'><span style='font-size:1.2em;color:#f60;float:left'>￥" + goods.price + " &nbsp;&nbsp;&nbsp; <span style='color:#777; font-size:0.8em; text-decoration:line-through'>￥" + goods.market_price + "</span></p>");
        html.push("</div>");
        html.push("<br style='clear:both'></div>");
        if (i > 1 && i == (goodslist.length - 1)) {
            html.push("</div>");
        }
    });

    if (goodslist.length > 2) {
        html.push('<div id="showallgoods"><p style="text-align:center;"><a><span class="title" style="float:none">更多' + (goodslist.length - 2) + '个预售</span><span class="tghandler" style="float:none"><i class=\"angle down icon\"></i></span></a> </p></div>');
    }
    $("#presellgoodslist").html(html.join(""));
    $("#presellgoodslist").show();

    // 跳转商品详情
    $("#presellgoodslist div[name=presellgoodsItem]").on("click", function () {
        var page = '../mine/goods/detail.html?goodsid=' + $(this).attr("tip");
        console.log(page);
        clicked(page, false, false, "slide-in-right");
    });

}

// 产品详情
function PaintProductList(goodslist, store_pic) {
    var html = [];
    html.push('<div style="border-bottom: 1px solid #e5e5e5;"><h2><span class="icon orangered_icon" style="padding:0.2em 0.3em;color:#fff">惠</span><a style="display:initial">本店菜单</a></h2></div>');
    $.each(goodslist, function (i, goods) {
        //商品信息
        var src = (0 == goods.pic) ? configManager.storeImgurl.format(store_pic, "100-100") : configManager.goodsImgurl.format(goods.pic, "100-100");
        var goodsinfo = [goods.id, goods.store_id, goods.title, goods.price, src];
        html.push("<div style='padding:5px 15px; background:#fff;border-bottom: 1px solid #e5e5e5;' tip=" + goodsinfo.join("|") + ">");
        html.push("<div style='float:left; width:25%;'><img width='60' height='60'  name='imgitem' src='../../images/defaultpic.jpg'  data-src='" + src + "'' alt='' /></div>");
        html.push("<div style='float:left; width:75%'><p style='font-size:1.3em; color:#555; width:100%; line-height:1.5em;'><span style='float:right; font-size:0.8em; color:green;'><i class=\"truck icon\"></i>已售：" + goods.selled + "件</span>" + goods.title + "</p>");
        html.push("<p style='line-height:1.8em; margin-top:0.7em;width: 100%;'><span style='background:#f60; display:inline-block; float:right; padding:0.3em; font-size:0.8em; height:1.3em; line-height:1.3em; border-radius:2px; color:#fff; font-size:1em' name='buy'  tip=" + goodsinfo.join("|") + "><i class=\"cart icon\" style='opacity:1'></i>购买</span><span style='font-size:1.2em;color:#f60;float:left'>￥" + goods.price + " &nbsp;&nbsp;&nbsp; <span style='color:#777; font-size:0.8em; text-decoration:line-through'>￥" + goods.market_price + "</span></p>");
        html.push("</div>");
        html.push("<br style='clear:both'></div>");
    });

    $("#goodsitemlist").html(html.join(""));
    $("#goodsitemlist").show();
}

function BindEvent() {
    // 分享
    $("#sharepop").on("click", function () { $(this).hide(); });
    $("#btnshare").on("click", function () {
        $("#sharepop").show();
    });

    // weixin: 0  weixinquan:1  inaweibo:2  tencentweibo:3  QQ: 4
    $("li[name=shareitem]").on("click", function () {
        var item = $(this).attr("tip");
        ShareBarCode(item);
    });

    // 关注、收藏
    $("#btncollect").on("click", function () {
        if (!_currentloginuser) {
            clicked('../account/login.html', false, false, 'slide-in-bottom');
            return;
        } else {
            var iscancle = $(this).attr("tip") == "1" ? true : false;

            // 更改关注按钮样式
            if (iscancle) {
                $("#btncollect i").addClass('empty');
                $("#btncollect").attr("tip", "0");
            } else {
                $("#btncollect i").removeClass('empty');
                $("#btncollect").attr("tip", "1");
            }

            // 是否关注
            CollecteShop(iscancle);
        }
    });

    // 回退
    $("#back").on("click", function () {
        plus.webview.currentWebview().close();
    });

    // 跳转地图
    var t1 = null;
    $("#storebaseInfo").on("click", "#storeaddress,#storeaddressmark", function () {
        if (t1 == null) { t1 = new Date().getTime(); } else { var t2 = new Date().getTime(); if (t2 - t1 < 500) { t1 = t2; return; } else { t1 = t2; } }
        var newview = plus.webview.create("maps.html", "maps.html", {}, { storeInfo: { name: _storeDetailInfo.store_name, address: _storeDetailInfo.store_address, lat: _storeDetailInfo.store_lng, lng: _storeDetailInfo.store_lat } });
        newview.show("slide-in-right");
    });

    // 跳转地图
    var t11 = null;
    // 跳转购物车页面
    $("#goodsitemlist").on("click", "span[name=buy]", function () {
        if (t11 == null) { t11 = new Date().getTime(); } else { var t22 = new Date().getTime(); if (t22 - t11 < 500) { t11 = t22; return; } else { t11 = t22; } }
        //判断是否停止营业
        if (0 == _storeDetailInfo.store_pause) {
            plus.nativeUI.alert("本店已暂停营业");
            return;
        }
        //临时订单
        var goodsinfo = $(this).attr("tip").split("|");
        var currentgoods = { "id": goodsinfo[0], "storeid": goodsinfo[1], "title": goodsinfo[2], "price": goodsinfo[3], "src": goodsinfo[4], "count": 1, "selected": true };
        var mycart = JSON.parse(plus.storage.getItem(storageManager.cart));
        if (!mycart) { mycart = []; }
        // 如果不是本商店商品，清空购物车
        $.each(mycart, function () {
            var goods = this;
            if (goods && goods.storeid != currentgoods.storeid) {
                plus.storage.removeItem(storageManager.cart);
            }
        });

        // 更新购物车
        mycart = JSON.parse(plus.storage.getItem(storageManager.cart));
        var existsIndex = -1;
        if (null != mycart && (mycart instanceof Array)) {
            $.each(mycart, function (index, goods) { if (goods && goods.id == currentgoods.id) { existsIndex = index; return false; } })
        } else {
            mycart = [];
        }
        if (existsIndex < 0) {
            mycart.push(currentgoods);
        } else {
            mycart[existsIndex].count = mycart[existsIndex].count + 1;
            mycart[existsIndex].price = currentgoods.price;
        }

        // 放入缓存，购物车，提交订单需要
        console.log(JSON.stringify(mycart));
        plus.storage.setItem(storageManager.cart, JSON.stringify(mycart));
        clicked("../mine/order/cart.html", false, false, "slide-in-right");
        return false;
    });

    var showallgoodslisttext = "";
    //显示隐藏其他团购商品
    $("#groupbuying").on("click", "#showallgoods", function () {
        if ($(this).find(".title").html() != "收起") {
            showallgoodslisttext = $(this).find(".title").html();
            $(this).find(".title").html("收起");
            $(this).find('.tghandler').find('i').removeClass('down').addClass('up');
            $("#hidegroupbygoodslist").show(300);
        } else {
            $(this).find(".title").html(showallgoodslisttext);
            $(this).find('.tghandler').find('i').removeClass('up').addClass('down');
            $("#hidegroupbygoodslist").hide(300);
        }
    });


    var showallpresellgoodslisttext = "";
    // 预售商品
    $("#presellgoodslist").on("click", "#showallpresellgoods", function () {
        if ($(this).find(".title").html() != "收起") {
            showallpresellgoodslisttext = $(this).find(".title").html();
            $(this).find(".title").html("收起");
            $(this).find('.tghandler').find('i').removeClass('down').addClass('up');
            $("#hidepresellgoodslist").show(300);
        } else {
            $(this).find(".title").html(showallpresellgoodslisttext);
            $(this).find('.tghandler').find('i').removeClass('up').addClass('down');
            $(".othergoods").slideUp(500);
            $("#hidepresellgoodslist").hide(300);
        }
    });

    //跳转评价列表
    $("#storebaseInfo").on("click", "p[name=p_apparaise]", function () {
        clicked("../mine/order/appraises.html?store=" + _storeid);
    });

    // 滚动实现懒加载
    $("div[class=main]").scroll(function () {
        $('img[name=imgitem]').lazyload();
    }).trigger('scroll');

}

// 是否收藏
function IsCollecteShop() {
    if (undefined != _currentloginuser && null != _currentloginuser) {
        $.ajax({
            type: 'POST',
            url: configManager.RequstUrl + "api/store/iscollect",
            data: { "userid": _currentloginuser.id, "store": _storeid, "token": _currentloginuser.token }
        }).done(function (data) {
            if (data.state != "success") { console.log(data.message); return; }
            if (data.iscollect) {
                $("#btncollect i").removeClass('empty');
                $("#btncollect").attr("tip", "1");
            }
        });
    }
}

// 关注/取消关注店铺
function CollecteShop(iscancle) {
    console.log(iscancle);
    // 关注商家
    var requsturl = (iscancle ? "api/store/delcollect" : "api/store/collection");
    console.log(requsturl);
    $.ajax({
        type: 'POST',
        url: configManager.RequstUrl + requsturl,
        data: { "userid": _currentloginuser.id, "store": _storeid, "token": _currentloginuser.token }
    }).done(function (data) {
        if (data.state != "success") { console.log(data.message); return; }

    });
}

function DrawScore(score) {
    var pic = '0';
    if (score > 1 && score < 2) {
        pic = '1';
    } else if (score > 2 && score < 3) {
        pic = '2';
    } else if (score == 3) {
        pic = '3';
    } else if (score > 3 && score < 4) {
        pic = '35';
    } else if (score == 4) {
        pic = '4';
    } else if (score > 4 && score < 5) {
        pic = '45';
    } else if (score == 5) {
        pic = '5';
    } else {
        pic = '0';
    }
    return '<img style="vertical-align:middle; margin-top:5px" width="90" height="18" src="http://i3.dpfile.com/s/i/app/api/32_' + pic + 'star.png" />';
}

// TODO
// 生产用户唯一标识二维码
function ShareBarCode(item) {
    // 获取二维码
    $.ajax({
        type: 'Get',
        async: false,
        url: configManager.RequstUrl + 'api/common/qrcode?type=login&code=' + _storeDetailInfo.code
    }).done(function (data) {
        if (data.state != "success") {
            console.log(data.message);
            return;
        }
        var httpurl = data.uri;
        var filename = plus.io.PUBLIC_DOWNLOADS + "/" + getUrlFileName(data.uri);

        // 判断本地是否存在该图片
        try {
            plus.io.resolveLocalFileSystemURL(filename, function (entry) {
                shareShow(data.link, filename, item);
            }, function (e) {
                DownLoadFile(httpurl, filename, item, data.link);
            });
        } catch (err) {
            DownLoadFile(httpurl, filename, item, data.link);
        }
    });
}

function DownLoadFile(httpurl, filename, item, link) {
    // 下载图片到本地，成功后分享
    var dtask = plus.downloader.createDownload(httpurl, { filename: filename }, function (d, status) {
        // 下载完成
        if (status == 200) {
            shareShow(link, d.filename, item);
        } else {
            shareShow(link, null, item);
        }
    });
    dtask.start();
}

//设置轮播图片
function showSliderStorepic(shopbaseinfo) {
    var html = [], ww = $(window).width(), pics = [], imgUrl = "";
    if (null != shopbaseinfo.store_pic) { pics.push(shopbaseinfo.store_pic); }
    if ((shopbaseinfo.store_pics instanceof Array) && 0 < shopbaseinfo.store_pics.length) { pics = pics.concat(shopbaseinfo.store_pics); }

    if (pics.length == 1) {
        html.push("<div class='sjqbgdtu' style='width:100%;height:212px'>");
        imgUrl = configManager.storeImgurl.format(pics[0], ww * 1.2 + "-255");
        html.push("<a href='javascript:void(0);'><div style='background:url(" + imgUrl + ") center no-repeat;width:" + ww + "px;height:212px'></div></a>");
        html.push("</div>");
        html.push("<div class='sjxqtpswz'>" + shopbaseinfo.store_name + "</div>");
        $("#mui-slider").html(html.join(""));
    } else {
        var length = pics.length;
        html.push('<div class="mui-slider-group mui-slider-loop sjqbgdtu">');
        $.each(pics, function (i, pic) {
            if (0 == i) {
                imgUrl = configManager.storeImgurl.format(pics[length - 1], ww * 1.2 + "-255");
                html.push('<div class="mui-slider-item mui-slider-item-duplicate">');
                html.push('<a href="#">');
                html.push('<img src="' + imgUrl + '"/>');
                html.push('</a>');
                html.push('</div>');
            }
            imgUrl = configManager.storeImgurl.format(pics[i], ww * 1.2 + "-255");
            html.push('<div class="mui-slider-item">');
            html.push('<a href="#">');
            html.push('<img src="' + imgUrl + '"/>');
            html.push('</a>');
            html.push('</div>');
            if (length - 1 == i) {
                imgUrl = configManager.storeImgurl.format(pics[0], ww * 1.2 + "-255");
                html.push('<div class="mui-slider-item mui-slider-item-duplicate">');
                html.push('<a href="#">');
                html.push('<img src="' + imgUrl + '"/>');
                html.push("</a>");
                html.push('</div>');
            }
        });
        html.push('</div>');
        html.push('<div class="mui-slider-indicator mui-text-right" style="right:15px;bottom:28px">');
        $.each(pics, function (i, pic) {
            if (0 == i) { html.push('<div class="mui-indicator mui-active"></div>'); }
            else { html.push('<div class="mui-indicator"></div>'); }
        });
        html.push('</div>');
        html.push("<div class='sjxqtpswz'>" + shopbaseinfo.store_name + "</div>");
        $("#mui-slider").html(html.join(""));
        mui.init({ swipeBack: true });
        var gallery = mui('#mui-slider');
        gallery.slider({ interval: 3000 });
    }

}
