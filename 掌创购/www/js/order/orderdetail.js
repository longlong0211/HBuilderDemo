//$(function () { plusReady(); });

var _currentuser, _orderinfo = null;
function plusReady() {
    //初始化页面
    var id = getUrlParam("id");	//订单号

    // 获取当前用户
    _currentuser = JSON.parse(plus.storage.getItem(storageManager.user));

    PaintPage(id);
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

//初始化页面
function PaintPage(id) {
    var postdata = { "userid": _currentuser.id, "token": _currentuser.token, "orderid": id };
    //console.log( JSON.stringify( postdata ) );
    $.ajax({
        type: "POST",
        url: configManager.RequstUrl + "api/order/info",
        async: true,
        data: postdata,
        beforeSend:function(){ plus.nativeUI.showWaiting(); }
    }).done(function (data) {
    	plus.nativeUI.closeWaiting();
        if ("success" == data.state) {
            _orderinfo = data.data;

            //如果是商家，判断是否自己的订单
            if (([2, 3].indexOf(_currentuser.user_type) > -1) && _orderinfo.seller.code != _currentuser.code) {
                plus.nativeUI.alert("不是本店订单，不允许操作！"); back(); return;
            }
            Render(_orderinfo);
            SetOrderStatus(_orderinfo);
            BindEvent(_orderinfo);
        }
        else {
            plus.ui.alert(data.message, function () { }, configManager.alerttip, configManager.alertCtip);
        }
    });
}

// 订单详情页面
function Render(order) {
    var html = [];
	//console.log(JSON.stringify(order));
    html.push('<div class="sjxqbkbg">');
    var src = '';
    $.each(order.goods, function (i, goods) {
        src = (0==goods.goods_pic) ? configManager.storeImgurl.format(order.seller.store.store_pic, "") : configManager.goodsImgurl.format(goods.goods_pic, "");
        html.push('<dl style="font-size:1.2em;" class="dlsdlmx"><dt style="width:15%;"><a><img style="width:50px;height:50px" src="' + src + '" /></a></dt><dd>' + goods.goods_title + '</dd><dd>单价：<b>¥' + goods.goods_price + '元</b><dd>数量：<b>' + goods.quantity + '</b></dd>');
        if ([2, 3].indexOf(goods.goods_type) > -1) {
            html.push('<dd><span><a name="imagetext" tip="' + goods.goods_id + '">查看图文详情</a></span></dd>');
        }
        html.push('</dl>');
    });
    if (1 == order.is_groupbuy) {
        html.push('<p class="sjxqsst"><span><b><img src="../../../images/sjxqtu4.png" /></b>支持随时退</span><span><b><img src="../../../images/sjxqtu5.png" /></b>支持过期退</span></p></div>');
    }
    html.push('<div class="grxinxis ddxqym"><p class="sjxqmdkxyh">');
    html.push('<span id="orderspan" tip=""><a style="width:auto">申请退款</a></span>');
    //线上支付，未付款可以退款同时可以取消
    html.push('<span id="cancelspan" tip="2" style="display:none"><a style="width:auto">取消</a></span>');
    html.push('<font style="font-size:0.7em;margin-left:0px">订单号：' + order.order_sn + '</font>');
    html.push('</p></div>');

    html.push('<div class="sjxqbkbg sjxqckxq"><h2>订单详情</h2><p><b>应付：</b><span id="money">' + order.money + '</span>元</p><p>');
    html.push('<b>总价：</b><span>' + order.amount + '</span>元');
    if(1 == order.is_discount){ html.push("<span style='font-size: 0.7em;padding-left:2px;color:#ff6633;'>" + order.discount.discount + "折</span>"  ); }
    html.push('</p>');
    var address = (1 == order.is_takeaway) ? '<p><b>配送地址：</b><span id="address">' + order.address + '</span></p>' : '';
    html.push('<p><b>购买手机号：</b>' + order.buyer.name + '</p><p><b>下单时间：</b>' + order.created_at + '</p>' + address + '</div>');

    html.push('<div class="sjxqbkbg sjxqckxq"><h2>商家信息</h2><p><span>' + order.seller.store.store_name + '</span></p><p><b>电话：</b><span>' + order.seller.name + '</span></p><p><b>地址：</b><span>' + order.seller.store.store_address + '</span></p></div>')
    if (1 == order.is_groupbuy || 1 == order.is_presell) {
        html.push('<div class="sjxqbkbg sjxqckxq"><h2>购买须知</h2><p><b class="zcd"></b>' + order.goods[0].goods_notice + '</p></div>');
        html.push('<div class="sjxqbkbg sjxqckxq"><h2>本单详情</h2>');
        html.push('<p><b class="zcd"></b>' + order.goods[0].goods_content + '</p>');
        html.push('</div>');
    }

    html.push('</div>');

    $("#orderdetail").html(html.join(""));
}

//绑定事件
function BindEvent() {
    // 订单操作
    $("#orderdetail").on("click", "#orderspan,#cancelspan", function () {
        var tip = $(this).attr("tip");
        console.log(tip);
        switch (tip) {
            // 付款
            case _orderStatus.pay: payOrder(); break;
                // 退款
            case _orderStatus.refund: refundOrder(); break;
                // 取消
            case _orderStatus.cancel: cancelOrder(); break;
                // 同意退款
            case _orderStatus.confirmRefund: confirmRefund(); break;
                // 确认外卖订单
            case _orderStatus.confirmTakeaway: confirmTakeaway(); break;
                // 配送外卖订单
            case _orderStatus.deliveryTakeaway: deliveryTakeaway(); break;
            //提交评价
            case _orderStatus.unappraise:{ clicked("appraise.html?id=" + _orderinfo.id  ); } break;
            default: break;
        }
    });


    //点击图文详情
    $("#orderdetail").on("click", "a[name=imagetext]", function () {
        var page = "../goods/imagetext.html?goodsid=" + $(this).attr('tip');
        clicked(page, false, false, "slide-in-right");
    });

    // 后退
    $("#back").on("click", function () {
        plus.webview.currentWebview().close();
    });
}

// 订单操作
function SetOrderStatus(order) {
    //预购商品不能退款
    var ispresellorder = false;
    if (order.goods && order.goods.count > 0) {
        $.each(order.goods, function (i, goods) { if (goods.goods_type == 2) { ispresellorder = true; return; } });
    }
    //普通用户
    if ([1, 4, 5].indexOf(_currentuser.user_type) > -1) {
        //线上支付
        if (0 != order.payment) {
            //未付款可以点击支付，可以点击取消
            if (0 == order.status) {
                $("#orderspan a").text("付款");
                $("#orderspan").attr('tip', _orderStatus.pay);
                $("#cancelspan").show();
            }
            //已付款可以点击申请退款
            else if (1 == order.status && !ispresellorder) {
                $("#orderspan a").text("退款");
                $("#orderspan").attr('tip', _orderStatus.refund);
            }
            else {
                showOrderStatus(order.status);
            }
        }
        //到店刷卡
        else {
            //未付款可以取消
            if (0 == order.status) {
                $("#orderspan a").text("取消");
                $("#orderspan").attr('tip', _orderStatus.cancel);
            }
            //已付款可以申请退款
            else if (1 == order.status) {
                if (!ispresellorder) {
                    $("#orderspan a").text("退款");
                    $("#orderspan").attr('tip', _orderStatus.refund);
                }
            }            
            else {
                //$("#orderspan").remove();
                showOrderStatus(order.status);
            }
        }

        //已确认消费可以点击进入评价
        if (2 == order.status) {
            $("#orderspan a").text("待评价");
            console.log(_orderStatus.unappraise);
            $("#orderspan").attr('tip', _orderStatus.unappraise);
        }        
    }
    //商家和商家子帐号
    else if ([2, 3].indexOf(_currentuser.user_type) > -1) {
        //退款
        if ([-2].indexOf(order.status) > -1) {
            $("#orderspan a").text("同意退款");
            $("#orderspan").attr('tip', _orderStatus.confirmRefund);
        }
        //      else if( 1 == order.status || ( 0 == order.payment && 0 == order.status ) ){//确认消费
        //          $("#money").css({"color":"#C41308", "font-size":"1.3em"}); 
        //          $("#orderspan a").text("确认消费");
        //          $("#orderspan").on("click", function () {
        //          	confirmResume();
        //          });
        //      }
        //外卖订单，同意接单
        else if (1 == order.is_takeaway && 0 == order.take_status && (1 == order.status || 0 == order.payment)) {
            $("#money").css({ "color": "#C41308", "font-size": "1.3em" });
            $("#orderspan a").text("确认接单");
            $("#orderspan").attr('tip', _orderStatus.confirmTakeaway);
        }
        //外卖订单，配送
        else if (1 == order.is_takeaway && 1 == order.take_status) {
            $("#money").css({ "color": "#C41308", "font-size": "1.3em" });
            $("#orderspan a").text("配送");
            $("#orderspan").attr('tip', _orderStatus.deliveryTakeaway);
        }
        else {
            showOrderStatus(order.status);
        }
    }
    //其他
    else {
        showOrderStatus(order.status);
    }

}


// 普通用户 线上支付 支付订单
function payOrder() {
    //构造一个临时订单跳转到支付界面

    //	//				console.log("更新前" + JSON.stringify(temporder) );
    //	temporder.id 		= data.data.id;
    //	temporder.amount	= postorder.amount;
    //	temporder.discount	= parseFloat($("#discount").text());
    //	temporder.total		= parseFloat($("#totalprice").text());
    //	temporder.storeid	= postorder.store;
    //	temporder.coin		= postorder.coin;	
    //	
    //	
    //  var currentgoods = {
    //      "id"		: goodinfo.id,
    //      "storeid"	: goodinfo.store.id,
    //      "title"		: goodinfo.title,
    //      "price"		: goodinfo.price,
    //      "pic"		: goodinfo.pic,
    //      "count"		: 1,
    //      "selected"	: true
    //  };

    var temporder = {};
    //商品
    temporder.goods = [];
    $.each(_orderinfo.goods, function (i, goods) {

        temporder.goods.push({
            "id": goods.id,
            "storeid": goods.store_id,
            "title": goods.goods_title,
            "price": goods.goods_price,
            "pic": goods.goods_pic,
            "count": goods.quantity,
            "selected": true
        });
    });
    temporder.id = _orderinfo.id;
    temporder.amount = _orderinfo.amount;
    temporder.discount = _orderinfo.pay_coin / configManager.coinrate;
    temporder.total = _orderinfo.amount - temporder.discount;
    temporder.storeid = _orderinfo.store_id;
    temporder.coin = _orderinfo.pay_coin;
    plus.storage.setItem(storageManager.temporder, JSON.stringify(temporder));
    //直接支付
    //console.log("temporder:" + JSON.stringify(temporder));
    clicked('paytype.html');
}

// 普通用户 未付款 取消订单
function cancelOrder() {
    plus.nativeUI.showWaiting();
    var postdata = { "userid": _currentuser.id, "order": _orderinfo.id, "token": _currentuser.token };
    $.ajax({
        type: "POST",
        url: configManager.RequstUrl + "api/order/cancel",
        async: true,
        data: postdata
    }).done(function (data) {
        if ("success" == data.state) {
            plus.ui.alert(data.message, function () { clicked('order.html') }, configManager.alerttip, configManager.alertCtip);
        } else {
            plus.ui.alert(data.message, function () { }, configManager.alerttip, configManager.alertCtip);
        }
    }).always(function () {
        plus.nativeUI.closeWaiting();
    });

}

// 普通用户 线上支付 申请退款
function refundOrder() {
    plus.nativeUI.showWaiting();
    var postdata = { "userid": _currentuser.id, "token": _currentuser.token, "order": _orderinfo.id };
    $.ajax({
        type: "POST",
        url: configManager.RequstUrl + "api/order/refund",
        async: true,
        data: postdata,
        beforeSend: function () { $("#waitingupload").removeClass("heisebghid").addClass("heisebg"); }
    }).done(function (data) {
        if ("success" == data.state) {
            plus.ui.alert(data.message, function () { clicked('order.html') }, configManager.alerttip, configManager.alertCtip);
        } else {
            plus.ui.alert(data.message, function () { }, configManager.alerttip, configManager.alertCtip);
        }
    }).always(function () {
        plus.nativeUI.closeWaiting();
    });
}

// 商家确认退款
function confirmRefund() {
    plus.nativeUI.showWaiting();
    var postdata = { "userid": _currentuser.id, "token": _currentuser.token, "order": _orderinfo.id };
    $.ajax({
        type: "POST",
        url: configManager.RequstUrl + "api/store/orderrefund",
        async: true,
        data: postdata
    }).done(function (data) {
        if ("success" == data.state) {
            plus.ui.alert(data.message, function () { clicked('order.html') }, configManager.alerttip, configManager.alertCtip);
        } else {
            plus.ui.alert(data.message, function () { }, configManager.alerttip, configManager.alertCtip);
        }
    }).always(function () {
        plus.nativeUI.closeWaiting();
    });

}

// 商家确认消费
function confirmResume() {
    plus.nativeUI.showWaiting();
    var postdata = { "userid": _currentuser.id, "token": _currentuser.token, "order": _orderinfo.id };
    $.ajax({
        type: "POST",
        url: configManager.RequstUrl + "api/store/orderdone",
        async: true,
        data: postdata
    }).done(function (data) {
        if ("success" == data.state) {
            plus.ui.alert(data.message, function () { }, configManager.alerttip, configManager.alertCtip);
        } else {
            plus.ui.alert(data.message, function () { }, configManager.alerttip, configManager.alertCtip);
        }
    }).always(function () {
        plus.nativeUI.closeWaiting();
    });
}

// 商家确认接单（外卖订单）
function confirmTakeaway() {
    plus.nativeUI.showWaiting();
    var postdata = { "userid": _currentuser.id, "token": _currentuser.token, "order": _orderinfo.id };
    $.ajax({
        type: "POST",
        url: configManager.RequstUrl + "api/store/orderconfirm",
        async: true,
        data: postdata
    }).done(function (data) {
        if ("success" == data.state) {
            // 发送确认短信
            sendSms(true);
            reloadOrderStatus();
        }
        plus.ui.alert(data.message, function () { }, configManager.alerttip, configManager.alertCtip);
    }).always(function () {
        plus.nativeUI.closeWaiting();
    });
}

// 商家配送（外卖订单）
function deliveryTakeaway() {
    plus.nativeUI.showWaiting();
    var postdata = { "order": _orderinfo.id, "userid": _currentuser.id, "token": _currentuser.token };
    $.ajax({
        type: "POST",
        url: configManager.RequstUrl + "api/store/ordertake",
        async: true,
        data: postdata
    }).done(function (data) {
        if ("success" == data.state) {
            // 发送配送短信
            sendSms(false);
            reloadOrderStatus();
        }

        plus.ui.alert(data.message, function () { }, configManager.alerttip, configManager.alertCtip);
    }).always(function () {
        plus.nativeUI.closeWaiting();
    });

}

// 显示订单状态
function showOrderStatus(status) {
    switch (status) {
        case -3: //
            $("#orderspan").html("已退款");
            break;
        case -2:
            $("#orderspan").html("退款中");
            break;
        case -1:
            $("#orderspan").html("已取消");
            break;
        case 0:
            $("#orderspan").html("未付款");
            $("#money").css({ "color": "#C41308", "font-size": "1.3em" });
            break;
        case 1:
            $("#orderspan").html("未消费");
            $("#money").css({ "color": "#04AD5F", "font-size": "1.3em" });
            break;
        case 2:
            $("#money").css({ "color": "#04AD5F", "font-size": "1.3em" });
            $("#orderspan").html("待评价");
            break;
        case 3:
            $("#money").css({ "color": "#04AD5F", "font-size": "1.3em" });
            $("#orderspan").html("已完成");
            break;
        default:
            break;
    }
}

// 发送短信
function sendSms(isconfirm) {
    var message = "";
    var storename = _orderinfo.seller.store.store_name ? _orderinfo.seller.store.store_name : "";
    var storemobile = _orderinfo.store_mobile ? _orderinfo.store_mobile : "";
    if (isconfirm) {
        message = smsMessage.confirm.format(_orderinfo.order_sn, storename, storemobile);
    } else {
        message = smsMessage.haveDelivery.format(_orderinfo.order_sn, storename, storemobile);
    }
    $.ajax({
        type: "POST",
        url: configManager.RequstUrl + "api/common/sms",
        async: true,
        data: { "userid": _currentuser.id, "token": _currentuser.token, "mobile": _orderinfo.buyer.name, "message": message }
    }).done(function (data) {
        if ("success" != data.state) {
            console.log(data.message);
            plus.nativeUI.alert("短信通知商家失败，请电话联系商家！")
        }
    });
}

// 订单状态
var _orderStatus = {
    "pay": "0",
    "refund": "1",
    "cancel": "2",
    "confirmRefund": "3",
    "confirmTakeaway": "4",
    "deliveryTakeaway": "5",
    "unappraise":"6"
}

// 重新获取订单状态
function reloadOrderStatus() {
    var postdata = { "userid": _currentuser.id, "token": _currentuser.token, "orderid": _orderinfo.id };
    console.log(postdata);
    $.ajax({
        type: "POST",
        url: configManager.RequstUrl + "api/order/info",
        async: true,
        data: postdata
    }).done(function (data) {
        if ("success" == data.state) {
            _orderinfo = data.data;
            SetOrderStatus(_orderinfo);
        }

    });
}