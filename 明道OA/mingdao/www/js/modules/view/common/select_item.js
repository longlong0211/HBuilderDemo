define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var queryMap = parseURL();
	var currentId = queryMap.get('id');
	var winId = queryMap.get('winId');
	var keyValue = queryMap.get('keyValue');
	var uuid = queryMap.get('uuid');
	getCurrentId = function() {
		var current = '';
		if ($('li.choosed', '#itemUL').size() > 0) {
			var li = $('li.choosed', '#itemUL');
			if (li) {
				current = $(li).attr('value');
				var currentText=$(li).attr('text');
				var applyEdit = $windowManager.getById(winId);
				if (applyEdit) {
					applyEdit.evalJS('setSelectItem("' + uuid + '","' + currentText + '","' + current + '")');
				}
			}
		} else {
			var applyEdit = $windowManager.getById(winId);
			if (applyEdit) {
				applyEdit.evalJS('setSelectItem("' + uuid + '","","")');
			}
		}
		var selectHead = $windowManager.opener();
		if (selectHead) {
			$userInfo.removeItem('itemJsonData');
			selectHead.close('slide-out-right');
		}

	};
	loadData = function() {
		var itemJsonData = JSON.parse($userInfo.get('itemJsonData'));
		if (itemJsonData && $(itemJsonData).size() > 0) {
			var sb = new StringBuilder();
			var kv=keyValue.split('_');
			$(itemJsonData).each(function(i, o) {
				sb.append(String.formatmodel($templete.getSelectItemItem(false), {
					itemValue: o[kv[0]],
					itemName: o[kv[1]]
				}));
			});
			$('#itemUL').empty().append(sb.toString());
			if (currentId) {
				$('li[value="' + currentId + '"]', '#itemUL').addClass('choosed');
			}
			bindEvent();
		}
	};
	bindEvent = function() {
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