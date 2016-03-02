//$(function() {	plusReady();})

function plusReady() {
	var currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
	var jqXHR = $.ajax({
		type: 'Get',
		url: configManager.RequstUrl + 'api/common/qrcode?type=login&code=' + currentuser.code
	});
	jqXHR.done(function(data) {
		if (data.state != "success") {
			console.log(data.message);
			return;
		}
		$("#shopbarcode").html("<img src='" + data.uri + "'><br />扫一扫二维码，关注店铺");
	});
}

if (window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}