function plusReady() {
    // 解决部分魅族，大神手机某项页面不执行PlusReady方法
    var pages = JSON.parse(plus.storage.getItem(storageManager.exctPlusReadyPages));
    pages.push(pageName.mine);
    plus.storage.setItem(storageManager.exctPlusReadyPages, JSON.stringify(pages));

    // 获取当前用户类型 1：普通用户； 2：商家； 3：商家子账号； 4：代理； 5：代理子账号； 6：后台管理人员
    var currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
    // 用户基本信息
    GetUserInfo(currentuser);
    if (currentuser) {
        currentusertype = currentuser.user_type;
        if (currentusertype == 1) {
            PaintNormalUser();
        } else if ([2, 3].indexOf(currentusertype) > -1) {
            //店铺
            if (!currentuser.store) { GetUserStoreInfo(currentuser.id); }
            PaintShopUser(currentusertype);
        } else if ([4, 5].indexOf(currentusertype) > -1) {
            //代理
            PaintAgentUser();
        } else {
            //普通用户
            PaintNormalUser();
        }
    } else {
        // 加载普通用户
        PaintNormalUser();
    }

    // 绑定事件
    BindEvent(currentuser);
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

function init() {
    getlastUserInfo();
}

// 接受Main事件请求
function receivePersonEvent(opearindex) {
    if (opearindex == 0) {
        var currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
        GetUserInfo(currentuser);
    } else if (opearindex == 1) {
        GetUserInfo(null);
    }
}

// 接受Mian事件触发
function receiveMainEvent() {
    getlastUserInfo();
}

// 获取用户信息
function GetUserInfo(user) {
    if (user) {
        if (null != user.account && null != user.account.coin) {
            $("#coin").text(user.account.coin);
        }
        $("#avatar").attr("src", configManager.avatarImgurl.format(user.avatar_id, "80-80"));
        $("#real_name").text(user.real_name);
        $("#name").text(user.name);
        $("#code").text(user.code);
    } else {
        $("#coin").text("0.00");
        $("#avatar").attr("src", configManager.avatarImgurl.format(0, "80-80"));
        $("#real_name").text("未登录");
        $("#name").text("");
        $("#code").text("XXXXXX");
    }
}

// 普通用户（我的订单，我的外卖，我的钱包，我的购物车，关注商家，邀请会员，便民支付，金融服务，自助银行）
function PaintNormalUser() {
    var html = [];
    html.push("");
    html.push("<ul cla class='bus-serv-item'>");
    html.push("<li name='mitem' tip='order/order.html'> <a><img src='../../images/busn-14.png' /> <span>我的订单</span></a></li>");
    html.push("<li name='mitem' tip='order/takeaway.html?t=1'> <a><img src='../../images/busn-03.png' /> <span>我的外卖</span></a></li>");
    html.push("<li name='mitem' tip='wallet/wallet.html'> <a><img src='../../images/busn-02.png' /> <span>我的钱包</span></a></li>");
    html.push("<li name='mitem' tip='order/cart.html'> <a><img src='../../images/busn-16.png' /> <span>我的购物车</span></a></li>");
    html.push("<li name='mitem' tip='collections.html'> <a><img src='../../images/busn-15.png' /> <span>关注商家</span></a></li>");
    html.push("<li name='mitem' tip='invite.html'> <a><img src='../../images/busn-07.png' /> <span>邀请会员</span></a></li>");
    html.push("<li name='mitem' tip='finance/handypay.html'> <a><img src='../../images/busn-05.png' /> <span>便民支付</span></a></li>");
    html.push("<li name='mitem' tip='finance/financial.html'> <a><img src='../../images/busn-04.png' /> <span>金融服务</span></a></li>");
    html.push("<li name='mitem' tip='finance/selfservice.html'> <a><img src='../../images/busn-06.png' /> <span>自助银行</span></a></li>");
    html.push("</ul>");

    $("#itemlist").html(html.join(""));
}

// 代理（我的订单，我的外卖，我的钱包，我的购物车，关注商家，邀请会员，便民支付，金融服务，自助银行，我的代理）
function PaintAgentUser() {
    var html = [];
    html.push("");
    html.push("<ul cla class='bus-serv-item'>");
    html.push("<li name='mitem' tip='order/order.html'> <a><img src='../../images/busn-14.png' /> <span>我的订单</span></a></li>");
    html.push("<li name='mitem' tip='order/takeaway.html?t=1'> <a><img src='../../images/busn-03.png' /> <span>我的外卖</span></a></li>");
    html.push("<li name='mitem' tip='wallet/wallet.html'> <a><img src='../../images/busn-02.png' /> <span>我的钱包</span></a></li>");
    html.push("<li name='mitem' tip='agent/agent.html'> <a><img src='../../images/busn-09.png' /> <span>我的代理</span></a></li>");
    html.push("<li name='mitem' tip='order/cart.html'> <a><img src='../../images/busn-16.png' /> <span>我的购物车</span></a></li>");
    html.push("<li name='mitem' tip='collections.html'> <a><img src='../../images/busn-15.png' /> <span>关注商家</span></a></li>");
    html.push("<li name='mitem' tip='invite.html'> <a><img src='../../images/busn-07.png' /> <span>邀请会员</span></a></li>");
    html.push("<li name='mitem' tip='finance/handypay.html'> <a><img src='../../images/busn-05.png' /> <span>便民支付</span></a></li>");
    html.push("<li name='mitem' tip='finance/financial.html'> <a><img src='../../images/busn-04.png' /> <span>金融服务</span></a></li>");
    html.push("<li name='mitem' tip='finance/selfservice.html'> <a><img src='../../images/busn-06.png' /> <span>自助银行</span></a></li>");

    html.push("</ul>");

    $("#itemlist").html(html.join(""));
}

// 商家
//（我的店铺，我的外卖，我的钱包，管理子账号，促销广告，邀请会员，便民支付，金融服务，自助银行）
// 商家子帐号
// （我的店铺，我的外卖，促销广告，邀请会员，便民支付，金融服务，自助银行）
function PaintShopUser(currentusertype) {
    var html = [];
    html.push("");
    html.push("<ul cla class='bus-serv-item'>");

    if (currentusertype == 3) {
        html.push("<li name='mitem' tip='goods/manage.html'> <a><img src='../../images/busn-12.png' /> <span>商品管理</span></a></li>");
        html.push("<li name='mitem' tip='invite.html'> <a><img src='../../images/busn-07.png' /> <span>邀请会员</span></a></li>");
        html.push("<li name='mitem' tip='gathering'> <a><img src='../../images/busn-10.png' /> <span>收款</span></a></li>");
    }

    if (currentusertype == 2) {
        html.push("<li name='mitem' tip='shop/myshop.html'> <a><img src='../../images/busn-01.png' /> <span>我的店铺</span></a></li>");
        html.push("<li name='mitem' tip='order/takeaway.html?t=1'> <a><img src='../../images/busn-03.png' /> <span>我的外卖</span></a></li>");
        html.push("<li name='mitem' tip='../subaccount/storemanager.html'> <a><img src='../../images/busn-09.png' /> <span>管理子帐号</span></a></li>");
        html.push("<li name='mitem' tip='wallet/wallet.html'> <a><img src='../../images/busn-02.png' /> <span>我的钱包</span></a></li>");
        html.push("<li name='mitem' tip='invite.html'> <a><img src='../../images/busn-07.png' /> <span>邀请会员</span></a></li>");
        html.push("<li name='mitem' tip='shop/shopadv.html'> <a><img src='../../images/busn-08.png'/> <span>促销广告</span></a></li>");
        html.push("<li name='mitem' tip='finance/handypay.html'> <a><img src='../../images/busn-05.png' /> <span>便民支付</span></a></li>");
        html.push("<li name='mitem' tip='finance/financial.html'> <a><img src='../../images/busn-04.png' /> <span>金融服务</span></a></li>");
        html.push("<li name='mitem' tip='finance/selfservice.html'> <a><img src='../../images/busn-06.png' /> <span>自助银行</span></a></li>");
    }
    html.push("</ul>");

    $("#itemlist").html(html.join(""));
}

var currentusertype = 0;
function BindEvent(currentuser) {
    // 个人信息
    $("#personinfo").on("click", function () {
        var currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
        if (!currentuser) { clicked('../account/login.html', false, false, 'slide-in-bottom'); return; }
        clicked('../account/personal.html', false, false, 'slide-in-right');
    });

    // 二维码
    $("#personbarcode,#mycode").on("click", function () {
        var currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
        if (!currentuser) { clicked('../account/login.html', false, false, 'slide-in-bottom'); return; }
        clicked('../account/personbarcode.html', false, false, 'slide-in-right');
    });

    // 分享
    $("#sharepop").on("click", function () { $(this).hide(); });
    $("#btnshare").on("click", function () {
        var currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
        if (!currentuser) { clicked('../account/login.html', false, false, 'slide-in-bottom'); return; }
        $("#sharepop").show();
    });

    // 消息
    $("#header").on("click", "#headertalk", function () {
        clicked("../message/message.html", false, false, "slide-in-right");
    });

    // weixin: 0  weixinquan:1  inaweibo:2  tencentweibo:3  QQ: 4
    $("li[name=shareitem]").on("click", function () {
        var item = $(this).attr("tip");
        // 分享二维码必须在本地
        var currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
        if (!currentuser.barcode) { CreateUserBarCode(currentuser, item); return; }

        shareShow("扫一扫，关注我们", currentuser.barcode, item);
    });

    // 必须登陆
    $("li[name=mitem]").on("click", function () {
        var currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
        // 未登陆请登录
        if (!currentuser) {
            clicked('../account/login.html', false, false, 'slide-in-bottom');
        } else if ([6].indexOf(currentuser.user_type) > -1) {
            //
            plus.nativeUI.alert("对不起，无权查看！", function () { }, "提示", "好");
        } else {
            // 跳转
            var page = $(this).attr("tip");
            //商家子帐号点击收款，弹出二维码扫描
            if ("gathering" == page) {
                clicked(pageName.scanbarcode, true, true);
            } else {
                if ("wallet/wallet.html" == page) {
                    getlastUserInfo();
                }
                clicked(page, false, false, 'slide-in-right');
            }
        }
    });

    //我的金币，我的邀请码跳转
    $("#mycoin").on("click", function () {
        var currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
        if (!currentuser) {
            clicked('../account/login.html', false, false, 'slide-in-bottom'); return;
        }
        else {
            clicked('wallet/income.html?t=coin', false, false, 'slide-in-right');
        }
    });
}

// 获取用户店铺信息
function GetUserStoreInfo(userid) {
    $.ajax({
        type: "GET",
        async: true,
        url: configManager.RequstUrl + "/api/user/profile",
        data: { "userid": userid, "account": "1" }
    }).done(function (data) {
        if ("success" == data.state) {
            user = data.data;
            plus.storage.setItem(storageManager.user, JSON.stringify(data.data));
        }
        else {
            console.log(data.message);
        }
    });
}


// 生产用户唯一标识二维码
function CreateUserBarCode(currentuser, item) {
    console.log("生成");
    $.ajax({
        type: 'Get',
        async: false,
        url: configManager.RequstUrl + 'api/common/qrcode?type=login&code=' + currentuser.code
    }).done(function (data) {
        if (data.state != "success") {
            console.log(data.message);
            return;
        }

        // 下载本地
        var dtask = plus.downloader.createDownload(data.uri, {}, function (d, status) {
            // 下载完成
            if (status == 200) {
                currentuser.barcode = d.filename;
                plus.storage.setItem(storageManager.user, JSON.stringify(currentuser));
                shareShow(data.link, currentuser.barcode, item);
            } else {

            }

        });
        dtask.start();
    });
}

// 获取最新用户信息
function getlastUserInfo() {
    var currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
    if (!currentuser) { return; }
    $.ajax({
        type: "GET",
        async: false,
        url: configManager.RequstUrl + "api/user/profile",
        data: { "userid": currentuser.id, "account": "1" }
    }).done(function (data) {
        if ("success" == data.state) {
            currentuser.store = (data.data.hasOwnProperty("store")) ? data.data.store : null;
            currentuser.account = data.data.account;
            if (null != currentuser.account && null != currentuser.account.coin) {
                $("#coin").text(currentuser.account.coin);
            }

            plus.storage.setItem(storageManager.user, JSON.stringify(currentuser));
        }
        else {
            console.log(data.message);
        }

    });
}

