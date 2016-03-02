function plusReady(){
	

	
	BindEvent();
	
}

if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

function BindEvent(){

	
	$("#sharepop").on("click", function () { $(this).hide(); });
	$("#invite").on("click", function(){
		

        var currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
        if (!currentuser) { clicked('../account/login.html',false,false,'slide-in-bottom'); return; }
        $("#sharepop").show();
		
	})
	
    $("li[name=shareitem]").on("click", function () {
        var item = $(this).attr("tip");
        // 分享二维码必须在本地
        var currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
        if (!currentuser.barcode) { CreateUserBarCode(currentuser, item); return; }

        shareShow("扫一扫，关注我们", currentuser.barcode, item);
    });	
	
}
