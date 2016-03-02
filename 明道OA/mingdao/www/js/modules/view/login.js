define(function(require, exports, module) {
	var $common = require('core/common');
	var $windowManager = require('manager/window');
	var $nativeUIManager = require('manager/nativeUI');
	var $authorize = require('core/authorize');
	var $userInfo = require('core/userInfo');
	var $updateManager = require('manager/update');
	showCompany = function(account, password) {
		$nativeUIManager.watting('正在验证帐户...', false);
		$authorize.validate(account, password, function(jsonData) {
			var companyList = jsonData['companyList'];
			if (companyList && $(companyList).size() > 0) {
				$userInfo.put('companyCount',$(companyList).size());
				if ($(companyList).size() == 1) {
					var companyId = companyList[0].companyId;
					login(companyId, account, password);
				} else {
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
										login(uid, account, password);
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
		}, function(code) {
			if(code){
				if(code=='unkown'){
					$nativeUIManager.wattingTitle('身份验证失败');
				}else if(code=='network'){
					$nativeUIManager.wattingTitle('网络异常,未知的域名');
				}else{
					$nativeUIManager.wattingTitle(code);
				}
			}
			window.setTimeout(function() {
				$nativeUIManager.wattingClose();
			}, 1000);
		});
	};
	login = function(companyId, account, password) {
		$nativeUIManager.watting('正在登陆...', false);
		$authorize.login(companyId, account, password, function() {
			$windowManager.load('home.html');
			$nativeUIManager.wattingClose();
		}, function(message) {
			$nativeUIManager.wattingTitle(message);
			window.setTimeout(function() {
				$nativeUIManager.wattingClose();
			}, 1000);
		});
	};

	init = function() {
		if ($userInfo.isSupport()) {
			if ($('#account').val() == '') {
				$('#account').val($userInfo.get('account'));
			}
			if ($('#password').val() == '') {
				$('#password').val($userInfo.get('password'));
			}
		}
	};

	plusReady = function() {
		init();
		$common.touchSE($('#loginBtn'), function(event, startTouch, o) {}, function(event, o) {
			if ($.trim($('#account').val()).length > 0 && $.trim($('#password').val()).length > 0) {
				showCompany($.trim($('#account').val()), $.trim($('#password').val()));
			} else {
				$nativeUIManager.watting('请输入用户名称和密码', 1500);
			}
		});
		$common.touchSE($('#regBtn'), function(event, startTouch, o) {}, function(event, o) {
			$('.mask').show();
			$('#regTip').show();
			$common.touchSE($('#closeRegTip','#regTip'), function(event, startTouch, o) {
				if(!$(o).hasClass('current')){
					$(o).addClass('current');
				}
			}, function(event, o) {
				if($(o).hasClass('current')){
					$(o).removeClass('current');
				}
				$('.mask').hide();
				$('#regTip').hide();
			});
			$common.touchSE($('#goOnLogin','#regTip'), function(event, startTouch, o) {
				if(!$(o).hasClass('current')){
					$(o).addClass('current');
				}
			}, function(event, o) {
				if($(o).hasClass('current')){
					$(o).removeClass('current');
				}
				$('.mask').hide();
				$('#regTip').hide();
				$windowManager.create('regMingdao', 'reg.html', false, true, function(show) {
					show();
				});
			});
		});
		$updateManager.execute();
		plus.navigator.closeSplashscreen();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});