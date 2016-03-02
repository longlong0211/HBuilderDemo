//$(function () { plusReady(); })
function plusReady() {
    loaded();
    paintCityChar();
      var currentcity = JSON.parse(plus.storage.getItem(storageManager.currentcity));
      if (currentcity) {
          $("#currentcitytitle").text("当前城市-" + currentcity.name)
          $("#currentcity").text("定位中...").attr("tip", currentcity.id + "|" + currentcity.name);
      } else {
          $("#currentcitytitle").text("当前城市");
          $("#currentcity").text("定位中...").attr("tip", 0 + "|");
      }

    gpsPosition();
    // 热门城市
    loadCitiesData(true);
    // 所有城市
    loadCitiesData(false);
    bindEvent();
}

if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

// 加载A-Z字符
function paintCityChar() {
    var html = [];
    html.push("<ul>");
    for (var i = 0; i < 26; i++) {
        var charcode = 65 + i;
        if ([73, 79, 85, 86].indexOf(charcode) == -1) {
            var char = String.fromCharCode((charcode));
            html.push("<li><a>" + char + "</a></li>");
        }
    }
    html.push("</ul>");
    $("#citychar").html(html.join(""));
    $("#citychar ul li a").on("click", function () {
        var char = $(this).text();

        var prevctiy = $("#citychar" + char);
        var first = prevctiy.parent().parent().next();
        if (first.length == 0) {
            prevctiy = $("#citychar" + String.fromCharCode(char.charCodeAt() + 1));
            first = prevctiy.parent().parent().next();
        }
        if (first.length > 0) {
            var toindex = first.attr('id').substr(1) - 5;
            if (toindex > 0) {
                myScroll.scrollToElement("#c" + toindex, 300);
            }
        }
    });
}

// 获取城市数据
function loadCitiesData(onlyhot) {
    if (!onlyhot) {
        paintCityList(allcitydata.data);
        return;
    }

    var jqXHR = $.ajax({
        type: 'Get',
        url: configManager.RequstUrl + 'api/common/city?onlyhot=' + (onlyhot ? 1 : 0)
    });

    jqXHR.done(function (data) {
        if (data.state != "success") { console.log(data.message); return; }
        var cities = data.data;
        if (onlyhot) {
            paintHotCityList(cities);
        }
    });
}

//  画出热门城市
function paintHotCityList(cities) {
    var html = [];
    html.push("<ul class='city-hot-list'>");
    for (var i = 0; i < cities.length; i++) {
        var city = cities[i];
        html.push("<li name='hotcityli' tip=" + city.id + "|" + city.name + "><a>" + city.name + "</a></li>");
    }
    html.push("</ul>");
    $("#hotcities").html(html.join(""));
    try { myScroll.refresh(); } catch (err) { }
}

// 画出所有城市
function paintCityList(cities) {
    var html = [];
    var cindex = 0;
    for (var citychar in cities) {
        html.push("<ul class='city-all-list '>");
        html.push("<li style='background:#fff;margin-left: -10px;margin-right:-10px'><h2><a class='city-all-tit' id='citychar" + citychar + "'>" + citychar + "</a></h2></li>");
        for (var i = 0; i < cities[citychar].length; i++) {
            cindex = cindex + 1;
            var city = cities[citychar][i];
            html.push(" <li name='cityli' id='c" + cindex + "' tip=" + city.id + "|" + city.name + "><a>" + city.name + "</a></li>");
        }
        html.push("</ul>");
    }
    $("#allcities").html(html.join(""));

    try { myScroll.refresh(); } catch (err) { }
}

// 调用APIGPS定位
function gpsPosition() {
    plus.geolocation.getCurrentPosition(
        function (position) {
            //获取地理坐标信息
            var codns = position.coords;
            console.log("GPS:" + "X:" + codns.latitude + " Y:" + codns.longitude);
            getCurrentCity(codns.latitude, codns.longitude);
        },
        function (e) {

        });
}

// 根据坐标获取当前城市
function getCurrentCity(lat, lng) {
    $.ajax({
        type: 'Get',
        url: configManager.RequstUrl + 'api/common/position?lat=' + lat + '&lng=' + lng
    }).done(function (data) {
        if (data.state != "success") { console.log(data.message); return; }
        var currentcity = data.data;
        console.log("定位当前城市为：" + currentcity.name);
        if ($("#currentcity").text() != currentcity.name) {
            $("#currentcity").text(currentcity.name).attr("tip", currentcity.id + "|" + currentcity.name);
        }

        var curr = JSON.parse(plus.storage.getItem(storageManager.currentcity));
        curr.lat = lat;
        curr.lng = lng;
        plus.storage.setItem(storageManager.currentcity, JSON.stringify(curr));
    });
}

function bindEvent() {
    // 点击定位城市
    $("#currentcity").on("click", function () {
        setcity(this);
    });

    // 绑定选中所有城市
    $("#allcities").on("click", "ul li[name=cityli]", function () {
        setcity(this);
    });

    // 热门城市
    $("#hotcities").on("click", "ul li[name=hotcityli]", function () {
        setcity(this);
    });
}

function setcity(citydata) {
    try {
        // 获取窗口对象
        var oricity = JSON.parse(plus.storage.getItem(storageManager.currentcity));
        var data = $(citydata).attr("tip").split('|');
        var sid = data[0]; var sname = data[1];
        if (!oricity) {
            var cityData = { "id": sid, "parent_id": 0, "name": sname, "lat": 0, "lng": 0 };
            plus.storage.setItem(storageManager.currentcity, JSON.stringify(cityData));
            // 回调切换城市
            plus.webview.getWebviewById(pageName.home).evalJS("selectcity()");
            plus.webview.getWebviewById(pageName.merchant).evalJS("selectcity()");
        } else if (sid != oricity.id) {
            oricity.id = sid; oricity.name = sname;
            // 更新缓存
            plus.storage.setItem(storageManager.currentcity, JSON.stringify(oricity));
            // 回调切换城市
            plus.webview.getWebviewById(pageName.home).evalJS("selectcity()");
            plus.webview.getWebviewById(pageName.merchant).evalJS("selectcity()");
        }
    } catch (err) { }

    // 返回首页
    back();
}

var myScroll;
function loaded() {
    myScroll = new iScroll('wrapper', {
        useTransform: false,
        hideScrollbar: true,
        vScrollbar: true,
        fadeScrollbar: true,
        scrollbarClass: "myScrollbar",

        onBeforeScrollStart: function (e) {
            var target = e.target;
            while (target.nodeType != 1) target = target.parentNode;

            if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
                e.preventDefault();
        }
    });
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
