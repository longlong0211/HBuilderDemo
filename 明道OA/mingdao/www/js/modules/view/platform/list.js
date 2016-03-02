define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $updateManager = require('manager/update');
	var $pushManager = require('manager/push');
	var currentWindow;
	viewCallback = function(type, id) {
		processCallback(type, id);
	};
	back = function(reqId) {
		if (reqId) {
			$nativeUIManager.watting('正在撤销申请...');
			window.setTimeout(function() {
				$common.refreshToken(function(token) {
					$.ajax({
						type: 'POST',
						url: $common.getRestApiURL() + '/wf/req/back',
						dataType: 'json',
						data: {
							oaToken: $userInfo.get('token'),
							id: reqId,
							'org.guiceside.web.jsp.taglib.Token': token
						},
						success: function(jsonData) {
							if (jsonData) {
								if (jsonData['result'] == '0') {
									$nativeUIManager.wattingTitle('撤销成功!');
									processCallback('ing', reqId);
								} else if (jsonData['result'] == '1') {
									$nativeUIManager.wattingTitle('单据已被审批或处理!');
								} else if (jsonData['result'] == '-1') {
									$nativeUIManager.wattingTitle('撤销失败,请稍后再试!');
									processCallback('ing', reqId);
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

	confirmBatch = function(confirmIds, callback) {
		if (manageIds) {
			$nativeUIManager.watting('正在批量确认申请...');
			window.setTimeout(function() {
				$common.refreshToken(function(token) {
					$.ajax({
						type: 'POST',
						url: $common.getRestApiURL() + '/wf/req/confirmBatch',
						dataType: 'json',
						data: {
							oaToken: $userInfo.get('token'),
							ids: confirmIds,
							'org.guiceside.web.jsp.taglib.Token': token
						},
						success: function(jsonData) {
							if (jsonData) {
								if (jsonData['result'] == '0') {
									var successArray = jsonData['successArray'];
									if (successArray && $(successArray).size() > 0) {
										$(successArray).each(function(i, o) {
											processCallback('confirm', o, true);
										});
									}
									$nativeUIManager.wattingTitle('批量确认完成!共计确认了' + jsonData['passCount'] + '个申请');
									window.setTimeout(function() {
										$nativeUIManager.wattingClose();
										if (typeof callback == 'function') {
											callback();
										}
									}, 1000);
								} else {
									$nativeUIManager.wattingTitle('批量确认发生错误,请稍后重试');
									window.setTimeout(function() {
										$nativeUIManager.wattingClose();
										if (typeof callback == 'function') {
											callback();
										}
									}, 1000);
								}
							}
						},
						error: function(jsonData) {
							$nativeUIManager.wattingTitle('批量确认发生错误,请稍后重试');
							window.setTimeout(function() {
								$nativeUIManager.wattingClose();
								if (typeof callback == 'function') {
									callback();
								}
							}, 1000);
						}
					});
				});
			}, 500);
		}
	};

	confirm = function(reqId) {
		if (reqId) {
			$nativeUIManager.watting('正在确认申请...');
			window.setTimeout(function() {
				$common.refreshToken(function(token) {
					$.ajax({
						type: 'POST',
						url: $common.getRestApiURL() + '/wf/req/confirm',
						dataType: 'json',
						data: {
							oaToken: $userInfo.get('token'),
							id: reqId,
							'org.guiceside.web.jsp.taglib.Token': token
						},
						success: function(jsonData) {
							if (jsonData) {
								if (jsonData['result'] == '0') {
									$nativeUIManager.wattingTitle('确认完成!');
									processCallback('confirm', reqId);
								} else if (jsonData['result'] == '-1') {
									$nativeUIManager.wattingTitle('确认失败,请稍后再试!');
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

	workBatch = function(manageIds, callback) {
		if (manageIds) {
			$nativeUIManager.watting('正在批量经办申请...');
			window.setTimeout(function() {
				$common.refreshToken(function(token) {
					$.ajax({
						type: 'POST',
						url: $common.getRestApiURL() + '/wf/reqManage/workBatch',
						dataType: 'json',
						data: {
							oaToken: $userInfo.get('token'),
							ids: manageIds,
							reason: $('#reasonBatch').val(),
							attToken: '',
							'org.guiceside.web.jsp.taglib.Token': token
						},
						success: function(jsonData) {
							if (jsonData) {
								if (jsonData['result'] == '0') {
									var successArray = jsonData['successArray'];
									if (successArray && $(successArray).size() > 0) {
										$(successArray).each(function(i, o) {
											processCallback('manage', o, true);
										});
									}
									$nativeUIManager.wattingTitle('批量经办完成!共计经办了' + jsonData['passCount'] + '个申请');
									window.setTimeout(function() {
										$nativeUIManager.wattingClose();
										if (typeof callback == 'function') {
											callback();
										}
									}, 1000);
								} else {
									$nativeUIManager.wattingTitle('批量经办发生错误,请稍后重试');
									window.setTimeout(function() {
										$nativeUIManager.wattingClose();
										if (typeof callback == 'function') {
											callback();
										}
									}, 1000);
								}
							}
						},
						error: function(jsonData) {
							$nativeUIManager.wattingTitle('批量经办发生错误,请稍后重试');
							window.setTimeout(function() {
								$nativeUIManager.wattingClose();
								if (typeof callback == 'function') {
									callback();
								}
							}, 1000);
						}
					});
				});
			}, 500);
		}
	};

	work = function(manageId) {
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
							'org.guiceside.web.jsp.taglib.Token': token
						},
						success: function(jsonData) {
							if (jsonData) {
								if (jsonData['result'] == '0') {
									$nativeUIManager.wattingTitle('经办完成!');
									processCallback('manage', manageId);
								} else if (jsonData['result'] == '2') {
									processCallback('manage', manageId);
									$nativeUIManager.wattingTitle('经办失败,单据已被撤销!');
								} else if (jsonData['result'] == '1') {
									processCallback('manage', manageId);
									$nativeUIManager.wattingTitle('经办失败,请勿重复处理!');
								} else if (jsonData['result'] == '-1') {
									$nativeUIManager.wattingTitle('经办失败,请稍后再试!');
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

	rejectBatch = function(taskIds, callback) {
		if (taskIds) {
			$nativeUIManager.watting('正在批量否决申请...');
			window.setTimeout(function() {
				$common.refreshToken(function(token) {
					$.ajax({
						type: 'POST',
						url: $common.getRestApiURL() + '/wf/reqTask/overruleBatch',
						dataType: 'json',
						data: {
							oaToken: $userInfo.get('token'),
							ids: taskIds,
							reason: $('#reasonBatch').val(),
							attToken: '',
							'org.guiceside.web.jsp.taglib.Token': token
						},
						success: function(jsonData) {
							if (jsonData) {
								if (jsonData['result'] == '0') {
									var successArray = jsonData['successArray'];
									if (successArray && $(successArray).size() > 0) {
										$(successArray).each(function(i, o) {
											processCallback('task', o, true);
										});
									}
									$nativeUIManager.wattingTitle('批量否决完成!共计否决了' + jsonData['passCount'] + '个申请');
									window.setTimeout(function() {
										$nativeUIManager.wattingClose();
										if (typeof callback == 'function') {
											callback();
										}
									}, 1000);
								} else {
									$nativeUIManager.wattingTitle('批量否决发生错误,请稍后重试');
									window.setTimeout(function() {
										$nativeUIManager.wattingClose();
										if (typeof callback == 'function') {
											callback();
										}
									}, 1000);
								}
							}
						},
						error: function(jsonData) {
							$nativeUIManager.wattingTitle('批量否决发生错误,请稍后重试');
							window.setTimeout(function() {
								$nativeUIManager.wattingClose();
								if (typeof callback == 'function') {
									callback();
								}
							}, 1000);
						}
					});
				});
			}, 500);
		}
	};

	reject = function(taskId) {
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
							reason: '',
							attToken: '',
							'org.guiceside.web.jsp.taglib.Token': token
						},
						success: function(jsonData) {
							if (jsonData) {
								if (jsonData['result'] == '0') {
									processCallback('task', taskId);
									$nativeUIManager.wattingTitle('审批完成');
								} else if (jsonData['result'] == '1') {
									processCallback('task', taskId);
									$nativeUIManager.wattingTitle('审批失败,不能重复审批!');
								} else if (jsonData['result'] == '2') {
									processCallback('task', taskId);
									$nativeUIManager.wattingTitle('审批失败,单据已被撤销!');
								} else if (jsonData['result'] == '-1') {
									$nativeUIManager.wattingTitle('审批失败,请稍后重试!');
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

	passBatch = function(taskIds, callback) {
		if (taskIds) {
			$nativeUIManager.watting('正在批量通过申请...');
			window.setTimeout(function() {
				$common.refreshToken(function(token) {
					$.ajax({
						type: 'POST',
						url: $common.getRestApiURL() + '/wf/reqTask/passBatch',
						dataType: 'json',
						data: {
							oaToken: $userInfo.get('token'),
							ids: taskIds,
							reason: $('#reasonBatch').val(),
							attToken: '',
							'org.guiceside.web.jsp.taglib.Token': token
						},
						success: function(jsonData) {
							if (jsonData) {
								if (jsonData['result'] == '0') {
									var successArray = jsonData['successArray'];
									if (successArray && $(successArray).size() > 0) {
										$(successArray).each(function(i, o) {
											processCallback('task', o, true);
										});
									}
									$nativeUIManager.wattingTitle('批量通过完成!共计通过了' + jsonData['passCount'] + '个申请');
									window.setTimeout(function() {
										$nativeUIManager.wattingClose();
										if (typeof callback == 'function') {
											callback();
										}
									}, 1000);
								} else {
									$nativeUIManager.wattingTitle('批量通过发生错误,请稍后重试');
									window.setTimeout(function() {
										$nativeUIManager.wattingClose();
										if (typeof callback == 'function') {
											callback();
										}
									}, 1000);
								}
							}
						},
						error: function(jsonData) {
							$nativeUIManager.wattingTitle('批量通过发生错误,请稍后重试');
							window.setTimeout(function() {
								$nativeUIManager.wattingClose();
								if (typeof callback == 'function') {
									callback();
								}
							}, 1000);
						}
					});
				});
			}, 500);
		}
	};

	pass = function(taskId) {
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
							reason: '',
							attToken: '',
							'org.guiceside.web.jsp.taglib.Token': token
						},
						success: function(jsonData) {
							if (jsonData) {
								if (jsonData['result'] == '0') {
									processCallback('task', taskId);
									$nativeUIManager.wattingTitle('审批完成');
								} else if (jsonData['result'] == '1') {
									processCallback('task', taskId);
									$nativeUIManager.wattingTitle('审批失败,不能重复审批!');
								} else if (jsonData['result'] == '2') {
									processCallback('task', taskId);
									$nativeUIManager.wattingTitle('审批失败,单据已被撤销!');
								} else if (jsonData['result'] == '-1') {
									$nativeUIManager.wattingTitle('审批失败,请稍后重试!');
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
	processCallback = function(type, uid, manualCloseWatting) {
		var listItem = $('.list[dir="' + type + '"]');
		if (listItem) {
			var liObj = $(listItem).find('li[uid="' + uid + '"]');
			if (liObj) {
				$(liObj).fadeOut(500, function() {
					$(liObj).remove();
					var listTitle = $('.list_tilte[dir="' + type + '"]');
					var count = $('li', listItem).size();
					if (count == 0) {
						$(listTitle).remove();
						$(listItem).remove();
					} else {
						$('.desc', listTitle).attr('dir', count).find('em').text(count);
						if (count == 1) {
							$('#batchAction').hide();
						}
					}
					if (!manualCloseWatting) {
						$nativeUIManager.wattingClose();
					}
					refreshBadge();
				});
			}
		}
	};
	onRefresh = function() {
		window.setTimeout(function() {
			loadData(function() {
				currentWindow.endPullToRefresh();
			});
		}, 500);
	};
	pullToRefreshEvent = function() {
		currentWindow = $windowManager.current();
		currentWindow.setPullToRefresh({
			support: true,
			height: "50px",
			range: "200px",
			contentdown: {
				caption: "下拉可以刷新"
			},
			contentover: {
				caption: "释放立即刷新"
			},
			contentrefresh: {
				caption: "正在刷新..."
			}
		}, onRefresh);
	};
	bindQuickViewEvent = function(obj) {
		var preViewObj = $('.preview', obj);
		var li = $(obj).closest('li');
		if (preViewObj && li) {
			$common.touchSME($('.approveAction', preViewObj).find('span'),
				function(startX, startY, endX, endY, event, startTouch, o) {
					event.stopPropagation();
				},
				function(startX, startY, endX, endY, event, moveTouch, o) {
					event.stopPropagation();
				}, function(startX, startY, endX, endY, event, o) {
					event.stopPropagation();
					if (startX == endX && startY == endY) {
						if (!$(o).hasClass('active')) {
							var reqId = $(li).attr('reqId');
							var taskId = $(li).attr('uid');
							var dir = $(o).attr('dir');
							if (reqId && taskId && dir) {
								$(o).addClass('active');
								window.setTimeout(function() {
									$(o).removeClass('active');
									if (dir == 'view') {
										$windowManager.create('req_viewHead', '../req/viewHead.html?reqId=' + reqId + '&from=platform', false, true, function(show) {
											show();
										});
									} else if (dir == 'pass') {
										pass(taskId);
									} else if (dir == 'reject') {
										reject(taskId);
									}
								}, 100);
							}
						}
					}
				});
		}
	};
	taskProccessEvent = function(o, taskUL) {
		if (!$(o).hasClass('current')) {
			$('li', taskUL).removeClass('current');
			$('li', taskUL).find('.preview').hide();
			$(o).addClass('current');
			var quickPreview = $(o).attr('quickPreview');
			if (quickPreview) {
				if (quickPreview == 'Y') {
					if ($('.preview', o).size() == 0) {
						var reqId = $(o).attr('reqId');
						if (reqId) {
							$nativeUIManager.watting('请稍等...');
							$('.list_li', o).after(String.formatmodel($templete.getWorkDataView(), {}));
							var table = $('.preview', o).find('table');
							if (table) {
								$.ajax({
									type: 'POST',
									url: $common.getRestApiURL() + '/platform/desktop/quickPreview',
									dataType: 'json',
									data: {
										reqId: reqId,
										oaToken: $userInfo.get('token')
									},
									success: function(jsonData) {
										if (jsonData) {
											if (jsonData['result'] == '0') {
												var dataArray = jsonData['dataArray'];
												if (dataArray && $(dataArray).size() > 0) {
													var tableSb = new StringBuilder();
													$(dataArray).each(function(i, trDataArray) {
														$(trDataArray).each(function(j, o) {
															tableSb.append('<tr>\n');
															tableSb.append('<th style="width:120px;">' + o['label'] + ':</th>\n');
															tableSb.append('<td>' + o['value'] + '</td>\n');
															tableSb.append('</tr>\n');
														});
													});
													$('tbody', table).empty().append(tableSb.toString());
													$('.preview', o).show();
													$nativeUIManager.wattingClose();
													bindQuickViewEvent(o);
												}
											} else {
												$nativeUIManager.wattingTitle('错误,请稍后再试');
												window.setTimeout(function() {
													$nativeUIManager.wattingClose();
												}, 1500);
											}
										}
									},
									error: function(jsonData) {
										$nativeUIManager.wattingTitle('错误,请稍后再试');
										window.setTimeout(function() {
											$nativeUIManager.wattingClose();
										}, 1500);
									}
								});
							}
						}
					} else {
						$('.preview', o).show();
						bindQuickViewEvent(o);
					}
				} else if (quickPreview == 'N') {
					$nativeUIManager.confactionSheetirm('请选择操作', '取消', [{
							title: '通过'
						}, {
							title: '否决'
						}, {
							title: '更多'
						}],
						function(index) {
							if (index > 0) {
								var taskId = $(o).attr('uid');
								var reqId = $(o).attr('reqId');
								if (reqId && taskId) {
									if (index == 1) {
										pass(taskId);
									} else if (index == 2) {
										reject(taskId);
									} else if (index == 3) {
										$windowManager.create('req_viewHead', '../req/viewHead.html?reqId=' + reqId + '&from=platform', false, true, function(show) {
											show();
										});
									}
								}
							}
							$(o).removeClass('current');
						});
				}
			}
		} else {
			$(o).removeClass('current');
			$('.preview', o).hide();
		}
	};
	taskBatchEvent = function(o, taskUL) {
		if (!$(o).hasClass('current')) {
			$(o).addClass('current');
			$('.radio_ico', o).addClass('current');
		} else {
			$(o).removeClass('current');
			$('.radio_ico', o).removeClass('current');
		}
	};
	manageProccessEvent = function(o, manageUL) {
		if (!$(o).hasClass('current')) {
			$('li', manageUL).removeClass('current');
			$('li', manageUL).find('.preview').hide();
			$(o).addClass('current');
			$nativeUIManager.confactionSheetirm('请选择操作', '取消', [{
					title: '经办完成'
				}, {
					title: '查看'
				}],
				function(index) {
					if (index > 0) {
						var manageId = $(o).attr('uid');
						var reqId = $(o).attr('reqId');
						if (reqId && manageId) {
							if (index == 1) {
								work(manageId);
							} else if (index == 2) {
								$windowManager.create('req_viewHead', '../req/viewHead.html?reqId=' + reqId + '&from=platform', false, true, function(show) {
									show();
								});
							}
						}
					}
					$(o).removeClass('current');
				});
		} else {
			$(o).removeClass('current');
			$('.preview', o).hide();
		}
	};
	manageBatchEvent = function(o, manageUL) {
		if (!$(o).hasClass('current')) {
			$(o).addClass('current');
			$('.radio_ico', o).addClass('current');
		} else {
			$(o).removeClass('current');
			$('.radio_ico', o).removeClass('current');
		}
	};
	confirmProccessEvent = function(o, confirmUL) {
		if (!$(o).hasClass('current')) {
			$('li', confirmUL).removeClass('current');
			$(o).addClass('current');
			$nativeUIManager.confactionSheetirm('请选择操作', '取消', [{
					title: '确认'
				}, {
					title: '查看'
				}],
				function(index) {
					if (index > 0) {
						var reqId = $(o).attr('reqId');
						if (reqId) {
							if (index == 1) {
								confirm(reqId);
							} else if (index == 2) {
								$windowManager.create('req_viewHead', '../req/viewHead.html?reqId=' + reqId + '&from=platform', false, true, function(show) {
									show();
								});
							}
						}
					}
					$(o).removeClass('current');
				});
		} else {
			$(o).removeClass('current');
			$('.preview', o).hide();
		}
	};
	confirmBatchEvent = function(o, manageUL) {
		if (!$(o).hasClass('current')) {
			$(o).addClass('current');
			$('.radio_ico', o).addClass('current');
		} else {
			$(o).removeClass('current');
			$('.radio_ico', o).removeClass('current');
		}
	};
	refreshBadge = function() {
		var badge = 0;
		var taskUL = $('.list[dir="task"]', '.workData');
		if (taskUL) {
			badge += $('li', taskUL).size();
		}
		var manageUL = $('.list[dir="manage"]', '.workData');
		if (manageUL) {
			badge += $('li', manageUL).size();
		}
		var confirmUL = $('.list[dir="confirm"]', '.workData');
		if (confirmUL) {
			badge += $('li', confirmUL).size();
		}
		var shareUL = $('.list[dir="share"]', '.workData');
		if (shareUL) {
			badge += $('li', shareUL).size();
		}
		plus.runtime.setBadgeNumber(badge);
	};
	bindEvent = function() {
		var taskUL = $('.list[dir="task"]', '.workData');
		if (taskUL) {
			$common.touchSME($('li', taskUL),
				function(startX, startY, endX, endY, event, startTouch, o) {},
				function(startX, startY, endX, endY, event, moveTouch, o) {

				}, function(startX, startY, endX, endY, event, o) {
					if (startX == endX && startY == endY) {
						$(o).addClass('active');
						window.setTimeout(function() {
							$(o).removeClass('active');
							var ul = $(o).closest('ul');
							if (!$(ul).hasClass('choose')) {
								taskProccessEvent(o, taskUL);
							} else {
								taskBatchEvent(o, taskUL)
							}
						}, 100);
					}
				});
		}
		var manageUL = $('.list[dir="manage"]', '.workData');
		if (manageUL) {
			$common.touchSME($('li', manageUL),
				function(startX, startY, endX, endY, event, startTouch, o) {},
				function(startX, startY, endX, endY, event, moveTouch, o) {}, function(startX, startY, endX, endY, event, o) {
					if (startX == endX && startY == endY) {
						$(o).addClass('active');
						window.setTimeout(function() {
							$(o).removeClass('active');
							var ul = $(o).closest('ul');
							if (!$(ul).hasClass('choose')) {
								manageProccessEvent(o, manageUL);
							} else {
								manageBatchEvent(o, manageUL)
							}
						}, 100);
					}
				});
		}
		var confirmUL = $('.list[dir="confirm"]', '.workData');
		if (confirmUL) {
			$common.touchSME($('li', confirmUL),
				function(startX, startY, endX, endY, event, startTouch, o) {},
				function(startX, startY, endX, endY, event, moveTouch, o) {}, function(startX, startY, endX, endY, event, o) {
					if (startX == endX && startY == endY) {
						$(o).addClass('active');
						window.setTimeout(function() {
							$(o).removeClass('active');
							var ul = $(o).closest('ul');
							if (!$(ul).hasClass('choose')) {
								confirmProccessEvent(o, confirmUL);
							} else {
								confirmBatchEvent(o, confirmUL)
							}
						}, 100);
					}
				});
		}
		var tipUL = $('.list[dir="tip"]', '.workData');
		if (tipUL) {
			$common.touchSME($('li', tipUL),
				function(startX, startY, endX, endY, event, startTouch, o) {},
				function(startX, startY, endX, endY, event, moveTouch, o) {}, function(startX, startY, endX, endY, event, o) {
					if (startX == endX && startY == endY) {
						if (!$(o).hasClass('active')) {
							var reqId = $(o).attr('reqId');
							if (reqId) {
								$(o).addClass('active');
								window.setTimeout(function() {
									$(o).removeClass('active');
									$windowManager.create('req_viewHead', '../req/viewHead.html?reqId=' + reqId + '&from=platform', false, true, function(show) {
										show();
									});
								}, 100);
							}
						}
					}
				});
		}
		var ingUL = $('.list[dir="ing"]', '.workData');
		if (ingUL) {
			$common.touchSME($('li', ingUL),
				function(startX, startY, endX, endY, event, startTouch, o) {},
				function(startX, startY, endX, endY, event, moveTouch, o) {}, function(startX, startY, endX, endY, event, o) {
					if (startX == endX && startY == endY) {
						if (!$(o).hasClass('active')) {
							var reqId = $(o).attr('reqId');
							if (reqId) {
								$(o).addClass('active');
								window.setTimeout(function() {
									$(o).removeClass('active');
									var backYn = $(o).attr('backYn');
									if (backYn) {
										if (backYn == 'Y') {
											$nativeUIManager.confactionSheetirm('请选择操作', '取消', [{
													title: '查看'
												}, {
													title: '撤销'
												}],
												function(index) {
													if (index > 0) {
														if (index == 1) {
															$windowManager.create('req_viewHead', '../req/viewHead.html?reqId=' + reqId + '&from=platform', false, true, function(show) {
																show();
															});
														} else if (index == 2) {
															back(reqId);
														}
													}
												});
										} else if (backYn == 'N') {
											$windowManager.create('req_viewHead', '../req/viewHead.html?reqId=' + reqId + '&from=platform', false, true, function(show) {
												show();
											});
										}
									}
								}, 100);
							}
						}
					}
				});
		}
		var taskOverUL = $('.list[dir="taskOver"]', '.workData');
		if (taskOverUL) {
			$common.touchSME($('li', taskOverUL),
				function(startX, startY, endX, endY, event, startTouch, o) {},
				function(startX, startY, endX, endY, event, moveTouch, o) {}, function(startX, startY, endX, endY, event, o) {
					if (startX == endX && startY == endY) {
						if (!$(o).hasClass('active')) {
							var reqId = $(o).attr('reqId');
							if (reqId) {
								$(o).addClass('active');
								window.setTimeout(function() {
									$(o).removeClass('active');
									$windowManager.create('req_viewHead', '../req/viewHead.html?reqId=' + reqId + '&from=platform', false, true, function(show) {
										show();
									});
								}, 100);
							}
						}
					}
				});
		}
		var manageOverUL = $('.list[dir="manageOver"]', '.workData');
		if (manageOverUL) {
			$common.touchSME($('li', manageOverUL),
				function(startX, startY, endX, endY, event, startTouch, o) {},
				function(startX, startY, endX, endY, event, moveTouch, o) {}, function(startX, startY, endX, endY, event, o) {
					if (startX == endX && startY == endY) {
						if (!$(o).hasClass('active')) {
							var reqId = $(o).attr('reqId');
							if (reqId) {
								$(o).addClass('active');
								window.setTimeout(function() {
									$(o).removeClass('active');
									$windowManager.create('req_viewHead', '../req/viewHead.html?reqId=' + reqId + '&from=platform', false, true, function(show) {
										show();
									});
								}, 100);
							}
						}
					}
				});
		}
		var shareUL = $('.list[dir="share"]', '.workData');
		if (shareUL) {
			$common.touchSME($('li', shareUL),
				function(startX, startY, endX, endY, event, startTouch, o) {},
				function(startX, startY, endX, endY, event, moveTouch, o) {}, function(startX, startY, endX, endY, event, o) {
					if (startX == endX && startY == endY) {
						if (!$(o).hasClass('active')) {
							var reqId = $(o).attr('reqId');
							if (reqId) {
								$(o).addClass('active');
								window.setTimeout(function() {
									$(o).removeClass('active');
									$windowManager.create('req_viewHead', '../req/viewHead.html?reqId=' + reqId + '&from=platform', false, true, function(show) {
										show();
									});
								}, 100);
							}
						}
					}
				});
		}
		$common.touchSE($('.batchAction', '.workData'), function(event, startTouch, o) {
			var obj = o;
			var p = $(obj).parent();
			if (p) {
				var dir = $(p).attr('dir');
				var ul = $(p).next();
				if (ul && dir) {
					if (!$(ul).hasClass('choose')) {
						$(ul).addClass('choose');
						$(obj).text('完成');
						$('.desc', p).hide();
						$('.batchCancelAction', p).show();
						$common.touchSE($('.batchCancelAction', p), function(event, startTouch, o) {
								$(ul).removeClass('choose');
								$('.radio_ico', ul).removeClass('current');
								$(obj).text('批量操作');
								$('.desc', p).show();
								$('.batchCancelAction', p).hide();
							},
							function(event, o) {

							});
					} else {
						var batchIds = '';
						var batchCount = 0;
						$('.radio_ico', ul).each(function(i, o) {
							if ($(o).hasClass('current')) {
								var li = $(o).parent();
								if (li) {
									var batchId = $(li).attr('uid');
									if (batchId) {
										batchIds += batchId + ',';
										batchCount++;
									}
								}
							}
						});
						if (batchCount == 0) {
							$(ul).removeClass('choose');
							$('.desc', p).show();
							$('.batchCancelAction', p).hide();
							$(obj).text('批量操作');
						} else {
							if (dir == 'task') {
								$nativeUIManager.confactionSheetirm('你将批量审批' + batchCount + '个申请', '取消', [{
										title: '通过'
									}, {
										title: '否决'
									}],
									function(index) {
										if (index > 0) {
											if (batchIds) {
												if (index == 1) {
													passBatch(batchIds, function() {
														$(ul).removeClass('choose');
														$('.desc', p).show();
														$('.batchCancelAction', p).hide();
														$(obj).text('批量操作');
													});
												} else {
													rejectBatch(batchIds, function() {
														$(ul).removeClass('choose');
														$('.desc', p).show();
														$('.batchCancelAction', p).hide();
														$(obj).text('批量操作');
													});
												}
											}
										}
									});
							} else if (dir == 'manage') {
								$nativeUIManager.confactionSheetirm('你将批量经办' + batchCount + '个申请', '取消', [{
										title: '经办完成'
									}],
									function(index) {
										if (index > 0) {
											if (batchIds) {
												if (index == 1) {
													workBatch(batchIds, function() {
														$(ul).removeClass('choose');
														$('.desc', p).show();
														$('.batchCancelAction', p).hide();
														$(obj).text('批量操作');
													});
												}
											}
										}
									});
							} else if (dir == 'confirm') {
								$nativeUIManager.confactionSheetirm('你将批量确认' + batchCount + '个申请', '取消', [{
										title: '确认完成'
									}],
									function(index) {
										if (index > 0) {
											alert(batchId);
											alert(batchCount);
											$(ul).removeClass('choose');
											$(obj).text('批量操作');
										}
									});
							}
						}
					}
				}
			}
		}, function(event, o) {

		});

		refreshBadge();
	};
	bindData = function(jsonData) {
		var sb = new StringBuilder();
		var taskArray = jsonData['taskArray'];
		if (taskArray && $(taskArray).size() > 0) {
			var batchFlag = false;
			if ($(taskArray).size() > 1) {
				batchFlag = true;
			}
			sb.append(String.formatmodel($templete.getWorkType(batchFlag), {
				typeText: '待审批',
				typeCount: $(taskArray).size(),
				dir: 'task'
			}));
			sb.append(String.formatmodel($templete.getWorkDataCardStart(), {
				dir: 'task'
			}));
			$(taskArray).each(function(i, o) {
				var desc = '<span class="name width-48">' + o['userName'] + '</span> <span class="t_wait">于</span> ' + o['dateTime'] +
					' <span class="t_wait">发起</span> ';
				if (o['nodeSeq'] != "1") {
					desc += '已被 <span class="name width-48">' + o['prevName'] + '</span>';
					if (o['prevIdea'] == "1") {
						desc += ' <span class="t_croose">通过</span>';
					} else if (o['prevIdea'] == "3") {
						desc += ' <span class="t_wait">转审</span>';
					}
				}
				var quickPreview = o['quickPreview'];
				sb.append(String.formatmodel($templete.getWorkData(batchFlag, quickPreview), {
					applyName: o['applyName'] + ' <span class="t_wait">[' + o['reqNo'] + ']</span>',
					desc: desc,
					uid: o['id'],
					reqId: o['reqId'],
					quickPreview: o['quickPreview'],
					backYn: 'N'
				}));
			});
			sb.append(String.formatmodel($templete.getWorkDataCardEnd(), {}));
		}
		var manageArray = jsonData['manageArray'];
		if (manageArray && $(manageArray).size() > 0) {
			var batchFlag = false;
			if ($(manageArray).size() > 1) {
				batchFlag = true;
			}
			sb.append(String.formatmodel($templete.getWorkType(batchFlag), {
				typeText: '待经办',
				typeCount: $(manageArray).size(),
				dir: 'manage'
			}));
			sb.append(String.formatmodel($templete.getWorkDataCardStart(), {
				dir: 'manage'
			}));
			$(manageArray).each(function(i, o) {
				var desc = '<span class="name width-48">' + o['userName'] + '</span> <span class="t_wait">于</span> ' + o['dateTime'] +
					' <span class="t_wait">发起</span> ';
				if (o['taskYn'] != "Y") {
					desc += '已被 <span class="name width-48">' + o['taskName'] + '</span> <span class="t_croose">通过</span>';
				}
				var quickPreview = o['quickPreview'];
				sb.append(String.formatmodel($templete.getWorkData(batchFlag, quickPreview), {
					applyName: o['applyName'] + ' <span class="t_wait">[' + o['reqNo'] + ']</span>',
					desc: desc,
					uid: o['id'],
					reqId: o['reqId'],
					quickPreview: 'N',
					backYn: 'N'
				}));
			});
			sb.append(String.formatmodel($templete.getWorkDataCardEnd(), {}));
		}
		var confirmArray = jsonData['confirmArray'];
		if (confirmArray && $(confirmArray).size() > 0) {
			var batchFlag = false;
			if ($(confirmArray).size() > 1) {
				batchFlag = true;
			}
			sb.append(String.formatmodel($templete.getWorkType(batchFlag), {
				typeText: '待确认',
				typeCount: $(confirmArray).size(),
				dir: 'confirm'
			}));
			sb.append(String.formatmodel($templete.getWorkDataCardStart(), {
				dir: 'confirm'
			}));
			$(confirmArray).each(function(i, o) {
				var desc = '<span class="t_wait">于</span> ' + o['dateTime'] +
					' <span class="t_wait">发起</span> ';
				desc += '已被 <span class="name width-48">' + o['userName'] + '</span> <span class="t_croose">处理</span>';
				sb.append(String.formatmodel($templete.getWorkData(batchFlag, 'N'), {
					applyName: o['applyName'] + ' <span class="t_wait">[' + o['reqNo'] + ']</span>',
					desc: desc,
					uid: o['id'],
					reqId: o['id'],
					quickPreview: 'N',
					backYn: 'N'
				}));
			});
			sb.append(String.formatmodel($templete.getWorkDataCardEnd(), {}));
		}
		var ingArray = jsonData['ingArray'];
		if (ingArray && $(ingArray).size() > 0) {
			var batchFlag = false;
			sb.append(String.formatmodel($templete.getWorkType(batchFlag), {
				typeText: '进行中',
				typeCount: $(ingArray).size(),
				dir: 'ing'
			}));
			sb.append(String.formatmodel($templete.getWorkDataCardStart(), {
				dir: 'ing'
			}));
			$(ingArray).each(function(i, o) {
				var desc = '<span class="t_wait">于</span> ' + o['dateTime'] +
					' <span class="t_wait">发起</span> ';
				desc += '正在等待 <span class="name width-48">' + o['userName'] + '</span>';
				if (o['nodeType'] == "task") {
					desc += ' <span class="t_wait">审批</span>';
				} else if (o['nodeType'] == "manage") {
					desc += ' <span class="t_wait">执行</span>';
				}
				sb.append(String.formatmodel($templete.getWorkData(batchFlag, 'N'), {
					applyName: o['applyName'] + ' <span class="t_wait">[' + o['reqNo'] + ']</span>',
					desc: desc,
					uid: o['id'],
					reqId: o['id'],
					quickPreview: 'N',
					backYn: o['backYn']
				}));
			});
			sb.append(String.formatmodel($templete.getWorkDataCardEnd(), {}));
		}
		var taskOverArray = jsonData['taskOverArray'];
		if (taskOverArray && $(taskOverArray).size() > 0) {
			var batchFlag = false;
			sb.append(String.formatmodel($templete.getWorkType(batchFlag), {
				typeText: '已审批',
				typeCount: $(taskOverArray).size(),
				dir: 'taskOver'
			}));
			sb.append(String.formatmodel($templete.getWorkDataCardStart(), {
				dir: 'taskOver'
			}));
			$(taskOverArray).each(function(i, o) {
				var desc = '<span class="name width-48">' + o['userName'] + '</span> <span class="t_wait">于</span> ' + o['dateTime'] +
					' <span class="t_wait">发起</span> ';
				desc += '正在等待';
				if (o['nodeType'] == "task") {
					desc += ' <span class="name width-48">' + o['taskName'] + '</span> <span class="t_wait">审批</span>';
				} else if (o['nodeType'] == "manage") {
					desc += ' <span class="name width-48">' + o['manageName'] + '</span> <span class="t_wait">执行</span>';
				} else if (o['nodeType'] == "confirm") {
					desc += ' <span class="name width-48">' + o['confirmName'] + '</span> <span class="t_wait">确认</span>';
				}
				sb.append(String.formatmodel($templete.getWorkData(batchFlag, 'N'), {
					applyName: o['applyName'] + ' <span class="t_wait">[' + o['reqNo'] + ']</span>',
					desc: desc,
					uid: o['id'],
					reqId: o['reqId'],
					quickPreview: 'N',
					backYn: 'N'
				}));
			});
			sb.append(String.formatmodel($templete.getWorkDataCardEnd(), {}));
		}
		var manageOverArray = jsonData['manageOverArray'];
		if (manageOverArray && $(manageOverArray).size() > 0) {
			var batchFlag = false;
			sb.append(String.formatmodel($templete.getWorkType(batchFlag), {
				typeText: '已执行',
				typeCount: $(manageOverArray).size(),
				dir: 'manageOver'
			}));
			sb.append(String.formatmodel($templete.getWorkDataCardStart(), {
				dir: 'manageOver'
			}));
			$(manageOverArray).each(function(i, o) {
				var desc = '<span class="name width-48">' + o['userName'] + '</span> <span class="t_wait">于</span> ' + o['dateTime'] +
					' <span class="t_wait">发起</span> ';
				desc += '正在等待';
				desc += ' <span class="name width-48">' + o['userName'] + '</span> <span class="t_wait">确认</span>';
				sb.append(String.formatmodel($templete.getWorkData(batchFlag, 'N'), {
					applyName: o['applyName'] + ' <span class="t_wait">[' + o['reqNo'] + ']</span>',
					desc: desc,
					uid: o['id'],
					reqId: o['reqId'],
					quickPreview: 'N',
					backYn: 'N'
				}));
			});
			sb.append(String.formatmodel($templete.getWorkDataCardEnd(), {}));
		}
		var shareArray = jsonData['shareArray'];
		if (shareArray && $(shareArray).size() > 0) {
			var batchFlag = false;
			sb.append(String.formatmodel($templete.getWorkType(batchFlag), {
				typeText: '传阅',
				typeCount: $(shareArray).size(),
				dir: 'share'
			}));
			sb.append(String.formatmodel($templete.getWorkDataCardStart(), {
				dir: 'share'
			}));
			$(shareArray).each(function(i, o) {
				var desc = '<span class="name width-48">' + o['userName'] + '</span> <span class="t_wait">于</span> ' + o['dateTime'] +
					' <span class="t_wait">发起</span> ';
				desc += '被';
				desc += ' <span class="name width-48">' + o['ownerName'] + '</span> <span class="t_wait">传阅</span> 给您';
				sb.append(String.formatmodel($templete.getWorkData(batchFlag, 'N'), {
					applyName: o['applyName'] + ' <span class="t_wait">[' + o['reqNo'] + ']</span>',
					desc: desc,
					uid: o['id'],
					reqId: o['reqId'],
					quickPreview: 'N',
					backYn: 'N'
				}));
			});
			sb.append(String.formatmodel($templete.getWorkDataCardEnd(), {}));
		}
		$('.workData').empty().append(sb.toString());
		bindEvent();
		pullToRefreshEvent();
	};
	loadData = function(callback) {
		if (!callback) {
			$nativeUIManager.watting('加载中...');
		}
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/platform/desktop/data',
			dataType: 'json',
			data: {
				oaToken: $userInfo.get('token')
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						bindData(jsonData);
						if (!callback) {
							$nativeUIManager.wattingClose();
						}
						if (typeof callback == 'function') {
							callback();
						}
					} else {
						if (!callback) {
							$nativeUIManager.wattingTitle('未知错误');
						} else {
							$nativeUIManager.watting('未知错误');
						}
						window.setTimeout(function() {
							$nativeUIManager.wattingClose();
							if (typeof callback == 'function') {
								callback();
							}
						}, 1500);
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				if (!callback) {
					$nativeUIManager.wattingTitle('未知错误');
				} else {
					$nativeUIManager.watting('未知错误');
				}
				window.setTimeout(function() {
					$nativeUIManager.wattingClose();
					if (typeof callback == 'function') {
						callback();
					}
				}, 1500);
			}
		});
	};
	plusReady = function() {
		loadData();
		$updateManager.execute();
		$pushManager.connect(function(type, id, reqId) {
			$windowManager.create('req_viewHead', '../req/viewHead.html?reqId=' + reqId + '&from=platform', false, true, function(show) {
				show();
			});
		}, function() {
			var platformListWindow = $windowManager.getById('platform_list');
			if (platformListWindow) {
				if (platformListWindow.isVisible()) {
					loadData();
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