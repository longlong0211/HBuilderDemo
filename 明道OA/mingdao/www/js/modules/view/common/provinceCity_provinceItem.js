define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var queryMap = parseURL();
	var provinceId = queryMap.get('provinceId');
	var cityId = queryMap.get('cityId');
	var uuid = queryMap.get('uuid');
	var $dbDataManager = require('manager/dbData');
	bindData = function(dbResult) {
		if (dbResult) {
			var resultRows = dbResult.rows.length;
			var sb = new StringBuilder();
			for (var r = 0; r < resultRows; r++) {
				sb.append(String.formatmodel($templete.getSelectItemItem(true), {
					itemValue: dbResult.rows.item(r)['ID'],
					itemName: dbResult.rows.item(r)['NAME']
				}));
			}
			$('#itemUL').empty().append(sb.toString());
			$nativeUIManager.wattingClose();
			if (provinceId) {
				$('li[value="' + provinceId + '"]', '#itemUL').addClass('choosed');
			}
			bindEvent();

		}
	};
	loadData = function() {
		$nativeUIManager.watting('正在加载省份', false);
		$dbDataManager.getProvinceList(function(dbResult) {
			bindData(dbResult);
		});
	};
	bindEvent = function() {
		$common.touchSME($('li', '#itemUL'),
			function(startX, startY, endX, endY, event, startTouch, o) {},
			function(startX, startY, endX, endY, event, moveTouch, o) {}, function(startX, startY, endX, endY, event, o) {
				if (startX == endX && startY == endY) {
					if (!$(o).hasClass('active')) {
						$('li', '#itemUL').removeClass('choosed');
						$(o).addClass('choosed');
						var pId = $(o).attr('value');
						var pName = $(o).attr('text');
						var city = plus.webview.create('provinceCity_cityItem.html?provinceId=' + pId + '&provinceName=' + pName + '&cityId=' + cityId + '&uuid=' + uuid, 'provinceCity_cityItem', {
							top: "45px",
							bottom: "0px",
							scrollIndicator: 'vertical'
						});
						city.addEventListener("loaded", function() {
							$windowManager.opener().append(city);
						}, false);
						window.setTimeout(function() {
							$(o).removeClass('active');
						}, 100);
					}
				}
			});
	};
	plusReady = function() {
		loadData();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});