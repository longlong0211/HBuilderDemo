var _currentuser;
function plusReady() {
    _currentuser = JSON.parse(plus.storage.getItem(storageManager.user));

    //初始化
    init();

    // 广告
    PaintAdv();
}

if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

function init() {
    if (2 == _currentuser.user_type || 3 == _currentuser.user_type) {
        paintStoreUserWallet(_currentuser.user_type);
    } else {
        paintAccontUserWallet();
    }
	
    var account = ( 3 == _currentuser.user_type ) ? _currentuser.parent.account : _currentuser.account;
    if (account) {
    	$("#all").text(account.all);
        $("#cash").text(account.cash);
        $("#card").text(account.card);
        $("#coin").text(account.coin);
        $("#pos").text(account.pos);
        $("#frozen").text(account.frozen);
    }
    
    //console.log(JSON.stringify(account));
    
    //余额转出
	$("#transfer a").on("click", function(){
		if( 0 == _currentuser.auth_status ){
			plus.ui.alert("对不起您还未通过实名认证", function() { 
				clicked("../../account/unautherized.html", false, false, "slide-in-right"); 
			}, configManager.alerttip, configManager.alertCtip);
		}
		else{
			clicked('transfer/choose.html', false, false, 'slide-in-right');
		}
	});
	//绑定银行卡
	$("#bbnone a").on("click", function(){
//		if( 0 == _currentuser.auth_status ){
//			plus.ui.alert("对不起您还未通过实名认证", function() { 
//				clicked("../../account/unautherized.html", false, false, "slide-in-right"); 
//			}, configManager.alerttip, configManager.alertCtip);
//		}
//		else{
			clicked('bankcard/manager.html', false, false, 'slide-in-right');
//		}
	});
	//充值
	$("#charge a").on("click", function(){
//		if( 0 == _currentuser.auth_status ){
//			plus.ui.alert("对不起您还未通过实名认证", function() { 
//				clicked("../../account/unautherized.html", false, false, "slide-in-right"); 
//			}, configManager.alerttip, configManager.alertCtip);
//		}
//		else{
			clicked('charge/choose.html', false, false, 'slide-in-right');
//		}
	});

}

// 画页面商家
function paintStoreUserWallet(usertype) {
    var html = [];
    html.push("<div class='grxinxis'>");
    
    
    html.push("<p><a onclick=\"clicked('income.html?t=all',false,false,'slide-in-right')\"><span><b id='all'>0.00</b><i class='angle right icon' ></i> </span>可结算款（余额）</a></p>");
    html.push("<p><a onclick=\"clicked('income.html?t=cash',false,false,'slide-in-right')\"><span><b id='cash'>0.00</b><i class='angle right icon'></i> </span>平台交易额</a></p>");
    html.push("<p><a onclick=\"clicked('income.html?t=pos',false,false,'slide-in-right')\"><span><b id='pos'>0.00</b><i class='angle right icon'></i> </span>POS交易额</a></p>");
	html.push("<p><a onclick=\"clicked('income.html?t=frozen',false,false,'slide-in-right')\"><span><b id='frozen'>0.00</b><i class='angle right icon'></i> </span>商户保证金</a></p>");
    html.push("<p><a onclick=\"clicked('income.html?t=coin', false, false, 'slide-in-right')\"><span><b id='coin'>0</b> <i class='angle right icon'></i> </span>金币</a></p>");

    if (usertype == 2) {
        //html.push("<p id='transfer'><a href='javascript:void(0);'><span> <b>&nbsp;</b> <i class='angle right icon'></i> </span>余额转出</a></p>");
        html.push("<p id='bbnone'><a href='javascript:void(0);'><span> <b>&nbsp;</b> <i class='angle right icon'></i> </span>银行卡  </a></p>");
    }
    html.push("</div>");

    $("#itemlist").html(html.join(""));
}

// 画其他会员
function paintAccontUserWallet() {
    var html = [];
    html.push("<div class='grxinxis'>");
    html.push("<p><a onclick=\"clicked('income.html?t=cash',false,false,'slide-in-right')\"><span><b id='cash'> 0.00元</b> <i class='angle right icon'></i> </span>余额</a></p>");
    html.push("<p id='membercard'><a onclick=\"clicked('income.html?t=card', false, false, 'slide-in-right')\"><span><b id='card'> 0.00元</b> <i class='angle right icon'></i> </span>会员卡</a></p>");
    html.push("<p><a onclick=\"clicked('income.html?t=coin', false, false, 'slide-in-right')\"><span><b id='coin'>0</b> <i class='angle right icon'></i> </span>金币</a></p>");
    html.push("<p id='charge'><a href='javascript:void(0);'><span> <b>&nbsp;</b> <i class='angle right icon'></i> </span>充值</a></p>");
//  html.push("<p id='transfer'><a href='javascript:void(0);'><span> <b>&nbsp;</b> <i class='angle right icon'></i> </span>余额转出</a></p>");
    html.push("<p id='bbnone'><a href='javascript:void(0);'><span> <b>&nbsp;</b> <i class='angle right icon'></i> </span>银行卡  </a></p>");
    html.push("</div>");

    $("#itemlist").html(html.join(""));
}


// 画广告位
function PaintAdv() {
    // 头部
    $.ajax({
        type: 'Get',
        url: configManager.RequstUrl + "api/ads/posi?mark=moneybag"
    }).done(function (data) {
        if (data.state != "success") { console.log(data.message); return; }
        if (!data.data.ads || data.data.ads.length <= 0) { return; }

        var html = [];
        html.push("<div class='mui-slider-group mui-slider-loop'>");

        for (var i = 0; i < data.data.ads.length; i++) {
            var adv = data.data.ads[i];
            var src = "../../../images/moneybag.jpg";
            if (i == 0) {
                html.push("<div class='mui-slider-item mui-slider-item-duplicate'><a><img name='adsimg" + i + "' src='" + src + "'></a></div>");
            }

            html.push("<div class='mui-slider-item'><a><img name='adsimg" + i + "' src='" + src + "'></a></div>");

            if (i == data.data.ads.length - 1) {
                html.push("<div class='mui-slider-item mui-slider-item-duplicate'><a><img name='adsimg" + i + "' src='" + src + "'></a></div></div>");
            }
        }

        html.push("<div class='mui-slider-indicator'>");
        for (var i = 0; i < data.data.ads.length; i++) {
            var indi = (i == 0) ? "<div class='mui-indicator mui-active'></div>" : "<div class='mui-indicator'></div>";
            html.push(indi);
        }
        html.push("</div>");
       
        $("#slider").html(html.join(""));

        // 下载广告
        for (var i = 0; i < data.data.ads.length; i++) {
            var adv = data.data.ads[i];
            var httpurl = configManager.adsImgurl.format(adv.pic, "") + '640-220';

            setAdsImg("#slider", adv.pic, httpurl, i);
        }
        
        settingAdvScroll();
    });
}

// 设置广告滚动
function settingAdvScroll() {
    mui.init({
        swipeBack: true //启用右滑关闭功能
    });
    var slider = mui("#slider");
    slider.slider({ interval: 3000 });
}

// 获取图片路径
function setAdsImg(adspostion, picid, httpImageUrl, adsIndex) {
    var filename = (plus.io.PUBLIC_DOWNLOADS + "/ads/" + picid + ".png");

    // 是否存在
    plus.io.resolveLocalFileSystemURL("_downloads/" + filename, function (entry) {
        var url = entry.toLocalURL();
        $(adspostion + " img[name=adsimg" + adsIndex + "]").attr("src", url);
    },
   function (e) {
       downloadAdsImg(adspostion, filename, httpImageUrl, adsIndex);
   });
}

function downloadAdsImg(adspostion, filename, httpImageUrl, adsIndex) {
    // 下载本地
    var dtask = plus.downloader.createDownload(httpImageUrl, { filename: filename }, function (d, status) {
        // 下载完成
        if (status == 200) {
            var url = "file://" + plus.io.convertLocalFileSystemURL(d.filename);
            $(adspostion + " img[name=adsimg" + adsIndex + "]").attr("src", url);
        } else {
        }
    });
    dtask.start();
}
