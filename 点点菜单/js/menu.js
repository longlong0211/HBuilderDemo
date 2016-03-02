mui.init();
mui.plusReady(function() {
	var a = plus.webview.currentWebview();
	var b = a.name;
	rush(a, b)
});

function rush(a, b) {
	$.getJSON("../js/json/" + b + ".json?t=" + new Date().getTime(), function(d) {
		for (var c = 0; c < d.length; c++) {
			$(".mui-table-view").append('<li class="mui-table-view-cell mui-bar-tab" id="info" name="' + d[c].title + '" title="' + b + '"><a class="mui-navigate-right" name="chuanyu"><img class="mui-media-object mui-pull-left" src="' + d[c].food_img + '"><div class="mui-media-body">' + d[c].menu_name + '<p class="mui-ellipsis"><span class="mui-badge mui-badge-danger mui-badge-inverted">￥' + d[c].money + "</span></p></div></a></li>")
		}
		$(".title").html(d[0].name);
		$(".phoneh").append('<a class="phone">' + d[0].phone + "</a>");
		$(".shopimges").attr("src", "../image/" + b + ".jpg")
	}) 
}
var getName = null;
var getMenu = null;
mui(".mui-table-view").on("tap", "li", function(b) {
	getName = this.getAttribute("title");
	getMenu = this.getAttribute("name");
	if (getName) {
		var a = mui.openWindow({
			url: "food2.html",
			extras: {
				name: getName,
				menu: getMenu
			},
			show: {
				autoShow: true,
				aniShow: "slide-in-right",
				duration: "100ms"
			},
			waiting: {
				autoShow: false
			}
		})
	} else {
		mui.toast("还没准备好，客官请稍等o(∩_∩)o..")
	}
	console.log(getName)
});
mui(".header-m").on("tap", "a", function(b) {
	var a = mui.openWindow({
		url: "searchc.html",
		extras: {
			name: null
		}, 
		show: {
			autoShow: true,
			aniShow: "slide-in-right",
			duration: "100ms"
		},
		waiting: {
			autoShow: false
		}
	})
});
mui.back = function() {
	mui.currentWebview.close()
};