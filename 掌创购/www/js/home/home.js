if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

function plusReady() {
    loaded();
    // 解决部分魅族，大神手机某项页面不执行PlusReady方法
    var pages = JSON.parse(plus.storage.getItem(storageManager.exctPlusReadyPages));
    pages.push(pageName.home);
    plus.storage.setItem(storageManager.exctPlusReadyPages, JSON.stringify(pages));

    // 判断当前网络状况
    if (!checkNetworkHeath()) { setDefaultPage(); return; }

    // 首次加载不存在当前城市
    var isfirstInit = false;
    var cachecity = JSON.parse(plus.storage.getItem(storageManager.currentcity));
    if (!cachecity) {
        isfirstInit = true;
        cachecity = { "id": 383, "parent_id": 31, "name": "杭州", "lat": 30.33928387105413, "lng": 120.1032966187033 };
        plus.storage.setItem(storageManager.currentcity, JSON.stringify(cachecity));
    }

    // 默认城市杭州
    $("#currentcityname").text(cachecity.name);

    // 关闭启动页
    plus.navigator.closeSplashscreen();

    // 检测是否有新消息
    checklatestmsg();

    // 加载数据
    loadDisCountList(cachecity.id, cachecity.lat, cachecity.lng);

    // 加载广告
    PaintAdv();

    // 启动定位
    gpsPosition(isfirstInit);

    // 绑定页面事件
    bindEvent();
}

function settingAppPlus() {
    // 隐藏滚动条
    plus.webview.currentWebview().setStyle({
        scrollIndicator: 'none'
    });
    // Android处理返回键
    plus.key.addEventListener('backbutton', function () {
        if (confirm('确认退出？')) {
            plus.runtime.quit();
        }
    }, false);
}

// 调用APIGPS定位
function gpsPosition(isfirstInit) {
    plus.geolocation.getCurrentPosition(
        function (position) {
            //获取地理坐标信息
            var codns = position.coords;
            console.log("GPS:" + "X:" + codns.latitude + " Y:" + codns.longitude);

            // 更新坐标信息
            var cachecity = JSON.parse(plus.storage.getItem(storageManager.currentcity));
            if (cachecity) {
                cachecity.lat = codns.latitude; cachecity.lng = codns.longitude;
                plus.storage.setItem(storageManager.currentcity, JSON.stringify(cachecity));
            }

            getCurrentCity(codns.latitude, codns.longitude);
        },
        function (e) {
            if (isfirstInit) {
                console.log("获取位置信息失败：" + e.message);
                plus.nativeUI.alert("为了提供更好的服务，请检查是否打开定位！", function () {
                    clicked(pageName.city, false, false, "slide-in-bottom");
                });
            }

            try { myScroll.refresh(); } catch (err) { }
        });
}

// 根据坐标获取当前城市
function getCurrentCity(lat, lng) {
    console.log(configManager.RequstUrl + 'api/common/position?lat=' + lat + '&lng=' + lng);
    $.ajax({
        type: 'Get',
        url: configManager.RequstUrl + 'api/common/position?lat=' + lat + '&lng=' + lng
    }).done(function (data) {
        if (data.state != "success") { console.log(data.message); return; }
        var currentcity = data.data;
        console.log("定位当前城市为：" + currentcity.name);

        var cachecity = JSON.parse(plus.storage.getItem(storageManager.currentcity));
        // 缓存城市与定位城市一致
        if (cachecity && currentcity.id != cachecity.id) {
            plus.nativeUI.confirm("当前城市为" + currentcity.name + ", 是否切换？", function (e) {
                if (e.index == 1) {
                    updateCurrentCity(currentcity, lat, lng);
                    plus.webview.getWebviewById(pageName.merchant).evalJS("init()");
                }
            }, "提示", ["取消", "切换"]);
        }
        try { myScroll.refresh(); } catch (err) { }
    }).fail(function () {
        try { myScroll.refresh(); } catch (err) { }
        plus.nativeUI.alert(errorMessage.interface);
    });
}

// 更新当前城市
function updateCurrentCity(currentcity, lat, lng) {
    // 定位当前城市，默认杭州
    $("#currentcityname").text(currentcity.name);

    // 定位成功加载当前城市产品
    loadDisCountList(currentcity.id, lat, lng);

    // 放入缓存
    var cityData = { "id": currentcity.id, "parent_id": currentcity.parent_id, "name": currentcity.name, "lat": lat, "lng": lng };
    plus.storage.setItem(storageManager.currentcity, JSON.stringify(cityData));
}

// 城市切换
function selectcity() {
    // 缓存是否有数据
    var cachecity = JSON.parse(plus.storage.getItem(storageManager.currentcity));
    if (cachecity) {
        console.log("切换城市：" + cachecity.name);
        $("#currentcityname").text(cachecity.name);
        // 重新加载商品
        loadDisCountList(cachecity.id, cachecity.lat, cachecity.lng);
    }
}

// 加载优惠商品列表
function loadDisCountList(cityid, lat, lng) {
    // 检查网络状况
    var params = [];
    // 用户是否登陆
    var currentUser = JSON.parse(plus.storage.getItem(storageManager.user));
    if (currentUser) {
        params.push("userid=" + currentUser.id);
        params.push("city=" + cityid);
    } else {
        params.push("city=" + cityid);
    }
    params.push("lat=" + lat);
    params.push("lng=" + lng);
    params.push("limit=" + 20);

    console.log("接口：" + configManager.RequstUrl + "api/common/index?" + params.join("&"));
    var t1 = new Date().getTime();
    // 当前城市
    $.ajax({
        type: 'Get',
        url: configManager.RequstUrl + "api/common/index?" + params.join("&")
    }).done(function (data) {
        var t2 = new Date().getTime();
        console.log("耗时-加载优惠商品列表" + (t2 - t1));
        if (data.state != "success") { console.log(data.message); return; }

        // 画优惠产品
        if (data.data.goods.list && data.data.goods.list.length > 0) {
            paintGoodsList(data.data.goods.list);
        } else {
            $("#discountgoodlist").html("<div style='text-align:center;padding-top:2em;font-size:16px'>暂无推荐商品</div>");
        }

        // 商品数据不够20条填充商家数据
        if (!(data.data.goods.list && data.data.goods.list.length > 20)) {
            if (data.data.store.list && data.data.store.list.length > 0) {
                // 画商家
                paintStoreList(data.data.store.list);
            } else {
                $("#discountgoodlist").html("<div style='text-align:center;padding-top:2em;font-size:16px'>暂无推荐商品</div>");
            }
        }

        try { myScroll.refresh(); } catch (err) { }
    }).fail(function () {
        //plus.nativeUI.alert(errorMessage.interface);
        $("#discountgoodlist").html("<div style='text-align:center;padding-top:2em;font-size:16px'>暂无推荐商品</div>");
    });
}

// 画优惠商品列表
function paintGoodsList(goodslist) {
    var html = [];
    for (var i = 0; i < goodslist.length; i++) {
        var goods = goodslist[i];
        html.push("<div name='goodsItem' class='item-01-wrap' tip='" + goods.id + "'><ul class='item-01-block'>");
        html.push("<li class='img-part'> <img name='imgitem' class='img' src='../../images/defaultpic.jpg' data-src='" + configManager.goodsImgurl.format(goods.pic, configManager.imgwid + "-" + configManager.imghei) + "'><b></b></li>");
        html.push("<li class='tips-part'><p><i class=\"dollar icon\"></i>消费" + goods.store.offline_pay_fee + "%</p><p><i class=\"bitcoin icon\"></i>金币" + goods.store.coin_pay_fee + "%</p></li>");

        var address = goods.store.store_address;
        if (goods.store.store_address.length > 18)
        { address = address.substr(0, 18) + '...'; }

        html.push("<li class='text-part'><h2>" + goods.title + "</h2><p>" + address + "</p><p><span style='color:#f30; font-size:1.4em;'>￥" + goods.price + "</span>&nbsp;&nbsp;<span style='color:#999;text-decoration:line-through;'>" + goods.market_price + "</span></p></li>");
        html.push("</ul></div>");
    }

    $("#discountgoodlist").html(html.join(""));
    $('img[name=imgitem]').lazyload({ effect: 'fadeIn', fadeTime: 100, timeout: 260 });
}

// 商家
function paintStoreList(storelist) {
    var html = [];
    for (var i = 0; i < storelist.length; i++) {
        var merchant = storelist[i];
        //      var store_pic = configManager.storeImgurl.format(merchant.store_pic, "75-53");
        var store_pic = configManager.storeImgurl.format(merchant.store_pic, configManager.imgwid + "-" + configManager.imghei);

        var distancestr = '';
        if (merchant.store_distance) {
            distancestr = parseFloat(merchant.store_distance).toFixed(2) + "km";
        }

        html.push("<div class='item-02-wrap bottom-line' style='background:#fff;' name='shopitem' tip='" + merchant.id + "'>");
        html.push("<ul class='item-01-block '>");
        html.push("<li class='img-part'> <img class='img' name='imgitem' src='../../images/defaultpic.jpg'  data-src= '" + store_pic + "'/> </li>");
        html.push("<li class='text-part2'><p>");

        html.push("<span class='icon gold_icon'>奖</span>");
        if (merchant.is_noreserve > 0) {
            html.push("<span class='icon red_icon'>约</span>");
        }
        if (merchant.is_refund > 0) {
            html.push("<span class='icon green_icon'>退</span>");
        }
        if (merchant.is_groupbuy > 0) {
            html.push("<span class='icon orange_icon'>团</span>");
        }
        if (merchant.is_takeaway > 0) {
            html.push("<span class='icon blue_icon'>外</span>");
        }

        html.push(merchant.store_name + "</p>");
        html.push("<p>" + DrawScore(merchant.store_score));
        html.push("<span style='color:#777; font-size:0.9em'>(" + merchant.reviews + "评价)</span>");
        if (merchant.store_discount > 0) { html.push("<span class='span_discount'>最低" + merchant.store_discount + "折</span>"); }
        html.push("</p>");
        html.push("<p><span style='float:right'>" + distancestr + "</span>" + merchant.store_address + "</p></li>");
        html.push("</ul><div class='off-left-tips1'> </div>");
        html.push("</div>");
    }


    $("#discountgoodlist").html(html.join(""));
    $('img[name=imgitem]').lazyload();
}

// 绑定事件
function bindEvent() {
    var t1 = null;//这个设置为全局
    $("#typemenulist li[name=typemenuItem]").on("click", function () {
        if (t1 == null) { t1 = new Date().getTime(); } else { var t2 = new Date().getTime(); if (t2 - t1 < 1000) { t1 = t2; return; } else { t1 = t2; } }
        var tip = $(this).attr("tip");

        // 跳转团购
        if ("groupbuy" == tip) {
            clicked("../merchant/groupby.html", false, false, "slide-in-right");
            return;
        }
        if ("classify" == tip) {
            clicked("../merchant/classify.html", false, false, "slide-in-right");
            return;
        }

        // 跳转商家
        plus.webview.getWebviewById(pageName.main).evalJS("redirect('footermerchant')");

        var merchantview = plus.webview.getWebviewById(pageName.merchant);
        if (merchantview) {
            // 通知商家列表页更新
            plus.webview.getWebviewById(pageName.merchant).evalJS("receiveHomeEvent('" + tip + "')");
        } else {
            plus.storage.setItem(storageManager.merchantInitParams, tip);
        }

    });

    // 优惠产品
    $("#discountgoodlist").on("click", " div[name=goodsItem]", function () {
        if (t1 == null) { t1 = new Date().getTime(); } else { var t2 = new Date().getTime(); if (t2 - t1 < 1000) { t1 = t2; return; } else { t1 = t2; } }

        // 跳转订单详情
        clicked('../mine/goods/detail.html?goodsid=' + $(this).attr("tip"), false, false, "slide-in-right");
    });

    // 最近商家
    $("#discountgoodlist").on("click", "div[name=shopitem]", function () {
        if (t1 == null) { t1 = new Date().getTime(); } else { var t2 = new Date().getTime(); if (t2 - t1 < 1000) { t1 = t2; return; } else { t1 = t2; } }

        // 跳转商家详情
        clicked("../merchant/detail.html?storeid=" + $(this).attr("tip"), false, false, "slide-in-right");
    });
}

var myScroll, pullDownEl, pullDownOffset;
function loaded() {
    pullDownEl = document.getElementById('pullDown');
    pullDownOffset = pullDownEl.offsetHeight;

    myScroll = new iScroll('wrapper', {
        useTransition: true,
        fadeScrollbar: true,
        fixedScrollbar: true,
        scrollbarClass: "myScrollbar",
        topOffset: pullDownOffset,
        hScroll: false,
        vScrollbar: false,
        onBeforeScrollStart: function (e) {
            if (this.absDistY > (this.absDistX + 5)) { e.preventDefault(); }
        },
        onRefresh: function () {
            if (pullDownEl.className.match('loading')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉即可刷新';
            }
        },
        onScrollMove: function () {
            if (this.y > 5 && !pullDownEl.className.match('flip')) {
                pullDownEl.className = 'flip';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '松开刷新...';
                this.minScrollY = 0;
            } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉即可刷新...';
                this.minScrollY = -pullDownOffset;
            }

        },
        onScrollEnd: function () {
            if (pullDownEl.className.match('flip')) {
                pullDownEl.className = 'loading';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';
                pullDownAction();
            }
            $('img[name=imgitem]').lazyload();
        }
    });

    setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

// 下拉
function pullDownAction() {
    setTimeout(function () {
        // 启动定位
        gpsPosition();
    }, 500);
}
// 上滑
function pullUpAction() { try { myScroll.refresh(); } catch (err) { } }

// 检查网络
function checkNetworkHeath() {
    // 判断当前网络状况
    var currentNetworkType = plus.networkinfo.getCurrentType();
    console.log("当前网络" + currentNetworkType);
    if (currentNetworkType && (plus.networkinfo.CONNECTION_UNKNOW == currentNetworkType || plus.networkinfo.CONNECTION_NONE == currentNetworkType)) {
        //plus.nativeUI.alert("无网络连接！");
        return false;
    }

    return true;
}

// 无网络连接，初始化界面
function setDefaultPage() {
    plus.navigator.closeSplashscreen();
    // 默认杭州
    var cityData = { "id": 383, "parent_id": 31, "name": "杭州", "lat": 30.33928387105413, "lng": 120.1032966187033 };
    // 定位当前城市，默认杭州
    $("#currentcityname").text(cityData.name);
    $("#discountgoodlist").html("<div style='text-align:center;padding-top:2em;font-size:16px'>暂无推荐商品</div>");

    plus.storage.setItem(storageManager.currentcity, JSON.stringify(cityData));
    try { myScroll.refresh(); } catch (err) { }
}

// 画评分
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
    return '<img width="74" height="10" src="http://i3.dpfile.com/s/i/app/api/32_' + pic + 'star.png" />';
}

// 画广告位
function PaintAdv() {
    // 头部
    $.ajax({
        type: 'Get',
        url: configManager.RequstUrl + "api/ads/posi?mark=indextop"
    }).done(function (data) {
        if (data.state != "success") { console.log(data.message); return; }
        if (!data.data.ads || data.data.ads.length <= 0) { return; }
        // 显示页面
        var html = [];
        html.push("<div class='mui-slider-group mui-slider-loop'>");

        for (var i = 0; i < data.data.ads.length; i++) {
            var adv = data.data.ads[i];
            var src = "../../images/bannertop.jpg";
            if (i == 0) {
                html.push("<div name='advitem' class='mui-slider-item mui-slider-item-duplicate'><a tip='" + adv.url + "'><img name='adsimg" + i + "' src='" + src + "'></a></div>");
            }
            //html.push("<div name='advitem' class='mui-slider-item'><a tip='../merchant/discount.html'><img name='adsimg" + i + "' src='" + src + "'></a></div>");

            html.push("<div name='advitem' class='mui-slider-item'><a tip='" + adv.url + "'><img name='adsimg" + i + "' src='" + src + "'></a></div>");

            if (i == data.data.ads.length - 1) {
                html.push("<div name='advitem' class='mui-slider-item mui-slider-item-duplicate'><a tip='" + adv.url + "'><img name='adsimg" + i + "' src='" + src + "'></a></div></div>");
            }
        }

        html.push("<div class='mui-slider-indicator' style='text-align:right; right:8px;bottom:3px'>");
        for (var i = 0; i < data.data.ads.length; i++) {
            var indi = (i == 0) ? "<div class='mui-indicator mui-active'></div>" : "<div class='mui-indicator'></div>";
            html.push(indi);
        }
        html.push("</div>");
        $("#slider").html(html.join(""));

        // 点击广告
        $("div[name=advitem]").on("click", function () {
            var url = $(this).find('a').attr('tip');
            if (url && url != "") {
                clicked(url, false, false, 'slide-in-right');
            }
        });

        // 下载广告
        for (var i = 0; i < data.data.ads.length; i++) {
            var adv = data.data.ads[i];
            var httpurl = configManager.adsImgurl.format(adv.pic, "") + '640-220';
            setAdsImg("#slider", adv.pic, httpurl, i);
        }

        settingAdvScroll();

        // 中间广告
        $.ajax({
            type: 'Get',
            url: configManager.RequstUrl + "api/ads/posi?mark=indexmiddle"
        }).done(function (data) {
            if (data.state != "success") { console.log(data.message); return; }
            if (!data.data.ads || data.data.ads.length <= 0) { return; }
            var adv = data.data.ads[0];

            html = [];
            html.push("<div id='midadvitem' tip='" + adv.url + "'> ");
            html.push("<ul class='index-notice '><li> <img name='adsimg0' src='../../images/adsmiddle.jpg' /></li></ul>");
            html.push("</div>");
            $("#advindexmiddle").html(html.join(""));
            $("#midadvitem").on("click", function () {
                var url = $(this).attr('tip');
                if (url && url != "") {
                    clicked(url, false, false, 'slide-in-right');
                }
            });

            var httpurl = configManager.adsImgurl.format(adv.pic, "") + '640-100';
            setAdsImg("#advindexmiddle", adv.pic, httpurl, 0);
        });

    });

}

// 设置广告滚动
function settingAdvScroll() {
    var first = null;
    mui.init({
        swipeBack: true, //启用右滑关闭功能
        keyEventBind: {
            backbutton: false
        }
    });
    mui.back = function () {
        plus.nativeUI.confirm("退出掌创购?", function (e) {
            if (e.index == 0) { plus.runtime.quit(); }
        }, "提示", ["是", "否"]);
    }
    var slider = mui("#slider");
    slider.slider({ interval: 3000 });
}

// 获取图片路径
function setAdsImg(adspostion, picid, httpImageUrl, adsIndex) {
    var filename = (plus.io.PUBLIC_DOWNLOADS + "/ads/" + picid + ".jpg");

    // 是否存在
    plus.io.resolveLocalFileSystemURL("_downloads/" + filename, function (entry) {
        var url = entry.toLocalURL();
        $(adspostion + " img[name=adsimg" + adsIndex + "]").attr("src", url);
    },
   function (e) {
       downloadAdsImg(adspostion, filename, httpImageUrl, adsIndex);
   });
}

function downloadAdsImg(adspostion, filename, httpImageUrl, adsIndex) {
    // 下载本地
    var dtask = plus.downloader.createDownload(httpImageUrl, { filename: filename }, function (d, status) {
        // 下载完成
        if (status == 200) {
            var url = "file://" + plus.io.convertLocalFileSystemURL(d.filename);
            $(adspostion + " img[name=adsimg" + adsIndex + "]").attr("src", url);
        } else {
        }
    });
    dtask.start();
}

// 检测是否有新消息
function checklatestmsg() {
    $.ajax({
        type: 'Get',
        url: configManager.RequstUrl + 'api/common/lastmsgtime'
    }).done(function (data) {
        if (data.state != "success") { console.log(data.message); return; }
        // 消息
        var msgicon = $("#messageicon").offset();
        $("#hascount").css({ "top": msgicon.top - 2, "left": msgicon.left + 7 });
        var latestMsgTime = plus.storage.getItem(storageManager.latestMsgTime);
        if (!latestMsgTime || Number(latestMsgTime) <= Date.parse(data.time)) {
            $("#hascount").show();
        }
    })
}