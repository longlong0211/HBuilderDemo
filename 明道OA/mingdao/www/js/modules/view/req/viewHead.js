define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var queryMap = parseURL();
	var reqId = queryMap.get('reqId');
	var from = queryMap.get('from');
	var finalJsonData = false;
	var confirmBtn = false;
	var approveBtn = false;
	var manageBtn = false;
	var backBtn = false;
	var attBtn = false;
	var bottomWindowFlag = false;
	back = function(backId, callback) {
		if (backId) {
			$nativeUIManager.watting('正在撤销申请...');
			window.setTimeout(function() {
				$common.refreshToken(function(token) {
					$.ajax({
						type: 'POST',
						url: $common.getRestApiURL() + '/wf/req/back',
						dataType: 'json',
						data: {
							oaToken: $userInfo.get('token'),
							id: backId,
							'org.guiceside.web.jsp.taglib.Token': token
						},
						success: function(jsonData) {
							if (jsonData) {
								if (jsonData['result'] == '0') {
									$nativeUIManager.wattingTitle('撤销成功');
									window.setTimeout(function() {
										if (typeof callback == 'function') {
											callback();
										}
									}, 1000);
								} else if (jsonData['result'] == '1') {
									$nativeUIManager.wattingTitle('单据已被审批或处理');
									window.setTimeout(function() {
										$nativeUIManager.wattingClose();
									}, 1000);
								} else if (jsonData['result'] == '-1') {
									$nativeUIManager.wattingTitle('撤销失败,请稍后重试!');
									window.setTimeout(function() {
										$nativeUIManager.wattingClose();
									}, 1000);
								}
							}
						},
						error: function(jsonData) {
							$nativeUIManager.wattingTitle('撤销发生错误,请稍后重试');
							window.setTimeout(function() {
								$nativeUIManager.wattingClose();
							}, 1000);
						}
					});
				});
			}, 500);
		}
	};
	confirm = function(confirmId, callback) {
		if (confirmId) {
			$nativeUIManager.watting('正在确认申请...');
			window.setTimeout(function() {
				$common.refreshToken(function(token) {
					$.ajax({
						type: 'POST',
						url: $common.getRestApiURL() + '/wf/req/confirm',
						dataType: 'json',
						data: {
							oaToken: $userInfo.get('token'),
							id: confirmId,
							'org.guiceside.web.jsp.taglib.Token': token
						},
						success: function(jsonData) {
							if (jsonData) {
								if (jsonData['result'] == '0') {
									$nativeUIManager.wattingTitle('确认完成');
									window.setTimeout(function() {
										if (typeof callback == 'function') {
											callback();
										}
									}, 1000);
								} else if (jsonData['result'] == '-1') {
									$nativeUIManager.wattingTitle('确认失败,请稍后重试!');
									window.setTimeout(function() {
										$nativeUIManager.wattingClose();
									}, 1000);
								}
							}
						},
						error: function(jsonData) {
							$nativeUIManager.wattingTitle('确认发生错误,请稍后重试');
							window.setTimeout(function() {
								$nativeUIManager.wattingClose();
							}, 1000);
						}
					});
				});
			}, 500);
		}
	};
	bindApproveEvent = function() {
		$common.touchSE($('span', '#approveAction'), function(event, startTouch, o) {}, function(event, o) {
			var dir = $(o).attr('dir');
			if (dir) {
				var id;
				if (dir == 'confirm' || dir == 'back') {
					if (dir == 'confirm') {
						confirm(reqId, function() {
							$nativeUIManager.wattingClose();
							var reqViewWindow = $windowManager.getById('req_viewHead');
							if (reqViewWindow) {
								$controlWindow.platformWindowShow();
								reqViewWindow.close();
								$windowManager.close('slide-out-right');
								var platformListWindow = $windowManager.getById('platform_list');
								if (platformListWindow) {
									platformListWindow.evalJS('viewCallback("confirm",' + reqId + ')');
								}
							}
						});
					} else if (dir == 'back') {
						back(reqId, function() {
							$nativeUIManager.wattingClose();
							var reqViewWindow = $windowManager.getById('req_viewHead');
							if (reqViewWindow) {
								$controlWindow.platformWindowShow();
								reqViewWindow.close();
								$windowManager.close('slide-out-right');
								var platformListWindow = $windowManager.getById('platform_list');
								if (platformListWindow) {
									platformListWindow.evalJS('viewCallback("ing",' + reqId + ')');
								}
							}
						});
					}
				} else {
					if (dir == 'pass') {
						id = finalJsonData['taskId'];
					} else if (dir == 'reject') {
						id = finalJsonData['taskId'];
					} else if (dir == 'forward') {
						id = finalJsonData['taskId'];
					} else if (dir == 'manage') {
						id = finalJsonData['manageId'];
					}
					$windowManager.create('req_proccess', 'proccess.html?id=' + id + '&type=' + dir, false, true, function(show) {
						show();
					});
				}
			}
		});
	};
	showComments = function() {
		var url = 'comments.html';
		var winID = 'req_comments';
		var bottomPx = '0px';
		if (bottomWindowFlag) {
			bottomPx = '50px';
		}
		var reqComments = plus.webview.create(url, winID, {
			top: '85px',
			bottom: bottomPx,
			scrollIndicator: 'vertical'
		});
		reqComments.addEventListener("loaded", function() {
			$windowManager.current().append(reqComments);
			$nativeUIManager.wattingClose();
		}, false);
	};
	showData = function() {
		$userInfo.put('reqJsonData', JSON.stringify(finalJsonData));
		var operation = finalJsonData['operation'];
		if (operation) {
			if (operation.indexOf('confirm') != -1) {
				confirmBtn = true;
				bottomWindowFlag = true;
				$('#approveAction').append($templete.getApproveActionForConfirm());
			} else if (operation.indexOf('pass') != -1) {
				approveBtn = true;
				bottomWindowFlag = true;
				$('#approveAction').append($templete.getApproveActionForTask());
			} else if (operation.indexOf('manage') != -1) {
				manageBtn = true;
				bottomWindowFlag = true;
				$('#approveAction').append($templete.getApproveActionForManage());
			} else if (operation.indexOf('back') != -1) {
				backBtn = true;
				bottomWindowFlag = true;
				$('#approveAction').append($templete.getApproveActionForBack());
			}
			if (operation.indexOf('att') != -1) {
				attBtn = true;
			}
		}
		var bottomPx = '0px';
		if (bottomWindowFlag) {
			$('#approveAction').show();
			bottomPx = '50px';
			bindApproveEvent();
		} else {
			$('#approveAction').hide();
		}
		if (attBtn) {
			$('#attAction').show();
			$userInfo.put('attData', JSON.stringify(finalJsonData['attData']));
			$common.touchSE($('#attAction'), function(event, startTouch, o) {}, function(event, o) {
				$windowManager.create('req_attList', '../req/attList.html', false, true, function(show) {
					show();
				});
			});
		} else {
			$('#attAction').hide();
		}
		var url = 'view.html';
		var winID = 'req_view';
		var reqView = plus.webview.create(url, winID, {
			top: '85px',
			bottom: bottomPx,
			scrollIndicator: 'vertical'
		});
		reqView.addEventListener("loaded", function() {
			$windowManager.current().append(reqView);
			$nativeUIManager.wattingClose();
		}, false);
	};
	bindData = function() {
		if (finalJsonData) {
			$('#subject').text(finalJsonData['subject']);
			showData();
		}
	};
	bindEvent = function() {
		$common.androidBack(function() {
			$userInfo.removeItem('reqJsonData');
			$userInfo.removeItem('attData');
			if (from) {
				if (from == 'platform') {
					$controlWindow.platformWindowShow();
				} else {
					$controlWindow.historyWindowShow(from);
				}
			}
			$windowManager.close('slide-out-right');
		});
		$common.touchSE($('#backAction'), function(event, startTouch, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
			}
		}, function(event, o) {
			if ($(o).hasClass('active')) {
				$userInfo.removeItem('reqJsonData');
				$userInfo.removeItem('attData');
				if (from) {
					if (from == 'platform') {
						$controlWindow.platformWindowShow();
					} else {
						$controlWindow.historyWindowShow(from);
					}
				}
				$windowManager.close('slide-out-right');
				$(o).removeClass('active');
			}
		});
		$common.touchSE($('span', '#reqContentTab'), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('current')) {
				var dir = $(o).attr('dir');
				if (dir) {
					if (dir == 'content') {
						var reqViewWindow = $windowManager.getById('req_view');
						if (reqViewWindow) {
							if (!reqViewWindow.isVisible()) {
								reqViewWindow.show();
							}
						}
						window.setTimeout(function() {
							var reqCommentsWindow = $windowManager.getById('req_comments');
							if (reqCommentsWindow) {
								if (reqCommentsWindow.isVisible()) {
									reqCommentsWindow.hide();
								}
							}
						}, 500);
					} else if (dir == 'comments') {
						var reqCommentsWindow = $windowManager.getById('req_comments');
						if (reqCommentsWindow) {
							if (!reqCommentsWindow.isVisible()) {
								reqCommentsWindow.show();
							}
						} else {
							showComments();
						}
						window.setTimeout(function() {
							var reqViewWindow = $windowManager.getById('req_view');
							if (reqViewWindow) {
								if (reqViewWindow.isVisible()) {
									reqViewWindow.hide();
								}
							}
						}, 500);
					}
					$('span', '#reqContentTab').removeClass('current');
					$(o).addClass('current');
				}
			}
		});

	};
	loadData = function(callback) {
		$nativeUIManager.watting('加载中...');
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/wf/req/data',
			dataType: 'json',
			data: {
				oaToken: $userInfo.get('token'),
				id: reqId
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						finalJsonData = jsonData
						bindData();
					} else {
						$nativeUIManager.wattingTitle('未知错误');
						window.setTimeout(function() {
							$nativeUIManager.wattingClose();
						}, 1500);
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				$nativeUIManager.wattingTitle('未知错误');
				window.setTimeout(function() {
					$nativeUIManager.wattingClose();
				}, 1500);
			}
		});
	};
	plusReady = function() {
		bindEvent();
		loadData();
		if (from) {
			if (from == 'platform') {
				$controlWindow.platformWindowHide();
			} else {
				$controlWindow.historyWindowHide(from);
			}
		}
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});