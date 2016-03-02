// 压缩图片
function compressImage(fromimg, toimg){
	var back = false;
	//plus.nativeUI.showWaiting();
	plus.zip.compressImage({
		src: fromimg,//"_www/img/shake/1.jpg",
		dst: toimg, //"_doc/cm.jpg",
		quality:60,
		overwrite:true,
		width:'600px',
		clip:{
			top:"0%",
			left:"0%",
			width:"100%",
			height:"100%"
		}
	},
	function(i){
		back = true;
		//plus.nativeUI.closeWaiting();
		console.log("压缩图片成功："+JSON.stringify(i));
	},function(e){
		back = false;
		//plus.nativeUI.closeWaiting();
		console.log("压缩图片失败: "+JSON.stringify(e));
	});
	
	return back;
}