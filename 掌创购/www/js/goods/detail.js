//$(function () { plusReady(); })
var _lunch, _currentlunchid, _goodsid, _storeInfo, _goodsdetailinfo, _currentloginuser;
function plusReady() {
    _goodsid = getUrlParam("goodsid");
    _currentlunchid = getUrlParam("l");;

    _currentloginuser = JSON.parse(plus.storage.getItem(storageManager.user));

    //加载订单详情
    LoadDetail(_goodsid);
    //绑定事件
    BindEvent();
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

//加载订单详情
function LoadDetail(goodsid) {
    $.ajax({
        type: 'GET',
        url: configManager.RequstUrl + "api/goods/info?goods=" + goodsid
    }).done(function (data) {
        if (data.state != "success") { console.log(data.message); return; }
        var goodsInfo = data.data;
        var storeInfo = goodsInfo.store;
        _goodsdetailinfo = goodsInfo;
        _storeInfo = storeInfo;
        var html = [];
        var ww = $(window).width();
        // 商铺图片
        html.push("<div class='sjqbgdtu' style='width:100%;height:212px'><a><div style='background:url(" + configManager.storeImgurl.format(goodsInfo.pic, ww * 1.2 + "-255") + ") center no-repeat;width:" + ww + "px;height:212px'></div></a></div>");
        html.push("<div class='sjxqtpswz'>" + goodsInfo.title + "<br>" + storeInfo.store_name + "</div>");
        $("#goodspic").html(html.join(""));

        html = [];
        // 购买
        html.push("<div class='sjxqbkbg spxqcon'>");
        html.push("<p class='spxqljqg'><span>")

        if (storeInfo.store_pause) {
            if (2 == goodsInfo.goods_type) {
                html.push("<b class='spxqljan' id='buy'><a><i class='icon iconfont icon-iconfontrefund' style='font-size:1.2em;'></i>立即抢购</a></b>");
            } else {
                html.push("<b class='spxqljan' id='buy'><a>立即购买</a></b><b class='spxqjran' id='addcart'><a>加入购物车</a></b>");
            }

            // 打折活动
            if (goodsInfo.lunch && goodsInfo.lunch != false && goodsInfo.lunch.length > 0) {
                if (!_currentlunchid) {
                    _lunch = goodsInfo.lunch[0];
                } else {
                    for (var i = 0; i < goodsInfo.lunch.length; i++) {
                        if (goodsInfo.lunch[i].id == _currentlunchid) {
                            _lunch = goodsInfo.lunch[i];
                            break;
                        }
                    }
                }

                if (_lunch != null) {
                    html.push("<b class='spxqljan' style='margin-left:0.9em' id='join'><a>参与霸王餐</a></b>");
                }
            }

        } else {
            html.push("<b class='spxqjrangray'><a>暂停营业</a></b>");
        }

        html.push("</span><b class='dhz'>" + goodsInfo.price + "元</b><font class='scz'>￥" + goodsInfo.market_price + "元</font>");
        html.push("</p>");

        html.push("<p class='sjxqsst spxqyhtb'>");

        if (goodsInfo.any_time_refund == 1) {
            html.push("<span><i class=\"checked checkbox icon\"></i>随时退</span>");
        }
        if (goodsInfo.over_time_refund == 1) {
            html.push("<span><i class=\"checked checkbox icon\"></i>过期退</span>");
        }
        html.push("<span><i class=\"truck icon\"></i>已售" + goodsInfo.selled + "件</span></p>");
        html.push("</div>");

        // 评分
        html.push("<div class='sjxqbkbg'>");
        html.push("<p class='sjxqsjpf'><span>0人评价</span><b>" + DrawScore(goodsInfo.score) + "</b></p>");
        html.push("</div>");

        // 预约电话
        html.push("<div class='sjxqbkbg'>");
        html.push("<p class='sjxqbddd spxqdhyy'><span><a href='tel:" + storeInfo.store_phone + "'><i class=\"phone sign icon\" style='font-size:3.2em; color: green'></i></a></span><b>预约电话<br />" + storeInfo.store_phone + "</b></p>");
        html.push("</div>");

        // 商家信息
        html.push("<div class='sjxqbkbg sjxqckxq'>");
        html.push("<h2>商家信息</h2>");
        html.push("<div  id='storedetail' tip='" + storeInfo.id + "'><p style='line-height:2em; font-size:1em;'><a>" + storeInfo.store_name + "</a></p>");
        html.push("<p>" + storeInfo.store_address + "</p></div>");
        html.push("</div>");

        // 商品描述
        html.push("<div class='sjxqbkbg sjxqckxq'>");
        html.push("<h2>本单详情</h2>");
        html.push("<p class='goods_content'>" + goodsInfo.content + "</p>");
        html.push("<p style='line-height:30px' class='imagetext' class='sjxqtw'><a><span style='float:right'><i class=\"angle right icon\"></i></span>查看图文详情</a> </p>");
        html.push("</div>");

        // 购买须知
        html.push("<div class='sjxqbkbg sjxqckxq'>");
        html.push("<h2>购买须知</h2>");
        html.push("<p>" + goodsInfo.notice + "</p>");
        html.push("</div>");

        $("#goodsInfo").html(html.join(""));
    });
}

//绑定事件
function BindEvent() {
    //点击图文详情
    $("#goodsInfo").on("click", ".imagetext", function () {
        var page = "imagetext.html?goodsid=" + _goodsdetailinfo.id;
        clicked(page, false, false, "slide-in-right");
    });

    // 商家详情
    $("#goodsInfo").on("click", "#storedetail", function () {
        clicked("../../merchant/detail.html?storeid=" + $(this).attr('tip'), false, false, 'slide-in-right');
    });

    //立即购买，只有一个商品，生成临时订单
    $("#goodsInfo").on("click", "#buy", function () {
        //判断用户
		if( !valiadateUser() ) { return false; }
        var goodinfo = _goodsdetailinfo;
        var currentgoods = {
            "id": goodinfo.id,
            "storeid": goodinfo.store.id,
            "title": goodinfo.title,
            "price": goodinfo.price,
            "pic": goodinfo.pic,
            "count": 1,
            "selected": true
        };
        var temporder = { "goods": [currentgoods] };
        plus.storage.setItem(storageManager.temporder, JSON.stringify(temporder));

        // 跳转提交页
        clicked("../order/commit.html", false, false, "slide-in-right");
    });

    // 加入购物车
    $("#goodsInfo").on("click", "#addcart", function () {
        //判断用户
		if( !valiadateUser() ) { return false; }
        // 放入购物车缓存 
        var goodinfo = _goodsdetailinfo;
        var src = (0 == goodinfo.pic) ? configManager.storeImgurl.format(storeInfo.store_pic, "100-100") : configManager.goodsImgurl.format(goodinfo.pic, "100-100");
        var currentgoods = {
            "id": goodinfo.id,
            "storeid": goodinfo.store.id,
            "title": goodinfo.title,
            "price": goodinfo.price,
            "src": src,
            "count": 1,
            "selected": true
        };

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
        plus.storage.setItem(storageManager.cart, JSON.stringify(mycart));
        clicked("../order/cart.html", false, false, "slide-in-right");
    });

    // 参与霸王餐活动
    $("#goodsInfo").on("click", "#join", function () {
    	//判断用户
    	if( !valiadateUser() ) { console.log("false"); return false; }
        $.ajax({
            type: 'GET',
            url: configManager.RequstUrl + "api/common/servertime"
        }).done(function (data) {
            if (data.state != "success") { console.log(data.message); return; }

            var currentdate = new Date(data.time);
            var actionstart = new Date(_lunch.start.replace("-", "/").replace("-", "/"));
            var actionend = new Date(_lunch.end.replace("-", "/").replace("-", "/"));

            if (currentdate > actionend) {
                plus.nativeUI.alert("活动已经结束！");
                return;
            } else if (currentdate < actionstart) {
                plus.nativeUI.alert("活动暂未开始！\n开始时间: " + actionstart.Format('yyyy-MM-dd hh:mm'));
                return;
            }
            // 跳转页问卷页
            var questionPage = plus.webview.create("../../merchant/question.html", "../../merchant/question.html", {}, { lunchid: _lunch.id, goodsid: _goodsid, price: (_goodsdetailinfo.price * _lunch.discount), is_paybycard: _storeInfo.is_paybycard });
            questionPage.show("slide-in-right");
        });

    });
}

// 评分
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

//判断用户是否登录，用户角色
function valiadateUser(){
	var result = true;
    // 是否登录
    if (!_currentloginuser) { clicked("../../account/login.html", false, false, "slide-in-bottom"); result = false; }
	
    //商家，商家子帐号，代理子帐号，不能购买商品
    if ([2,3,5].indexOf(_currentloginuser.user_type) > -1) {
        plus.ui.alert("帐号不能购买商品", function () { }, configManager.alerttip, configManager.alertCtip);
        result = false;
    }
    return result;
}
