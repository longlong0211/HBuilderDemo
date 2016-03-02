define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var queryMap = parseURL();
	var currentId = queryMap.get('id');
	var winId = queryMap.get('winId');
	var callFun = queryMap.get('callFun');
	var uuid = queryMap.get('uuid');
	getCurrentId = function() {
		var current = '';
		if ($('li.choosed', '.contactBox').size() > 0) {
			var li = $('li.choosed', '.contactBox');
			if (li) {
				current = $(li).attr('uid');
				var currentText = $(li).attr('name');
				var img=$('img',li).attr('src');
				var applyEdit = $windowManager.getById(winId);
				if (applyEdit) {
					applyEdit.evalJS(callFun+'("' + uuid + '","' + current + '","' + currentText + '","' + img + '","3")');
				}
			}
		} else {
			var applyEdit = $windowManager.getById(winId);
			if (applyEdit) {
				applyEdit.evalJS(callFun+'("' + uuid + '","","","","")');
			}
		}
		var selectHead = $windowManager.opener();
		if (selectHead) {
			selectHead.close('slide-out-right');
		}

	};
	loadData = function() {
		$nativeUIManager.watting('正在加载通讯录...');
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/common/common/users',
			dataType: 'json',
			data: {
				'oaToken': $userInfo.get('token')
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var userList = jsonData['userList'];
						if (userList && $(userList).size() > 0) {
							var sb = new StringBuilder();
							var tempKeyWord = '1'
							var keyWordList = new Array();
							$(userList).each(function(i, user) {
								if (user['keyword'] != tempKeyWord) {
									sb.append(String.formatmodel($templete.getContactsKeyWordItem(), {
										'keyWord': user['keyword']
									}));
									tempKeyWord = user['keyword'];
									keyWordList.push(tempKeyWord);
								}
								sb.append(String.formatmodel($templete.getContactsItem(), {
									'id': user['id'],
									'userImg': user['userImg'],
									'userId': user['userId'],
									'userName': user['name'],
									'deptName': user['deptName'],
									'jobName': user['jobName'],
									'keyWord': user['keyword']
								}));

							});
							$('.contactBox').empty().append(sb.toString());
							if (currentId) {
								$('li[uid="' + currentId + '"]', '.contactBox').addClass('choosed');
							}
							$('.wordfind_main').empty();
							for (var keyIndex = 0; keyIndex < keyWordList.length; keyIndex++) {
								$('.wordfind_main').append('<span dir="' + keyWordList[keyIndex] + '">' + keyWordList[keyIndex] + '</span>');
							}
							firstKeyWord();
							bindEvent();
							window.setTimeout(function() {
								$nativeUIManager.wattingClose();
							}, 500);
						}
					} else {
						$nativeUIManager.wattingTitle('发生错误,请稍后重试');
						window.setTimeout(function() {
							$nativeUIManager.wattingClose();
						}, 1000);
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				$nativeUIManager.wattingTitle('发生错误,请稍后重试');
				window.setTimeout(function() {
					$nativeUIManager.wattingClose();
				}, 1000);
			}
		});
	};
	firstKeyWord = function() {
		var firstKeyword = $('li.word-title', '.contactBox').first().attr('dir');
		if (firstKeyword) {
			$('#keyMapValue').text(firstKeyword);
		}
	};
	bindEvent = function() {
		$common.touchSME($('#keyMapValue'),
			function(startX, startY, endX, endY, event, startTouch, o) {},
			function(startX, startY, endX, endY, event, moveTouch, o) {}, function(startX, startY, endX, endY, event, o) {
				if (startX == endX && startY == endY) {
					if (!$(o).hasClass('active')) {
						$('.mask').show();
						$('.wordfind_main').animate({
							right: '0px'
						}, 500);
						$common.touchSE($('span','.wordfind_main'), function(event, startTouch, o) {
							
						}, function(event, o) {
							var dir=$(o).attr('dir');
							if (!$(o).hasClass('active')) {
								$('span','.wordfind_main').removeClass('active');
								$(o).addClass('active');
								$('li','.contactBox').hide();
								$('li[dir="'+dir+'"]','.contactBox').show();
								$('#keyMapValue').text(dir);
							}else{
								$(o).removeClass('active');
								$('li','.contactBox').show();
								firstKeyWord();
							}
						});
						$common.touchSE($('.mask'), function(event, startTouch, o) {
							event.preventDefault();
							event.stopPropagation();
							$('.wordfind_main').css({
								right: '-125px'
							});
							$('.mask').hide();
						}, function(event, o) {
							event.preventDefault();
							event.stopPropagation();
						});
						window.setTimeout(function() {
							$(o).removeClass('active');
						}, 100);
					}
				}
			});
		$common.touchSME($('li', '.contactBox'),
			function(startX, startY, endX, endY, event, startTouch, o) {},
			function(startX, startY, endX, endY, event, moveTouch, o) {}, function(startX, startY, endX, endY, event, o) {
				if (startX == endX && startY == endY) {
					if (!$(o).hasClass('active')) {
						$(o).addClass('active');
						if (!$(o).hasClass('choosed')) {
							$('li', '.contactBox').removeClass('choosed');
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