var _currentloginuser, _orderid,view = null;
function plusReady() {
    _orderid = getUrlParam("id");
    _currentloginuser = JSON.parse(plus.storage.getItem(storageManager.user));

    //不是商家可扫订单码
    if (-1 == ([2, 3].indexOf(_currentloginuser.user_type))) {
        plus.nativeUI.alert("您不是商家不可扫码！"); back(); return;
    }

    // 初始化页面
    PaintPage();
    // 绑定方法
    BindEvent();
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

function PaintPage() {
    $.ajax({
        type: "POST",
        url: configManager.RequstUrl + "api/order/info",
        async: true,
        data: { "userid": _currentloginuser.id, "token": _currentloginuser.token, "orderid": _orderid },
        beforeSend:function(){ view = plus.nativeUI.showWaiting(); }
    }).done(function (data) {
    	plus.nativeUI.closeWaiting();
        if ("success" != data.state) {
            console.log(data.message);
            plus.ui.alert(data.message, function () { plus.webview.currentWebview().close(); }, configManager.alerttip, configManager.alertCtip);
            return;
        }

        var order = data.data;
        var html = [];
        //订单图片
        html.push("<div class='item-02-wrap t-c'><img src='' id='orderbarcode' width='168' height='168' /><p class='mt10'>订单号码：" + order.order_sn + "&nbsp; &nbsp;&nbsp;&nbsp;订单金额:" + order.money + "</p></div>");

        //订单状态
        var moneytips = "本单未付金额:" + order.money;
        var classname = 'off-org-block';
        if ((0 == order.payment) && (1 < order.status)) {
            moneytips = "您已经支付金额";
            classname = 'off-green-block';
        }
        else if (0 < order.status) {
            moneytips = "您已经支付金额";
            classname = 'off-green-block';
        }

        html.push("<div class='item-02-wrap t-c'><span class='" + classname + "'>" + moneytips + "</span></div>");

        //订单商品
        html.push('<div class="table-list-wrap"><table><tbody><tr> <th width="50%">项目名称</th><th>数量</th><th>单价</th></tr>');
        $.each(order.goods, function (i, goods) {
            html.push('<tr><td>' + goods.goods_title + '</td><td>' + goods.quantity + '</td><td>' + goods.goods_price + '</td></tr>')
        });
        html.push('</tbody></table></div>');

        html.push("<div id='confirmresume' class='item-02-wrap'><p class='dlan'><a>确认消费</a></p></div>");

        $("#content").html(html.join(""));

        //商家点击确认消费 
        $("#content").on("click", "#confirmresume", function () {
        	console.log(JSON.stringify("order.status:" + order.status + "  order.payment:" + order.payment));
            //确认消费条件 线上支付且已付款或线下刷卡 (0 == order.payment && 0 == order.status) || (0 < order.payment && 1 == order.status)
            if ( (0 < order.payment && 1 == order.status) || 
            	(0 == order.payment && [0,1].indexOf( order.status ) > -1) ) {
                var postdata = { "userid": _currentloginuser.id, "token": _currentloginuser.token, "order": _orderid };
                console.log(JSON.stringify(postdata));
                $.ajax({
                    type: "POST",
                    url: configManager.RequstUrl + "api/store/orderdone",
                    async: true,
                    data: postdata,
                    beforeSend:function(){ view = plus.nativeUI.showWaiting(); }
                }).done(function (data) {
                	plus.nativeUI.closeWaiting();
                    if ("success" == data.state) {
                        plus.ui.alert(data.message, function () {
                            plus.webview.currentWebview().close();
                        }, configManager.alerttip, configManager.alertCtip);
                    } else {
                        plus.ui.alert(data.message, function () { }, configManager.alerttip, configManager.alertCtip);
                    }
                }).fail(function(){
                	plus.nativeUI.toast("确认失败！");
                });
            } else {
                plus.ui.alert("订单未完成支付或者已经确认", function () { }, configManager.alerttip, configManager.alertCtip);
            }
        });

        getOrderBarCode();
    });
}

function BindEvent() {
    // 回退
    $("#back").on("click", function () {
        var mainview = plus.webview.getWebviewById(pageName.main);
        mainview.evalJS("gohome()");
    });

    
}

function getOrderBarCode() {
    $.ajax({
        type: 'Get',
        url: configManager.RequstUrl + 'api/common/qrcode?type=order&order=' + _orderid
    }).done(function (data) {
        if (data.state != "success") {
            console.log(data.message);
            return;
        }
        $("#orderbarcode").attr("src", data.uri);
    });
}