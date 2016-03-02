//$(function () { plusReady(); })

var _currentuser;
function plusReady() {
    // 获取当前用户
    _currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
    loadSubAccountList();
    BindEvent();
}

if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}
// 加载商家子账号列表
function loadSubAccountList(pendstyle) {
    if (!pendstyle) { generatedCount = 1; }
    var pagenum = 10;
    var pagecount = generatedCount;
    if ("refresh" == pendstyle) {
        pagecount = 1;
        pagenum = 20
    }
    var searchtext = $("#searchtext").val();
    var postdata = { "userid": _currentuser.id, "token": _currentuser.token, "limit": pagenum, "page": pagecount };
    if (searchtext && !isNaN(searchtext)) { postdata["mobile"] = searchtext; } else { postdata["name"] = searchtext; }
    $.ajax({
        type: "POST",
        async: true,
        url: configManager.RequstUrl + "api/agent/sublist",
        data: postdata
    }).done(function (data) {
        if ("success" != data.state) { console.log(data.message); return; }
        var acc = data.data;
        var sublist = acc.list;

        $("#accountnum").text(acc.subcount);
        $("#shopnum").text(acc.storecount);
        $("#cashnum").text(acc.moneycount);
        $("#paynum").text(acc.cashcount);

        var html = [];
        for (var i = 0; i < sublist.length; i++) {
            var subaccount = sublist[i];
            var status = subaccount.status == 1 ? "<span class='off-org-block'>开启</span>" : "<span class='off-gray-block'>禁用</span>";
            html.push("<div class='item-01-wrap'><ul class='item-01-block'>");
            html.push("<li class='img-part2'> <img src='" + configManager.avatarImgurl.format(subaccount.avatar_id, "50-50") + "' width='50' height='50'>  <p>" + subaccount.nick + "</p></li>");
            html.push("<li class='tips-part t-c '><div class='off-right-block' name='btnoperat' tip='" + subaccount.id + "'>" + status + "</div></li>");
            html.push("<li class='text-part-70'><p>手机号：" + subaccount.name + "</p><p>发展店铺：" + subaccount.count.storecount + "家</p>");
            html.push("<p>店铺营业额：" + subaccount.count.moneycount + "元</p><p>支付收益：" + subaccount.count.cashcount + "元</p></li></ul></div>");
        }

        if ("append" == pendstyle) {
            // 无效加载
            if (html.length == 0) { generatedCount = generatedCount - 1; }
            $("#subaccountlist").append($(html.join("")));
        } else {
            if (html.length == 0) { html.push("<div style='vertical-align: middle;text-align: center;padding-top: 30%;'>没有子账号信息</div>"); }
            $("#subaccountlist").html(html.join(""));
        }
        try { myScroll.refresh(); } catch (err) { }


        // 开启、禁用子账号
        $("div[name=btnoperat]").on("click", function () {
            // 子账号ID
            var subitem = $(this);
            var subaccountid = subitem.attr("tip");
            $.ajax({
                type: "POST",
                async: true,
                url: configManager.RequstUrl + "api/agent/switchsub",
                data: { "userid": _currentuser.id, "token": _currentuser.token, "sub": subaccountid }
            }).done(function (data) {
                if ("success" != data.state) { alert(data.message); return; }
                // 开启成功
                var btnstyle = data.data.status == 1 ? "<span class='off-org-block'>开启</span>" : "<span class='off-gray-block'>禁用</span>";
                subitem.html(btnstyle);
            });
        });


    }).fail(function () {
        plus.nativeUI.alert(errorMessage.interface);
    });
}

// 绑定方法
function BindEvent() {
    // 添加
    $("#addsubaccount").on("click", function () {
        clicked('add.html?type=a', false, false, 'slide-in-right');
    });

    // 搜索
    $("#btnsearch").on("click", function () {
        loadSubAccountList();
    });
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
        generatedCount = 1;
        loadSubAccountList("refresh");
    }, 1500);
}
// 上滑
function pullUpAction() {
    setTimeout(function () {
        generatedCount = generatedCount + 1;
        loadSubAccountList("append");
    }, 1500);
}


