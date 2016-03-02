//$(function () { plusReady(); });

var _currentuser;
function plusReady() {
    // 获取当前用户
    _currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
    // 获取关注商家列表
    loadCollectList();
    // 绑定取消关注
    bindEvent();
}

if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

// 关注商家列表
function loadCollectList(appendstyle) {
	plus.nativeUI.showWaiting();
    var sortlist = [];
    sortlist.push("userid=" + _currentuser.id);
    // 是否刷新
    var pagenum = 15;
    if ("refresh" == appendstyle) {
        sortlist.push("page=1");
        sortlist.push("limit=15");
    } else {
        sortlist.push("page=" + generatedCount);
        sortlist.push("limit=" + pagenum);
    }

    $.ajax({
        type: "GET",
        url: configManager.RequstUrl + "api/user/collections?" + sortlist.join("&"),
    }).done(function (data) {
        if ("success" != data.state) { console.log(data.message); return; }
        var collectList = data.data;

        var html = [];
        for (var i = 0; i < collectList.length; i++) {
            var collect = collectList[i];
            var store = collect.store;

            var storepicsrc = configManager.storeImgurl.format(store.store_pic, "62-50");
            html.push("<div class='item-01-wrap' id='storeitem" + store.id + "' ><ul class='item-01-block'><li class='img-part'  tip='" + store.id + "' name='goodsitemli'><img style='width: auto;height: 50px;' src='../../images/defaultpic.jpg' name='imgitem' data-src='" + storepicsrc + "' width='62' height='50'></li>");
            html.push("<li class='tips-part t-c' name='btnCancle'  tip='" + store.id + "'><div class='comm-ctrl' name='switchstatus'><span style='padding: 1em 0.5em;margin-top: 0.4em;'  class='org-bg-block'>取消关注</span></div></li>");
            html.push("<li class='text-part' tip='" + store.id + "' name='goodsitemli'><h2>" + store.store_name + "</h2><h2>" + collect.created_at + "</h2></li></ul></div>");
        }

        if ("append" == appendstyle) {
            if (html.length == 0) { generatedCount = generatedCount - 1; }
            $("#collections").append($(html.join("")));
        } else {
            if (html.length == 0) { html.push("<div style='vertical-align: middle;text-align: center;padding-top: 30%;'>您还没有关注商家哟</div>"); }
            $("#collections").html(html.join(""));
        }

        try { myScroll.refresh(); } catch (err) { }
        $('img[name=imgitem]').lazyload();
        plus.nativeUI.closeWaiting();
    }).fail(function () {
        plus.nativeUI.alert(errorMessage.interface);
    });
}


function bindEvent() {
    var t1 = null;//这个设置为全局
    // 取消关注
    $("#collections").on("click", "li[name=btnCancle]", function (e) {
        if (t1 == null) { t1 = new Date().getTime(); } else {
            var t2 = new Date().getTime(); if (t2 - t1 < 500) {
                t1 = t2;
                return;
            } else {
                t1 = t2;
            }
        }
        var store_id = $(this).attr("tip");
        plus.nativeUI.confirm(
        	"确认取消关注该商家？",
        	function (e) {
        	    if (e.index == 0) {
        	        $("#storeitem" + store_id + "").hide();
        	        try { myScroll.refresh(); } catch (err) { }

        	        var postdata = { "userid": _currentuser.id, "token": _currentuser.token, "store": store_id };
        	        $.ajax({
        	            type: "POST",
        	            url: configManager.RequstUrl + "api/store/delcollect",
        	            async: true,
        	            data: postdata
        	        }).done(function (data) {

        	        });
        	    }
        	},
        	"提示", ["确认", "返回"]);
    });

    //跳转到商家详情
    $("#collections").on("click", "li[name=goodsitemli]", function () {
        var storeid = $(this).attr("tip");
        clicked("../merchant/detail.html?storeid=" + storeid, false, false, "slide-in-right");
    });
}


function pullDownAction() {
    setTimeout(function () {
        generatedCount = 1;
        loadCollectList("refresh");
    }, 600);
}

function pullUpAction() {
    setTimeout(function () {
        generatedCount = generatedCount + 1;
        loadCollectList("append");
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
