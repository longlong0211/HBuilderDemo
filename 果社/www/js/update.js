var server = "http://www.guoshe.cc/tools/index.ashx?action=get_update"; //获取升级描述文件服务器地址

function update() {


	mui.ajax(server, {
		data: {
			"appid": plus.runtime.appid,
			"version": plus.runtime.version, //版本号
			"imei": plus.device.imei
		},
		dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				if (data.status == "1") {
					//plus.ui.confirm(data.note, function(i) {
					plus.nativeUI.confirm(data.note, function(i) {
						if(0==i.index){
						//if (0 == i) {
							plus.runtime.openURL(data.url);
						}
					}, "果社", ["立即更新", "取　　消"]);
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；

				console.log(type);
			}
	});

}

mui.plusReady(update);