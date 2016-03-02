//$(function () { plusReady(); })

var _currentuser, _cardinfo;

function plusReady() {
	// 获取当前用户
	_currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
	_cardinfo = JSON.parse(plus.storage.getItem(storageManager.bankcardinfo));
	plus.storage.removeItem(storageManager.bankcardinfo);

	PaintPage();
	BindEvent();
}

if (window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}
// 银行卡列表
function PaintPage() {
	
	console.log(JSON.stringify(_cardinfo));
	
	var html = [];
	html.push("<div class='item-03-wrap  mt20'><ul class='select-pay-block'><li><div class='pay-item'>");
	html.push("<label><img src='../../../../images/bank/" + _cardinfo.bank_code + ".jpg' width='50' height='40' /></label>");
	html.push("<span><h2>" + _cardinfo.bank + "</h2><p>尾号" + _cardinfo.last4num + _cardinfo.card_type + "</p></span>");
	html.push("</div></li></ul></div>");
	
	
//	html.push("<div class='item-01-wrap  mt10'><div class='text-info-block data-input-block'> <label>次日24小时前到账</label>");

   	html.push("<div class='item-01-wrap  mt10'><div class='text-info-block data-input-block'> <label>选择到账时间:</label>");
	html.push("<select disabled='disabled' style='color:#069; border:none; height:25px; width:10em; margin-top:-10px; font-size:0.9em;' id='paymentdate'>");
	html.push("<option selected='selected'  value='t1'>次日24小时前到账</option>");
	html.push("<option value='t0'>2小时内到账</option>");
	html.push("</select>");
//	html.push("<i class=\"arrow sign down icon\"></i>");
	html.push("</div></div>");

	html.push("<div class='item-01-wrap  mt10'>");
	html.push("<div class='data-input-block'> <label>余额转出金额:</label> <span> <input type='tel' id='transfteramount' class='date-text-inp' placeholder='请输入金额' /></span></div>");
	html.push("</div>");

	html.push("<div class='item-02-wrap' ><input type='button' id='btntransfer' class='base-btn-inp t-c gray-bg' value='确认转出' /></div>");

	$("#content").html(html.join(""));
}

function BindEvent() {
	// 转账
	$("#content").on("click", "#btntransfer", function() {
		transfer();
	});

	$("#content").on("keyup", "#transfteramount", function() {
		var chargeAmount = $(this).val();
		if (chargeAmount && chargeAmount.trim()) {
			if ($("#btntransfer").hasClass("gray-bg")) {
				$("#btntransfer").removeClass("gray-bg");
			}
		} else {
			if (!$("#btntransfer").hasClass("gray-bg")) {
				$("#btntransfer").addClass("gray-bg");
			}
		}
	});
}

// 账户提现接口
function transfer() {
	var money = $("#transfteramount").val();
	var type = 1;// $("#paymentdate").val() == "t0" ? 0 : 1;
	$.ajax({
		type: "POST",
		async: true,
		url: configManager.RequstUrl + "api/account/cash",
		data: {
			"userid": _currentuser.id,
			"token": _currentuser.token,
			"type": type,
			"card": _cardinfo.id,
			"money": money
		}
	}).done(function(data) {
		if ("success" != data.state) {
			plus.nativeUI.alert(data.message);
			return;
		}
		plus.nativeUI.alert(data.message);
        plus.webview.currentWebview().opener().close("none");
        plus.webview.currentWebview().close("none");
        plus.webview.getWebviewById("wallet/wallet.html").evalJS("plusReady()");
	});
}