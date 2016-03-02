define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var queryMap = parseURL();
	var currentId = queryMap.get('id');
	var currentType = queryMap.get('type');
	var winId = queryMap.get('winId');
	var callFun = queryMap.get('callFun');
	var boss = queryMap.get('boss');
	var uuid = queryMap.get('uuid');
	showRoleItem = function() {
		var item = plus.webview.create('approve_roleItem.html?id=' + currentId + '&uuid=' + uuid + '&winId=' + winId + '&callFun=' + callFun+'&boss='+boss, 'approve_roleItem', {
			top: "45px",
			bottom: "0px",
			scrollIndicator: 'vertical'
		});
		item.addEventListener("loaded", function() {
			$windowManager.current().append(item);
		}, false);
	};
	showUserItem = function() {
		var item = plus.webview.create('approve_userItem.html?id=' + currentId + '&uuid=' + uuid + '&winId=' + winId + '&callFun=' + callFun, 'approve_userItem', {
			top: "45px",
			bottom: "0px",
			scrollIndicator: 'vertical'
		});
		item.addEventListener("loaded", function() {
			$windowManager.current().append(item);
		}, false);
	};
	loadWebview = function() {
		if (currentType) {
			if (currentType == '3') {
				showUserItem();
			} else {
				showRoleItem();
			}
		} else {
			showUserItem();
		}
	};
	plusReady = function() {
		loadWebview();
		var itemID = '';
		if (currentType) {
			if (currentType == '3') {
				itemID = 'approve_userItem';
			} else {
				itemID = 'approve_roleItem';
				$('dd', '.contaceTab').removeClass('current');
				$('dd[dir="role"]', '.contaceTab').addClass('current');
			}
		} else {
			itemID = 'approve_userItem';
		}
		$common.androidBack(function() {
			$windowManager.close('slide-out-right');
		});
		$common.touchSE($('#backAction'), function(event, startTouch, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
			}
		}, function(event, o) {
			if ($(o).hasClass('active')) {
				$windowManager.close('slide-out-right');
				$(o).removeClass('active');
			}
		});
		$common.touchSE($('#okBtn'), function(event, startTouch, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
			}
		}, function(event, o) {
			if ($(o).hasClass('active')) {
				var itemWindow = $windowManager.getById(itemID);
				if (itemWindow) {
					itemWindow.evalJS('getCurrentId()');
				}
				$(o).removeClass('active');
			}
		});

		$common.touchSE($('dd', '.contaceTab'), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('current')) {
				var dir = $(o).attr('dir');
				if (dir) {
					if (dir == 'employee') {
						itemID = 'approve_userItem';
						var userItemWindow = $windowManager.getById('approve_userItem');
						if (userItemWindow) {
							if (!userItemWindow.isVisible()) {
								userItemWindow.show();
							}
						} else {
							showUserItem();
						}
						window.setTimeout(function() {
							var roleItemWindow = $windowManager.getById('approve_roleItem');
							if (roleItemWindow) {
								if (roleItemWindow.isVisible()) {
									roleItemWindow.hide();
								}
							}
						}, 500);
					} else if (dir == 'role') {
						itemID = 'approve_roleItem';
						var roleItemWindow = $windowManager.getById('approve_roleItem');
						if (roleItemWindow) {
							if (!roleItemWindow.isVisible()) {
								roleItemWindow.show();
							}
						} else {
							showRoleItem();
						}
						window.setTimeout(function() {
							var userItemWindow = $windowManager.getById('approve_userItem');
							if (userItemWindow) {
								if (userItemWindow.isVisible()) {
									userItemWindow.hide();
								}
							}
						}, 500);
					}
					$('dd', '.contaceTab').removeClass('current');
					$(o).addClass('current');
				}
			}
		});
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});