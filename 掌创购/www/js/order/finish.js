//$(function () { plusReady();})
var _currentloginuser = null; var _orderinfo = null;
function plusReady() {
    //显示消费信息
    var id = getUrlParam("id");
    _currentloginuser = JSON.parse(plus.storage.getItem(storageManager.user));

    PaintPage(id);

    // 绑定方法
    BindEvent();
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

function PaintPage(id) {
    plus.nativeUI.showWaiting();
    $.ajax({
        type: "POST",
        url: configManager.RequstUrl + "api/order/info",
        async: true,
        data: { "userid": _currentloginuser.id, "token": _currentloginuser.token, "orderid": id }
    }).done(function (data) {
        if ("success" == data.state) {
            var order = data.data;
            var avaiableCoin = caculateAvaiableCoin(order);
            _orderinfo = order;

            var html = [];
            //订单图片
            html.push("<div class='item-02-wrap t-c'><img src='' id='orderbarcode' width='168px' height='168px' />");
            html.push("<p class='mt10'>订单号：" + order.order_sn + "&nbsp;金额:" + order.money + "&nbsp;可获金币: " + avaiableCoin + " </p>");
            html.push("</div>");

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

            if (order.goods && order.goods.length > 0) {
                //订单商品
                html.push('<div class="table-list-wrap"><table><tbody><tr> <th width="50%">项目名称</th><th>数量</th><th>单价</th></tr>');
                $.each(order.goods, function (i, goods) {
                    html.push('<tr><td>' + goods.goods_title + '</td><td>' + goods.quantity + '</td><td>' + goods.goods_price + '</td></tr>')
                });
                html.push('</tbody></table></div>');
            }
            $("#orderInfo").html(html.join(""));
            $.ajax({
                type: 'Get',
                url: configManager.RequstUrl + 'api/common/qrcode?type=order&hasbase=1&order=' + order.id
            }).done(function (data) {
                if (data.state != "success") {
                    console.log(data.message);
                    return;
                }
                $("#orderbarcode").attr("src", data.base64);
            });

            if (_orderinfo.is_takeaway == 1) {
                // 发送消息通知商家
                sendSms();
            }
        }
        else {
            plus.ui.alert(data.message, function () { }, configManager.alerttip, configManager.alertCtip);
        }
        plus.nativeUI.closeWaiting();
    });
}

function BindEvent() {
    //清除临时订单和购物车中的商品
    clearCachedCart();

    // 保存到相册
    $("#savepic").on("click", function () {
        plus.nativeUI.showWaiting("  保存中...  ");
        // 调用html2canvas生成截图
        html2canvas($("#orderInfo")[0], {
            allowTaint: true,
            taintTest: false,
            onrendered: function (canvas) {
                canvas.id = "mycanvas";
                var dataUrl = canvas.toDataURL("image/png", 1);
                // 调用接口解码，获取图片
                getimgByBase64(dataUrl);
            }
        });

    });

    // 回退
    $("#back").on("click", function () {
        plus.webview.currentWebview().close();
        var mainview = plus.webview.getWebviewById(pageName.main);
        mainview.evalJS("gohome()");
    });
}

// Base64生成图片
function getimgByBase64(base64code) {
    var bitmap = new plus.nativeObj.Bitmap("test");
    // 从本地加载Bitmap图片
    bitmap.loadBase64Data(base64code, function () {
        bitmap.save("_doc/orderscreen.png", { overwrite: true, quality: 100 }, function (i) {
            var filepath = plus.io.convertLocalFileSystemURL("_doc/orderscreen.png");
            // 保存相册
            plus.gallery.save(filepath);
            plus.nativeUI.closeWaiting();
            bitmap.clear();
            plus.nativeUI.toast("保存成功");
        }, function () {
            plus.nativeUI.closeWaiting();
        });

    }, function (e) {
        bitmap.clear();
        plus.nativeUI.closeWaiting();
        console.log('加载图片失败：' + JSON.stringify(e));
    });
}

function saveGallery(url) {
    var dtask = plus.downloader.createDownload(url, {}, function (d, status) {
        // 下载完成
        if (status == 200) {
            var filepath = plus.io.convertLocalFileSystemURL(d.filename);
            // 保存相册
            plus.gallery.save(filepath);
            plus.nativeUI.toast("保存成功");
            // 删除
            plus.io.resolveLocalFileSystemURL(filepath, function (entry) {
                entry.remove(function (e) { }, function (e) { });
            }, function (e) { });

        } else {
            plus.nativeUI.alert("Download failed: " + status);
        }

        plus.nativeUI.closeWaiting();
    });
    //dtask.addEventListener( "statechanged", onStateChanged, false );
    dtask.start();
}

//删除购物车中的当前商品，临时订单
function clearCachedCart() {
    // 清空购物车当前商品
    var mycart = JSON.parse(plus.storage.getItem(storageManager.cart));
    var tempmycart = [];
    // 如果不是本商店商品，清空购物车
    //	console.log(JSON.stringify(mycart));

    for (var i = 0; (mycart > 0) && (i < mycart.length) ; i++) {
        var goods = mycart[i];
        if (goods && !goods.selected) {
            tempmycart.push(goods);
        }
    }

    plus.storage.setItem(storageManager.cart, JSON.stringify(tempmycart));
    //清除临时订单
    plus.storage.removeItem(storageManager.temporder);

}

//计算可获得的金币数量
function caculateAvaiableCoin(order) {
    //  console.log(JSON.stringify(order));
    var availablecoin = 0;
    var coin = order.pay_coin;
    var total = order.money;
    var coin_pay_fee = order.seller.store.coin_pay_fee;
    var online_pay_fee = order.seller.store.online_pay_fee;
    var offline_pay_fee = order.seller.store.offline_pay_fee;

    //	console.log("coin=" + coin);
    //	console.log("total=" + total);
    //	console.log("coin_pay_fee=" + coin_pay_fee);
    //	console.log("online_pay_fee=" + online_pay_fee);
    //	console.log("offline_pay_fee=" + offline_pay_fee);

    switch (order.payment) {
        case 5:	//微信
        case 1: //余额支付
            availablecoin = (order.pay_coin * order.seller.store.coin_pay_fee) / configManager.coinrate + (total * order.seller.store.online_pay_fee * 100) / 100;
            break;
        case 0:
            availablecoin = (order.pay_coin * order.seller.store.coin_pay_fee) / configManager.coinrate + (total * order.seller.store.offline_pay_fee * 100) / 100;
            break;
        default:
            break;
    }
    //	console.log("availablecoin="+availablecoin);
    return Math.round(availablecoin);
}

// 发送短信
function sendSms() {
    var nick = _orderinfo.buyer.nick ? _orderinfo.buyer.nick : "";
    var message = smsMessage.commit.format(_orderinfo.order_sn, nick, _orderinfo.buyer.name);
    $.ajax({
        type: "POST",
        url: configManager.RequstUrl + "api/common/sms",
        async: true,
        data: { "userid": _currentloginuser.id, "token": _currentloginuser.token, "mobile": _orderinfo.store_mobile, "message": message }
    }).done(function (data) {
        if ("success" != data.state) {
            console.log(data.message);
            plus.nativeUI.alert("短信通知商家失败，请电话联系商家！")
        }
    });
}