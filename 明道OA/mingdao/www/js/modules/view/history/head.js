define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');

	bindEvent = function() {
		$common.touchSE($('span', '#historyTab'), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('current')) {
				var oldDir = $userInfo.get('historyType');
				$('span', '#historyTab').removeClass('current');
				var dir = $(o).attr('dir');
				if (dir) {
					var lang = $(o).attr('lang');
					if (lang) {
						if (lang == '1') {
							$controlWindow.historyListWindowShow(dir);
							$userInfo.put('historyType', dir);
						} else if (lang == '0') {
							loadWebview(dir);
						}
						$(o).addClass('current');
					}
				}
				window.setTimeout(function() {
					if (oldDir) {
						$controlWindow.historyListWindowHide(oldDir);
					}
				}, 500);
			}
		});
	};
	loadWebview = function(type) {
		var url = type + 'List.html';
		var winID = 'history_' + type + 'List';
		var list = plus.webview.create(url, winID, {
			top: "80px",
			bottom: "0px",
			scrollIndicator: 'vertical'
		});
		list.addEventListener("loaded", function() {
			$windowManager.current().append(list);
			$userInfo.put('historyType', type);
			$('span[dir="' + type + '"]', '#historyTab').attr('lang', '1');
		}, false);
	}
	plusReady = function() {
		loadWebview('req');
		bindEvent();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});