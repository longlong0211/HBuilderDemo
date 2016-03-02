function plusReady() {
    // 解决部分魅族，大神手机某项页面不执行PlusReady方法
    var pages = JSON.parse(plus.storage.getItem(storageManager.exctPlusReadyPages));
    pages.push(pageName.merchant);
    plus.storage.setItem(storageManager.exctPlusReadyPages, JSON.stringify(pages));

    loaded();
    // 当前城市
    _currentcityInfo = JSON.parse(plus.storage.getItem(storageManager.currentcity));
    // 默认当前城市为杭州
    if (!_currentcityInfo) {
        _currentcityInfo = { "id": 383, "parent_id": 31, "name": "杭州", "lat": 30.33928387105413, "lng": 120.1032966187033 };
    }
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

var _currentcityInfo = null;
var _homefilter; // 首页跳转过来
var _typeliststr, _areastr, _sortstr;
var _hight = $(window).height() - 100 > 280 ? 280 : $(window).height() - 100;
var initCity = 0;
var _isInit = false;
function init() {
    _isInit = true;

    // 判断是否是否初始化，切换城市
    if (initCity == _currentcityInfo.id) { return; } else { initCity = _currentcityInfo.id; }

    // 定位当前城市，默认杭州
    $("#currentcityname").text(_currentcityInfo.name);

    // 全部分类
    PaintTypePage();
    BindTypePageEvent();

    // 全城
    PaintAreaPage();
    BindAreaEvent();

    // 排序
    PaintSortPage();
    BindSortEvent();

    // 事件绑定
    BindMenuEvent();

    generatedCount = 1;
    var initParams = plus.storage.getItem(storageManager.merchantInitParams);
    if (initParams) {
        receiveHomeEvent(initParams);
        plus.storage.removeItem(storageManager.merchantInitParams);
    } else {
        LoadStoreList();
    }
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
    var menulist = $("div [name=menulist]");
    $("div [name=menutitle]").on("click", function () {
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
}

// 接受搜索情况
function receiveSearchEvent() {
    generatedCount = 1;
    $("#stroetypemenu span").attr("tip", "").text("全部分类");
    $("#allcitiesmenu span").attr("tip", "").text("全城");;
    $("#sortlistmenu span").attr("tip", "distance").text("离我最近");

    // 菜单栏回归到初始状态
    $("div [name=menulist]:visible").hide();
    $("#hidegb").hide();
    // 更新数据
    LoadStoreList();

}

// 接受首页通知更新
function receiveHomeEvent(filtertext) {
    _homefilter = "";
    generatedCount = 1;
    $("#stroetypemenu span").attr("tip", "").text("全部分类");
    $("#allcitiesmenu span").attr("tip", "").text("全城");;
    $("#sortlistmenu span").attr("tip", "distance").text("离我最近");
    if (filtertext) { _homefilter = filtertext; }
    // 首页菜单
    if (filtertext.indexOf('|') > 0) {
        // 更新类别
        var valus = filtertext.split('|');
        if (valus.length > 2) {
            var tipvalue = (("0" == valus[1]) ? valus[0] : valus[0] + "|" + valus[1]);
            $("#stroetypemenu span").attr("tip", tipvalue).text(valus[2]);
        }
    }

    // 更新数据
    if (_isInit) {
        LoadStoreList();
    }
}

// 接受Main事件请求
function receiveMainEvent() {
    // 菜单栏回归到初始状态
    $("div [name=menulist]:visible").hide();
    $("#hidegb").hide();
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
        // 不存在坐标信息
        if ((sortTip == "smart" || sortTip == "distance") && _currentcityInfo.lat == 0) {
            sortTip = "views";
        }

        sortlist.push("by=" + sortTip);

        if (sortTip == "smart" || sortTip == "distance") {
            sortlist.push("lat=" + _currentcityInfo.lat);
            sortlist.push("lng=" + _currentcityInfo.lng);
        } else if (sortTip == "score") {
            sortlist.push("order=DESC");
        }
    }

    // 查询条件
    var searchtext = plus.storage.getItem(storageManager.searchtext);
    $("#searchvalue").text((searchtext && searchtext.trim() != "") ? searchtext : "搜索商家/商圈/商品");
    if (searchtext) {
        sortlist.push("keyword=" + searchtext);
    }

    //是否仅获取支持团购的商家
    if (_homefilter && _homefilter.indexOf('groupbuy') != -1) {
        sortlist.push("groupbuy=1");
    }

    //是否仅获取支持外卖的商家
    if (_homefilter && _homefilter.indexOf('takeaway') != -1) {
        sortlist.push("takeaway=1");
    }

    if (!paintstyle) { generatedCount = 1; }
    var pagenum = 20;
    if ("refresh" == paintstyle) {
        sortlist.push("page=1");
        sortlist.push("limit=20");
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
    console.log(configManager.RequstUrl + 'api/store/list?' + sortstr);
    if (!paintstyle) {
        $("#merchantlist").html("<div style='vertical-align: middle;text-align: center;padding-top: 40%;'>努力的加载中...</div>");
    }

    var t1 = new Date().getTime();
    $.ajax({
        type: 'Get',
        url: configManager.RequstUrl + 'api/store/list?' + sortstr
    }).done(function (data) {
        var t2 = new Date().getTime();
        console.log("耗时" + (t2 - t1));
        if (data.state != "success") { console.log(data.message); return; }
        var datalist = data.data;
        var html = [];
        for (var i = 0; i < datalist.length; i++) {
            var merchant = datalist[i];
            var store_pic = configManager.storeImgurl.format(merchant.store_pic, configManager.imgwid + "-" + configManager.imghei);
            var distancestr = '';
            if (merchant.store_distance) {
                distancestr = parseFloat(merchant.store_distance).toFixed(2) + "km";
            }

            html.push("<div class='item-02-wrap bottom-line' style='background:#fff;' name='shopitem' tip='" + merchant.id + "'>");
            html.push("<ul class='item-01-block '>");
            html.push("<li class='img-part'> <img name='storeimgitem' src='../../images/defaultpic.jpg' data-src= '" + store_pic + "' class='img'> </li>");
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
            html.push("<p class='apparses'>" + DrawScore(merchant.store_score));
            html.push("<span>(" + merchant.reviews + "评价/" + merchant.collectes + "关注)</span>");
            if (merchant.store_discount > 0) { html.push("<span class='span_discount'>最低" + merchant.store_discount + "折</span>"); }
            html.push("</p>");

            html.push("<p><span style='float:right'>" + distancestr + "</span>" + merchant.store_address + "</p></li>");
            html.push("</ul><div class='off-left-tips1'> </div>");
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

        // 跳转商家详情
        $("div[name=shopitem]").on("click", function () {
            clicked("detail.html?storeid=" + $(this).attr("tip"), false, false, "slide-in-right");
        });
        $('img[name=storeimgitem]').lazyload();
    }).fail(function () {
        plus.nativeUI.alert(errorMessage.interface);
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

// 切换城市重新加载数据
function selectcity() {
    // 当前城市
    _currentcityInfo = JSON.parse(plus.storage.getItem(storageManager.currentcity));

    $("#currentcityname").text(_currentcityInfo.name);
    // 菜单栏回归到初始状态
    $("div [name=menulist]:visible").hide();
    $("#hidegb").hide();
    _typeliststr = ""; _areastr = ""; _sortstr = "";
    $("#allcitiesmenu span").attr("tip", null).text(convertStr("全城"));
    $("#stroetypemenu span").attr("tip", null).text(convertStr("全部分类"));
    generatedCount = 1;

    PaintTypePage();
    PaintAreaPage();
    PaintSortPage();
    LoadStoreList();

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
        useTransition: true,
        fadeScrollbar: true,
        fixedScrollbar: true,
        vScrollbar: false,
        topOffset: pullDownOffset,
        hScroll: false,
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
            $('img[name=storeimgitem]').lazyload();
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
    setTimeout(function () {// <-- Simulate network congestion, remove setTimeout from production!
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

    }, 600);	// <-- Simulate network congestion, remove setTimeout from production!
}

function pullDownDo() {
    if (!_typeliststr || _typeliststr == "") {
        console.log("初始化");
        init();
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

