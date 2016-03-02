var _lat, _lng; var _storeinfo; var _currentcityname;

//$(function () { plusReady(); });
function plusReady() {
    plus.navigator.setFullscreen(true);
    var currentView = plus.webview.currentWebview();
    _storeinfo = currentView.storeInfo;
    // 商家信息
    //_storeinfo = { "address": "拱墅区通益路111号LOFT49艺术仓库12号", "name": "Mamala西餐厅", "lat": 120.13155, "lng": 30.32024 };
    paintStoreInfo();
    // 画地图
    paintMap();
    // 获取当前位置
    gpsPosition();
    $("#back").on("click", function () {
        plus.navigator.setFullscreen(false);
        plus.webview.currentWebview().close();
    });
}

if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

function paintStoreInfo() {
    $("#storetitle").text(_storeinfo.name);
    $("#storeaddress").text(_storeinfo.address);
}


// 调用APIGPS定位
function gpsPosition() {
    plus.geolocation.getCurrentPosition(
        function (position) {
            //获取地理坐标信息
            var codns = position.coords;
            console.log("GPS:" + "X:" + codns.latitude + " Y:" + codns.longitude);
            convertBaiduLatLng(codns.latitude, codns.longitude);
        },
        function (e) { console.log("定位失败"); });
}
// 根据坐标获取当前城市
function getCurrentCity(lat, lng) {
    $.ajax({
        type: 'Get',
        url: configManager.RequstUrl + 'api/common/position?lat=' + lat + '&lng=' + lng
    }).done(function (data) {
        if (data.state != "success") { console.log(data.message); return; }
        _currentcityname = data.data.name;
    }).fail(function () {
        _currentcityname = JSON.parse(plus.storage.getItem(storageManager.currentcity)).name;
    });
}


// 当前坐标转化为百度坐标
function convertBaiduLatLng(lat, lng) {
    console.log("http://api.map.baidu.com/geoconv/v1/?coords=" + lng + "," + lat + "&from=1&to=5&ak=" + appSecrent.baidu_ak);
    $.ajax({
        type: "get",
        url: "http://api.map.baidu.com/geoconv/v1/?coords=" + lng + "," + lat + "&from=1&to=5&ak=" + appSecrent.baidu_ak,
        dataType: "JSONP",
        async: true
    }).done(function (data) {
        if (data.status != 0) { plus.nativeUI.alert(data.message); return; }
        var xy = data.result[0];
        _lat = xy.x;
        _lng = xy.y;
    }).fail(function () {
        //plus.nativeUI.alert("调用百度API失败");
    });
}

// 百度地图
function paintMap() {
    // 百度地图API功能
    var map = new BMap.Map("allmap");
    var point = new BMap.Point(_storeinfo.lat, _storeinfo.lng);
    map.centerAndZoom(point, 20);
    //map.addControl(new BMap.ZoomControl());

    var marker1 = new BMap.Marker(new BMap.Point(_storeinfo.lat, _storeinfo.lng));  // 创建标注
    map.addOverlay(marker1);              // 将标注添加到地图中

    //var myIcon = new BMap.Icon("../../images/location.gif",
    //new BMap.Size(14, 23), {
    //    // 指定定位位置。     
    //    // 当标注显示在地图上时，其所指向的地理位置距离图标左上      
    //    // 角各偏移7像素和25像素。您可以看到在本例中该位置即是     
    //    // 图标中央下端的尖角位置。      
    //    anchor: new BMap.Size(7, 25),
    //});
    //var locationpoint = new BMap.Marker(new BMap.Point(_lat,_lng), { icon: myIcon });

    //// 创建标注对象并添加到地图     
    //map.addOverlay(locationpoint);


    $("#btnSearchRoute").on("click", function () {
        /*start|end：（必选）
		{name:string,latlng:Lnglat}
		opts:
		mode：导航模式，固定为
		BMAP_MODE_TRANSIT、BMAP_MODE_DRIVING、
		BMAP_MODE_WALKING、BMAP_MODE_NAVIGATION
		分别表示公交、驾车、步行和导航，（必选）
		region：城市名或县名  当给定region时，认为起点和终点都在同一城市，除非单独给定起点或终点的城市
		origin_region/destination_region：同上
		*/
        var start = {
            name: "当前位置",
            latlng: new BMap.Point(_lat, _lng)
            //latlng: new BMap.Point(120.1145635196, 30.343378775704)
        }
        var end = {
            name: _storeinfo.name,
            latlng: new BMap.Point(_storeinfo.lat, _storeinfo.lng)
            //latlng: new BMap.Point(120.132085, 30.30803)

        }
        // 获取当前城市
        var opts = {
            //mode: BMAP_MODE_WALKING,
            region: _currentcityname
        }
        var searchObj = new BMap.RouteSearch();
        searchObj.routeCall(start, end, opts);
    });
}