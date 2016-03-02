//$(function () { plusReady(); })

var _currentuser, _accounttype;
function plusReady() {
    // 获取当前用户
    _currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
    //_currentuser = { "id": 98, "name": "13019643846", "email": "", "nick": "小猪猪", "real_name": "", "avatar_id": 308, "code": "044A", "id_no": null, "id_pic1": null, "id_pic2": null, "id_pic3": null, "user_type": 2, "status": 1, "auth_status": 1, "parent_id": 2, "remark": null, "created_at": "2015-07-01 03:39:36", "updated_at": "2015-07-01 15:37:07", "token": "OTh8JDJ5JDEwJHFxTEw1Q3NFNXhGZFlhTjY3bkpTYWVGUWlqNFE4OS9VVEdxaXJYTHZFQURXTG5saUVaN1BDfDhhMjE1YjYzNWI4YWEyZjk2YTk3ODE4MGJhNTcxMjQ5", "store": { "id": 96, "user_id": 98, "pcate_id": 1, "category_id": 12, "prov_id": 31, "city_id": 383, "area_id": 3230, "dist_id": 12, "store_lng": 120.17177575863, "store_lat": 30.255947419181, "store_name": "小猪猪", "store_phone": "0571-85870359", "store_address": "上城区吴山路39号杭州湖滨银泰in77-C3区1楼", "store_license": 0, "store_pic": 97, "store_intro": "测试小店的介绍，统一显示此内容", "store_hours": "周一至周五 9:00 ~ 22:00", "store_capita": 0, "reviews": 0, "store_score": 0, "online_pay_fee": 3, "offline_pay_fee": 2, "coin_pay_fee": 15, "trade_fee": 15, "agent_fee": 0, "agent_tz_fee": 0.03, "agent_to_fee": 0.04, "is_takeaway": 1, "is_noreserve": 1, "is_refund": 1, "collectes": 0, "store_views": 151, "store_sn": null, "store_pause": 1, "deleted_at": null, "created_at": "2015-07-01 03:39:36", "updated_at": "2015-07-02 22:25:32" }, "account": { "id": 98, "user_id": 98, "used": "0.00", "all": "-86.70", "cash": "-86.70", "card": "0.00", "coin": "100.00", "pos": "0.00" }, "address": null };
    _accounttype = getUrlParam("t");

    getPageTitle();
    loadIncomeList();
}

if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

function getPageTitle() {
    var pagetitle = "";
    switch (_accounttype) {
        case "all": pagetitle = "可结算款（余额）"; break;
        case "cash": pagetitle = "平台交易额"; break;
        case "pos": pagetitle = "POS交易额"; break;
        default: break;
    }

    $("#pagetitle").text(pagetitle);
}

// 加载收支明细
function loadIncomeList(pendstyle) {
    // account all:营业总额 cash：余额账户 pos：会员卡账户
    // type takein：收入 payout：支出 all：所有

    if (!pendstyle) { _pagecount = 1; }
    var limit = 15;
    var pagecount = _pagecount;
    if ("refresh" == pendstyle) {
        pagecount = 1;
        limit = 20;
    }

	var postdata = { "userid": _currentuser.id, "token": _currentuser.token, "account": _accounttype, "type": "takein", "limit": 10, "page": _pagecount };
    console.log(JSON.stringify(postdata));
    
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

            var amount = 0;
            switch (_accounttype.toLocaleLowerCase()) {
                case "cash": amount = item.cash; break;
                case "card": amount = item.card; break;
                case "coin": amount = item.coin; break;
                case "pos": amount = item.pos; break;
                case "all": amount = parseFloat(item.cash) + parseFloat(item.card) + parseFloat(item.coin) + parseFloat(item.pos); break;
                default: break;
            }

            var spanstyle = parseFloat(amount) > 0 ? " style='color:#00bd3f;'" : "";
            var amountstr = parseFloat(amount) > 0 ? "+" : "";
            html.push("<p><a><span" + spanstyle + ">" + amountstr + amount + "</span>" + item.intro + "</a></p>");
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

    });
}

var myScroll, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset, _pagecount = 1;
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

// 下拉
function pullDownAction() {
    setTimeout(function () {
        _pagecount = 1;
        loadIncomeList("refresh");
    }, 1000);
}
// 上滑
function pullUpAction() {
    setTimeout(function () {
        _pagecount = _pagecount + 1;
        loadIncomeList("append");
    }, 1000);
}

