define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var queryMap = parseURL();
	var id = queryMap.get('id');
	var applyId = queryMap.get('applyId');
	var subject = queryMap.get('subject');
	var currentFlowList = false;
	var flowTypeMap = new HashMap();
	sendApply = function() {
		var approveCount = $('li', '#approveNodesUL').size();
		if (approveCount == 0) {
			$nativeUIManager.alert('提示', '表单没有正确加载流程,请选择流程以后再进行提交', 'OK', function() {});
			return false;
		}
		if ($('.touch_off', '#exigencyYn').hasClass('current')) {
			$('#exigency').val(1);
		} else {
			$('#exigency').val(0);
		}

		if ($('.touch_off', '#confirmYn').hasClass('current')) {
			$('#confirmExecutive').val(1);
		} else {
			$('#confirmExecutive').val(0);
		}
		$('#approveCount').val($('li[type="task"]', '#approveNodesUL').size());
		$nativeUIManager.watting('正在提交申请...');
		window.setTimeout(function() {
			$common.refreshToken(function(token) {
				$('#org\\.guiceside\\.web\\.jsp\\.taglib\\.Token').val(token);
				$.ajax({
					type: 'POST',
					url: $common.getRestApiURL() + '/wf/req/save',
					dataType: 'json',
					data: $('#editForm').serialize().replace(/\+/g, " "),
					success: function(jsonData) {
						if (jsonData) {
							if (jsonData['result'] == '0') {
								$nativeUIManager.wattingTitle('提交成功,请到工作台查看审批进度');
								window.setTimeout(function() {
									$nativeUIManager.wattingClose();
									$windowManager.close('slide-out-right');
									$controlWindow.sendWindowShow();
								}, 1500);
							} else {
								$nativeUIManager.wattingTitle('提交失败,请稍后重试');
								window.setTimeout(function() {
									$nativeUIManager.wattingClose();
								}, 1000);
							}
						}
					},
					error: function(jsonData) {
						$nativeUIManager.wattingTitle('发生错误,请稍后重试');
						window.setTimeout(function() {
							$nativeUIManager.wattingClose();
						}, 1000);
					}
				});
			});
		}, 500);

	};
	setSelectItem = function(uuid, text, value) {
		$('#' + uuid).attr('flowId', value);
		$('#' + uuid).attr('type', flowTypeMap.get(value + '_'));
		selectObj = $('#' + uuid);
		if (selectObj) {
			$('.text_int', selectObj).text(text).addClass('alignright');
			loadFlow(flowTypeMap.get(value + '_'), value);
		}
	};
	bindEvent = function() {

		$common.touchSE($('#exigencyYn'), function(event, startTouch, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
			}
		}, function(event, o) {
			if ($(o).hasClass('active')) {
				if (!$('.touch_off', o).hasClass('current')) {
					$('.touch_off', o).addClass('current');
				} else {
					$('.touch_off', o).removeClass('current');
				}
				window.setTimeout(function() {
					$(o).removeClass('active');
				}, 100);
			}
		});

		$common.touchSE($('#confirmYn'), function(event, startTouch, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
			}
		}, function(event, o) {
			if ($(o).hasClass('active')) {
				var manageCount = $('li[type="manage"]', '#approveNodesUL').size();
				if (manageCount > 0) {
					if (!$('.touch_off', o).hasClass('current')) {
						$('.touch_off', o).addClass('current');
					} else {
						$('.touch_off', o).removeClass('current');
					}
				} else {
					$nativeUIManager.alert('提示', '当前流程中没有经办人,无法进行确认!', 'OK', function() {});
				}
				window.setTimeout(function() {
					$(o).removeClass('active');
				}, 100);
			}
		});
	};

	function addApproveNode(nodeSeq, approveId, approveType) {
		var editForm = $('#approveNodeHidden', '#editForm');
		$(editForm).append('<input type="hidden" id="nodeSeq' + nodeSeq + '" name="nodeSeq' + nodeSeq + '" value="' + nodeSeq + '">');
		$(editForm).append('<input type="hidden" id="approveId' + nodeSeq + '" name="approveId' + nodeSeq + '" value="' + approveId + '">');
		$(editForm).append('<input type="hidden" id="approveType' + nodeSeq + '" name="approveType' + nodeSeq + '" value="' + approveType + '">');
	}

	function loadFlow(flowType, flowId, repeatApprove) {
		currentFlowType = flowType;
		currentFowId = flowId;
		$nativeUIManager.watting('正在加载流程...');
		$('#approveNodeHidden', '#editForm').empty();
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/common/common/flowDetail',
			dataType: 'json',
			data: {
				flowId: flowId,
				flowType: flowType,
				repeatApprove: repeatApprove,
				oaToken: $userInfo.get('token')
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var nodeList = jsonData['nodeList'];
						var sb = new StringBuilder();
						if (nodeList && $(nodeList).size() > 0) {
							var approveArray = new Array();
							var flagRepeat = false;
							//$('.repeatApprove').hide();
							$(nodeList).each(function(i, o) {
								sb.append(String.formatmodel($templete.getFlowItem(), {
									userId: o['userId'],
									nodeName: o['nodeName'],
									userImg: o['userImg'],
									text: '审批(' + (i + 1) + ')',
									approveType: o['approveType'],
									type: 'task'
								}));
								addApproveNode((i + 1), o['userId'], o['approveType']);
								if (approveArray.Contains(o['userId'])) {
									flagRepeat = true;
								} else {
									approveArray.push(o['userId'])
								}
							});
							if (flagRepeat) {
								//$('.repeatApprove').show();
							} else {
								//                              if(jsonData['repeatYn']=='Y'){
								//                                  $('.repeatApprove').show();
								//                              }else{
								//                                  $('span','.repeatApprove').removeClass('checked');
								//                                  $('.repeatApprove').hide();
								//                              }
							}
						}
						var manageNode = jsonData['manageNode'];
						if (manageNode) {
							sb.append(String.formatmodel($templete.getFlowItem(), {
								userId: manageNode['userId'],
								nodeName: manageNode['nodeName'],
								userImg: manageNode['userImg'],
								text: '经办人',
								approveType: manageNode['approveType'],
								type: 'manage'
							}));
							addApproveNode(9999, manageNode['userId'], manageNode['approveType']);
						}
						$('#approveNodesUL').empty().append(sb.toString());
						$nativeUIManager.wattingClose();
						bindEvent();
					} else {
						// $('.repeatApprove').hide();
						$nativeUIManager.wattingTitle('发生错误,请稍后重试');
						window.setTimeout(function() {
							$nativeUIManager.wattingClose();
						}, 1000);
					}
				}
			},
			error: function(jsonData) {
				// $('.repeatApprove').hide();
				$nativeUIManager.wattingTitle('发生错误,请稍后重试');
				window.setTimeout(function() {
					$nativeUIManager.wattingClose();
				}, 1000);
			}
		});
	};
	loadData = function() {
		$('#id').val(id);
		$('#applyId').val(applyId);
		$nativeUIManager.watting('请稍等...');
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/wf/req/flowMobile',
			dataType: 'json',
			data: {
				'oaToken': $userInfo.get('token'),
				id: id,
				applyId: applyId
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var flowList = jsonData['flowList'];
						if (flowList && $(flowList).size() > 0) {
							currentFlowList = flowList;
							$(currentFlowList).each(function(i, o) {
								flowTypeMap.put(o['id'] + '_', o['type']);
							});
						}
						var flow = jsonData['flow'];
						if (flow) {
							$('span', '#currentFlow').eq(1).text(flow['flowName']);
							$('#currentFlow').attr('flowId', flow['id']);
							$('#currentFlow').attr('type', flow['type']);
						} else {
							$nativeUIManager.alert('提示', '当前申请没有可用流程', 'OK', function() {
								$windowManager.close('slide-out-right');
								$controlWindow.sendWindowShow();
							});
						}


						$common.touchSE($('#currentFlow'), function(event, startTouch, o) {
							if (!$(o).hasClass('active')) {
								$(o).addClass('active');
							}
						}, function(event, o) {
							if ($(o).hasClass('active')) {
								var currentId = $(o).attr('flowId');
								var title = $('span', o).eq(0).text();
								$userInfo.put('itemJsonData', JSON.stringify(currentFlowList));
								$windowManager.create('select_head', '../common/select_head.html?id=' + currentId + '&title=' + title + '&uuid=currentFlow&winId=apply_flow&keyValue=id_flowName', false, true, function(show) {
									show();
								});
								window.setTimeout(function() {

								}, 100);
							}
						});



						window.setTimeout(function() {
							$nativeUIManager.wattingClose();
							if (flow) {
								loadFlow(flow['type'], flow['id']);
							}
						}, 500);
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
	plusReady = function() {
		loadData();
		$('#subject').text(subject);
		$common.androidBack(function() {
			$nativeUIManager.confirm('提示', '你确定取消申请?', ['确定', '取消'], function() {
				$windowManager.close('slide-out-right');
				$controlWindow.sendWindowShow();
			}, function() {});
		});
		$common.touchSE($('#backAction'), function(event, startTouch, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
			}
		}, function(event, o) {
			if ($(o).hasClass('active')) {
				$nativeUIManager.confirm('提示', '你确定取消申请?', ['确定', '取消'], function() {
					$windowManager.close('slide-out-right');
					$controlWindow.sendWindowShow();
				}, function() {});
				$(o).removeClass('active');
			}
		});
		window.setTimeout(function() {
			var editHeadWindow = $windowManager.getById('apply_head');
			if (editHeadWindow) {
				editHeadWindow.close();
			}
		}, 1000);
		$common.touchSE($('#sendAction'), function(event, startTouch, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
			}
		}, function(event, o) {
			if ($(o).hasClass('active')) {
				sendApply();
				$(o).removeClass('active');
			}
		});
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});