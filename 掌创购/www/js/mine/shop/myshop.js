
var currentuser,storeinfo;
function plusReady() {
    Init();
    BindEvent();
}

if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

// 加载店铺信息
function Init() {
    // 获取当前用户
    currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
    storeinfo = currentuser.store;

    if (storeinfo) {
        var src = "";
        if (currentuser.avatar_id) {
            src = configManager.storeImgurl.format(currentuser.avatar_id, "50-50");
        } else {
            src = configManager.storeImgurl.format(0, "50-50");
        }
        $("#storepic").attr("src", src);
        $("#sotrename").text(storeinfo.store_name);

        //停止营业，点击进入评价
        PauseStore(currentuser);
        //统计
        countItem(storeinfo.id);
    } else {
        plus.nativeUI.alert("该用户不是商户！");
    }
}

// TODO
// 获取商品、广告、订单数量
function countItem(storeid) {
    var requestdata = { "store": storeid };

    var countjqXHR = $.ajax({
        type: 'GET',
        url: configManager.RequstUrl + 'api/store/info',
        data: requestdata
    });
    countjqXHR.done(function (data) {
        if (data.state != "success") {
            console.log(data.message); return;
        }
        var store = data.data;
        //      console.log(JSON.stringify(store));
        $("#goodscount").text(store.goodsCount);
        $("#ordercount").text(store.orderCount);
        $("#appraisecount").text(store.reviews);
        if (store.store_pause == 0) {
            $("#pause span").css("background", "#666666").html("暂停中");
        }
    });
}

function BindEvent() {
    $("#shopitem").on("click", function () { clicked("shopinfo.html", false, false, "slide-in-right"); });
    $("#goodsitem").on("click", function () { clicked("../goods/manage.html", false, false, "slide-in-right"); });
    $("#orderitem").on("click", function () { clicked("../order/order.html", false, false, "slide-in-right"); });
    //$("#advitem").on("click", function () { clicked("shopadv.html", false, false, "slide-in-right"); });

	$("#appraiseitem").on("click", function () { clicked("../order/appraises.html?store="+storeinfo.id+"&store_user="+storeinfo.user_id, false, false, "slide-in-right"); });
}

//停止营业
function PauseStore(user) {

    $("#pause span").on("click", function () {

        $.ajax({
            type: "POST",
            url: configManager.RequstUrl + "api/store/pause",
            async: true,
            data: { "userid": user.id, "token": user.token }
        }).done(function (data) {
            plus.ui.alert(data.message, function () { }, configManager.alerttip, configManager.alertCtip);
            if ("success" == data.state) {
                //				alert(JSON.stringify(data));
                if (data.data.store_pause > 0) {
                    $("#pause span").css("background", "#ff6633").html("营业中");
                }
                else {
                    $("#pause span").css("background", "#666666").html("暂停中");
                }
            }
        });
    });
}

