//$(function () { plusReady(); })

var _currentuser, _statuslist = [], _take_statuslist = [], _takeaway;
function plusReady() {
    _takeaway = getUrlParam("t");

    // 获取当前用户
    _currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
    painttab();
    paintOrderList();
    bindEvent();
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}


// 画Tab菜单
// 商家： 全部 交易中（0:未付款 1:未消费 2:待评价 ） 退款（-2:同意退款	-3:退款成功 ）
// 个人： 全部 未付款（0：未付款）  未消费（1：未消费 ） 待评价（2：待评价 ） 退款（-2：退款中 -3：已退款）
function painttab() {
    var html = '<div class="tab-wrap">';
    //商家
    if ([2, 3].indexOf(_currentuser.user_type) > -1) {
        $("#wrapper").css("top", "140px");
        html += '<div class="search-wrap">';
        html += '<span class="searchicon"><i class="search icon"></i></span>';
        html += '<input type="text" id="searchtext" placeholder="请输入订单号或者手机号" class="search-text f-l">';
        html += '<input  id="btnserach"  type="button" value="搜索"  class="search-btn f-r">';
        html += '</div>';
        html += '<div id="store_order_cate" class="tab-wrap"><table><tbody><tr>';
        html += '<th><a tip="" 		title="" class="fc-org">全部</a></th>';
        html += '<th><a tip="0|1" 		title="0">待确认</a></th>';
        html += '<th><a tip="0|1" 		title="2">配送中</a></th>';
        html += '<th><a tip="-2|-3" title="">退款</a></th>';
        html += '</tr></tbody></table></div>';
    }
    //买家
    else {
        html += '<div id="person_order_cate" class="tab-wrap"><table><tbody><tr>';
        html += '<th><a tip="" 		title="" class="fc-org" >全部</a></th>';
        html += '<th><a tip="2" 	title="">待评价</a></th>';
        html += '<th><a tip="-2|-3" title="">退款</a></th>';
        html += '</tr></tbody></table></div>';
    }
    html += "</div>";
    $("#ordermanagermenu").html(html);

    if ("2" != _currentuser.user_type) {
        $("#orderlist").prev().css("margin-top", "35px");
    }
}

var _pagecount = 1;
// 加载订单列表
function paintOrderList(paintstyle) {
    if (!paintstyle) { _pagecount = 1; }

    var pagenum = 15;
    var pagecount = _pagecount;
    if ("refresh" == paintstyle) {
        pagecount = 1;
        pagenum = 20;
    }

    var postdata = { "userid": _currentuser.id, "token": _currentuser.token, "limit": pagenum, "page": _pagecount };
    // 查询条件
    if ($("#searchtext")) {
        var searchtext = $("#searchtext").val();
        if (searchtext != "") {
            if ( isTelephone(searchtext) ) { postdata["mobile"] = searchtext; } else { postdata["ordersn"] = searchtext; }
        }
    }

    // 订单类型
    if (_takeaway) { postdata["takeaway"] = _takeaway; }

    // 订单状态
    if (_statuslist.length > 0) { postdata["status"] = _statuslist; }

	//外卖配送状态
	if(_take_statuslist.length > 0){ postdata["takestatus"] = _take_statuslist; }
    if (!paintstyle) {
        $("#orderlist").html("<div style='vertical-align: middle;text-align: center;padding-top: 40%;'>努力的加载中...</div>");
    }
    console.log(JSON.stringify(postdata));
    $.ajax({
        type: "POST",
        url: configManager.RequstUrl + "api/order/list",
        async: true,
        data: postdata
    }).done(function (data) {
        if ("success" != data.state) { console.log(data.message); return; }
        var orderlist = data.data;
        drawpage(orderlist, paintstyle);
    }).fail(function () {
        plus.nativeUI.alert(errorMessage.interface);
    });
}


function drawpage(orderlist, paintstyle) {
    var html = [];
    for (var i = 0; i < orderlist.length; i++) {
        var order = orderlist[i];
        //获取订单的主键ID,状态和支付类型
        var hiddendata = "<input id='" + order.id + "' value='" + order.payment + "' tip='" + order.status + "' type='hidden' />"
        var src;
        if( order.goods &&  0 < order.goods.length  && 0 < order.goods[0].goods_pic ){
        	src = configManager.goodsImgurl.format(order.goods[0].goods_pic, "112-79");
        }else{
        	src = configManager.storeImgurl.format(order.store_pic, "112-79");
        }

        var num = (order.goods && order.goods.length > 0) ? order.goods.length : 0;
        var statusdesc = ("2" == _currentuser.user_type) ? getShopStatusDesc(order.status) : getStatusDesc(order.status, order.payment);
        
        
        html.push("<div class='item-01-wrap'><ul class='item-01-block'>");
        html.push("<li class='img-part'><img width='75' height='53' name='imgitem'  src='../../../images/defaultpic.jpg'  data-src='" + src + "'> </li>");
        html.push("<li class='tips-part t-c'>");
        html.push("<div class='off-right-block'>" + hiddendata + "<span class='off-org-btn'>" + statusdesc + "</span></div>");
        //外卖订单配送
        html.push(getTakeawayStatus(order));
        html.push("</li>");
        html.push("<li class='text-part'>");
        html.push("<p>订单号：" + order.order_sn + "</p><p>时间：" + order.created_at.substr(0, 16) + "</p>");
        html.push("<p><span>数量：<em class='fc-green'>" + num + "</em></span> <span>总价：<em class='fc-org'>￥" + order.money + "</em></span></p>");
        //支付方式
        html.push(getPayment(order));
        html.push("</li>");
        html.push("</ul></div>");
    }

    if ("append" == paintstyle) {
        // 无效加载
        if (html.length == 0) { _pagecount = _pagecount - 1; }
        $("#orderlist").append($(html.join("")));
    } else {
        if (html.length == 0) { html.push("<div style='vertical-align: middle;text-align: center;padding-top: 40%;'>没有此类订单信息</div>"); }
        $("#orderlist").html(html.join(""));
    }
    try { myScroll.refresh(); } catch (err) { }
    $('img[name=imgitem]').lazyload();

}

//外卖订单确认，配送
function getTakeawayStatus(order){
	var str = "",cusStyle="style='font-size:0.7em'";
	if( 1 == order.is_takeaway && [0,1].indexOf(order.status) > -1 ){
		str = "<div name='div_confirm' class='off-right-block'><span {0} class='off-org-span'>{1}</span></div>";
		
		if( 0 == order.take_status && ( 1 == order.status || 0 == order.payment ) ){			
			str = ( [2,3].indexOf(_currentuser.user_type) > -1 ) ? str.format("", "待确认") : str.format(cusStyle, "等待商家确认");			
		}
		else if( 1 == order.take_status ){
			str = ( [2,3].indexOf(_currentuser.user_type) > -1 ) ? str.format("",  "待配送") : str.format(cusStyle, "美食制作中");			
		}
		else if( 2 == order.take_status ){
			str = ( [2,3].indexOf(_currentuser.user_type) > -1 ) ? str.format("", "配送中") : str.format(cusStyle, "正在配送");
		}
		else{
			str = "";
		}
	}
	return str;
}

//获取支付方式
function getPayment(order){
	var str = "";
	if( [0].indexOf(order.payment)>-1 ){
		str = "<p>支付：线下刷卡</p>";
	}
	return str;
}

// 商家订单状态描述
function getShopStatusDesc(status) {
    var desc = "";
    switch (status) {
        case 0: desc = configManager.ordertag.unpay; break;
        case 1: desc = configManager.ordertag.unconsumecode; break;
        case 2: desc = configManager.ordertag.unappraise; break;
        case 3: desc = configManager.ordertag.finish; break;
        case -1: desc = configManager.ordertag.canceled; break;
        case -2: desc = configManager.ordertag.agreerefund; break;
        case -3: desc = configManager.ordertag.refundsuccess; break;
        default: break;
    }

    return desc;
}

// 消费者订单状态描述
function getStatusDesc(status, payment) {
    var desc = "";
    switch (status) {
        case 0: desc = (payment == 0) ? configManager.ordertag.ordercode : configManager.ordertag.unpay; break;
        case 1: desc = /*(payment == 0) ? configManager.ordertag.ordercode : */configManager.ordertag.consumecode; break;
        case 2: desc = configManager.ordertag.unappraise; break;
        case 3: desc = configManager.ordertag.appraised; break;
        case -1: desc = configManager.ordertag.canceled; break;
        case -2: desc = configManager.ordertag.refunding; break;
        case -3: desc = configManager.ordertag.refundsuccess; break;
        default: break;
    }

    return desc;
}

// 绑定事件
function bindEvent() {
    // 搜索
    $("#ordermanagermenu").on("click", "#btnserach", function () {
        $("#orderlist").html("<div style='vertical-align: middle;text-align: center;padding-top: 40%;'>努力的加载中...</div>");
        // 查询
        paintOrderList();
    });	
	
    // tab切换
    $(".tab-wrap table tr th a").on("click", function () {
        // 切换样式
        $("div.tab-wrap table tr th a[class=fc-org]").removeClass("fc-org");
        $(this).addClass("fc-org");
        _statuslist = [];
        var tip = $(this).attr("tip");
        if (tip && tip != "") {
            _statuslist = tip.split("|");
        }
        _take_statuslist = [];
        var title = $(this).attr("title");
        if(title && "" != title){
        	_take_statuslist = title.split("|");
        }
        $("#orderlist").html("title");
        // 查询
        paintOrderList();
    });

    //点击整个订单
    $("#orderlist").on("click", "div>ul>li.text-part,div>ul>li.img-part", function () {
        var hidden = $(this).parent().find("input[type=hidden]");
        var id = $(hidden).attr("id");							//主键ID
        clicked("orderdetail.html?id=" + id.toString(),false,false,'slide-in-right');
    });

    //点击最后的按钮
    $("#orderlist").on("click", "div>ul>li.tips-part", function () {
        var hidden = $(this).find("input[type=hidden]");
        var id = $(hidden).attr("id");	//主键ID
        var payment = $(hidden).val();		//支付方式
        var status = $(hidden).attr("tip");//订单状态
        var nextpage = "";


        //商家，商家子帐号，这里不是扫码，所以不会确认消费
        if ([2, 3].indexOf(_currentuser.user_type) > -1) {
            switch (status) {
                case "1":								//未消费 确认消费
                case "-2": 								//退款     确认退款
                    nextpage = 'orderdetail.html'; break;
                default: break;
            }

        }
        //个人用户
        else {
            switch (status) {
                case "2": nextpage = 'appraise.html'; break; //待评价
                case "0": {
                    if ("0" == payment) { nextpage = 'finish.html'; } 			//未付款，到店刷卡，订单码
                    else { nextpage = 'orderdetail.html'; }						//未付款，线上支付，订单详情 可以完成支付
                } break;
                case "1": {
                    nextpage = 'finish.html'; 									//已付款，消费码
                } break;
                default: nextpage = 'orderdetail.html'; break;
            }
        }

        if (nextpage != "") {
            clicked(nextpage + "?id=" + id.toString());
        }

    });
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

// 下拉
function pullDownAction() {
    setTimeout(function () {
        _pagecount = 1;
        paintOrderList("refresh");
    }, 1000);
}
// 上滑
function pullUpAction() {
    setTimeout(function () {
        _pagecount = _pagecount + 1;
        paintOrderList("append");
    }, 1500);
}