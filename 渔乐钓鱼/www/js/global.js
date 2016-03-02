var appname="渔乐钓鱼";
var appid = "H5B2A27D8";
var apppackage = "com.fishyl.H5B2A27D8";
var appver_android = "2.0.2";
var appver_ios = "2.0.2";
var apiurl  = "http://api.fishyl.com/";
var apikey = "fishyl_2#33SYWCXLLS";
var picurl = "http://pic.fishyl.com/";
var wwwurl = "http://app.fishyl.com/";
var mainurl = "http://www.fishyl.com/";
var appdesc = "畅享自然，渔乐无穷";

 
if(GetSystem()=="ios" && CurentDate()<= "2015-11-10")
{
	 apiurl = "http://api.shopjia.com/";
	 picurl = "http://pic.shopjia.com/";
}
 

	
function GetVersion(s){
	
	if(s=="ios"){
		return appver_ios;
	}
	else{
		return appver_android;
	}
	
}

function GetSystem()
{
	return mui.os.android?"android":"ios"; 
}

function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
	var r = window.location.search.substr(1).match(reg);
	if (r!=null) return (r[2]); return null;
}

function CurentDate()
{ 
    var now = new Date();
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日
    var clock = year + "-";
    if(month < 10) clock += "0";
    clock += month + "-";
    if(day < 10) clock += "0";
    clock += day + ""; 
    return(clock); 
} 

function PreviousDate()
{ 
    var now = new Date(new Date()-24*60*60*1000);
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日
    var clock = year + "-";
    if(month < 10) clock += "0";
    clock += month + "-";
    if(day < 10) clock += "0";
    clock += day + ""; 
    return(clock); 
} 

function CurentTime()
{ 
    var now = new Date();
   
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日
   
    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
   
    var clock = year + "-";
   
    if(month < 10)
        clock += "0";
   
    clock += month + "-";
   
    if(day < 10)
        clock += "0";
       
    clock += day + " ";
   
    if(hh < 10)
        clock += "0";
       
    clock += hh + ":";
    if (mm < 10) clock += '0'; 
    clock += mm; 
    return(clock); 
} 

// 开始播放
function startPlay( url ) {
	if(config_notify_disturb=="0")
	{
		p = plus.audio.createPlayer( url );
		p.play( function () {
			console.log( "播放完成！" );
		}, function ( e ) {
			console.log( "播放音频文件\""+url+"\"失败："+e.message );
		} );
	}
}

function deviceVibrate() {
	if(config_notify_disturb=="0")
	{
	    var str = "";
	    switch ( plus.os.name ) {
	    	case "iOS":
	            if ( plus.device.model.indexOf("iPhone") >= 0 ) {
	                plus.device.vibrate();
	                str += "设备振动中...";
	            } else {
	                str += "此设备不支持振动";
	            }
	    	break;
	    	default:
	    		plus.device.vibrate();
	            str += "设备振动中...";
	    	break;
	    }
		console.log( str );
	}
}

var index=null;
mui.plusReady(function () {
	//获得主页面webview引用；
	index = plus.webview.currentWebview().opener();
})

  
