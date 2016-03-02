(function(mui, window, document, undefined) {
	mui.init();
	var get = function(id) {
		return document.getElementById(id);
	};
	var qsa = function(sel) {
		return [].slice.call(document.querySelectorAll(sel));
	};
	var ui = {
		name: get('pointname'),
		question: get('question'),
		province: get('province'),
		city: get('city'),
		district: get('district'),
		address: get('address'),
		pos: get('selectPos'),
		longt: get('longtpos'),
		lat: get('latpos'),
		bossname: get('bossname'),
		bosstel: get('bosstel'),
		cosmoney: get('cosmoney'),
		userpick: get('showUserPicker'),
		paypick: get('showPayPicker'),
		typepick: get('showtypePicker'),
		//bossname: get('bossname'),
		//imageList: get('image-list'),
		submit: get('submit')
	};
	ui.clearForm = function() {
		ui.name.value = '';
		ui.question.value = '';
		ui.province.value = '';
		ui.city.value = '';
		ui.district.value = '';
		ui.address.value = '';
		ui.pos.value = '';
		ui.longt.value = '';
		ui.lat.value = '';
		ui.bossname.value = '';
		ui.bosstel.value = '';
		ui.cosmoney.value = '';
		ui.userpick.value = '';
		ui.paypick.value = '';
		ui.typepick.value = '';
		//ui.imageList.innerHTML = '';
		//ui.newPlaceholder();
	};
	
	ui.submit.addEventListener('tap', function(event) {
		if (document.getElementById("pointname").value == '') {
			return mui.toast('钓点名称不能为空');
		}
		
		//开始提交数据
		feedback.send({
			name: ui.name.value,
			question: ui.question.value,
			province: ui.province.value,
			city: ui.city.value,
			district: ui.district.value,
			address: ui.address.value,
			pos: ui.pos.value,
			longt: ui.longt.value,
			lat: ui.lat.value,
			bossname: ui.bossname.value,
			bosstel: ui.bosstel.value,
			cosmoney: ui.cosmoney.value,
			userpick: ui.userpick.value,
			paypick: ui.paypick.value,
			typepick: ui.typepick.value,
			user_id: uid,
			user_name: nickname,
			//images: ui.getFileInputIdArray()
		}, function() {
			 
			mui.toast('感谢您提交钓点！');
			ui.clearForm();
			mui.back();
		});
	}, false);
	
	feedback.send = function(content, callback) {
			
				mui.plusReady(function() {
				
				 var wt = plus.nativeUI.showWaiting();
				
				var url_index=apiurl+"IPondsAdd.ashx?name="+encodeURIComponent(content.name);
				url_index += "&content="+encodeURIComponent(content.question);
				url_index += "&province="+encodeURIComponent(content.province);
				url_index += "&city="+encodeURIComponent(content.city);
				url_index += "&district="+encodeURIComponent(content.district);
				url_index += "&address="+encodeURIComponent(content.address);
				url_index += "&longt="+encodeURIComponent(content.longt);
				url_index += "&lat="+encodeURIComponent(content.lat);
				url_index += "&contacter="+encodeURIComponent(content.bossname);
				url_index += "&telphone="+encodeURIComponent(content.bosstel);
				url_index += "&money="+encodeURIComponent(content.cosmoney);
				url_index += "&typename="+encodeURIComponent(content.userpick);
				url_index += "&paytypename="+encodeURIComponent(content.paypick);
				url_index += "&fishes="+encodeURIComponent(content.typepick);
				//url_index += "&pic="+encodeURIComponent(content.images);
				url_index += "&user_id="+encodeURIComponent(content.user_id);
				url_index += "&user_name="+encodeURIComponent(content.user_name);
				
				var xhr_index=null;
 
				
				 
				sendtointerface("","",url_index,function(responseText,status){
					var data=eval("("+responseText+")");
                	if(data.retisok==1 )
                	{
                		if(files.length<=0){
				 			mui.toast("感谢您提交钓点，我们会尽快进行审核！");
				 			
				 			files=[];
				 			filesnum = 0;
				 			filenumtotal = 0;
				 			plus.nativeUI.closeWaiting();
				 			jQuery("#imagelist").html();
				 			mui.back();
				 			//oldback();
						}
                		else
                		{
                			plus.nativeUI.closeWaiting();
                			insertid = data.indexid;
                			postupload(insertid);
                			 
                		}  
                		
                		
                		
                		
                		
                	}else{
                		
                		mui.toast( "不小心失败了，"+data.retmessage );
                		
                		plus.nativeUI.closeWaiting();
                	}
				},function(){wt.close(); });
			
			});
			
			
			
				
				

	};
})(mui, window, document, undefined);