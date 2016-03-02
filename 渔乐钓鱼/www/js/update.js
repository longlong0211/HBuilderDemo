function update(type){
	var server=apiurl+"update.ashx";//获取升级描述文件服务器地址
	mui.getJSON(server,{"appid":appid,"version":GetVersion(GetSystem()),"system":GetSystem(),"imei":plus.device.imei},function (data) {
		
		data.title = decodeURIComponent(data.title);
		data.note = decodeURIComponent(data.note);
		data.url = decodeURIComponent(data.url);
		data.version = decodeURIComponent(data.version);
		
		if(data.status){
			plus.storage.setItem("update",data.version);
			//plus.nativeUI.confirm
			plus.ui.confirm( data.note, function(e){
				if ( 0==e.index ) {  
					plus.runtime.openURL( data.url );
				}
			}, data.title, ["立即更新","取　　消"] );
		}else{
			plus.storage.setItem("update","");
			if(type=="update"){
				mui.toast('渔乐app 已是最新版本~');
			}
		}
	});
}

