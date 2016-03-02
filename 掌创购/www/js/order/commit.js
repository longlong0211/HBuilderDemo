var currentloginuser
function plusReady() {
    currentloginuser = userLogin();

    // 判断商品类型（购物车、立即购买），type=c:购物车商品 t:立即抢购
    var ordertype = (undefined == getUrlParam("type")) ? "t" : "c";
    //	console.log(JSON.stringify(currentloginuser));  
    //初始化页面并返回当前的商品
    var mycart = init(ordertype);

    //绑定事件 ， 调整金币，提交订单
    bind(ordertype, mycart);

}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

//初始化页面
function init(ordertype) {
    //	console.log(ordertype);
    var mycart;
    if (ordertype == "c") {
        //从购物车选择商品购买，可能有多个商品
        mycart = JSON.parse(plus.storage.getItem(storageManager.cart));
        //console.log(JSON.stringify(mycart));
        PaintNormalGoods(mycart, currentloginuser);
    } else {
        //立即购买，只有一个商品
        temporder = JSON.parse(plus.storage.getItem(storageManager.temporder));
        //temporder = {"goods":[{"id":1,"storeid":5,"title":"衣服","price":"15.00","pic":134,"count":1,"selected":true}]};
        PaintGroupGoods(temporder, currentloginuser);
    }
    return mycart;
}

//绑定事件 ， 调整金币，提交订单
function bind(ordertype, mycart) {
    //	console.log(JSON.stringify(currentloginuser));
    $("#user_mobile").text(currentloginuser.name);
    $("#validcoin").text(parseInt(currentloginuser.account.coin));
    // 可用金币
    var validcoin = parseInt(currentloginuser.account.coin);
    //小计
    var subtotal = 0;
    $.each($(".subtotal"), function (i, sub) {
        subtotal += parseFloat($(this).text());
    });
    //金币折扣
    $("#coin").on("keyup", function () {
        var uscoin = parseFloat($(this).val().trim());
        if ("" == $(this).val().trim()) { uscoin = 0; }
        else if (!is_integer($(this).val().trim())) { $(this).val(0); uscoin = 0; }

        //console.log( "dis:" + (uscoin/configManager.coinrate)  );
        //		console.log( "subtotal:" + subtotal );
        //输入金币个数抵用的钱大于小计总和
        if ((uscoin / configManager.coinrate) >= subtotal) {
            $(this).val(subtotal * configManager.coinrate);
            //return false;
        }
        if (uscoin > validcoin) {
            $(this).val(validcoin);
        }

        if (ordertype == "c") {
            calcPrice(mycart);
        } else {
            calcGroupPrice();
        }

    }).on("change", function () {
        var uscoin = parseInt($("#coin").val().trim());
        if (uscoin > validcoin) {
            plus.ui.alert("金币数不足", function () { }, configManager.alerttip, configManager.alertCtip);
            return;
        }
    });

    //提交订单
    $("#commitorder").on("click", function () {

        //商家，商家子帐号，代理子帐号，不能购买商品
        if (2 == currentloginuser.user_type ||
    		3 == currentloginuser.user_type ||
    		5 == currentloginuser.user_type) {
            plus.ui.alert("帐号不能购买商品", function () { }, configManager.alerttip, configManager.alertCtip);
            return false;
        }

        if ("" != $("#coin").val() && !is_integer($("#coin").val().trim())) {
            plus.ui.alert("请输入正确的金币格式", function () { }, configManager.alerttip, configManager.alertCtip);
            return;
        }

        var uscoin = parseInt($("#coin").val().trim());
        if (uscoin > validcoin) {
            plus.ui.alert("金币数不足", function () { }, configManager.alerttip, configManager.alertCtip);
            return;
        }

        //到店消费
        var is_takeaway = 0;
        var address = "";
        var is_instore = $("input[name=is_instore]:checked").val();
        var desktop = $("#desktop").val();
        var store_is_takeaway = $("#hid_is_takeaway").val();
        if ("0" == is_instore && "1" == store_is_takeaway) {
            if ("" == $("#address").val().trim()) {
                plus.ui.alert("请填写收货地址", function () { }, configManager.alerttip, configManager.alertCtip);
                return false;
            } else {
                address = $("#address").val().trim();
                is_takeaway = 1;
            }
        }

        var storeid = 0;
        var cgoodslist = [];
        if (ordertype == "c") {
            $.each(mycart, function (key, goods) {
                if (goods) {
                    storeid = goods.storeid;
                    cgoodslist.push({ "gid": goods.id, "num": goods.count });
                }
            });
        } else {
            var goodsinfo = $("#groupgoodsdata").val().split("|");
            storeid = goodsinfo[1];
            cgoodslist.push({ "gid": goodsinfo[0], "num": parseInt($("#quantity").val().trim()) });
        }

        var postorder = {
            "userid": currentloginuser.id,
            "token": currentloginuser.token,
            "store": storeid,
            "goods": cgoodslist,
            "amount": subtotal,
            "coin": $("#coin").val(),
            "payment": $("input[name='payment']:checked").val(),
            "is_instore": is_instore,
            "desktop": desktop,
            "is_takeaway": is_takeaway,
            "address": address
        };
        //		console.log(JSON.stringify(postorder));
        //		return false;
        $.ajax({
            type: "POST",
            url: configManager.RequstUrl + "api/order/create",
            async: true,
            data: postorder,
            beforeSend:function(){ plus.nativeUI.showWaiting(); }
        }).done(function (data) {
            if ("success" == data.state) {
            	plus.nativeUI.closeWaiting();
                //订单提交成功，重新生成临时订单信息
                var temporder = {};
                temporder.id = data.data.id;
                temporder.amount = postorder.amount;
                temporder.discount = parseFloat($("#discount").text());
                temporder.total = parseFloat($("#totalprice").text());
                temporder.storeid = postorder.store;
                temporder.coin = postorder.coin;
                temporder.goods = data.data.goods;

                plus.storage.setItem(storageManager.temporder, JSON.stringify(temporder));

                //提交成功之后更新当前用户的收货地址
                if (!currentloginuser.address) { currentloginuser.address = { "address": "" }; }
                currentloginuser.address.address = (null != postorder.address) ? postorder.address : "";
                plus.storage.setItem(storageManager.user, JSON.stringify(currentloginuser));

                //线下刷卡或者金币全额抵扣直接到订单二维码页面
                var page = (0 == postorder.payment || 1 == data.data.status) ? "finish.html?id=" + data.data.id.toString() : "paytype.html";
                clicked(page + "?ordertype=" + ordertype, false, false, "slide-in-right");

            } else {
                plus.ui.alert(data.message, function () { }, configManager.alerttip, configManager.alertCtip);
            }
        });
    });

    // 本单详情
    $("#addressinput").on("click", function () {
        var textbox = plus.webview.create("../../common/textbox.html", "../../common/textbox.html", {}, { textboxid: "address", textboxvalue: $("#address").val() });
        textbox.show("slide-in-right");
    });
}

//多个商品情况
function PaintNormalGoods(mycart) {
    var html = [], tprice = 0;
    //  console.log(JSON.stringify(mycart));
    $.each(mycart, function (key, goods) {
        if (goods && goods.selected) {
            tprice += parseFloat(goods.price) * parseInt(goods.count);
            html.push("<div class='item-01-wrap '><div class='float-info-block' style='width:100%;overflow: hidden;'>");
            html.push("<span class='title'>" + goods.title + ":</span><span class='num'>" + goods.price + "*" + goods.count + "</span><span class='price'><em id='goods_price'>" + ( parseFloat(goods.price) * parseInt(goods.count) ) + "</em>元</span>");
            html.push("</div></div>");
        }
    });
    tprice = tprice.toFixed(2);
    html.push("<div class='item-01-wrap'><div class='float-info-block'><label>小计:</label> <span> <em class='subtotal' id='subtotal'>" + tprice + "</em>元</span></div></div>");
    $("#afterorder").before(html.join(""));
    calcPrice(mycart);

    //如果是团购商家可以填收货地址
    //  console.log(mycart[0].storeid);
    BindGroupgoodsAddress(mycart[0].storeid);
}

// 立即购买产品，只有一个商品情况
function PaintGroupGoods(temporder) {
    //	console.log(JSON.stringify(temporder));
    var html = [];
    $.each(temporder.goods, function (key, goods) {
        if (goods) {
            var tprice = parseFloat(goods.price) * parseInt(goods.count);
            html.push("<div class='item-01-wrap '><div class='float-info-block'> <label id='goods_title'>" + goods.title + ":</label><span><em id='goods_price'>" + goods.price + "</em>元</span></div></div>");
            html.push("<div class='item-01-wrap'><div class='float-info-block'><label>数量:</label> <span> <a class='num-a minus' id='minus'>-</a> <a class='num-a' style='border:none;'>");
            html.push("<input readonly='true' type='tel' style='height:1.5em; width:2.5em; text-align:center; border:1px solid #ddd; border-radius:0.2em;' value='" + goods.count + "' id='quantity' class='num-text' /></a> <a class='num-a' id='add'>+</a></span></div></div>");
            html.push("<div class='item-01-wrap'><div class='float-info-block'><label>小计:</label> <span> <em class='subtotal' id='subtotal'>" + tprice + "</em>元</span></div></div>");
            //商品id, 商家id，商品价格
            var data = goods.id + "|" + goods.storeid + "|" + goods.price;
            html.push("<input type='hidden' id='groupgoodsdata' value='" + data + "' />");
        }
    });
    $("#afterorder").before(html.join(""));
    // 计算总价
    calcGroupPrice();
    //加个数
    $("#add").on("click", function () {
        var goodscount = parseInt($("#quantity").val().trim());
        goodscount = goodscount + 1;
        $("#quantity").val(goodscount);

        // 计算总价
        calcGroupPrice();
    });

    //减个数
    $("#minus").on("click", function () {
        var goodscount = parseInt($("#quantity").val().trim());
        if (goodscount == 1) { return; }
        goodscount = goodscount - 1;
        $("#quantity").val(goodscount);

        // 计算总价
        calcGroupPrice();
    });

    //如果是团购商家可以填收货地址
    //  console.log(JSON.stringify(temporder.goods[0].storeid));
    BindGroupgoodsAddress(temporder.goods[0].storeid);
}

function BindGroupgoodsAddress(storeid) {
    //	console.log("storeid");

    //根据storeid获取商家信息
    $.ajax({
        type: "get",
        url: configManager.RequstUrl + "api/store/info",
        async: true,
        data: { "store": storeid }
    }).done(function (data) {
        if ("success" == data.state) {
            var store = data.data;
            //店铺是否支持到店刷卡
            if( 0 == store.is_paybycard ){
            	$("#apayoffline").hide();
            	$("#payonline").attr("checked",true);
            }
            //店铺是否支持外卖
            $("#hid_is_takeaway").val(store.is_takeaway);
            if (1 == store.is_takeaway) {
                $("#addressdiv").show();
                if (null != currentloginuser.address || undefined != currentloginuser.address) {
                    $("#address").val(currentloginuser.address.address);
                    $("#addressinput").val(convertStr(currentloginuser.address.address));
                }
            }
			//切换外卖地址或桌位			
            $("input[name=is_instore]").on("click", function () {
                var is_instore = $(this).val();
                if (1 == is_instore) {
                    $("#desktopdiv").show();
                    $("#addressdiv").hide();
                }
                else {
                    if (1 == store.is_takeaway) {
                        $("#desktopdiv").hide();
                        $("#addressdiv").show();
                        if (null != currentloginuser.address || undefined != currentloginuser.address) {
                            $("#address").val(currentloginuser.address.address);
                        }
                    }
                    else {
                        $("#desktopdiv").hide();
                        $("#addressdiv").hide();
                    }
                }
            });

        }
    });
}

// 计算购物车价格
function calcPrice(mycart) {
    var totalprice = 0;
    $.each(mycart, function (index, goods) {
        if (goods && goods.selected) {
            totalprice = totalprice + (parseFloat(goods.price) * parseFloat(goods.count));
        }
    });
    totalprice = totalprice - calcDiscount();
    totalprice = totalprice.toFixed(2);
    $("#totalprice").text(totalprice);
    return totalprice;
}

// 计算购物车价格
function calcGroupPrice() {
    var quantity = parseInt($("#quantity").val().trim());
    var price = parseFloat($("#goods_price").text().trim());
    var totalprice = quantity * price;
    $("#subtotal").text(totalprice);

    totalprice = totalprice - calcDiscount();
    totalprice = totalprice.toFixed(2);
    $("#totalprice").text(totalprice);
    
    return totalprice;
}

// 计算抵用金额
function calcDiscount() {
    var coinamount = parseInt($("#coin").val().trim());
    var discount = 0;
    if (coinamount) {
        var discount = (coinamount / configManager.coinrate).toFixed(2);
        $("#discount").text(discount);
    } else {
        discount = 0;
        $("#discount").text(0);
    }

    return discount;
}

// 获取文本内容
function getMessage(id, value) {
    $("#" + id).val(value);
    $("#" + id + "input").val(convertStr(value));
}

// 处理字符串过长情况
function convertStr(str) {
    if (str && str.length > 12) {
        return str.substr(0, 10) + "...";
    }

    return str;
}
