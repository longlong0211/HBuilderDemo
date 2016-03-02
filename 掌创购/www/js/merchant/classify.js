$(function(){
	plusReady();
//	BindEvent();
});
function plusReady() {

    InitPage();

    BindEvent();
}
//if (window.plus) {
//  plusReady();
//} else {
//  document.addEventListener('plusready', plusReady, false);
//}

function InitPage() {

    $.ajax({
        type: "get",
        url: "http://www.o2abc.net/api/common/category?parent=0&hassub=1",
        async: true
    }).done(function (data) {
        if ("success" != data.state) { plus.ui.alert(data.message, function () { }, configManager.alerttip, configManager.alertCtip); return false; }

        PaintPage(data.data);

    });
}

function PaintPage(category) {
    var html = [];
    var display = "";
    $.each(category, function (i, cate) {
    	display = "";
        html.push('<dl class="flnr"><dt><a href="javascript:void(0);">' + cate.name + '</a></dt>');
        
        html.push('<dd tip="' + cate.id + "|0|" + cate.name + '"><a href="javascript:void(0);">全部</a></dd>');        
        
        
        $.each(cate.sub, function (j, sub) {

        	if(sub.name.length > 5){
        		sub.name = sub.name.substr(0,5) + "...";
        	}
        	
        	if( (j+2) == 12 && (cate.sub.length+1)>12 ){
        		html.push('<dd id="showleft"><a href="javascript:void(0);"> <i style="" class="angle down icon"></i>&nbsp;&nbsp; </a></dd>');
        		display = "style= 'display:none'";
        	}
        	
        	html.push('<dd '+ display +' tip="' + cate.id + "|" + sub.id + "|" + sub.name + '"><a href="javascript:void(0);" >' + sub.name + '</a></dd>');
        	        	
			//补空白
        	if( cate.sub.length == (j+1) && ((cate.sub.length+1)%4) != 0 ){
        		var blankcount = ( (cate.sub.length + 1) > 12 ) ? ((cate.sub.length + 2) % 4) : ((cate.sub.length + 1) % 4);
        		
        		blankcount = 4 - blankcount;
        		
//      		console.log(cate.name + " " + (cate.sub.length) +  " " +  blankcount );
        		
        		
        		if( blankcount>0 && blankcount<4 ){
        			for(var k=0; k<blankcount; k++){
        				html.push('<dd '+ display +' ><a href="javascript:void(0);">&nbsp;&nbsp;</a></dd>');
        			}
        		}
        		if( display.length > 0 ){
        			html.push('<dd '+ display +' ><a href="javascript:void(0);">&nbsp;&nbsp;</a></dd>');
        		}
        	}
        });
        
        html.push('</dl>');
    });
    
    $("#allclassify").html(html.join(""));
}

function BindEvent() {	
	
	$("#allclassify").on("click", "#showleft", function(){
		
		$(this).nextAll().show();
		$(this).remove();
	});
	
    $("#allclassify").on("click", "dd", function () {
        var tip = $(this).attr("tip");
        if(tip){
	        // 跳转商家列表
	        plus.webview.getWebviewById(pageName.main).evalJS("redirect('footermerchant')");
	        var targepage = plus.webview.getWebviewById(pageName.merchant);
	        if (targepage) {
	            plus.webview.getWebviewById(pageName.merchant).evalJS("receiveHomeEvent('" + tip + "')");
	        } else {
	            plus.storage.setItem(storageManager.merchantInitParams, tip);
	        }
	        plus.webview.currentWebview().close();
        }
    });

    // 回退
    $("#back").on("click", function () {
        plus.webview.currentWebview().close();
    });
}
