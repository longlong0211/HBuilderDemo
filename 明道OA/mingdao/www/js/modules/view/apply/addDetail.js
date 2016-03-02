define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $inputManager = require('manager/input');
	var $validator = require('core/validator');
	var selectMap = new HashMap();
	var queryMap = parseURL();
	var uuid = queryMap.get('uuid');
	var currentRow = queryMap.get('currentRow');
	saveDetail = function() {
		$validator.checkAll();
		window.setTimeout(function() {
			var passed = $validator.isPassed();
			if (passed) {
				$nativeUIManager.watting('正在保存...');
				window.setTimeout(function() {
					var detailJsonData = JSON.parse($userInfo.get('detailJsonData'));
					if (detailJsonData && $(detailJsonData).size() > 0) {
						var sb = new StringBuilder();
						$(detailJsonData).each(function(i, o) {
							var detailType = o['detailType'];
							var detailName = o['detailName'];
							var detailIndex = o['detailIndex'];
							if (detailType && detailName && detailIndex) {
								var detailText = '';
								var detailValue = '';
								var detailId = o['uuid'] + '_' + currentRow + '_' + detailIndex;
								if (detailType == '_costType') {
									var obj = $('li.choose[controlType="_costType"][uuid="' + detailId + '"]');
									if (obj) {
										detailText = $('.text_int', obj).text();
										detailValue = $('input', obj).val();
										sb.append(String.formatmodel($templete.getAddDetailContentColItem(), {
											detailName: detailName,
											detailText: detailText,
											detailValue: detailValue,
											detailId: detailId
										}));
									}
								} else if (detailType == '_costItem') {
									var obj = $('li.choose[controlType="_costItem"][uuid="' + detailId + '"]');
									if (obj) {
										detailText = $('.text_int', obj).text();
										detailValue = $('input', obj).val();
										sb.append(String.formatmodel($templete.getAddDetailContentColItem(), {
											detailName: detailName,
											detailText: detailText,
											detailValue: detailValue,
											detailId: detailId
										}));
									}
								} else if (detailType == '_source') {
									var obj = $('li.choose[controlType="_source"][uuid="' + detailId + '"]');
									if (obj) {
										detailText = $('.text_int', obj).text();
										detailValue = $('input', obj).val();
										sb.append(String.formatmodel($templete.getAddDetailContentColItem(), {
											detailName: detailName,
											detailText: detailText,
											detailValue: detailValue,
											detailId: detailId
										}));
									}
								} else if (detailType == '_date') {
									var obj = $('li.choose[controlType="_date"][uuid="' + detailId + '"]');
									if (obj) {
										detailText = $('.text_int', obj).text();
										detailValue = $('input', obj).val();
										sb.append(String.formatmodel($templete.getAddDetailContentColItem(), {
											detailName: detailName,
											detailText: detailText,
											detailValue: detailValue,
											detailId: detailId
										}));
									}
								} else if (detailType == '_time') {
									var obj = $('li.choose[controlType="_time"][uuid="' + detailId + '"]');
									if (obj) {
										detailText = $('.text_int', obj).text();
										var detailValue1 = $('input[name="' + detailId + '_hours"]', obj).val();
										var detailValue2 = $('input[name="' + detailId + '_hours"]', obj).val();
										detailValue = detailValue1 + ":" + detailValue2;
										sb.append(String.formatmodel($templete.getAddDetailContentColItemForTime(), {
											detailName: detailName,
											detailText: detailValue,
											detailValue1: detailValue1,
											detailValue2: detailValue2,
											detailId: detailId
										}));
									}
								} else if (detailType == '_number') {
									var obj = $('li.ipt[controlType="_number"][uuid="' + detailId + '"]');
									if (obj) {
										detailText = $('input', obj).val();
										detailValue = $('input', obj).val();
										sb.append(String.formatmodel($templete.getAddDetailContentColItem(), {
											detailName: detailName,
											detailText: detailText,
											detailValue: detailValue,
											detailId: detailId
										}));
									}
								} else if (detailType == '_amount') {
									var obj = $('li.ipt[controlType="_amount"][uuid="' + detailId + '"]');
									if (obj) {
										detailText = $('input', obj).val();
										detailValue = $('input', obj).val();
										sb.append(String.formatmodel($templete.getAddDetailContentColItem(), {
											detailName: detailName,
											detailText: detailText,
											detailValue: detailValue,
											detailId: detailId
										}));
									}
								} else {
									if (detailType.startsWith('_total')) {
										var obj = $('li.ipt[controlType="'+detailType+'"][uuid="' + detailId + '"]');
										if (obj) {
											detailText = $('input', obj).val();
											detailValue = $('input', obj).val();
											sb.append(String.formatmodel($templete.getAddDetailContentColItem(), {
												detailName: detailName,
												detailText: detailText,
												detailValue: detailValue,
												detailId: detailId
											}));
										}
									} else {
										var obj = $('li.ipt[controlType="_varchar"][uuid="' + detailId + '"]');
										if (obj) {
											detailText = $('input', obj).val();
											detailValue = $('input', obj).val();
											sb.append(String.formatmodel($templete.getAddDetailContentColItem(), {
												detailName: detailName,
												detailText: detailText,
												detailValue: detailValue,
												detailId: detailId
											}));
										}
									}
								}
							}
						});
						var detailContent = String.formatmodel($templete.getAddDetailContentItem(sb.toString()), {
							index: currentRow
						});
						var editWindow = $windowManager.getById('apply_edit');
						if (editWindow) {
							$userInfo.put('detailContent', detailContent);
							editWindow.evalJS('addDetail("' + uuid + '")');
							$userInfo.removeItem('detailJsonData');
							$nativeUIManager.wattingClose();
							$windowManager.close('slide-out-right');
						}
					}
				}, 500);
			} else {
				$nativeUIManager.alert('提示', '请检查申请信息是否填写完毕', 'OK', function() {});
			}
		}, 500);
	};
	setSelectItem = function(uuid, text, value) {
		$('#' + uuid).val(value);
		$validator.check(uuid);
		var selectObj = false;
		var sourceCount = $('li.choose[controlType="_source"][uuid="' + uuid + '"]').size();
		if (sourceCount > 0) {
			selectObj = $('li.choose[controlType="_source"][uuid="' + uuid + '"]');
		} else {
			var costTypeCount = $('li.choose[controlType="_costType"][uuid="' + uuid + '"]').size();
			if (costTypeCount > 0) {
				selectObj = $('li.choose[controlType="_costType"][uuid="' + uuid + '"]');
				var itemId = $('li.choose[controlType="_costItem"]').find('input').val();
				if (isStr(itemId)) {
					$nativeUIManager.alert('提示', '更换了费用类别请重新选择费用项目', 'OK', function() {
						$('li.choose[controlType="_costItem"]').find('input').val('');
						$('li.choose[controlType="_costItem"]').find('.text_int').text('请选择').removeClass('alignleft');
					});
				}
			} else {
				var costItemCount = $('li.choose[controlType="_costItem"][uuid="' + uuid + '"]').size();
				if (costItemCount > 0) {
					selectObj = $('li.choose[controlType="_costItem"][uuid="' + uuid + '"]');
				}
			}
		}
		if (selectObj) {
			$('.text_int', selectObj).text(text).addClass('alignleft');
		}
	};
	putSource = function(controlUID, sources) {
		selectMap.put(controlUID, JSON.stringify(sources));
	};
	getSource = function(controlUID) {
		return selectMap.get(controlUID);
	};
	isStr = function(str) {
		if (str && str.length > 0 && str != undefined && str != 'undefined') {
			return true;
		}
		return false;
	};
	bindEvent = function() {
		$common.touchSE($('#saveDetail'), function(event, startTouch, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
			}
		}, function(event, o) {
			if ($(o).hasClass('active')) {
				saveDetail();
				window.setTimeout(function() {
					$(o).removeClass('active');
				}, 100);
			}
		});
		$inputManager.forceCloseKeyboard();
		$inputManager.focus();
		$common.touchSE($('li.choose[controlType="_date"]'), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
				var uuid = $(o).attr('uuid');
				$nativeUIManager.pickDate(function(date) {
					var dateStr = date.Format('yyyy-MM-dd');
					$('input[name="' + uuid + '"]', o).val(dateStr);
					$('.text_int', o).text(dateStr).addClass('alignleft');
					$validator.check(uuid);
				}, function() {

				});
				window.setTimeout(function() {
					$(o).removeClass('active');
				}, 100);
			}
		});

		$common.touchSE($('li.choose[controlType="_time"]'), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
				var uuid = $(o).attr('uuid');
				var defaultHours = $('.inner', o).attr('defaultHours');
				var defaultMinute = $('.inner', o).attr('defaultMinute');
				var currentDate = false;
				var current = defaultHours + ":" + defaultMinute;
				if (current) {
					currentDate = new Date('1986-12-15 ' + current + ':45');
				}
				$nativeUIManager.pickTime(function(date) {
					var hours = parseInt(date.Format('h'));
					var minutes = parseInt(date.Format('m'));
					if (hours < 10) {
						hours = '0' + hours;
					}
					if (minutes < 10) {
						minutes = '0' + minutes;
					}
					var timeValue = hours + ":" + minutes;

					$('input[name="' + uuid + '_hours"]', o).val(hours);
					$('input[name="' + uuid + '_minute"]', o).val(minutes);
					$('input[name="' + uuid + '"]', o).val(timeValue);
					$('.text_int', o).text(timeValue).addClass('alignleft');
					$validator.check(uuid);
				}, function() {

				}, {
					time: currentDate
				});
				window.setTimeout(function() {
					$(o).removeClass('active');
				}, 100);
			}
		});
		$common.touchSE($('li.choose[controlType="_source"]'), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
				var uuid = $(o).attr('uuid');
				var itemJsonData = getSource(uuid);
				if (itemJsonData) {
					var currentId = $('#' + uuid).val();
					var title = $('span', o).eq(0).text();
					$userInfo.put('itemJsonData', itemJsonData);
					$windowManager.create('select_head', '../common/select_head.html?id=' + currentId + '&title=' + title + '&uuid=' + uuid + '&winId=apply_addDetail', false, true, function(show) {
						show();
					});
				}
				window.setTimeout(function() {
					$(o).removeClass('active');
				}, 100);
			}
		});
		$common.touchSE($('li.choose[controlType="_costType"]'), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
				var uuid = $(o).attr('uuid');
				$nativeUIManager.watting('正在加载费用类别...');
				$.ajax({
					type: 'POST',
					url: $common.getRestApiURL() + '/common/common/expenseTypeList',
					dataType: 'json',
					data: {
						oaToken: $userInfo.get('token')
					},
					success: function(jsonData) {
						if (jsonData) {
							if (jsonData['result'] == '0') {
								var typeList = jsonData['typeList'];
								if (typeList && $(typeList).size() > 0) {
									$userInfo.put('itemJsonData', JSON.stringify(typeList));
									$nativeUIManager.wattingClose();
									var currentId = $('#' + uuid).val();
									var title = $('span', o).eq(0).text();
									$windowManager.create('select_head', '../common/select_head.html?id=' + currentId + '&title=' + title + '&uuid=' + uuid + '&winId=apply_addDetail&keyValue=id_typeName', false, true, function(show) {
										show();
									});
								}
							} else {
								$nativeUIManager.wattingTitle('发生错误,请稍后重试');
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
				window.setTimeout(function() {
					$(o).removeClass('active');
				}, 100);
			}
		});


		$common.touchSE($('li.choose[controlType="_costItem"]'), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('active')) {
				var typeId = $('li.choose[controlType="_costType"]').find('input').val();
				if (isStr(typeId)) {
					$(o).addClass('active');
					var uuid = $(o).attr('uuid');
					$nativeUIManager.watting('正在加载费用项目...');
					$.ajax({
						type: 'POST',
						url: $common.getRestApiURL() + '/common/common/expenseItemList',
						dataType: 'json',
						data: {
							oaToken: $userInfo.get('token'),
							typeId: typeId
						},
						success: function(jsonData) {
							if (jsonData) {
								if (jsonData['result'] == '0') {
									var itemList = jsonData['itemList'];
									if (itemList && $(itemList).size() > 0) {
										$userInfo.put('itemJsonData', JSON.stringify(itemList));
										$nativeUIManager.wattingClose();
										var currentId = $('#' + uuid).val();
										var title = $('span', o).eq(0).text();
										$windowManager.create('select_head', '../common/select_head.html?id=' + currentId + '&title=' + title + '&uuid=' + uuid + '&winId=apply_addDetail&keyValue=id_itemName', false, true, function(show) {
											show();
										});
									}
								} else {
									$nativeUIManager.wattingTitle('发生错误,请稍后重试');
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
				} else {
					$nativeUIManager.alert('提示', '请先选择费用类别', 'OK', function() {});
				}
				window.setTimeout(function() {
					$(o).removeClass('active');
				}, 100);
			}
		});
	};
	bindMagic = function() {
		window.setTimeout(function() {
			$('li.ipt').each(function(i, o) {
				var controlType = $(o).attr('controlType');
				if (controlType) {
					if (controlType.startsWith('_total')) {
						var widgetIndex1 = $(o).attr('widgetIndex1');
						var widgetIndex2 = $(o).attr('widgetIndex2');
						if (widgetIndex1 && widgetIndex2) {
							widgetIndex1 = parseInt(widgetIndex1);
							widgetIndex2 = parseInt(widgetIndex2);
							var widget1 = $('li', '.item_list').eq(widgetIndex1);
							var widget2 = $('li', '.item_list').eq(widgetIndex2);
							if (widget1) {
								if ($('input', widget1).size() == 1) {
									var mode = $validator.getMode($('input', widget1).attr('id'));
									if (mode) {
										mode['callback'] = function() {
											var formulaType1 = $(widget1).attr('controltype');
											var formulaType2 = $(widget2).attr('controltype');
											if (formulaType1 && formulaType2) {
												var formulaValue1 = $('input', widget1).val();
												var formulaValue2 = $('input', widget2).val();
												$.ajax({
													type: 'POST',
													url: $common.getRestApiURL() + '/common/common/calculationDetail',
													dataType: 'json',
													data: {
														oaToken: $userInfo.get('token'),
														formula: controlType,
														formulaType1: formulaType1,
														formulaType2: formulaType2,
														formulaValue1: formulaValue1,
														formulaValue2: formulaValue2
													},
													success: function(jsonData) {
														if (jsonData) {
															if (jsonData['result'] == '0') {
																$('input', o).val(jsonData['value']).trigger('blur');
															}
														}
													},
													error: function(jsonData) {}
												});
											}
										};
										$validator.setMode($('input', widget1).attr('id'), mode);
									}
								}
							}
							if (widget2) {
								if ($('input', widget2).size() == 1) {
									var mode = $validator.getMode($('input', widget2).attr('id'));
									if (mode) {
										mode['callback'] = function() {
											var formulaType1 = $(widget1).attr('controltype');
											var formulaType2 = $(widget2).attr('controltype');
											if (formulaType1 && formulaType2) {
												var formulaValue1 = $('input', widget1).val();
												var formulaValue2 = $('input', widget2).val();
												$.ajax({
													type: 'POST',
													url: $common.getRestApiURL() + '/common/common/calculationDetail',
													dataType: 'json',
													data: {
														oaToken: $userInfo.get('token'),
														formula: controlType,
														formulaType1: formulaType1,
														formulaType2: formulaType2,
														formulaValue1: formulaValue1,
														formulaValue2: formulaValue2
													},
													success: function(jsonData) {
														if (jsonData) {
															if (jsonData['result'] == '0') {
																$('input', o).val(jsonData['value']).trigger('blur');
															}
														}
													},
													error: function(jsonData) {}
												});
											}
										};
										$validator.setMode($('input', widget2).attr('id'), mode);
									}
								}
							}
						}
					}
				}
			});
		}, 500);
	};
	bindValidate = function() {
		$('li.ipt[controlType="_varchar"]').each(function(i, o) {
			var blankYn = $(o).attr('blankYn');
			var regData = $(o).attr('regData');
			var uuid = $(o).attr('uuid');
			if (blankYn && regData && uuid) {
				if (blankYn == 'Y') {
					if (regData != '_any') {
						$validator.addMode({
							id: uuid,
							required: true,
							pattern: [{
								type: 'blank',
								exp: '!=',
								msg: '请填写'
							}, {
								type: 'reg',
								exp: regData,
								msg: '格式不正确'
							}]
						});
					} else {
						$validator.addMode({
							id: uuid,
							required: true,
							pattern: [{
								type: 'blank',
								exp: '!=',
								msg: '请填写'
							}]
						});
					}
				}
			}
		});

		$('li.ipt[controlType="_number"]').each(function(i, o) {
			var blankYn = $(o).attr('blankYn');
			var uuid = $(o).attr('uuid');
			if (blankYn && uuid) {
				if (blankYn == 'Y') {
					var other = $('.inner', o);
					if (other) {
						$validator.addMode({
							id: uuid,
							required: true,
							pattern: [{
								type: 'blank',
								exp: '!=',
								msg: '请填写'
							}, {
								type: 'int',
								exp: '==',
								msg: '格式不正确'
							}]
						});
					}
				}
			}
		});
		$('li.ipt[controlType="_amount"]').each(function(i, o) {
			var blankYn = $(o).attr('blankYn');
			var uuid = $(o).attr('uuid');
			if (blankYn && uuid) {
				if (blankYn == 'Y') {
					var other = $('.inner', o);
					if (other) {
						$validator.addMode({
							id: uuid,
							required: true,
							pattern: [{
								type: 'blank',
								exp: '!=',
								msg: '请填写'
							}, {
								type: 'number',
								exp: '==',
								msg: '格式不正确'
							}]
						});
					}
				}
			}
		});

		$('li.choose[controlType="_date"]').each(function(i, o) {
			var blankYn = $(o).attr('blankYn');
			var uuid = $(o).attr('uuid');
			if (blankYn && uuid) {
				if (blankYn == 'Y') {
					$validator.addMode({
						id: uuid,
						required: true,
						pattern: [{
							type: 'blank',
							exp: '!=',
							msg: '请选择'
						}]
					});
				}
			}
		});
		$('li.choose[controlType="_time"]').each(function(i, o) {
			var blankYn = $(o).attr('blankYn');
			var uuid = $(o).attr('uuid');
			if (blankYn && uuid) {
				if (blankYn == 'Y') {
					$validator.addMode({
						id: uuid,
						required: true,
						pattern: [{
							type: 'blank',
							exp: '!=',
							msg: '请选择'
						}]
					});
				}
			}
		});
		$('li.choose[controlType="_source"]').each(function(i, o) {
			var blankYn = $(o).attr('blankYn');
			var uuid = $(o).attr('uuid');
			if (blankYn && uuid) {
				if (blankYn == 'Y') {
					$validator.addMode({
						id: uuid,
						required: true,
						pattern: [{
							type: 'blank',
							exp: '!=',
							msg: '请选择'
						}]
					});
				}
			}
		});
		$('li.choose[controlType="_costType"]').each(function(i, o) {
			var blankYn = $(o).attr('blankYn');
			var uuid = $(o).attr('uuid');
			if (blankYn && uuid) {
				if (blankYn == 'Y') {
					$validator.addMode({
						id: uuid,
						required: true,
						pattern: [{
							type: 'blank',
							exp: '!=',
							msg: '请选择'
						}]
					});
				}
			}
		});
		$('li.choose[controlType="_costItem"]').each(function(i, o) {
			var blankYn = $(o).attr('blankYn');
			var uuid = $(o).attr('uuid');
			if (blankYn && uuid) {
				if (blankYn == 'Y') {
					$validator.addMode({
						id: uuid,
						required: true,
						pattern: [{
							type: 'blank',
							exp: '!=',
							msg: '请选择'
						}]
					});
				}
			}
		});
		window.setTimeout(function() {
			$validator.setUp();
		}, 500);
	};
	loadData = function() {
		var detailJsonData = JSON.parse($userInfo.get('detailJsonData'));
		if (detailJsonData && $(detailJsonData).size() > 0) {
			var sb = new StringBuilder();
			$(detailJsonData).each(function(i, o) {
				var detailType = o['detailType'];
				var detailName = o['detailName'];
				var detailIndex = o['detailIndex'];
				if (detailType && detailName && detailIndex) {
					if (detailType == '_costType') {
						sb.append(String.formatmodel($templete.getEditSelectItem(), {
							controlName: detailName,
							uuid: o['uuid'] + '_' + currentRow + '_' + detailIndex,
							controlType: detailType,
							coordinate: currentRow + '_' + detailIndex,
							blankYn: 'Y',
							regData: '_any',
							controlTip: '',
							defaultValue: '',
							rightNote: ''
						}));
					} else if (detailType == '_costItem') {
						sb.append(String.formatmodel($templete.getEditSelectItem(), {
							controlName: detailName,
							uuid: o['uuid'] + '_' + currentRow + '_' + detailIndex,
							controlType: detailType,
							coordinate: currentRow + '_' + detailIndex,
							blankYn: 'Y',
							regData: '_any',
							controlTip: '',
							defaultValue: '',
							rightNote: ''
						}));
					} else if (detailType == '_date') {
						sb.append(String.formatmodel($templete.getEditDateItem(), {
							controlName: detailName,
							uuid: o['uuid'] + '_' + currentRow + '_' + detailIndex,
							controlType: detailType,
							coordinate: currentRow + '_' + detailIndex,
							blankYn: 'Y',
							regData: '_any',
							controlTip: '',
							defaultValue: '',
							rightNote: ''
						}));
					} else if (detailType == '_amount') {
						sb.append(String.formatmodel($templete.getEditAmountItem(), {
							controlName: detailName,
							uuid: o['uuid'] + '_' + currentRow + '_' + detailIndex,
							controlType: detailType,
							coordinate: currentRow + '_' + detailIndex,
							blankYn: 'Y',
							regData: '_any',
							controlTip: '',
							defaultValue: '',
							rightNote: '',
							minAmount: '',
							maxAmount: ''
						}));
					} else if (detailType == '_number') {
						sb.append(String.formatmodel($templete.getEditNumberItem(), {
							controlName: detailName,
							uuid: o['uuid'] + '_' + currentRow + '_' + detailIndex,
							controlType: detailType,
							coordinate: currentRow + '_' + detailIndex,
							blankYn: 'Y',
							regData: '_any',
							controlTip: '',
							defaultValue: '',
							rightNote: '',
							minLength: '',
							maxLength: ''
						}));
					} else if (detailType == '_source') {
						sb.append(String.formatmodel($templete.getEditSelectItem(), {
							controlName: detailName,
							uuid: o['uuid'] + '_' + currentRow + '_' + detailIndex,
							controlType: detailType,
							coordinate: currentRow + '_' + detailIndex,
							blankYn: 'Y',
							regData: '_any',
							controlTip: '',
							defaultValue: '',
							rightNote: ''
						}));
						var sourceList = o['sourceList'];
						if (sourceList && $(sourceList).size() > 0) {
							putSource(o['uuid'] + '_' + currentRow + '_' + detailIndex, sourceList);
						}
					} else if (detailType == '_time') {
						sb.append(String.formatmodel($templete.getEditTimeItem(), {
							controlName: detailName,
							uuid: o['uuid'] + '_' + currentRow + '_' + detailIndex,
							controlType: detailType,
							coordinate: currentRow + '_' + detailIndex,
							blankYn: 'Y',
							regData: '_any',
							controlTip: '',
							defaultValue: '',
							rightNote: '',
							defaultHours: '0',
							defaultMinute: '0'
						}));
					} else {
						if (detailType.startsWith('_total')) {
							sb.append(String.formatmodel($templete.getEditVarcharItemReadonly(), {
								controlName: detailName,
								uuid: o['uuid'] + '_' + currentRow + '_' + detailIndex,
								controlType: detailType,
								coordinate: currentRow + '_' + detailIndex,
								blankYn: 'Y',
								regData: detailType,
								controlTip: '',
								defaultValue: '',
								rightNote: '',
								widgetIndex1: o['widgetIndex1'],
								widgetIndex2: o['widgetIndex2']
							}));
						} else {
							sb.append(String.formatmodel($templete.getEditVarcharItem(), {
								controlName: detailName,
								uuid: o['uuid'] + '_' + currentRow + '_' + detailIndex,
								controlType: '_varchar',
								coordinate: currentRow + '_' + detailIndex,
								blankYn: 'Y',
								regData: detailType,
								controlTip: '',
								defaultValue: '',
								rightNote: ''
							}));
						}
					}
				}
			});
			$('.item_list').empty().append(sb.toString());
			bindEvent();
			bindValidate();
			bindMagic();
		}
	};
	plusReady = function() {
		loadData();
		$('#selectName').text('添加第' + currentRow + '条明细');
		$common.touchSE($('#backAction'), function(event, startTouch, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
			}
		}, function(event, o) {
			if ($(o).hasClass('active')) {
				$userInfo.removeItem('detailJsonData');
				$windowManager.close('slide-out-right');
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