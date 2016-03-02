if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

function plusReady() {
    // 判断当前网络状况
    var currentNetworkType = plus.networkinfo.getCurrentType();
    if (currentNetworkType && (plus.networkinfo.CONNECTION_UNKNOW == currentNetworkType || plus.networkinfo.CONNECTION_NONE == currentNetworkType)) {
        plus.nativeUI.alert("无网络连接！");
        loaded();
        // 解决部分魅族，大神手机某项页面不执行PlusReady方法
        var pages = JSON.parse(plus.storage.getItem(storageManager.exctPlusReadyPages));
        pages.push(pageName.home);
        plus.storage.setItem(storageManager.exctPlusReadyPages, JSON.stringify(pages));

        setDefaultPage();
    }

}

var myScroll, pullDownEl, pullDownOffset;
function loaded() {
    pullDownEl = document.getElementById('pullDown');
    pullDownOffset = pullDownEl.offsetHeight;

    myScroll = new iScroll('wrapper', {
        useTransition: true,
        fadeScrollbar: true,
        fixedScrollbar: true,
        scrollbarClass: "myScrollbar",
        topOffset: pullDownOffset,
        hScroll: false,
        vScrollbar: false

    });

    setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
}


// 无网络连接，初始化界面
function setDefaultPage() {
    plus.navigator.closeSplashscreen();
    // 默认杭州
    var cityData = { "id": 383, "parent_id": 31, "name": "杭州", "lat": 30.33928387105413, "lng": 120.1032966187033 };
    // 定位当前城市，默认杭州
    $("#currentcityname").text(cityData.name);
    $("#discountgoodlist").html("<div style='text-align:center;padding-top:2em;font-size:16px'>暂无推荐商品</div>");

    plus.storage.setItem(storageManager.currentcity, JSON.stringify(cityData));
    try { myScroll.refresh(); } catch (err) { }
}



