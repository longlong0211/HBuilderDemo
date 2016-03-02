define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var queryMap = parseURL();
	var provinceId = queryMap.get('provinceId');
	var provinceName = queryMap.get('provinceName');
	var cityId = queryMap.get('cityId');
	var uuid = queryMap.get('uuid');
	var $dbDataManager = require('manager/dbData');
	getCurrentId = function() {
		var current = '';
		var currentText = '';
		if ($('li.choosed', '#itemUL').size() > 0) {
			var li = $('li.choosed', '#itemUL');
			if (li) {
				current = $(li).attr('value');
				currentText = $(li).attr('text');
				var applyEdit = $windowManager.getById('apply_edit');
				if (applyEdit) {
					applyEdit.evalJS('setProvinceCityItem("' + uuid + '","'+provinceName+'","'+provinceId+'","' + currentText + '","' + current + '")');
				}
			}
		} else {
			var applyEdit = $windowManager.getById('apply_edit');
			if (applyEdit) {
				applyEdit.evalJS('setProvinceCityItem("' + uuid + '","","","","")');
			}
		}
		var selectHead = $windowManager.opener().opener();
		if (selectHead) {
			selectHead.close('slide-out-right');
		}
	};
	bindData = function(dbResult) {
		if (dbResult) {
			var resultRows = dbResult.rows.length;
			var sb = new StringBuilder();
			for (var r = 0; r < resultRows; r++) {
				sb.append(String.formatmodel($templete.getSelectItemItem(false), {
					itemValue: dbResult.rows.item(r)['ID'],
					itemName: dbResult.rows.item(r)['NAME']
				}));
			}
			$('#itemUL').empty().append(sb.toString());
			$nativeUIManager.wattingClose();
			if (cityId) {
				$('li[value="' + cityId + '"]', '#itemUL').addClass('choosed');
			}
			bindEvent();
		}
	};
	loadData = function() {
		$nativeUIManager.watting('正在加载城市', false);
		$dbDataManager.getCityList(provinceId, function(dbResult) {
			bindData(dbResult);
		});
	};
	bindEvent = function() {
		$windowManager.opener().opener().evalJS('showOkBtn()');
		$common.touchSME($('li', '#itemUL'),
			function(startX, startY, endX, endY, event, startTouch, o) {},
			function(startX, startY, endX, endY, event, moveTouch, o) {}, function(startX, startY, endX, endY, event, o) {
				if (startX == endX && startY == endY) {
					if (!$(o).hasClass('active')) {
						if (!$(o).hasClass('choosed')) {
							$('li', '#itemUL').removeClass('choosed');
							$(o).addClass('choosed');
						} else {
							$(o).removeClass('choosed');
						}
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