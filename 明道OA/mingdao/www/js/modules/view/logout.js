define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $authorize = require('core/authorize');
	var refreshContactFlag = false;
	refreshContact = function() {
		$nativeUIManager.watting('正在同步...', false);
		refreshContactFlag = true;
		window.setTimeout(function() {
			$common.refreshToken(function(token) {
				$.ajax({
					type: 'POST',
					url: $common.getRestApiURL() + '/common/common/refreshContact',
					dataType: 'json',
					data: {
						oaToken: $userInfo.get('token')
					},
					success: function(jsonData) {
						if (jsonData) {
							if (jsonData['result'] == '0') {
								$nativeUIManager.wattingTitle('同步完成!当前员工总数为' + jsonData['count']);
								window.setTimeout(function() {
									$nativeUIManager.wattingClose();
								}, 1000);
							} else if (jsonData['result'] == '-1') {
								$nativeUIManager.wattingTitle('同步失败,请稍后重试!');
								window.setTimeout(function() {
									$nativeUIManager.wattingClose();
								}, 1000);
							}
						}
					},
					error: function(jsonData) {
						$nativeUIManager.wattingTitle('同步发生错误,请稍后重试');
						window.setTimeout(function() {
							$nativeUIManager.wattingClose();
						}, 1000);
					}
				});
			});
		}, 500);
	};
	changeLogin = function(companyId, account, password) {
		$nativeUIManager.watting('正在切换...', false);
		$authorize.login(companyId, account, password, function() {
			$controlWindow.lunchWindowShow();
			$windowManager.getLaunchWindow().loadURL('home.html');
			$controlWindow.activeWindowClose();
			$nativeUIManager.wattingClose();
		}, function() {
			$nativeUIManager.wattingTitle('未知错误');
			window.setTimeout(function() {
				$nativeUIManager.wattingClose();
			}, 1000);
		});
	};
	showCompany = function(account, password) {
		$nativeUIManager.watting('请稍等...', false);
		$authorize.validate(account, password, function(jsonData) {
			var companyList = jsonData['companyList'];
			if (companyList && $(companyList).size() > 0) {
				if ($(companyList).size() > 1) {
					$nativeUIManager.wattingClose();
					$('.mask').show();
					var companyUl = $('ul', '#companyList');
					if (companyUl) {
						$(companyUl).empty();
						$(companyList).each(function(i, companyObj) {
							$(companyUl).append('<li uid="' + companyObj['companyId'] + '">' + companyObj['companyName'] + '</li>');
						});
						$('#companyList').show();
						$common.touchSME($('li', companyUl), function(startX, startY, endX, endY, event, startTouch, o) {}, function(startX, startY, endX, endY, event, moveTouch, o) {}, function(startX, startY, endX, endY, event, o) {
							event.preventDefault();
							if (startX == endX && startY == endY) {
								$(o).addClass('current');
								window.setTimeout(function() {
									var uid = $(o).attr('uid');
									if (uid) {
										$('#companyList,.mask').hide();
										changeLogin(uid, account, password);
									}
									$(o).removeClass('current');
								}, 300);
							}
						});

						$common.touchSE($('.quitBtn'), function(event, startTouch, o) {}, function(event, o) {
							$('#companyList,.mask').hide();
						});
					}
				}
			}
		}, function() {
			$nativeUIManager.wattingTitle('发生异常,请稍后再试! ');
			window.setTimeout(function() {
				$nativeUIManager.wattingClose();
			}, 1000);
		});
	};
	bindEvent = function() {
		$common.androidBack(function() {
			$controlWindow.lunchWindowShow();
			$windowManager.close('slide-out-right');
		});
		$common.touchSE($('#backAction'), function(event, startTouch, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
			}
		}, function(event, o) {
			if ($(o).hasClass('active')) {
				$controlWindow.lunchWindowShow();
				$windowManager.close('slide-out-right');
				$(o).removeClass('active');
			}
		});
		$common.touchSE($('#changeAction'), function(event, startTouch, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
			}
		}, function(event, o) {
			if ($(o).hasClass('active')) {
				showCompany($userInfo.get('account'), $userInfo.get('password'));
				window.setTimeout(function() {
					$(o).removeClass('active');
				}, 500);
			}
		});
		$common.touchSE($('#synContactAction'), function(event, startTouch, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
			}
		}, function(event, o) {
			if ($(o).hasClass('active')) {
				if (!refreshContactFlag) {
					refreshContact();
					window.setTimeout(function() {
						$(o).removeClass('active');
					}, 500);
				} else {
					$nativeUIManager.alert('提示', '请勿重复同步通讯录!', 'OK');
				}
			}
		});
		$common.touchSE($('#logoutAction'), function(event, startTouch, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
			}
		}, function(event, o) {
			if ($(o).hasClass('active')) {
				$authorize.logout();
				window.setTimeout(function() {
					$(o).removeClass('active');
				}, 500);
			}
		});
	};
	plusReady = function() {
		bindEvent();
		$('#userImg').attr('src', $userInfo.get('userImg'));
		$('#userName').text($userInfo.get('userName'));
		$('#companyName').text($userInfo.get('companyName')+' 当前版本号:('+plus.runtime.version+')');
		var companyCount = $userInfo.get('companyCount');
		if (companyCount) {
			companyCount = parseInt(companyCount);
			if (companyCount > 1) {
				$('#changeAction').show();
			} else {
				$('#changeAction').hide();
			}
		}
		var adminYn = $userInfo.get('adminYn');
		if (adminYn) {
			if (adminYn == 'Y') {
				$('#synContactAction').show();
			}
		}
		$controlWindow.lunchWindowHide();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});