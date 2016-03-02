//mui初始化
mui.init({
    swipeBack: true //启用右滑关闭功能
});
var subpages = [pageName.home, pageName.merchant, pageName.mine, pageName.more];
var subpage_style = { top: '0px', bottom: '55px', zindex: 0 };

var aniShow = {};
var haveInitPage = [];
//创建子页面，首个选项卡页面显示，其它均隐藏；
mui.plusReady(function () {
    var self = plus.webview.currentWebview();
    for (var i = 0; i < 4; i++) {
        var temp = {};
        var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
        if (i > 0) {
            sub.hide();
        } else {
            temp[subpages[i]] = "true";
            mui.extend(aniShow, temp);
        }
        self.append(sub);
    }

    // 清除上次启动无用缓存
    clearStoreage();

    // 初始化首页
    haveInitPage.push(pageName.home);
});

//当前激活选项
var activeTab = subpages[0];
var t1 = new Date().getTime();
//选项卡点击事件
mui('#footer').on('tap', 'a', function (e) {
    var targetTab = $(this).attr('href');
    if (targetTab == activeTab) { return; }

    // 防止用户，立即切换页面
    var t2 = new Date().getTime(); if (t2 - t1 < 2000) { return; }
    if (plus.webview.currentWebview().children().length < subpages.length) { return; }

    // 扫描二维码
    if ($(this).hasClass("mid-ma")) { clicked(pageName.scanbarcode, true, true); return; }

    // 如果为主页面清空页面
    if (targetTab == pageName.home) { gohome(); }

    //显示目标选项卡
    if (mui.os.ios || aniShow[targetTab]) {
        plus.webview.show(targetTab);
    } else {
        var temp = {};
        temp[targetTab] = "true";
        mui.extend(aniShow, temp);
        plus.webview.show(targetTab);
    }

    // 设置选中状态
    setSelectBackgroud($("#footer ul li a[href='" + activeTab + "']"), false);
    setSelectBackgroud($(this), true);

    //隐藏当前;
    plus.webview.hide(activeTab);
    //更改当前活跃的选项卡
    activeTab = targetTab;

    // 初始化目标页
    if (haveInitPage.indexOf(targetTab) == -1) {
        // 解决部分魅族，大神手机某项页面不执行PlusReady方法
        var pages = JSON.parse(plus.storage.getItem(storageManager.exctPlusReadyPages));
        if (pages.indexOf(targetTab) == -1) {
            plus.webview.getWebviewById(targetTab).reload(false);
        }
        plus.webview.getWebviewById(targetTab).evalJS("init()");
        haveInitPage.push(targetTab);
    }

    if (targetTab == pageName.merchant) {
        plus.webview.getWebviewById(pageName.merchant).evalJS("receiveMainEvent()");
    }

    if (targetTab == pageName.mine) {
        plus.webview.getWebviewById(pageName.mine).evalJS("receiveMainEvent()");
    }

    // 清空多余页面
    clear();

});

// 返回主页关闭其他页
function gohome() {
    var allwebview = plus.webview.all();
    var mainview = plus.webview.getWebviewById(pageName.main);
    for (var i = 0; i < allwebview.length; i++) {
        var vie = allwebview[i];
        if (subpages.indexOf(vie.id) > -1 || mainview.id == vie.id || pageName.city == vie.id) {
            // TODO
        } else {
            console.log("关闭" + vie.id);
            vie.close("none");
        }
    }
}

function clear(pagename) {
    var allwebview = plus.webview.all();
    var mainview = plus.webview.getWebviewById(pageName.main);
    for (var i = 0; i < allwebview.length; i++) {
        var vie = allwebview[i];
        if (subpages.indexOf(vie.id) > -1 || mainview.id == vie.id || pagename == vie.id || pageName.city == vie.id) {
            // TODO
        } else {
            console.log("关闭" + vie.id);
            vie.close("none");
        }
    }
}

function setSelectBackgroud(tab, isselected) {
    var tip = tab.attr("tip");
    var item = "";
    switch (tip) {
        case "0":
            item = (isselected ? "<i class=\"icon iconfont icon-home\" style=\"font-size:2.0em; color:#f63;\"></i> <span style=\"color:#f63\">首页</span>" : "<i class=\"icon iconfont icon-home\" style=\"font-size:2.0em;\"></i> <span>首页</span>"); break;
        case "1":
            item = (isselected ? "<i class=\"icon iconfont icon-shopping\" style=\"font-size:2.0em; color:#f63;\"></i> <span style='color:#ff6633'>商家</span>" : "<i class=\"icon iconfont icon-shopping\" style=\"font-size:2.0em;\"></i> <span>商家</span>"); break;
        case "3":
            item = (isselected ? "<i class=\"icon iconfont icon-my\" style=\"font-size:2.0em; color:#f63;\"></i> <span style='color:#ff6633'>我的</span>" : "<i class=\"icon iconfont icon-my\" style=\"font-size:2.0em;\"></i> <span>我的</span>"); break;
        case "4":
            item = (isselected ? "<i class=\"icon iconfont icon-add\" style=\"font-size:2.0em; color:#f63;\"></i> <span style='color:#ff6633'>更多</span>" : "<i class=\"icon iconfont icon-add\" style=\"font-size:2.0em;\"></i> <span>更多</span>"); break;
        default: break;
    }

    tab.html(item);
}

// 跳转
function redirect(footid) {
    var dd = document.getElementById(footid)
    mui.trigger(dd, 'tap');
}

// 清除之前无用缓存
function clearStoreage() {
    plus.storage.removeItem(storageManager.searchtext);
}
