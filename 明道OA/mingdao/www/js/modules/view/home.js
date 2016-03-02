define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	bindEvent = function() {
		$common.androidBack(function() {
			$nativeUIManager.confirm('提示', '你确定登出明道OA?', ['确定', '取消'], function() {
				plus.runtime.quit();
			}, function() {});
		});
		$common.touchSE($('span', '#bottomTab'), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('current')) {
				var dir = $(o).attr('dir');
				if (dir) {
					var oldDir = $('span.current', '#bottomTab').attr('dir');
					$('span', '#bottomTab').removeClass('current');

					var lang = $('span[dir="' + dir + '"]', '#bottomTab').attr('lang');
					if (lang) {
						if (lang == "1") {
							if (dir == 'platform') {
								$controlWindow.platformWindowShow();
							} else if (dir == 'history') {
								$controlWindow.historyWindowShow($userInfo.get('historyType'));
							} else if (dir == 'send') {
								$controlWindow.sendWindowShow();
							}else if(dir=='search'){
								$controlWindow.searchWindowShow();
							}
						} else if (lang == "0") {
							if (dir == 'platform') {
								//todo
							} else if (dir == 'history') {
								var historyHead = plus.webview.create("history/head.html", "history_head", {
									top: "0px",
									bottom: "50px"
								});
								historyHead.addEventListener("loaded", function() { //叶面加载完成后才显示
									$windowManager.current().append(historyHead);
									$('span[dir="history"]', '#bottomTab').attr('lang', '1');
								}, false);
							} else if (dir == 'send') {
								var sendHead = plus.webview.create("send/head.html", "send_head", {
									top: "0px",
									bottom: "50px"
								});
								sendHead.addEventListener("loaded", function() { //叶面加载完成后才显示
									$windowManager.current().append(sendHead);
									$('span[dir="send"]', '#bottomTab').attr('lang', '1');
								}, false);
							} else if (dir == 'search') {
								var searchHead = plus.webview.create("search/head.html", "search_head", {
									top: "0px",
									bottom: "50px"
								});
								searchHead.addEventListener("loaded", function() { //叶面加载完成后才显示
									$windowManager.current().append(searchHead);
									$('span[dir="search"]', '#bottomTab').attr('lang', '1');
								}, false);
							}
						}
						$(o).addClass('current');
					}
					window.setTimeout(function() {
						if (oldDir) {
							if (oldDir == 'platform') {
								$controlWindow.platformWindowHide();
							} else if (oldDir == 'history') {
								$controlWindow.historyWindowHide($userInfo.get('historyType'));
							} else if (oldDir == 'send') {
								$controlWindow.sendWindowHide();
								$userInfo.removeItem('applyJsonData');
							}else{
								$controlWindow.searchWindowHide();
								$userInfo.removeItem('resultJsonData');
							}
						}
					}, 500);
				}
			}
		});
	};
	loadWebview = function() {
		var workHead = plus.webview.create("platform/head.html", "platform_head", {
			top: "0px",
			bottom: "50px",
			scrollIndicator: 'vertical'
		});
		workHead.addEventListener("loaded", function() { //叶面加载完成后才显示
			$windowManager.current().append(workHead);
			$('span[dir="platform"]', '#bottomTab').attr('lang', '1');
		}, false);
	}
	plusReady = function() {
		loadWebview();
		bindEvent();
		document.addEventListener("resume", function() {
			$authorize.timeout();
		}, false);
		plus.navigator.closeSplashscreen();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});