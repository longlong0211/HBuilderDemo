define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var queryMap = parseURL();
	var id = queryMap.get('id');
	var type = queryMap.get('type');
	setForward = function(uuid, id, text, img, type) {
		var obj = $('li.choose[uuid="' + uuid + '"]');
		if (obj) {
			if (id && text && img && type) {
				$('#' + uuid + 'Id').val(id);
				$('#' + uuid + 'Type').val(type);
				$('.Inmask', obj).hide();
				var sb = new StringBuilder();
				sb.append(String.formatmodel($templete.getContactsSelectItem(), {
					userImg: img,
					userName: text
				}));
				$('span', obj).remove();
				$('i', obj).before(sb.toString());
			} else {
				$('#' + uuid + 'Id').val('');
				$('#' + uuid + 'Type').val('');
				$('.Inmask', obj).show();
				$('span', obj).remove();
			}
		}
	};
	forward = function(taskId, callback) {
		if (taskId) {
			var uuid = $('li.choose').attr('uuid');
			if (uuid) {
				var forwardId = $('#' + uuid + 'Id').val();
				var forwardType = $('#' + uuid + 'Type').val();
				if (forwardType == '3') {
					forwardType = 'employee';
				} else if (forwardType == '1') {
					forwardType = 'role';
				}
				if (forwardId && forwardType) {
					$nativeUIManager.watting('正在转审申请...');
					window.setTimeout(function() {
						$common.refreshToken(function(token) {
							$.ajax({
								type: 'POST',
								url: $common.getRestApiURL() + '/wf/reqTask/forward',
								dataType: 'json',
								data: {
									oaToken: $userInfo.get('token'),
									id: taskId,
									reason: $('#reason').val(),
									forwardId: forwardId,
									forwardType: forwardType,
									attToken: '',
									'org.guiceside.web.jsp.taglib.Token': token
								},
								success: function(jsonData) {
									if (jsonData) {
										if (jsonData['result'] == '0') {
											$nativeUIManager.wattingTitle('转审完成');
											window.setTimeout(function() {
												if (typeof callback == 'function') {
													callback();
												}
											}, 1000);
										} else if (jsonData['result'] == '-1') {
											$nativeUIManager.wattingTitle('转审失败,请稍后重试!');
											window.setTimeout(function() {
												$nativeUIManager.wattingClose();
											}, 1000);
										}
									}
								},
								error: function(jsonData) {
									$nativeUIManager.wattingTitle('转审发生错误,请稍后重试');
									window.setTimeout(function() {
										$nativeUIManager.wattingClose();
									}, 1000);
								}
							});
						});
					}, 500);
				} else {
					$nativeUIManager.alert('提示', '请先选择转审人员', 'OK');
				}
			}
		}
	};
	manage = function(manageId, callback) {
		if (manageId) {
			$nativeUIManager.watting('正在经办申请...');
			window.setTimeout(function() {
				$common.refreshToken(function(token) {
					$.ajax({
						type: 'POST',
						url: $common.getRestApiURL() + '/wf/reqManage/work',
						dataType: 'json',
						data: {
							oaToken: $userInfo.get('token'),
							id: manageId,
							reason: $('#reason').val(),
							attToken: '',
							'org.guiceside.web.jsp.taglib.Token': token
						},
						success: function(jsonData) {
							if (jsonData) {
								if (jsonData['result'] == '0') {
									$nativeUIManager.wattingTitle('经办完成');
									window.setTimeout(function() {
										if (typeof callback == 'function') {
											callback();
										}
									}, 1000);
								} else if (jsonData['result'] == '1') {
									$nativeUIManager.wattingTitle('经办失败,请勿重复处理!');
									window.setTimeout(function() {
										if (typeof callback == 'function') {
											callback();
										}
									}, 1000);
								} else if (jsonData['result'] == '2') {
									$nativeUIManager.wattingTitle('经办完成,单据已被撤销!');
									window.setTimeout(function() {
										if (typeof callback == 'function') {
											callback();
										}
									}, 1000);
								} else if (jsonData['result'] == '-1') {
									$nativeUIManager.wattingTitle('经办失败,请稍后重试!');
									window.setTimeout(function() {
										$nativeUIManager.wattingClose();
									}, 1000);
								}
							}
						},
						error: function(jsonData) {
							$nativeUIManager.wattingTitle('经办发生错误,请稍后重试');
							window.setTimeout(function() {
								$nativeUIManager.wattingClose();
							}, 1000);
						}
					});
				});
			}, 500);
		}
	};
	reject = function(taskId, callback) {
		if (taskId) {
			$nativeUIManager.watting('正在否决申请...');
			window.setTimeout(function() {
				$common.refreshToken(function(token) {
					$.ajax({
						type: 'POST',
						url: $common.getRestApiURL() + '/wf/reqTask/overrule',
						dataType: 'json',
						data: {
							oaToken: $userInfo.get('token'),
							id: taskId,
							reason: $('#reason').val(),
							attToken: '',
							'org.guiceside.web.jsp.taglib.Token': token
						},
						success: function(jsonData) {
							if (jsonData) {
								if (jsonData['result'] == '0') {
									$nativeUIManager.wattingTitle('审批完成');
									window.setTimeout(function() {
										if (typeof callback == 'function') {
											callback();
										}
									}, 1000);
								} else if (jsonData['result'] == '1') {
									$nativeUIManager.wattingTitle('审批失败,不能重复审批!');
									window.setTimeout(function() {
										if (typeof callback == 'function') {
											callback();
										}
									}, 1000);
								} else if (jsonData['result'] == '2') {
									$nativeUIManager.wattingTitle('审批失败,单据已被撤销!');
									window.setTimeout(function() {
										if (typeof callback == 'function') {
											callback();
										}
									}, 1000);
								} else if (jsonData['result'] == '-1') {
									$nativeUIManager.wattingTitle('审批失败,请稍后重试!');
									window.setTimeout(function() {
										$nativeUIManager.wattingClose();
									}, 1000);
								}
							}
						},
						error: function(jsonData) {
							$nativeUIManager.wattingTitle('审批发生错误,请稍后重试');
							window.setTimeout(function() {
								$nativeUIManager.wattingClose();
							}, 1000);
						}
					});
				});
			}, 500);
		}
	};
	pass = function(taskId, callback) {
		if (taskId) {
			$nativeUIManager.watting('正在通过申请...');
			window.setTimeout(function() {
				$common.refreshToken(function(token) {
					$.ajax({
						type: 'POST',
						url: $common.getRestApiURL() + '/wf/reqTask/pass',
						dataType: 'json',
						data: {
							oaToken: $userInfo.get('token'),
							id: taskId,
							reason: $('#reason').val(),
							attToken: '',
							'org.guiceside.web.jsp.taglib.Token': token
						},
						success: function(jsonData) {
							if (jsonData) {
								if (jsonData['result'] == '0') {
									$nativeUIManager.wattingTitle('审批完成');
									window.setTimeout(function() {
										if (typeof callback == 'function') {
											callback();
										}
									}, 1000);
								} else if (jsonData['result'] == '1') {
									$nativeUIManager.wattingTitle('审批失败,不能重复审批!');
									window.setTimeout(function() {
										if (typeof callback == 'function') {
											callback();
										}
									}, 1000);
								} else if (jsonData['result'] == '2') {
									$nativeUIManager.wattingTitle('审批失败,单据已被撤销!');
									window.setTimeout(function() {
										if (typeof callback == 'function') {
											callback();
										}
									}, 1000);
								} else if (jsonData['result'] == '-1') {
									$nativeUIManager.wattingTitle('审批失败,请稍后重试!');
									window.setTimeout(function() {
										$nativeUIManager.wattingClose();
									}, 1000);
								}
							}
						},
						error: function(jsonData) {
							$nativeUIManager.wattingTitle('审批发生错误,请稍后重试');
							window.setTimeout(function() {
								$nativeUIManager.wattingClose();
							}, 1000);
						}
					});
				});
			}, 500);
		}
	};
	bindEvent = function() {
		$common.touchSE($('#proccessAction'), function(event, startTouch, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
			}
		}, function(event, o) {
			if ($(o).hasClass('active')) {
				if (type == 'pass') {
					pass(id, function() {
						$nativeUIManager.wattingClose();
						var reqViewWindow = $windowManager.getById('req_viewHead');
						if (reqViewWindow) {
							$controlWindow.platformWindowShow();
							reqViewWindow.close();
							$windowManager.close('slide-out-right');
							var platformListWindow = $windowManager.getById('platform_list');
							if (platformListWindow) {
								platformListWindow.evalJS('viewCallback("task",' + id + ')');
							}
						}
					});
				} else if (type == 'reject') {
					reject(id, function() {
						$nativeUIManager.wattingClose();
						var reqViewWindow = $windowManager.getById('req_viewHead');
						if (reqViewWindow) {
							$controlWindow.platformWindowShow();
							reqViewWindow.close();
							$windowManager.close('slide-out-right');
							var platformListWindow = $windowManager.getById('platform_list');
							if (platformListWindow) {
								platformListWindow.evalJS('viewCallback("task",' + id + ')');
							}
						}
					});
				} else if (type == 'manage') {
					manage(id, function() {
						$nativeUIManager.wattingClose();
						var reqViewWindow = $windowManager.getById('req_viewHead');
						if (reqViewWindow) {
							$controlWindow.platformWindowShow();
							reqViewWindow.close();
							$windowManager.close('slide-out-right');
							var platformListWindow = $windowManager.getById('platform_list');
							if (platformListWindow) {
								platformListWindow.evalJS('viewCallback("manage",' + id + ')');
							}
						}
					});
				} else if (type == 'forward') {
					forward(id, function() {
						$nativeUIManager.wattingClose();
						var reqViewWindow = $windowManager.getById('req_viewHead');
						if (reqViewWindow) {
							$controlWindow.platformWindowShow();
							reqViewWindow.close();
							$windowManager.close('slide-out-right');
							var platformListWindow = $windowManager.getById('platform_list');
							if (platformListWindow) {
								platformListWindow.evalJS('viewCallback("task",' + id + ')');
							}
						}
					});
				}
			}
		});
	};
	plusReady = function() {
		if (type) {
			if (type == 'pass') {
				$('#title').text('正在审批...');
				$('#desc').text('请点击空白区域，输入您的审批意见');
				$('#proccessAction').text('通过申请').addClass('btn_commit');
			} else if (type == 'reject') {
				$('#title').text('正在审批...');
				$('#desc').text('请点击空白区域，输入您的审批意见');
				$('#proccessAction').text('否决申请').addClass('btn_voet')
			} else if (type == 'forward') {
				$('#title').text('正在审批...');
				$('#desc').text('请点击空白区域，输入您的审批意见');
				$('#forwardAction').show();
				$('#proccessAction').text('转审申请').addClass('btn_normal');

				$common.touchSE($('#forwardAction'), function(event, startTouch, o) {}, function(event, o) {
					if (!$(o).hasClass('active')) {
						$(o).addClass('active');
						var uuid = $(o).attr('uuid');
						var currentId = $('#' + uuid + 'Id').val();
						var currentType = $('#' + uuid + 'Type').val();
						$windowManager.create('approve_head', '../common/approve_head.html?id=' + currentId + '&type=' + currentType + '&uuid=' + uuid + '&winId=req_proccess&callFun=setForward&boss=N', false, true, function(show) {
							show();
						});
						window.setTimeout(function() {
							$(o).removeClass('active');
						}, 100);
					}
				});
			} else if (type == 'manage') {
				$('#title').text('正在经办...');
				$('#desc').text('请点击空白区域，输入您的经办结果');
				$('#proccessAction').text('经办完成').addClass('btn_commit');
			}
			bindEvent();
		}

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
		
		$common.androidBack(function() {
			$windowManager.close('slide-out-right');
		});
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});