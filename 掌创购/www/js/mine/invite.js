//$(function () { plusReady(); })

var _currentuser;
function plusReady() {
    // 获取当前用户
    _currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
    //_currentuser = { "id": 254, "name": "13761195710", "email": "", "nick": "掌创0254", "real_name": "小", "avatar_id": 304, "code": "04E6", "id_no": "411328198812255011", "id_pic1": 344, "id_pic2": 345, "id_pic3": 0, "user_type": 1, "status": 1, "auth_status": 1, "parent_id": 2, "remark": "", "created_at": "2015-07-28 18:23:30", "updated_at": "2015-07-30 18:26:05", "setpaypass": 1, "token": "MjU0fCQyeSQxMCQzMW9ldDlNYlN4aGM2NHVVaTRVN1JlcmZ3dmh5WXl4WmhLQ2szMjZWQkFOMldILi9BcGRIS3wyOGU3OGE0OTkyM2EzNmRkZDM2OGI2YTk4OWY2MTlmNw==", "account": { "id": 254, "user_id": 254, "used": "0.00", "all": "0.00", "cash": "0.00", "card": "0.00", "coin": "0.00", "pos": "0.00", "opos": "0.00", "zpos": "0.00", "frozen": "0.00" }, "address": { "id": 5, "user_id": 254, "prov_id": 0, "city_id": 0, "area_id": 0, "address": "OK雾气腾腾q e", "is_default": 1, "created_at": "2015-07-29 23:24:00", "updated_at": "2015-07-29 23:24:00" }, "store": null, "barcode": "_downloads/httpwwwo2abccomauthregistercode04e6.png" };
    paintPage();

    bindEvent();
}

if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

var _pagecount = 1;
// 邀请会员列表
function paintPage(paintstyle) {
	plus.nativeUI.showWaiting();
    if (!paintstyle) { _pagecount = 1; }
    var pagenum = 15;
    var pagecount = _pagecount;
    if ("append" != paintstyle) {
        pagecount = 1;
    }

    if (!paintstyle) {
        $("#userlist").html("<div style='vertical-align: middle;text-align: center;padding-top: 40%;'>努力的加载中...</div>");
    }
    var postdata = { "userid": _currentuser.id, "token": _currentuser.token, "limit": pagenum, "page": pagecount };
    $.ajax({
        type: "POST",
        async: true,
        url: configManager.RequstUrl + "api/user/pushers",
        data: postdata
    }).done(function (data) {
    	plus.nativeUI.closeWaiting();
        if ("success" != data.state) { return false; }
        var html = [];
        var list = data.data.list;
        if (list.length == 0 && ("append" != paintstyle)) {
            html.push('<div class="wdyqhybt"><span> 金币：0</span>会员数：0  </div>');
            html.push('<div class="con">');
            html.push('<div class="wdyqhymycon">');
            html.push('<img  src="../../images/wdyqhytu_my.jpg"/>');
            html.push('<p>朋友消费，你收益，快来赚钱吧<br/>邀请好友赚取金币，人脉就是钱脉&nbsp;&nbsp;');
            html.push('<span class="yaoqing">');
            html.push('<a id="btninvite" style="font-size:bigger">邀请</a>');
            html.push('</span>');
            html.push('</p>')
            html.push('</div>');
            html.push('</div>');
            $("#wrapper").hide();
            $("#emptyuserlist").html(html.join(""));
            myScroll.refresh(); try { myScroll.refresh(); } catch (err) { }
            return;
        }

        html = [];
        if (list.length > 0 && _pagecount == 1) {
            html.push("<div class='wdyqhybt'><span> 金币：" + data.data.coin_total + "</span>会员数：" + data.data.push_total + "</div>");
        }

        html.push("<div class='con'><div class='wdyqhycon'>");
        for (var i = 0; i < list.length; i++) {
            var user = list[i];
            html.push("<p><a><span>" + user.coin_count + "</span><b><img src=" + configManager.avatarImgurl.format(user.avatar_id, "30-30") + "'></b>" + user.nick + "</a></p>");
        }
        html.push("</div></div>");
        if ("append" == paintstyle) {
            if (html.length == 0) { _pagecount = _pagecount - 1; }
            $("#userlist").append($(html.join("")));
        } else {
            $("#userlist").html(html.join(""));
        }
        try { myScroll.refresh(); } catch (err) { }
    }).fail(function () {
        plus.nativeUI.alert(errorMessage.interface);
    });
}

function bindEvent() {
    $("#sharepop").on("click", function () {
        console.log(2);
        $(this).hide();
    });

    $(".main").on("click", "#btninvite", function () {
        $("#sharepop").show();
    });

    $("li[name=shareitem]").on("click", function () {
        var item = $(this).attr("tip");
        // 分享二维码必须在本地
        var currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
        if (!currentuser.barcode) { createUserBarCode(currentuser, item); return; }

        shareShow("扫一扫，关注我们", currentuser.barcode, item);
    });
}

// 生产用户唯一标识二维码
function createUserBarCode(currentuser, item) {
    console.log("生成");
    $.ajax({
        type: 'Get',
        async: false,
        url: configManager.RequstUrl + 'api/common/qrcode?type=login&code=' + currentuser.code
    }).done(function (data) {
        if (data.state != "success") {
            console.log(data.message);
            return;
        }

        // 下载本地
        var dtask = plus.downloader.createDownload(data.uri, {}, function (d, status) {
            // 下载完成
            if (status == 200) {
                currentuser.barcode = d.filename;
                plus.storage.setItem(storageManager.user, JSON.stringify(currentuser));
                shareShow(data.link, currentuser.barcode, item);
            } else {

            }

        });
        dtask.start();
    });
}

var myScroll, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset;
function loaded() {
    pullDownEl = document.getElementById('pullDown');
    pullDownOffset = pullDownEl.offsetHeight;
    pullUpEl = document.getElementById('pullUp');
    pullUpOffset = pullUpEl.offsetHeight;

    var viewheight = $(window).height() - 120;
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
                if ($("#scroller").height() <= viewheight) { return; }
                pullUpEl.className = 'flip';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '释放刷新...';
                this.maxScrollY = this.maxScrollY;
            } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                if ($("#scroller").height() <= viewheight) { return; }
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                this.maxScrollY = pullUpOffset;
            }
        },
        onScrollEnd: function () {
            if (pullDownEl.className.match('flip')) {
                pullDownEl.className = 'loading';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';
                pullDownAction();	// Execute custom function (ajax call?)
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                pullUpAction();	// Execute custom function (ajax call?)
            }
        }
    });

    setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);

// 下拉
function pullDownAction() {
    setTimeout(function () {
        _pagecount = 1;
        paintPage("refresh");

    }, 1000);
}
// 上滑
function pullUpAction() {
    setTimeout(function () {
        _pagecount = _pagecount + 1;
        paintPage("append");
    }, 1500);
}
