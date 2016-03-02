//$(function () {
//    plusReady();
//})

function plusReady() {
    //空购物车，显示友好界面
    var mycart = JSON.parse(plus.storage.getItem(storageManager.cart));
    PaintGoodsList(mycart);

    if (!mycart) { return; }

    BindEvent();
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

function PaintGoodsList(mycart) {

    if (null != mycart && mycart.length > 0) {
        var html = [];
        $.each(mycart, function () {
            var goods = this;
            if (!goods) { return; }

            html.push("<div class='shop-car-wrap ' id='goodsitem" + goods.id + "'><ul class='shop-car-block'>");
            html.push("<li class='car-hd'><i class='ok sign icon current' style='left: 0.2em' name='selectitem' tip='" + goods.id + "'></i><img name='imgitem' data-src='" + goods.src + "' src='../../../images/defaultpic.jpg' class='car-img' /></li>");
            html.push("<li class='car-bd'><p>" + goods.title + "</p><p><em class='fc-org'>￥" + goods.price + "</em></p>");
            html.push("<p><a class='car-num' style='border:none; margin:0;' name='minuscount'  tip='" + goods.id + "'><i style='font-size:2.8em; margin-top:-7px;margin-right:0em;color:#ccc;' class=\"collapse icon\"></i></a>");
            html.push("<a class='car-num' style='border:2px solid #ddd;width:3em; text-align:center; border-radius:2px;'><input type='tel' readonly='true' style='text-align:center; line-height:13px;'  class='car-text-inp'  value='" + goods.count + "' /></a>");
            html.push("<a class='car-num' style='border:none' name='addcount' tip='" + goods.id + "'><i style='font-size:2.8em; margin-top:-7px;margin-left:-2px;color:#ccc;' class=\"expand icon\"></i></a></p>");

            html.push("<a class='del-comm' name='removecount'  tip='" + goods.id + "'><i class='remove sign icon' style='font-size:2em; margin-top:0.4em'></i></a></li></ul></div>");
        });

        html.push("<div class='shop-car-wrap'><div class='shop-car-block'><i style='margin-top:0.3em; margin-left:0.5em;' class='ok sign icon current' id='selectallitem'></i>");
        html.push("<span class='car-btn' id='btncommit' style='padding-right:5px;'><input type='button' class='base-btn-inp' value='结算' /></span>");
        html.push("<span class='car-ft-text'> 合计：￥<em class=' fc-org' id='totalprice'>0</em></span>");
        html.push("</div></div>");

        $("#goodslist").html(html.join(""));
        // 计算总价
        calcPrice(mycart);
    }
    else {
        $("#emptycart").show();
    }

    $('img[name=imgitem]').lazyload();
}

function BindEvent() {
    // 添加
    $("a[name=addcount]").on("click", function () {
        var mycart = JSON.parse(plus.storage.getItem(storageManager.cart));
        var goodsid = $(this).attr("tip");
        var goodscount = 0;
        $.each(mycart, function (index, goods) {
            if (goods && goods.id == goodsid) {
                goods.count = (goods.count + 1);
                goodscount = goods.count;
            }
        });
        $(this).parent().find('input').val(goodscount);

        // 计算总价
        calcPrice(mycart);
        // 放入缓存，购物车，提交订单需要
        plus.storage.setItem(storageManager.cart, JSON.stringify(mycart));
    });

    // 减少
    $("a[name=minuscount]").on("click", function () {
        var mycart = JSON.parse(plus.storage.getItem(storageManager.cart));
        var goodsid = $(this).attr("tip");

        var goodscount = 0;
        $.each(mycart, function (index, goods) {
            if (goods && goods.id == goodsid) {
                goods.count = goods.count == 1 ? 1 : (goods.count - 1);
                goodscount = goods.count;
            }
        });
        $(this).parent().find('input').val(goodscount);
        // 计算总价
        calcPrice(mycart);
        // 放入缓存，购物车，提交订单需要
        plus.storage.setItem(storageManager.cart, JSON.stringify(mycart));
    });

    // 清空
    $("a[name=removecount]").on("click", function () {
        var selectedgoods = $(this);
        plus.nativeUI.confirm("确定要移除该件商品吗？", function (e) {
            if (e.index == 0) {
                var mycart = JSON.parse(plus.storage.getItem(storageManager.cart));
                var goodsid = selectedgoods.attr("tip");
                $.each(mycart, function (index, goods) {
                    if (goods && goods.id == goodsid) {
                        mycart.splice(index, 1);
                    }
                });

                $("#goodsitem" + goodsid).remove();
                // 计算总价
                calcPrice(mycart);
                if (mycart.length == 0) { $("#goodspage").html(""); $("#emptycart").show(); }
                // 放入缓存，购物车，提交订单需要
                plus.storage.setItem(storageManager.cart, JSON.stringify(mycart));

            }
        }, "提示", ["确定", "取消"]);
    });

    // 选择（合计价格）
    $("i[name=selectitem]").on("click", function () {
        var selectitem = $(this);
        var isselected = !selectitem.hasClass("current");
        if (isselected) { selectitem.addClass("current"); } else { selectitem.removeClass("current"); }
        if (!isselected && $("#selectallitem").hasClass("current")) {
            $("#selectallitem").removeClass("current");
        }

        // 更新购物车中物品是否被选中
        var mycart = JSON.parse(plus.storage.getItem(storageManager.cart));
        var goodsid = $(this).attr("tip");
        $.each(mycart, function () { if (this && this.id == goodsid) { this.selected = isselected; } });

        // 计算总价
        calcPrice(mycart);

        // 放入缓存，购物车，提交订单需要
        plus.storage.setItem(storageManager.cart, JSON.stringify(mycart));
    });


    // 全选（合计价格）
    $("#selectallitem").on("click", function () {
        var selectitem = $(this);
        var isselected = !selectitem.hasClass("current");
        if (isselected) { selectitem.addClass("current"); } else { selectitem.removeClass("current"); }

        // 全选
        $("i[name=selectitem]").each(function () {
            var item = $(this);
            if (isselected) {
                if (!item.hasClass("current")) {
                    item.addClass("current");
                }
            }
            else {
                item.removeClass("current");
            }
        });
        var mycart = JSON.parse(plus.storage.getItem(storageManager.cart));
        $.each(mycart, function () { if (this) { this.selected = isselected; } });

        // 计算总价
        calcPrice(mycart);

        // 放入缓存，购物车，提交订单需要
        plus.storage.setItem(storageManager.cart, JSON.stringify(mycart));
    });

    // 结算
    $("#btncommit").on("click", function () {
        if ($("#totalprice").text() == "0") {
            plus.nativeUI.alert("至少选择一件商品！");
            return;
        }
        var currentloginuser = JSON.parse(plus.storage.getItem(storageManager.user));
        if (!currentloginuser) {
            clicked("../../account/login.html", false, false, "slide-in-bottom");
        }
        clicked("commit.html?type=c");
    });
}

// 计算购物车价格
function calcPrice(mycart) {
    var totalprice = 0;
    $.each(mycart, function (key, goods) {
        if (goods && goods.selected) {
            totalprice = totalprice + (parseFloat(goods.price) * parseInt(goods.count));
        }
    });
    totalprice = totalprice.toFixed(2);
    $("#totalprice").text(totalprice);
    return totalprice;
}
