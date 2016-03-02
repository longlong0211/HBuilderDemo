//$(function () {
//    plusReady();
//});

var _currentuser = null;
function plusReady() {
    // 当前用户
    _currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
    loadGoodsList();
    BindEvent();
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}
// 加载商品列表
function loadGoodsList(appendstyle, seachtext) {
    var sortlist = [];
    if (2 == _currentuser.user_type) {
        sortlist.push("store=" + _currentuser.store.id);
    }
    else if (3 == _currentuser.user_type) {
        sortlist.push("store=" + _currentuser.parent.store.id);
    }
    // 根据商品名称搜索
    if (seachtext) { sortlist.push("title=" + seachtext); }
    // 分类搜索PageCount置为1
    if (!appendstyle) { generatedCount = 1; }

    // 是否刷新
    var pagenum = 15;
    if ("refresh" == appendstyle) {
        sortlist.push("page=1");
        sortlist.push("limit=20");
    } else {
        sortlist.push("page=" + generatedCount);
        sortlist.push("limit=" + pagenum);
    }
    var sortstr = sortlist.join("&");
    console.log(configManager.RequstUrl + "api/goods/list?" + sortstr);
    $.ajax({
        type: 'Get',
        url: configManager.RequstUrl + "api/goods/list?" + sortstr
    }).done(function (data) {
        if (data.state != "success") {
            console.log(data.message);
            return;
        }
        var goodslist = data.data;
        var html = [];
        for (var i = 0; i < goodslist.length; i++) {
            var goods = goodslist[i];
//          console.log(JSON.stringify(goods));
            var pic = ( 0 == goods.pic ) ? configManager.storeImgurl.format(goods.store_id, "75-60") : configManager.goodsImgurl.format(goods.pic, "112-90");
            var goodsStatusText = (goods.status == 1) ? "<span title='100'  style='padding: 1em 0.5em;margin-top: 1em;'  class='org-bg-block'>已上架</span>" : "<span title='101' style='padding: 1em 0.5em;margin-top: 1em;' class='gray-bg-block'>已下架</span>";
            html.push("<div class='item-01-wrap'><ul class='item-01-block'><li class='img-part' name='goodsitemli' tip='" + goods.id + "'><img src='../../../images/defaultpic.jpg' name='imgitem' data-src='" + pic + "' width='75' height='60'></li>");
            html.push("<li class='tips-part t-c'><div class='comm-ctrl' name='switchstatus' tip='" + goods.id + "|" + goods.status + "'>" + goodsStatusText + "</div></li>");
            html.push("<li class='text-part' name='goodsitemli' tip='" + goods.id + "'><h2>" + goods.title + "</h2><h2 class='fc-org'>￥" + goods.price + "</h2></li></ul></div>");
        }

        if ("append" == appendstyle) {
            if (html.length == 0) { generatedCount = generatedCount - 1; }
            $("#goodslist").append($(html.join("")));
        } else {
            if (html.length == 0) { html.push("<div style='vertical-align: middle;text-align: center;padding-top: 30%;'>没有商品信息</div>"); }
            $("#goodslist").html(html.join(""));
        }

        try { myScroll.refresh(); } catch (err) { }
        $('img[name=imgitem]').lazyload();
    }).fail(function () {
        plus.nativeUI.alert(errorMessage.interface);
    });
}

// 商品操作
function BindEvent() {
	//后退
	$("#returnto_shop").on("click",function(){
		plus.webview.currentWebview().opener().evalJS("countItem("+ _currentuser.store.id +")");
		plus.webview.currentWebview().close();	
	});
    // 添加商品
    $("#addgoods").on("click", function () {
        if ((2 == _currentuser.user_type && 1 != _currentuser.auth_status) ||
        	(3 == _currentuser.user_type && 1 != _currentuser.parent.auth_status)) {
            plus.nativeUI.alert("您没有通过认证不能发布商品");
        } else {
            clicked('add.html', false, false, 'slide-in-right');
        }
    });
    // 搜索商品
    $("#searchgoods").on("click", function () {
        var searchtext = $("#searchtext").val();
        if (searchtext) { searchtext.trim(); }
        loadGoodsList(null, searchtext);
    });

    // 管理商品
    $("#goodslist").on("click", "div[name=switchstatus]", function () {
        var gooditem = $(this);
        var data = gooditem.attr("tip").split('|');
        var status = data[1];
        var goodsid = data[0];
        if ("1" == status) {
            plus.nativeUI.confirm("确认下架商品？", function (e) {
                if (e.index == 0) {
                    switchGoodsStatus(goodsid);
                    gooditem.html("<span title='101' style='padding: 1em 0.5em;margin-top: 1em;'   class='gray-bg-block'>已下架</span>");
                    gooditem.attr("tip", goodsid + "|0");
                }
            }, "提示", ["确定", "取消"]);
        } else {
            switchGoodsStatus(goodsid);
            gooditem.html("<span title='100' style='padding: 1em 0.5em;margin-top: 1em;'   class='org-bg-block'>已上架</span>");
            gooditem.attr("tip", goodsid + "|1");
        }
    });

    // 编辑商品
    $("#goodslist").on("click", "li[name=goodsitemli]", function () {
        clicked("add.html?id=" + $(this).attr('tip'), false, false, 'slide-in-right');
    });
}

// 更新商品状态
function switchGoodsStatus(goodsid) {
    $.ajax({
        type: "POST",
        url: configManager.RequstUrl + "/api/goods/switchstatus",
        async: false,
        data: {
            "userid": _currentuser.id,
            "token": _currentuser.token,
            "goods": goodsid
        }
    }).done(function (data) {
        if (data.state != "success") {
            plus.nativeUI.alert(data.message);
        }
    });

}

// 添加完商品
function receiveAddEvent() {
    generatedCount = 1;
    var searchtext = $("#searchtext").val();
    if (searchtext) { searchtext.trim(); }
    loadGoodsList(null, searchtext);
}

function pullDownAction() {
    setTimeout(function () {
        generatedCount = 1;
        loadGoodsList("refresh");
    }, 600);
}

function pullUpAction() {
    setTimeout(function () {
        generatedCount = generatedCount + 1;
        loadGoodsList("append");
    }, 600);
}


var myScroll, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset, generatedCount = 1;
function loaded() {
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

            $('img[name=imgitem]').lazyload();
        }
    });

    setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
}

function isDisplayPullUp() {
    // 屏幕高度 - 滚动Div面高度 - 上拉Div在滚动Div位置
    return ($(window).height() - $("#wrapper").offset().top - $("#pullUp").position().top) < 0;
}
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);
