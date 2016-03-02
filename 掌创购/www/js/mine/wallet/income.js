//$(function () { plusReady(); })

var _currentuser, _accounttype;
function plusReady() {
    // 获取当前用户
    _currentuser = JSON.parse(plus.storage.getItem(storageManager.user));

    _accounttype = getUrlParam("t");
    loadIncomeList();
    BindEvent();
}

if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

function BindEvent() {
    // tab切换
    $("#menustab li").on("click", function () {
        // 样式切换
        $("#menustab li[class$=sbhg]").removeClass("sbhg");
        $(this).addClass("sbhg");
        _pagecount = 1;
        $("#datalist").html("");
        // 填充列表
        loadIncomeList();
    });

}

// 加载收支明细
function loadIncomeList(pendstyle) {
    plus.nativeUI.showWaiting();
    // account cash：余额账户 card：会员卡账户 coin：金币账户
    // type takein：收入 payout：支出 all：所有
    var type = $("#menustab li[class$=sbhg]").attr("tip");

    if (!pendstyle) { _pagecount = 1; }
    var limit = 15;
    var pagecount = _pagecount;
    if ("append" != pendstyle) {
        pagecount = 1;
        limit = 20;
        $("#datalist").html("<div style='vertical-align: middle;text-align: center;padding-top: 30%;'>加载中...</div>");
    }

    var postdata = { "userid": _currentuser.id, "account": _accounttype, "type": type, "limit": limit, "page": pagecount, "token": _currentuser.token };
    $.ajax({
        type: "POST",
        async: true,
        url: configManager.RequstUrl + "api/account/logs",
        data: postdata
    }).done(function (data) {
        if ("success" != data.state) { console.log(data.message); return; }
        var datalist = data.data;
        var html = [];
        for (var i = 0; i < datalist.length; i++) {
            var item = datalist[i];

            var amount = 0, after = 0;
            switch (_accounttype.toLocaleLowerCase()) {
                case "cash": amount = item.cash; after = item.after_cash; break;
                case "card": amount = item.card; after = item.after_card; break;
                case "coin": amount = item.coin; after = item.after_coin; break;
                case "pos": amount = item.pos; after = item.after_pos; break;
                case "frozen": amount = item.frozen; after = item.after_frozen; break;
                case "all": amount = parseFloat(item.cash)
                					+ parseFloat(item.card)
                					+ parseFloat(item.coin)
                					+ parseFloat(item.pos)
                					+ parseFloat(item.frozen); break;
                default: break;
            }

            var spanstyle = parseFloat(amount) > 0 ? " style='color:#008000;'" : " style='color:#C41308;'";
            var amountstr = parseFloat(amount) > 0 ? "+" : "";
            //          html.push("<p><a><span" + spanstyle + ">" + amountstr + amount + "</span>" + item.intro + "</a></p>");
            html.push("<p style='height:auto;line-height:normal;padding: 10px 0px;'>");
            html.push("<a href='javascript:void(0);'><span>" + item.created_at.substr(0, 10) + "</span><label>" + item.intro + "</label></a>");
            html.push("<a href='javascript:void(0);'><span" + spanstyle + ">" + amountstr + amount + "</span>余额：" + after + "</a>");
            html.push("</p>");
        }

        if ("append" == pendstyle) {
            // 无效加载
            if (html.length == 0) { _pagecount = _pagecount - 1; }
            $("#datalist").append($(html.join("")));
        } else {
            if (html.length == 0) { html.push("<div style='vertical-align: middle;text-align: center;padding-top: 30%;'>没有记录</div>"); }
            $("#datalist").html(html.join(""));
        }
        try { myScroll.refresh(); } catch (err) { }
        plus.nativeUI.closeWaiting();
    }).fail(function () {
        plus.nativeUI.alert(errorMessage.interface);
        $("#datalist").html("<div style='vertical-align: middle;text-align: center;padding-top: 30%;'>加载失败</div>");
    });
}

var myScroll, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset, _pagecount = 1;
function loaded() {
    pullUpEl = document.getElementById('pullUp');
    pullUpOffset = pullUpEl.offsetHeight;

    myScroll = new iScroll('wrapper', {
        useTransition: false,
        topOffset: pullDownOffset,
        onRefresh: function () {
            if (pullUpEl.className.match('loading')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '';
            }
        },
        onScrollMove: function () {
            if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
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
            if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                if (isDisplayPullUp()) {
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                    pullUpAction();
                }
            }
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

// 上滑
function pullUpAction() {
    setTimeout(function () { _pagecount = _pagecount + 1; loadIncomeList("append"); }, 1000);
}

