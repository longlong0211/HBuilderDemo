var domain = "http://www.o2abc.com/";
//var domain = "http://test.o2abc.com/";
var configManager=
{
	    "RequstUrl"			: domain
	    ,"validateaddress"	: "http://api.map.baidu.com/geocoder/v2/?ak=YRy3onEQ3n0Wmdb20jLEHTaY&output=json&address={0}"
	    ,"avatarImgurl"		: domain + "img/avatar-{0}/{1}"
	    ,"storeImgurl"		: domain + "img/store-{0}/{1}"
	    ,"authImgurl"		: domain + "img/auth-{0}/{1}"
	    ,"goodsImgurl"      : domain + "img/goods-{0}/{1}"
	    ,"reviewImgurl"     : domain + "img/review-{0}/{1}"
	    ,"feedImgurl"     	: domain + "img/feed-{0}/{1}"
	    ,"adsImgurl"     	: domain + "img/ads-{0}/{1}"
	    ,"imgwid"			: "180" //首页，商品，商家列表中的图片宽
	    ,"imghei"			: "150"  //首页，商品，商家列表中的图片高
	    ,"alerttip"			: "掌创购"
	    ,"alertCtip"		: "确定"
	    ,"coinrate"			: "100" //金币和人民币兑换比率
	    ,"senddelay"		: 60	//发送短信的延迟时间 单位：秒
	    ,"paytype"			: { 
	    						"offline"		: "0", //到店刷卡支付
	    						"membercard"	: "1", //掌创购会员，余额支付
	    						"online"		: "2", //在线银行卡支付
	    						"alipay"		: "3", //支付宝支付
    							"webchat"		: "4", //微信支付
    						  }
	    ,"ordertag"			: { //个人
								"pay"			: "付款",
								"ordercode"		: "订单码",
								"consumecode" 	: "消费码",
								"unappraise"	: "待评价",
								"appraised"		: "已评价",
								"refunding"		: "退款中",
								"refundsuccess"	: "已退款", //"退款成功"4个字占用空间太大 
								"refund"		: "退款",
								"canceled"		: "已取消",
								//商家
								"payed" 		: "已付款",
								"unconsumecode"	: "未消费",
								"unpay" 		: "未付款", 
								"agreerefund" 	: "退款中", //"同意退款"4个字占用空间太大
								"finish" 		: "已完成",
								"applyrefund" 	: "申请退款",
								"close" 		: "取消"
	    					  }
    	,"weixinchargeurl"	: domain + "pay/weixin/mobile.php"	//微信充话费
    	,"wexinpayurl"		: domain + "pay/weixin/index.php"	//微信支付
}

var pageName = {
	"main":"main.html"
	,"home":"home.html"
	,"merchant":"../merchant/merchantlist.html"
	,"mine":"../mine/mine.html"
	,"more":"more.html"
	,"scanbarcode":"../../plus/barcode_scan.html"
	,"city":"../home/city.html"
}

var storageManager=
{
	    "currentcity"	: 'storagekeycurrentcity'     // 当前城市
	    ,"user"			: "user"
	    ,"searchtext"	:"searchtext"
	    ,"groupbysearchtext"	:"groupbysearchtext"
	    ,"scanbarcode"     : "scanbarcodeInfo"
	    ,"cart"			: "cart"
	    ,"groupgoods" : "groupgoods"                  // 立即购买产品
	    ,"temporder"	: "temporder"
	    ,"bankcardinfo":"bankcardinfo"                // 银行卡信息
	    ,"merchantInitParams":"merchantInitParams"
	    ,"showWelcome": "showWelcome"                 // 是否显示欢迎页
	    ,"exctPlusReadyPages":"exctPlusReadyPages"    // 执行了plusReady的页面
	    ,"latestMsgTime": "latestMsgTime"            // 最新查看消息时间
        ,"latestJSVersion": "latestJSVersion"        // 最新版本号
}

var errorMessage=
{
		 "system"	: '系统错误' // 当前城市
	    ,"network"	: "网络异常，请检查网络连接"
	    ,"interface":"您的网络太不给力了！"
}

// 秘钥
var appSecrent =
{
	   "baidu_ak":"YRy3onEQ3n0Wmdb20jLEHTaY"	// 百度地图
}

// 短信推送
var smsMessage =
{
    "commit": "外卖订单，  订单号： {0} ， 会员号：{1}， 联系电话：{2}， 等待确认"    
	, "confirm": "外卖订单，  订单号： {0} ，  店铺名：{1}，  联系电话：{2}，  商家已接单，商品准备中"
	, "haveDelivery": "外卖订单，  订单号： {0} ，  店铺名：{1}，  联系电话：{2}，  已送出，狂奔在路上"
}

//实现字符串trime
String.prototype.trim = function()
{
	return this.replace(/(^\s*)|(\s*$)/g, "");
}
//实现字符串format功能
String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {    
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}
//实现Date的format功能
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function sleep(numberMillis) { 
	var now = new Date(); 
	var exitTime = now.getTime() + numberMillis; 
	while (true) { 
		now = new Date(); 
		if (now.getTime() > exitTime) 
		return;
	} 
}