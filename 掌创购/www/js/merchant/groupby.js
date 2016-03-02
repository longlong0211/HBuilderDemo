// TODO
//$(function () { plusReady(); });
function plusReady() { Init(); }

if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

var _currentcityInfo = null;
var _typeliststr, _areastr, _sortstr;
var _hight = $(window).height() - 100 > 280 ? 280 : $(window).height() - 100;
function Init() {
    // 当前城市
    _currentcityInfo = JSON.parse(plus.storage.getItem(storageManager.currentcity));
    // 默认当前城市为杭州
    if (!_currentcityInfo) {
        _currentcityInfo = { "id": 383, "parent_id": 31, "name": "杭州", "lat": 30.33928387105413, "lng": 120.1032966187033 };
    }

    loaded();
    // 全部分类
    PaintTypePage();
    BindTypePageEvent();

    // 地区
    PaintAreaPage();
    BindAreaEvent();

    // 排序
    PaintSortPage();
    BindSortEvent();

    // 绑定事件
    BindMenuEvent();

    // 加载数据
    LoadStoreList();
}

// 全部分类
function PaintTypePage() {
    var jqXHR = $.ajax({
        type: 'Get',
        url: configManager.RequstUrl + 'api/common/category?parent=0'
    }).done(function (data) {
        if (data.state != "success") { console.log(data.message); return; }
        var typelist = data.data;

        // 画页面
        var html = [];
        html.push("<li tip='0' class='current'><a>全部分类</a></li>");
        for (var i = 0; i < typelist.length; i++) {
            var type = typelist[i];
            html.push("<li tip='" + type.id + "'><a>" + type.name + "</a></li>");
        }

        _typeliststr = html.join("");
    });
}

// 子商铺类型
function PaintSubTypePage(parenttype, isall) {
    if (isall) {
        $("#sptlist").html("<ul><li></li></ul>");
        $("#sptlistscroll").height(_hight);
        sptlistscroll.refresh();
        return;
    }
    var parentid = parseInt(parenttype.attr('tip'));
    // 加载子分类
    $.ajax({
        type: 'Get',
        url: configManager.RequstUrl + 'api/common/category?parent=' + parentid
    }).done(function (data) {
        if (data.state != "success") { console.log(data.message); return; }
        var typelist = data.data;

        // 如果不存在子节点
        if (typelist.length == 0) {
            $("#sptlist").html("");
            $("#stroetypemenu span").attr("tip", parentid).text(convertStr(parenttype.text()));
            $("#stroetypelist").hide();
            // 查询
            LoadStoreList();
        } else {

            // 画页面
            var html = [];
            html.push("<ul><li tip='" + parentid + "' para='" + parenttype.text() + "'><a>全部</a></li>");
            for (var i = 0; i < typelist.length; i++) {
                var type = typelist[i];
                html.push("<li tip='" + type.parent_id + "|" + type.id + "'><a>" + type.name + "</a></li>");
            }
            html.push("</ul>");
            $("#sptlist").html(html.join(""));

            $("#sptlistscroll").height(_hight);
            sptlistscroll.refresh();
        }
    });
}

// 绑定事件
function BindTypePageEvent() {
    // 分类
    $("#fptlist").on("click", "li", function () {
        var parenttype = $(this);
        var parentid = parseInt(parenttype.attr('tip'));

        // 设置选中样式
        $("#fptlist li[class=current]").removeClass("current");
        parenttype.addClass("current");

        // 全部类型
        if (parentid == 0) {
            $("#sptlist").html("");
            $("#stroetypemenu span").attr("tip", null).text(convertStr(parenttype.text()));
            $("#stroetypelist").hide();
            // 查询
            LoadStoreList();
        } else {
            PaintSubTypePage(parenttype);
        }
    });

    // 子类
    $("#sptlist").on("click", "li", function () {
        var subtype = $(this);
        var subtypeid = subtype.attr("tip");
        $("#stroetypemenu span").attr("tip", subtypeid);
        if (subtype.text() == "全部") {
            $("#stroetypemenu span").text(convertStr(subtype.attr("para")));
        } else {
            $("#stroetypemenu span").text(convertStr(subtype.text()));
        }

        $("#stroetypelist").hide();
        // 查询
        LoadStoreList();
    });
    // 点击子页面空白页隐藏
    $("#sptlistscroll").on("click", function () {
        $("#stroetypelist").hide();
        $("#hidegb").hide();
    })
}

// 全城信息
function PaintAreaPage() {
    var jqXHR = $.ajax({
        type: 'Get',
        url: configManager.RequstUrl + 'api/common/area?city=' + _currentcityInfo.id
    });
    console.log(configManager.RequstUrl + 'api/common/area?city=' + _currentcityInfo.id);
    // 加载成功画页面
    jqXHR.done(function (data) {
        if (data.state != "success") { console.log(data.message); return; }
        var arealist = data.data;
        var html = [];
        html.push("<li tip='0' class='current'><a>全城</a></li><li tip='-1'><a>热门商圈</a></li>");
        for (var i = 0; i < arealist.length; i++) {
            var area = arealist[i];
            html.push("<li tip='" + area.id + "'><a>" + area.name + "</a></li>");
        }

        _areastr = html.join("");
    });
}

// 加载商圈页面
function PaintDistList(arealist, parentarea, isall) {
    if (isall) {
        $("#sarealist").html("<ul><li></li></ul>");
        $("#sareascroll").height(_hight);
        sareascroll.refresh();
        return;
    }
    var parentid = parseInt(parentarea.attr('tip'));

    // 如果不存在子节点
    if (arealist.length == 0) {
        $("#sarealist").html("");
        $("#allcitiesmenu span").attr("tip", parentid).text(convertStr(parentarea.text()));
        $("#allarea").hide();
        // 查询
        LoadStoreList();
    }

    var html = [];

    if (parentid != -1) {
        html.push("<li tip='" + parentid + "' para='" + parentarea.text() + "'><a>全部</a></li>");
    }
    for (var i = 0; i < arealist.length; i++) {
        var subarea = arealist[i];
        html.push("<li tip='" + subarea.area_id + "|" + subarea.id + "'><a>" + subarea.name + "</a></li>");
    }

    $("#sarealist").html(html.join(""));

    $("#sareascroll").height(_hight);
    sareascroll.refresh();
}

function BindAreaEvent() {
    $("#farealist").on("click", "li", function () {
        var parentarea = $(this);
        var parentid = parseInt(parentarea.attr('tip'));

        // 设置选中样式
        $("#farealist li[class=current]").removeClass("current");
        parentarea.addClass("current");

        if (parentid == 0) {
            // 全城
            $("#sarealist").html("");
            $("#allcitiesmenu span").text(convertStr(parentarea.text())).attr("tip", null);
            $("#allarea").hide();
            // 查询
            LoadStoreList();
        } else if (parentid == -1) {
            // 热门商圈
            var jqXHR = $.ajax({
                type: 'Get',
                url: configManager.RequstUrl + 'api/common/district?onlyhot=1&city=' + _currentcityInfo.id
            });

            // 加载成功画页面
            jqXHR.done(function (data) {
                if (data.state != "success") { console.log(data.message); return; }
                var arealist = data.data;
                PaintDistList(arealist, parentarea);
            });
        } else {
            // 其他区商圈
            var subjqXHR = $.ajax({
                type: 'Get',
                url: configManager.RequstUrl + 'api/common/district?area=' + parentid
            });
            console.log(configManager.RequstUrl + 'api/common/district?area=' + parentid);
            // 加载成功画页面
            subjqXHR.done(function (data) {
                if (data.state != "success") { console.log(data.message); return; }
                var arealist = data.data;
                PaintDistList(arealist, parentarea);
            });
        }
    });

    // 选中子节点
    $("#sarealist").on("click", "li", function () {
        var selected = $(this);

        $("#allcitiesmenu span").attr("tip", selected.attr("tip"));
        if (selected.text() == "全部") {
            $("#allcitiesmenu span").text(convertStr(selected.attr("para")));
        } else {
            $("#allcitiesmenu span").text(convertStr(selected.text()));
        }

        $("#allarea").hide();

        // 查询
        LoadStoreList();
    });
    $("#sareascroll").on("click", function () {
        $("#allarea").hide();
        $("#hidegb").hide();
    });
}

// 智能排序
function PaintSortPage() {
    var html = [];
    html.push("<li tip='distance'><a>离我最近</a></li>");
    html.push("<li tip='smart'><a>智能排序</a></li>");
    html.push("<li tip='score'><a>好评优先</a></li>");
    html.push("<li tip='capita'><a>人均最低</a></li>");
    html.push("<li tip='views'><a>人气排行</a></li>");

    _sortstr = html.join("");
}

function BindSortEvent() {
    $("#sortlist").on("click", "li", function () {
        $("#sortlistmenu span").attr("tip", $(this).attr("tip")).text($(this).text());
        $("#sortlist").hide();
        LoadStoreList();
    });
}

// 绑定事件
function BindMenuEvent() {
    // 回退
    $("#back").on("click", function () {
        plus.storage.removeItem(storageManager.groupbysearchtext);
        plus.webview.currentWebview().close();
    });
    // 搜索    
    $("#searchvalue").on("click", function () {
        clicked("../home/search.html?f=g", false, false, "slide-in-right");
    });

    var menulist = $("div [name=menulist]");
    $("div [name=menutitle]").on("click", function () {
        console.log("触发。。。。。");
        $("#hidegb").hide();
        var divId = $(this).attr("tip");
        var vis = $("div [name=menulist]:visible");
        vis.hide();
        // 当前Tab若与点击Tab一致，隐藏页面
        if (divId == vis.attr("id") && $("#" + divId + " li").length > 0) { return; }

        if (divId == "allarea") {
            $("#farealist").html(_areastr);
            $("#allareascroll").height(_hight);
            $("#" + divId).show();
            allareascroll.refresh();
            PaintDistList(null, null, true);
        } else if (divId == "stroetypelist") {
            $("#fptlist").html(_typeliststr);
            $("#fptlistscroll").height(_hight);
            $("#" + divId).show();
            fptlistscroll.refresh();
            PaintSubTypePage(null, true);
        } else if (divId == "sortlist") {
            $("#sortlistitem").html(_sortstr);
            $("#fptlistscroll").height(_hight);
            $("#" + divId).show();
            sortscroller.refresh();
        }
        $("#hidegb").show();

    });

    $("#hidegb").on("click", function () {
        // 菜单栏回归到初始状态
        $("div [name=menulist]:visible").hide();
        $(this).hide();
    });

    var showallgoodslisttext = "";
    //显示隐藏其他团购商品
    $("#merchantlist").on("click", "div[name=showallgoods]", function () {
        var meid = $(this).attr("tip");
        if ($(this).find(".title").html() != "收起") {
            showallgoodslisttext = $(this).find(".title").html();
            $(this).find(".title").html("收起");
            $(this).find('.tghandler').find('i').removeClass('down').addClass('up');
            $("#goodslist" + meid).show(300);
        } else {
            $(this).find(".title").html(showallgoodslisttext);
            $(this).find('.tghandler').find('i').removeClass('up').addClass('down');
            $("#goodslist" + meid).hide(300);
        }
        try { myScroll.refresh(); } catch (err) { }
    });

    // 跳转商品详情
    $("#merchantlist").on("click", "div[name=goodsItem]", function () {
        var page = '../mine/goods/detail.html?goodsid=' + $(this).attr("tip");
        clicked(page, false, false, "slide-in-right");
    });
}

// 接受搜索情况
function receiveSearchEvent() {
    generatedCount = 1;
    $("#stroetypemenu span").attr("tip", "").text("全部分类");
    $("#allcitiesmenu span").attr("tip", "").text("全城");;
    $("#sortlistmenu span").attr("tip", "distance").text("离我最近");

    // 菜单栏回归到初始状态ch
    $("div [name=menulist]:visible").hide();
    $("#hidegb").hide();

    // 更新数据
    LoadStoreList();
}

// 根据条件获取商家列表
function LoadStoreList(paintstyle) {
    $("#hidegb").hide();
    var sortlist = [];

    // 类别
    var typeTip = $("#stroetypemenu span").attr("tip");
    if (typeTip && typeTip != "") {
        var typetiplist = typeTip.split('|');
        var pcate = typetiplist[0];
        var scate = typetiplist.length > 1 ? typetiplist[1] : null;
        if (pcate) { sortlist.push("pcate=" + pcate); }
        if (scate) { sortlist.push("scate=" + scate); }
    }

    // 当前城市
    sortlist.push("city=" + _currentcityInfo.id);

    // 全城
    var areaTip = $("#allcitiesmenu span").attr("tip");
    if (areaTip && areaTip != "") {
        var areatiplist = areaTip.split('|');
        var area = areatiplist[0];
        var dist = areatiplist.length > 1 ? areatiplist[1] : null;
        if (area) { sortlist.push("area=" + area); }
        if (dist) { sortlist.push("dist=" + dist); }
    }

    // 智能排序
    var sortTip = $("#sortlistmenu span").attr("tip");
    if (sortTip) {
        sortlist.push("by=" + sortTip);
        if (sortTip == "smart" || sortTip == "distance") {
            sortlist.push("lat=" + _currentcityInfo.lat);
            sortlist.push("lng=" + _currentcityInfo.lng);
        } else if (sortTip == "score") {
            sortlist.push("order=DESC");
        }
    }

    // 查询条件
    var searchtext = plus.storage.getItem(storageManager.groupbysearchtext);
    $("#searchvalue").val(searchtext);
    if (searchtext) {
        sortlist.push("keyword=" + searchtext);
    }

    if (!paintstyle) { generatedCount = 1; }
    var pagenum = 8;
    if ("refresh" == paintstyle) {
        sortlist.push("page=1");
        sortlist.push("limit=8");
    } else {
        sortlist.push("page=" + generatedCount);
        sortlist.push("limit=" + pagenum);
    }
    // 显示空页面
    if (!paintstyle) {
        $("#merchantlist").html("<div style='vertical-align: middle;text-align: center;padding-top: 30%;'></div>");
    }
    var sortstr = sortlist.join("&");
    // TODO
    if (!paintstyle) {
        $("#merchantlist").html("<div style='vertical-align: middle;text-align: center;padding-top: 40%;'>努力的加载中...</div>");
    }

    $.ajax({
        type: 'Get',
        url: configManager.RequstUrl + 'api/store/glist?' + sortstr
    }).done(function (data) {
        if (data.state != "success") { console.log(data.message); return; }
        var datalist = data.data;
        var html = [];
        for (var i = 0; i < datalist.length; i++) {
            var merchant = datalist[i];
            var distancestr = '';
            if (merchant.store_distance) {
                distancestr = parseFloat(merchant.store_distance).toFixed(2) + "km";
            }

            html.push("<div class='tglb bg-fff'> <div class='tgsjmc'>");
            html.push("<h2><span>" + distancestr + "</span>" + merchant.store_name + "</h2>");
            html.push("<p class='pjgjc'><span>" + DrawScore(merchant.store_score) + "</span><span><a>￥" + merchant.store_capita + "/人</a></span><span><a>" + ((merchant.district) ? merchant.district.name : "") + "</a></span><span><a>" + ((merchant.cate) ? merchant.cate.name : "") + "</a></span></p>");
            html.push("</div>");

            var groupgoods = merchant.group_goods;
            for (var j = 0; j < groupgoods.length; j++) {
                var goods = groupgoods[j];
				var goods_pic = configManager.goodsImgurl.format(goods.pic, configManager.imgwid+"-"+configManager.imghei);

                if (j == 2) {
                    html.push("<div id='goodslist" + merchant.id + "' style='display:none'>");
                }
                html.push("<div class='item-02-wrap bottom-line' name='goodsItem' tip='" + goods.id + "'>");
                html.push("<ul class='item-01-block '>");
                html.push("<li class='img-part'> <img class='img' name='goodsimgitem' src='../../images/defaultpic.jpg' data-src='" + goods_pic + "'> </li>");
                html.push("<li class='text-part2'><p>全场金币通用</p><p class='jinq'><span style='font-size:1.2em;color:#f60'>￥" + goods.price + " &nbsp;&nbsp;&nbsp; <span style='color:#777; font-size:0.8em; text-decoration:line-through'>￥" + goods.market_price + "</span><span style='margin-left: 40px;color:#777; font-size:0.9em; '>已售" + goods.selled + "<span></p><p><span class='f-r'></span></p></li>");
                html.push("</ul>");
                html.push("<div class='off-left-tips1'> </div>");
                html.push("</div>");

                if (groupgoods.length > 2 && (j == groupgoods.length - 1)) {
                    html.push("</div>");
                }
            }

            if (groupgoods.length > 2) {
                html.push("<div class='djingd' name='showallgoods' tip='" + merchant.id + "'><p style='text-align:center;'><a><span class='title' style='float:none'>更多" + (groupgoods.length - 2) + "个团购</span><span class='tghandler' style='float:none'><i class='angle down icon'></i></span></a> </p></div>");
            }
            html.push("</div>");
        }

        if ("append" == paintstyle) {
            // 无效加载
            if (html.length == 0) { generatedCount = generatedCount - 1; }
            $("#merchantlist").append($(html.join("")));
        } else {
            if (html.length == 0) { html.push("<div style='vertical-align: middle;text-align: center;padding-top: 40%;'>没有此类商家，请看看别的吧</div>"); }
            $("#merchantlist").html(html.join(""));
        }
        try { myScroll.refresh(); } catch (err) { }

        $('img[name=goodsimgitem]').lazyload({ effect: 'fadeIn', fadeTime: 100, timeout: 260 });
    }).fail(function () {
        plus.nativeUI.alert("您的网络太不给力了！");
        if (!paintstyle) {
            $("#merchantlist").html("<div style='vertical-align: middle;text-align: center;padding-top: 40%;'>没有此类商家，请看看别的吧</div>");
        }
    });
};

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

// 处理字符串过长情况
function convertStr(str) {
    if (str && str.length > 5) {
        return str.substr(0, 4) + "...";
    }

    return str;
}

var fptlistscroll, sptlistscroll, allareascroll, sareascroll, sortscroller;
var myScroll, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset, generatedCount = 1;
function loaded() {
    //全部分类 
    fptlistscroll = new iScroll('fptlistscroll', { useTransition: false, fixedScrollbar: true, fadeScrollbar: true, hideScrollbar: true, scrollbarClass: "myScrollbar" });
    sptlistscroll = new iScroll('sptlistscroll', { useTransition: false, fixedScrollbar: true, fadeScrollbar: true, hideScrollbar: true, scrollbarClass: "myScrollbar" });

    //全部分类 
    allareascroll = new iScroll('allareascroll', { useTransition: false, fixedScrollbar: true, fadeScrollbar: true, hideScrollbar: true, scrollbarClass: "myScrollbar" });
    sareascroll = new iScroll('sareascroll', { useTransition: false, fixedScrollbar: true, fadeScrollbar: true, hideScrollbar: true, scrollbarClass: "myScrollbar" });

    sortscroller = new iScroll('sortscroller', { useTransition: false, fixedScrollbar: true, fadeScrollbar: true, hideScrollbar: true, scrollbarClass: "myScrollbar" });


    pullDownEl = document.getElementById('pullDown');
    pullDownOffset = pullDownEl.offsetHeight;
    pullUpEl = document.getElementById('pullUp');
    pullUpOffset = pullUpEl.offsetHeight;

    myScroll = new iScroll('wrapper', {
        useTransition: false,
        topOffset: pullDownOffset,
        onRefresh: function () {
            if (pullDownEl.className.match('loading')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉即可刷新';
            } else if (pullUpEl.className.match('loading')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '';
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
            } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                pullUpEl.className = 'flip';
                if (isDisplayPullUp()) {
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';
                }
                this.maxScrollY = this.maxScrollY;
            } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                pullUpEl.className = '';
                if (isDisplayPullUp()) {
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                }
                this.maxScrollY = pullUpOffset;
            }
        },
        onScrollEnd: function () {
            if (pullDownEl.className.match('flip')) {
                pullDownEl.className = 'loading';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';
                pullDownAction();
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                if (isDisplayPullUp()) {
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                    pullUpAction();
                }                
            }
            $('img[name=goodsimgitem]').lazyload({ effect: 'fadeIn', fadeTime: 100, timeout: 260 });
        }
    });

    setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
}

function isDisplayPullUp() {
    // 屏幕高度 - 滚动Div面高度 - 上拉Div在滚动Div位置
    return ($(window).height() - $("#wrapper").offset().top - $("#pullUp").position().top) < 0;
}
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

// 下拉刷新
function pullDownAction() {
    setTimeout(function () {
        // 检查网络状况
        if (!checkNetworkHeath()) { myScroll.refresh(); return; }
        generatedCount = 1;
        // 调用APIGPS定位
        plus.geolocation.getCurrentPosition(
       function (position) {
           //获取地理坐标信息
           var codns = position.coords;
           _currentcityInfo.lat = codns.latitude;
           _currentcityInfo.lng = codns.longitude;
           pullDownDo();
           plus.storage.setItem(storageManager.currentcity, JSON.stringify(_currentcityInfo));
       },
       function (e) {
           pullDownDo();
           console.log("获取位置信息失败：" + e.message);
       });

    }, 600);
}

function pullDownDo() {
    if (!_typeliststr || _typeliststr == "") {
        console.log("初始化");
        Init();
    } else {
        $("#goodstext").val(null);
        LoadStoreList("refresh");
    }
}
// 上滑加载
function pullUpAction() {
    setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
        generatedCount = generatedCount + 1;
        LoadStoreList("append");
    }, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
}

function checkNetworkHeath() {
    // 判断当前网络状况
    var currentNetworkType = plus.networkinfo.getCurrentType();
    console.log("当前网络" + currentNetworkType);
    if (currentNetworkType && (plus.networkinfo.CONNECTION_UNKNOW == currentNetworkType || plus.networkinfo.CONNECTION_NONE == currentNetworkType)) {
        plus.nativeUI.alert("无网络连接！")
        return false;
    }

    return true;
}

// 调用APIGPS定位
function gpsPosition() {
    plus.geolocation.getCurrentPosition(
        function (position) {
            //获取地理坐标信息
            var codns = position.coords;
            _currentcityInfo.lat = codns.latitude;
            _currentcityInfo.lng = codns.longitude;
            LoadStoreList();
            plus.storage.setItem(storageManager.currentcity, JSON.stringify(_currentcityInfo));
        },
        function (e) {
            LoadStoreList();
            console.log("获取位置信息失败：" + e.message);
        });
}