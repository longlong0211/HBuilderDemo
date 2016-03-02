//$(function(){
//	plusReady();
//})
var _storeid, _storeUser = 0;
function plusReady() {
    //店铺id
    _storeid = getUrlParam("store");
    _storeUser = getUrlParam("store_user");

    //初始化页面
    InitPage();

    BindEvent();
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

//初始化页面
var _pagecount = 1;
function InitPage(paintstyle) {
    if (!paintstyle) { _pagecount = 1; }

    var pagenum = 15;
    var pagecount = _pagecount;
    if ("refresh" == paintstyle) {
        pagecount = 1;
        pagenum = 15;
    }
    var requestdata = { "store": _storeid, "limit": pagenum, "page": _pagecount };
    //console.log(JSON.stringify(requestdata));
    $.ajax({
        type: "get",
        url: configManager.RequstUrl + "api/review/list",
        async: true,
        data: requestdata
    }).done(function (data) {
        if ("fail" == data.state) { plus.nativeUI.alert(data.message); return; }
        PaintList(data.data, paintstyle);
    });
}

//
function PaintList(appars, paintstyle) {
    var html = [];
    $.each(appars, function (i, appar) {
        html.push('<div class="spxqpj">');
        html.push('<p class="spxqpjxx"><span>');
        for (var i = 0; i < 5; i++) {
            if (i < appar.score) {
                html.push('<img style="width:15px;height:15px;" src="../../../images/star-on-big.png" />');
            } else {
                html.push('<img style="width:15px;height:15px;" src="../../../images/star-off-big.png" />');
            }
        }
        var nick = appar.buyer.nick;
        if (undefined == _storeUser && 1 == appar.anonymous) { nick = "匿名"; }
        html.push('</span> ' + nick + "&nbsp;&nbsp;" + appar.created_at.substr(0, 10) + ' </p>');

        html.push('<div class="pjhf">');
        html.push('<div class="pinjnr">');
        var comments = "暂无评价";
        if (appar.comment.length > 0) { comments = appar.comment; }
        html.push('<p style="font-size:1em">' + comments + '</p>');

        if (0 < appar.pics.length) {
            html.push('<p class="spxqpjtu">');
            $.each(appar.pics, function (i, pic) {
                //var src = configManager.reviewImgurl.format(pic,"40-40");
                //放大效果
                var big_src = configManager.reviewImgurl.format(pic, "200-200");
                html.push('<img name="parse_img" data-preview-src="" alt="" src="' + big_src + '" />');
            });
            html.push('</p>');
        }

        html.push('</div>');
        if (_storeUser > 0 && null == appar.reply) {
            html.push('<div name="reply" class="pinjan"><a href="javascript:void(0);">回复</a></div>');
        }
        html.push('</div>');
        if (appar.reply) {
            html.push('<p style="font-size:1em"><label>回复：</label>' + appar.reply + '</p>');
        }
        if (_storeUser > 0 && null == appar.reply) {
            html.push('<p name="reply_content" style="display:none;"><textarea class="pjhfk" rows="2" cols="" name=""></textarea></p>');
            html.push('<p name="commit_reply" style="display:none;"  title="' + appar.id + '" class="tjplan"><a href="javascript:void(0);">提交</a></p>');
        }
        html.push('</div>');
    });

    //console.log(html.join(""));

    if ("append" == paintstyle) {
        // 无效加载
        if (html.length == 0) { _pagecount = _pagecount - 1; }
        $("#appraiselist").append($(html.join("")));
    } else {
        if (html.length == 0) { html.push("<div style='vertical-align: middle;text-align: center;padding-top: 30%;'>没有人评价</div>"); }
        $("#appraiselist").html(html.join(""));
    }
    try { myScroll.refresh(); } catch (err) { }
}

//绑定函数
function BindEvent() {
    //回复
    var t1 = null;
    $("#appraiselist").on("click", "div[name=reply]", function (event) {
        if (t1 == null) { t1 = new Date().getTime(); } else { var t2 = new Date().getTime(); if (t2 - t1 < 500) { t1 = t2; return; } else { t1 = t2; } }

        if ($(this).parent().nextAll().is(":visible")) {
            $(this).parent().nextAll().hide();
        } else {
            $(this).parent().nextAll().show();
        }
        try { myScroll.refresh(); } catch (err) { }
    });

    //回复品论
    $("#appraiselist").on("click", "p[name=commit_reply]", function () {
        _user = JSON.parse(plus.storage.getItem(storageManager.user));
        if (t1 == null) { t1 = new Date().getTime(); } else { var t2 = new Date().getTime(); if (t2 - t1 < 500) { t1 = t2; return; } else { t1 = t2; } }

        var div_reply = $(this).parent().find("div[name=reply]");
        var p_replycontent = $(this).prev();
        var p_commitreply = $(this);

        var id = $(this).attr("title");
        var reply = $(this).prev().find("textarea").val();

        var postdata = {
            "id": id,
            "userid": _user.id,
            "reply": reply,
            "token": _user.token
        };
        console.log(JSON.stringify(postdata));
        //      return false;
        $.ajax({
            type: "POST",
            url: configManager.RequstUrl + "api/review/reply",
            async: true,
            data: postdata,
            beforeSend: function () { $("#waitingupload").removeClass("heisebghid").addClass("heisebg"); }
        }).done(function (data) {
            $("#waitingupload").removeClass("heisebg").addClass("heisebghid");

            if ("fail" == data.state) { plus.nativeUI.alert(data.message); return; }
            $(p_replycontent).before('<p><label>回复：</label>' + postdata.reply + '</p>');
            $(div_reply).hide();
            $(p_replycontent).hide();
            $(p_commitreply).hide();

            //$("#reply_content,#reply_commit,#reply").hide();
        });

    });

    //点击放大图片
    //	$("#appraiselist").on("click", "img[name=parse_img]", function(){
    //      if(t1 == null) { 
    //      	t1 = new Date().getTime();
    //      }else{
    //          var t2 = new Date().getTime(); 
    //          if(t2 - t1 < 500){
    //              t1 = t2;
    //              return;
    //          }else{
    //              t1 = t2;
    //          }
    //      }
    //		var bigSrc = $(this).attr("title");
    //		console.log(bigSrc);
    //		$(this).attr("src", bigSrc);
    //	});
}


var myScroll, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset;
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
        onBeforeScrollStart: function (e) {
            var target = e.target;
            while (target.nodeType != 1) target = target.parentNode;

            if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
                e.preventDefault();
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
        InitPage("refresh");
    }, 1000);
}

// 上滑
function pullUpAction() {
    setTimeout(function () {
        _pagecount = _pagecount + 1;
        InitPage("append");
    }, 1500);
}