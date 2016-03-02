define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $inputManager = require('manager/input');
	var $validator = require('core/validator');
	var loadFlag = false;
	var wordsFlag = false;
	var selectMap = new HashMap();
	var detailMap = new HashMap();
	var magicArray = false;
	var magicTypeMap = false;
	var magicMap = false;
	var magicExpMap = false;
	var expSysType = false;
	var expSysWidget = false;
	var expSysCol = false;
	var expSysMagicUUID = false
	sendApply = function() {
		var detailEmpty = false;
		var detailEmptyName = false;
		$('ul.item_list[controlType="detail"]').each(function(i, o) {
			var detailCount = $('.details', o).find('section').size();
			if (detailCount == 0) {
				detailEmpty = true;
				detailEmptyName = $(o).attr('controlName');
			}
		});
		if (detailEmpty) {
			$nativeUIManager.alert('提示', '明细[' + detailEmptyName + ']至少添加一条数据', 'OK', function() {});
		} else {
			$validator.checkAll();
			window.setTimeout(function() {
				var passed = $validator.isPassed();
				if (passed) {
					$nativeUIManager.watting('正在保存...');
					$common.refreshToken(function(token) {
						$('#org\\.guiceside\\.web\\.jsp\\.taglib\\.Token').val(token);
						$.ajax({
							type: 'POST',
							url: $common.getRestApiURL() + '/wf/req/saveTempMobile',
							dataType: 'json',
							data: $('#editForm').serialize().replace(/\+/g, " "),
							success: function(jsonData) {
								if (jsonData) {
									if (jsonData['result'] == '0') {
										$nativeUIManager.wattingTitle('保存成功!请选择审批流程...');
										window.setTimeout(function() {
											$nativeUIManager.wattingClose();
											$windowManager.create('apply_flow', 'flow.html?id=' + jsonData['id'] + '&applyId=' + jsonData['applyId'] + '&subject=' + jsonData['subject'], false, true, function(show) {
												show();
											});
										}, 1000);
									} else {
										$nativeUIManager.wattingTitle('保存失败,请稍后重试');
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
				} else {
					$nativeUIManager.alert('提示', '请检查申请信息是否填写完毕', 'OK', function() {});
				}
			}, 500);
		}
	};
	bindLastDelDetail = function(uuid, detailsDiv) {
		$('section', detailsDiv).find('.delAction').hide();
		var rows = $('section', detailsDiv).size();
		$('#' + uuid + '_rows').val(rows);
		var lastDelAction = $('section', detailsDiv).last().find('.delAction');
		if (lastDelAction) {
			$(lastDelAction).show();
			$common.touchSE($(lastDelAction), function(event, startTouch, o) {
				if (!$(o).hasClass('active')) {
					$(o).addClass('active');
				}
			}, function(event, o) {
				if ($(o).hasClass('active')) {
					$nativeUIManager.watting('正在删除...');
					$(o).closest('section').remove();
					bindLastDelDetail(uuid, detailsDiv);
					window.setTimeout(function() {
						$nativeUIManager.wattingClose();
					}, 500);
				}
			});

			if (expSysMagicUUID && expSysCol && expSysWidget && expSysType) {
				if (uuid == expSysWidget) {
					var result = 0;
					var count = 0;
					$('section', detailsDiv).each(function(i, o) {
						var tb = $('table', o);
						if (tb) {
							var tr = $('tr', tb).eq(expSysCol - 1);
							if (tr) {
								var v = $('input', tr).val();
								if (!isNaN(v)) {
									if (v == "") {
										v = 0;
									}
									if (expSysType == 'sum' || expSysType == 'avg') {
										if (!isNumber(v)) {
											result += Number(parseFloat(v).toFixed(2));
										} else {
											result += parseInt(v);
										}
									} else if (expSysType == 'min') {
										if (v < result) {
											result = v;
										}
									} else if (expSysType == 'max') {
										if (v > result) {
											result = v;
										}
									}
									count += 1;
								}
							}
						}
					});
					if (!isNumber(result.toString())) {
						result = Number(result.toFixed(2));
					}
					if (expSysType == 'avg') {
						result = result / count;
						result = result.toFixed(2);
					}
					$('#' + expSysMagicUUID).val(result).trigger('blur');
				}
			}
		}
	};
	addDetail = function(uuid) {
		var detailsDiv = $('.item_list[uuid="' + uuid + '"]').find('.details');
		if (detailsDiv) {
			$(detailsDiv).append($userInfo.get('detailContent'));
			$userInfo.removeItem('detailContent');
			bindLastDelDetail(uuid, detailsDiv);
		}
	};
	setSelectItem = function(uuid, text, value) {
		$('#' + uuid).val(value);
		$validator.check(uuid);
		var selectObj = $('li.choose[controlType="select"][uuid="' + uuid + '"]');
		if (selectObj) {
			$('.text_int', selectObj).text(text).addClass('alignleft');
		}
	};
	setSelectDeptItem = function(uuid, text, value) {
		$('#' + uuid).val(value);
		$validator.check(uuid);
		var selectObj = $('li.choose[controlType="selectDept"][uuid="' + uuid + '"]');
		if (selectObj) {
			$('.text_int', selectObj).text(text).addClass('alignleft');
		}
	};
	setSelectUserItem = function(uuid, text, value, userId) {
		$('#' + uuid).val(value);
		$('#' + uuid + '_hd').val(userId);
		$validator.check(uuid);
		var selectObj = $('li.choose[controlType="searchUser"][uuid="' + uuid + '"]');
		if (selectObj) {
			$('.text_int', selectObj).text(text).addClass('alignleft');
		}
	};
	setProvinceItem = function(uuid, text, value) {
		$('#' + uuid).val(value);
		$('#' + uuid + '_province').val(value);
		$validator.check(uuid);
		var selectObj = $('li.choose[controlType="province"][uuid="' + uuid + '"]');
		if (selectObj) {
			$('.text_int', selectObj).text(text).addClass('alignleft');
		}
	};
	setProvinceCityItem = function(uuid, provinceText, provinceValue, cityText, cityValue) {
		$('#' + uuid).val(provinceValue + cityValue);
		$('#' + uuid + '_province').val(provinceValue);
		$('#' + uuid + '_city').val(cityValue);
		$validator.check(uuid);
		var selectObj = $('li.choose[controlType="provinceCity"][uuid="' + uuid + '"]');
		if (selectObj) {
			$('.text_int', selectObj).text(provinceText + ' ' + cityText).addClass('alignleft');
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
	bindSetting = function() {
		$('li.ipt[controlType="varchar"]').each(function(i, o) {
			var controlTip = $(o).attr('controlTip');
			var defaultValue = $(o).attr('defaultValue');
			if (isStr(controlTip)) {
				$('input', o).attr('placeholder', controlTip);
			}
			if (isStr(defaultValue)) {
				$('input', o).val(defaultValue);
			}
		});
		$('li.ipt[controlType="number"]').each(function(i, o) {
			var controlTip = $(o).attr('controlTip');
			var defaultValue = $(o).attr('defaultValue');
			if (isStr(controlTip)) {
				$('input', o).attr('placeholder', controlTip);
			}
			if (isStr(defaultValue)) {
				$('input', o).val(defaultValue);
			}
		});
		$('li.ipt[controlType="amount"]').each(function(i, o) {
			var controlTip = $(o).attr('controlTip');
			var defaultValue = $(o).attr('defaultValue');
			if (isStr(controlTip)) {
				$('input', o).attr('placeholder', controlTip);
			}
			if (isStr(defaultValue)) {
				$('input', o).val(defaultValue);
			}
		});
		$('li.ipt[controlType="text"]').each(function(i, o) {
			var controlTip = $(o).attr('controlTip');
			var defaultValue = $(o).attr('defaultValue');
			if (isStr(controlTip)) {
				$('textarea', o).attr('placeholder', controlTip);
			}
			if (isStr(defaultValue)) {
				$('textarea', o).val(defaultValue);
			}
		});
		$('li.rd[controlType="magic"]').each(function(i, o) {
			var controlTip = $(o).attr('controlTip');
			if (isStr(controlTip)) {
				$('input', o).attr('placeholder', controlTip);
			}
		});
	};
	bindValidate = function() {
		$('li.ipt[controlType="varchar"]').each(function(i, o) {
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
				} else {
					if (regData != '_any') {
						$validator.addMode({
							id: uuid,
							required: false,
							pattern: [{
								type: 'reg',
								exp: regData,
								msg: '格式不正确'
							}]
						});
					}
				}
			}
		});

		$('li.ipt[controlType="text"]').each(function(i, o) {
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
							msg: '请填写'
						}]
					});
				}
			}
		});
		$('li.ipt[controlType="number"]').each(function(i, o) {
			var blankYn = $(o).attr('blankYn');
			var uuid = $(o).attr('uuid');
			if (blankYn && uuid) {
				if (blankYn == 'Y') {
					var other = $('.inner', o);
					if (other) {
						var minLength = $(other).attr('minLength');
						var maxLength = $(other).attr('maxLength');
						if (isStr(minLength) && isStr(maxLength)) {
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
								}, {
									type: 'int',
									exp: '(>=' + minLength + ')&&(<=' + maxLength + ')',
									msg: '范围(' + minLength + '至' + maxLength + ')'
								}],
								callback: function(t) {
									if (t) {
										if (magicMap && magicMap.containsValue(uuid)) {
											calculationMagic();
										}
									}
								}
							});
						} else {
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
								}],
								callback: function(t) {
									if (t) {
										if (magicMap && magicMap.containsValue(uuid)) {
											calculationMagic();
										}
									}
								}
							});
						}
					}
				} else {
					$validator.addMode({
						id: uuid,
						required: false,
						pattern: [{
							type: 'int',
							exp: '==',
							msg: '格式不正确'
						}],
						callback: function(t) {
							if (t) {
								if (magicMap && magicMap.containsValue(uuid)) {
									calculationMagic();
								}
							}
						}
					});
				}
			}
		});

		$('li.ipt[controlType="amount"]').each(function(i, o) {
			var blankYn = $(o).attr('blankYn');
			var uuid = $(o).attr('uuid');
			if (blankYn && uuid) {
				if (blankYn == 'Y') {
					var other = $('.inner', o);
					if (other) {
						var minAmount = $(other).attr('minAmount');
						var maxAmount = $(other).attr('maxAmount');
						if (isStr(minAmount) && isStr(maxAmount)) {
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
								}, {
									type: 'number',
									exp: '(>=' + minAmount + ')&&(<=' + maxAmount + ')',
									msg: '范围(' + minAmount + '至' + maxAmount + ')'
								}],
								callback: function(t) {
									if (t) {
										if (magicMap && magicMap.containsValue(uuid)) {
											calculationMagic();
										}
									}
								}
							});
						} else {
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
								}],
								callback: function(t) {
									if (t) {
										if (magicMap && magicMap.containsValue(uuid)) {
											calculationMagic();
										}
									}
								}
							});
						}
					}
				} else {
					$validator.addMode({
						id: uuid,
						required: false,
						pattern: [{
							type: 'number',
							exp: '==',
							msg: '格式不正确'
						}],
						callback: function(t) {
							if (t) {
								if (magicMap && magicMap.containsValue(uuid)) {
									calculationMagic();
								}
							}
						}
					});
				}
			}
		});

		$('li.choose[controlType="date"]').each(function(i, o) {
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
		$('li.choose[controlType="time"]').each(function(i, o) {
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
		$('li.choose[controlType="dateInterval"]').each(function(i, o) {
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
		$('li.choose[controlType="select"]').each(function(i, o) {
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
		$('li.choose[controlType="selectDept"]').each(function(i, o) {
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
		$('li.choose[controlType="searchUser"]').each(function(i, o) {
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
		$('li.choose[controlType="province"]').each(function(i, o) {
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
		$('li.choose[controlType="provinceCity"]').each(function(i, o) {
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
		$('li.noboder[controlType="checkbox"]').each(function(i, o) {
			var blankYn = $(o).attr('blankYn');
			var uuid = $(o).attr('uuid');
			if (blankYn && uuid) {
				if (blankYn == 'Y') {
					$validator.addMode({
						id: uuid + '_cr',
						required: true,
						pattern: [{
							type: 'blank',
							exp: '!=',
							msg: '请选择至少一项'
						}]
					});
				}
			}
		});
		$('li.noboder[controlType="radio"]').each(function(i, o) {
			var blankYn = $(o).attr('blankYn');
			var uuid = $(o).attr('uuid');
			if (blankYn && uuid) {
				if (blankYn == 'Y') {
					$validator.addMode({
						id: uuid + '_cr',
						required: true,
						pattern: [{
							type: 'blank',
							exp: '!=',
							msg: '必须选择一项'
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
		var layoutJsonData = JSON.parse($userInfo.get('layoutJsonData'));
		if (layoutJsonData) {
			$('#applyId').val(layoutJsonData['applyId']);
			var controlArray = layoutJsonData['controlArray'];
			if (controlArray && $(controlArray).size() > 0) {
				var sb = new StringBuilder();
				var cardFlag = false;
				$(controlArray).each(function(i, o) {
					if (!cardFlag) {
						sb.append(String.formatmodel($templete.getEditCardStart(), {

						}));
						cardFlag = true;
						sb.append(String.formatmodel($templete.getEditVarcharItem(), {
							controlName: '标题',
							uuid: 'subject',
							controlType: 'varchar',
							coordinate: '',
							blankYn: 'Y',
							regData: '_any',
							controlTip: '',
							defaultValue: layoutJsonData['subject'],
							rightNote: ''
						}));
					}
					if (o['readonlyYn'] == 'Y') {
						sb.append(String.formatmodel($templete.getEditReadonlyItem(), {
							controlName: o['controlName'],
							value: o['value']
						}));
					} else if (o['readonlyYn'] == 'N') {
						if (o['controlType'] == 'varchar') {
							sb.append(String.formatmodel($templete.getEditVarcharItem(), {
								controlName: o['controlName'],
								uuid: o['uuid'],
								controlType: o['controlType'],
								coordinate: o['coordinate'],
								blankYn: o['blankYn'],
								regData: o['regData'],
								controlTip: o['controlTip'],
								defaultValue: o['defaultValue'],
								rightNote: o['rightNote']
							}));
						} else if (o['controlType'] == 'number') {
							sb.append(String.formatmodel($templete.getEditNumberItem(), {
								controlName: o['controlName'],
								uuid: o['uuid'],
								controlType: o['controlType'],
								coordinate: o['coordinate'],
								blankYn: o['blankYn'],
								regData: o['regData'],
								controlTip: o['controlTip'],
								defaultValue: o['defaultValue'],
								rightNote: o['rightNote'],
								minLength: o['minLength'],
								maxLength: o['maxLength']
							}));
						} else if (o['controlType'] == 'amount') {
							sb.append(String.formatmodel($templete.getEditAmountItem(), {
								controlName: o['controlName'],
								uuid: o['uuid'],
								controlType: o['controlType'],
								coordinate: o['coordinate'],
								blankYn: o['blankYn'],
								regData: o['regData'],
								controlTip: o['controlTip'],
								defaultValue: o['defaultValue'],
								rightNote: o['rightNote'],
								minAmount: o['minAmount'],
								maxAmount: o['maxAmount']
							}));
						} else if (o['controlType'] == 'selectDept') {
							sb.append(String.formatmodel($templete.getEditSelectDeptItem(), {
								controlName: o['controlName'],
								uuid: o['uuid'],
								controlType: o['controlType'],
								coordinate: o['coordinate'],
								blankYn: o['blankYn'],
								regData: o['regData'],
								controlTip: o['controlTip'],
								defaultValue: o['defaultValue'],
								rightNote: o['rightNote']
							}));
						} else if (o['controlType'] == 'searchUser') {
							sb.append(String.formatmodel($templete.getEditSelectUserItem(), {
								controlName: o['controlName'],
								uuid: o['uuid'],
								controlType: o['controlType'],
								coordinate: o['coordinate'],
								blankYn: o['blankYn'],
								regData: o['regData'],
								controlTip: o['controlTip'],
								defaultValue: o['defaultValue'],
								rightNote: o['rightNote']
							}));
						} else if (o['controlType'] == 'select') {
							sb.append(String.formatmodel($templete.getEditSelectItem(), {
								controlName: o['controlName'],
								uuid: o['uuid'],
								controlType: o['controlType'],
								coordinate: o['coordinate'],
								blankYn: o['blankYn'],
								regData: o['regData'],
								controlTip: o['controlTip'],
								defaultValue: o['defaultValue'],
								rightNote: o['rightNote']
							}));
							var sourceList = o['sourceList'];
							if (sourceList && $(sourceList).size() > 0) {
								putSource(o['uuid'], sourceList);
							}
						} else if (o['controlType'] == 'province') {
							sb.append(String.formatmodel($templete.getEditSelectProvinceItem(), {
								controlName: o['controlName'],
								uuid: o['uuid'],
								controlType: o['controlType'],
								coordinate: o['coordinate'],
								blankYn: o['blankYn'],
								regData: o['regData'],
								controlTip: o['controlTip'],
								defaultValue: o['defaultValue'],
								rightNote: o['rightNote']
							}));
						} else if (o['controlType'] == 'provinceCity') {
							sb.append(String.formatmodel($templete.getEditSelectProvinceCityItem(), {
								controlName: o['controlName'],
								uuid: o['uuid'],
								controlType: o['controlType'],
								coordinate: o['coordinate'],
								blankYn: o['blankYn'],
								regData: o['regData'],
								controlTip: o['controlTip'],
								defaultValue: o['defaultValue'],
								rightNote: o['rightNote']
							}));
						} else if (o['controlType'] == 'words') {
							sb.append(String.formatmodel($templete.getEditWordsItem(), {
								controlName: o['controlName'],
								uuid: o['uuid'],
								controlType: o['controlType'],
								coordinate: o['coordinate'],
								blankYn: o['blankYn'],
								regData: o['regData'],
								controlTip: o['controlTip'],
								defaultValue: o['defaultValue'],
								rightNote: o['rightNote'],
								linkAcId: o['linkAcId'],
								linkWidgetName: o['linkWidgetName']
							}));
						} else if (o['controlType'] == 'magic') {
							sb.append(String.formatmodel($templete.getEditMagicItem(), {
								controlName: o['controlName'],
								uuid: o['uuid'],
								controlType: o['controlType'],
								coordinate: o['coordinate'],
								blankYn: o['blankYn'],
								regData: o['regData'],
								controlTip: o['controlTip'],
								defaultValue: o['defaultValue'],
								rightNote: o['rightNote'],
								expression_status: o['expression_status'],
								expression: o['expression'],
								expression_sys_type: o['expression_sys_type'],
								expression_sys_widget: o['expression_sys_widget'],
								expression_sys_col: o['expression_sys_col']
							}));
						} else if (o['controlType'] == 'text') {
							sb.append(String.formatmodel($templete.getEditTextAreaItem(), {
								controlName: o['controlName'],
								uuid: o['uuid'],
								controlType: o['controlType'],
								coordinate: o['coordinate'],
								blankYn: o['blankYn'],
								regData: o['regData'],
								controlTip: o['controlTip'],
								defaultValue: o['defaultValue'],
								rightNote: o['rightNote']
							}));
						} else if (o['controlType'] == 'date') {
							sb.append(String.formatmodel($templete.getEditDateItem(), {
								controlName: o['controlName'],
								uuid: o['uuid'],
								controlType: o['controlType'],
								coordinate: o['coordinate'],
								blankYn: o['blankYn'],
								regData: o['regData'],
								controlTip: o['controlTip'],
								defaultValue: o['defaultValue'],
								rightNote: o['rightNote']
							}));
						} else if (o['controlType'] == 'time') {
							sb.append(String.formatmodel($templete.getEditTimeItem(), {
								controlName: o['controlName'],
								uuid: o['uuid'],
								controlType: o['controlType'],
								coordinate: o['coordinate'],
								blankYn: o['blankYn'],
								regData: o['regData'],
								controlTip: o['controlTip'],
								defaultValue: o['defaultValue'],
								rightNote: o['rightNote'],
								defaultHours: o['defaultHours'],
								defaultMinute: o['defaultMinute']
							}));
						} else if (o['controlType'] == 'dateInterval') {
							sb.append(String.formatmodel($templete.getEditDateIntervalItem(), {
								controlName: o['controlName'],
								uuid: o['uuid'],
								controlType: o['controlType'],
								coordinate: o['coordinate'],
								blankYn: o['blankYn'],
								regData: o['regData'],
								controlTip: o['controlTip'],
								defaultValue: o['defaultValue'],
								rightNote: o['rightNote']
							}));
						} else if (o['controlType'] == 'checkbox') {

							if (cardFlag) {
								sb.append(String.formatmodel($templete.getEditCardEnd(), {

								}));
							}
							sb.append(String.formatmodel($templete.getEditCardStart(), {

							}));
							sb.append(String.formatmodel($templete.getEditDesc(), {
								controlName: o['controlName'],
								uuid: o['uuid'],
								controlType: o['controlType'],
								coordinate: o['coordinate'],
								blankYn: o['blankYn'],
								regData: o['regData'],
								controlTip: o['controlTip'],
								defaultValue: o['defaultValue'],
								rightNote: o['rightNote']
							}));
							var sourceList = o['sourceList'];
							if (sourceList && $(sourceList).size() > 0) {
								$(sourceList).each(function(s, so) {
									sb.append(String.formatmodel($templete.getEditCheckBoxItem(), {
										itemValue: so['value'],
										itemName: so['value'],
										uuid: o['uuid'],
										class: s == 0 ? 'mart5' : ''
									}));
								});
							}
							if (i < $(controlArray).size() - 1) {
								sb.append(String.formatmodel($templete.getEditCardEnd(), {

								}));
								sb.append(String.formatmodel($templete.getEditCardStart(), {}));
								cardFlag = true;
							} else {
								cardFlag = false;
							}
						} else if (o['controlType'] == 'radio') {
							if (cardFlag) {
								sb.append(String.formatmodel($templete.getEditCardEnd(), {

								}));
							}
							sb.append(String.formatmodel($templete.getEditCardStart(), {

							}));
							sb.append(String.formatmodel($templete.getEditDesc(true), {
								controlName: o['controlName'],
								uuid: o['uuid'],
								controlType: o['controlType'],
								coordinate: o['coordinate'],
								blankYn: o['blankYn'],
								regData: o['regData'],
								controlTip: o['controlTip'],
								defaultValue: o['defaultValue'],
								rightNote: o['rightNote']
							}));
							var sourceList = o['sourceList'];
							if (sourceList && $(sourceList).size() > 0) {
								$(sourceList).each(function(s, so) {
									sb.append(String.formatmodel($templete.getEditRadioItem(), {
										itemValue: so['value'],
										itemName: so['value'],
										class: s == 0 ? 'mart5' : ''
									}));
								});
							}
							if (i < $(controlArray).size() - 1) {
								sb.append(String.formatmodel($templete.getEditCardEnd(), {

								}));
								sb.append(String.formatmodel($templete.getEditCardStart(), {}));
								cardFlag = true;
							} else {
								cardFlag = false;
							}
						} else if (o['controlType'] == 'detail') {
							if (cardFlag) {
								sb.append(String.formatmodel($templete.getEditCardEnd(), {

								}));
							}
							sb.append(String.formatmodel($templete.getAddDetailItem(), {
								controlName: o['controlName'],
								controlType: o['controlType'],
								uuid: o['uuid']
							}));
							if (i < $(controlArray).size() - 1) {
								sb.append(String.formatmodel($templete.getEditCardStart(), {}));
								cardFlag = true;
							} else {
								cardFlag = false;
							}
							var detailList = o['detailList'];
							if (detailList && $(detailList).size() > 0) {
								putSource(o['uuid'], detailList);
							}
						}
					}
					if (i == $(controlArray).size() - 1 && cardFlag) {
						sb.append(String.formatmodel($templete.getEditCardEnd(), {

						}));
					}
				});
				$('#layoutDIV').empty().append(sb.toString());
				bindEvent();
				bindSetting();
				bindValidate();
			}
		}
	};
	bindEvent = function() {
		$inputManager.forceCloseKeyboard();
		$inputManager.focus();

		$('li.ipt[uuid="subject"]').find('input').addClass('alignleft');
		var checkBoxUL = $('li.noboder[controlType="checkbox"]').closest('ul');
		$common.touchSE($('li.choose', checkBoxUL), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
				var uuid = $(o).closest('ul').find('li.noboder').attr('uuid');
				var value = $(o).attr('value');
				if (!$('span', o).hasClass('icon-square-checked')) {
					$('span', o).addClass('icon-square-checked');
					$('input[name="' + uuid + '"]', o).val(value);
				} else {
					$('span', o).removeClass('icon-square-checked');
					$('input[name="' + uuid + '"]', o).val('');
				}
				window.setTimeout(function() {
					$(o).removeClass('active');
					var crValue = '';
					$('li.choose', checkBoxUL).each(function() {
						if ($('span', this).hasClass('icon-square-checked')) {
							var v = $('input', this).val();
							if (v) {
								crValue += v;
							}
						}
					});
					$('#' + uuid + '_cr', checkBoxUL).val(crValue);
					$validator.check(uuid + '_cr');
				}, 100);
			}
		});

		var radioUL = $('li.noboder[controlType="radio"]').closest('ul');
		$common.touchSE($('li.choose', radioUL), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
				var ul = $(o).closest('ul');
				var uuid = $(ul).find('li.noboder').attr('uuid');
				var value = $(o).attr('value');
				if (!$('span', o).is(":visible")) {
					$('li', ul).find('span').hide();
					$('span', o).show();
					$('input[name="' + uuid + '"]', ul).val(value);
				} else {
					$('span', o).hide();
					$('input[name="' + uuid + '"]', ul).val('');
				}
				window.setTimeout(function() {
					$(o).removeClass('active');
					var crValue = $('input[name="' + uuid + '"]', ul).val();
					$('#' + uuid + '_cr', radioUL).val(crValue);
					$validator.check(uuid + '_cr');
				}, 100);
			}
		});

		$common.touchSE($('li.choose[controlType="date"]'), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
				var uuid = $(o).attr('uuid');
				$nativeUIManager.pickDate(function(date) {
					var dateStr = date.Format('yyyy-MM-dd');
					$('input[name="' + uuid + '"]', o).val(dateStr);
					$('.text_int', o).text(dateStr).addClass('alignleft');
					$validator.check(uuid);
					if (magicMap && magicMap.containsValue(uuid)) {
						calculationMagic();
					}
				}, function() {

				});
				window.setTimeout(function() {
					$(o).removeClass('active');
				}, 100);
			}
		});

		$common.touchSE($('li.choose[controlType="time"]'), function(event, startTouch, o) {}, function(event, o) {
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
					if (magicMap && magicMap.containsValue(uuid)) {
						calculationMagic();
					}
				}, function() {

				}, {
					time: currentDate
				});
				window.setTimeout(function() {
					$(o).removeClass('active');
				}, 100);
			}
		});
		$common.touchSE($('li.choose[controlType="dateInterval"]'), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
				var uuid = $(o).attr('uuid');
				$nativeUIManager.pickDate(function(date1) {
					var dateStr1 = date1.Format('yyyy-MM-dd');
					$nativeUIManager.watting('请选择结束时间');
					window.setTimeout(function() {
						$nativeUIManager.pickDate(function(date2) {
							var dateStr2 = date2.Format('yyyy-MM-dd');
							$nativeUIManager.wattingClose();
							var startDate = dateStr1;
							var endDate = dateStr2;
							var ckFlag = checkDate(startDate, endDate);
							if (!ckFlag) {
								$nativeUIManager.alert('错误提示', '结束日期不能小于开始日期', '重新输入', function() {});
								return false;
							}
							var dateIntervalValue = dateStr1 + '&nbsp;至&nbsp;' + dateStr2;
							var dateIntervalValueHD = dateStr1 + '_' + dateStr2;
							$('input[name="' + uuid + '_startDate"]', o).val(dateStr1);
							$('input[name="' + uuid + '_endDate"]', o).val(dateStr2);
							$('input[name="' + uuid + '"]', o).val(dateIntervalValueHD);
							$('.text_int', o).html(dateIntervalValue).addClass('alignleft');
							$validator.check(uuid);
						}, function() {}, {
							title: '结束时间'
						});
					}, 1000);
				}, function() {

				}, {
					title: '开始时间'
				});
				window.setTimeout(function() {
					$(o).removeClass('active');
				}, 100);
			}
		});

		$common.touchSE($('li.choose[controlType="select"]'), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
				var uuid = $(o).attr('uuid');
				var itemJsonData = getSource(uuid);
				if (itemJsonData) {
					var currentId = $('#' + uuid).val();
					var title = $('span', o).eq(0).text();
					$userInfo.put('itemJsonData', itemJsonData);
					$windowManager.create('select_head', '../common/select_head.html?id=' + currentId + '&title=' + title + '&uuid=' + uuid, false, true, function(show) {
						show();
					});
				}
				window.setTimeout(function() {
					$(o).removeClass('active');
				}, 100);
			}
		});

		$common.touchSE($('li.choose[controlType="province"]'), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
				var uuid = $(o).attr('uuid');
				var currentId = $('#' + uuid + '_province').val();
				var title = $('span', o).eq(0).text();
				$windowManager.create('province_head', '../common/province_head.html?id=' + currentId + '&title=' + title + '&uuid=' + uuid, false, true, function(show) {
					show();
				});
				window.setTimeout(function() {
					$(o).removeClass('active');
				}, 100);
			}
		});
		$common.touchSE($('li.choose[controlType="provinceCity"]'), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
				var uuid = $(o).attr('uuid');
				var provinceId = $('#' + uuid + '_province').val();
				var cityId = $('#' + uuid + '_city').val();
				var title = $('span', o).eq(0).text();
				$windowManager.create('provinceCity_head', '../common/provinceCity_head.html?provinceId=' + provinceId + '&cityId=' + cityId + '&title=' + title + '&uuid=' + uuid, false, true, function(show) {
					show();
				});
				window.setTimeout(function() {
					$(o).removeClass('active');
				}, 100);
			}
		});
		$common.touchSE($('li.choose[controlType="selectDept"]'), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
				var uuid = $(o).attr('uuid');
				var currentId = $('#' + uuid).val();
				var title = $('span', o).eq(0).text();
				$windowManager.create('dept_head', '../common/dept_head.html?id=' + currentId + '&title=' + title + '&uuid=' + uuid, false, true, function(show) {
					show();
				});
				window.setTimeout(function() {
					$(o).removeClass('active');
				}, 100);
			}
		});

		$common.touchSE($('li.choose[controlType="searchUser"]'), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
				var uuid = $(o).attr('uuid');
				var currentId = $('#' + uuid).val();
				var title = $('span', o).eq(0).text();
				$windowManager.create('contacts_head', '../common/contacts_head.html?id=' + currentId + '&title=' + title + '&uuid=' + uuid, false, true, function(show) {
					show();
				});
				window.setTimeout(function() {
					$(o).removeClass('active');
				}, 100);
			}
		});
		$('li.rd[controlType="words"]').each(function(i, o) {
			var linkAcId = $('.inner', o).attr('linkAcId');
			var linkWidgetName = $('.inner', o).attr('linkWidgetName');
			if (linkAcId && linkWidgetName) {
				var wordsObj = $('input', o);
				if (wordsObj) {
					$(wordsObj).attr('placeholder', '根据' + linkWidgetName + '生成');
				}
				$('#' + linkAcId).on('blur', function() {
					if (!wordsFlag) {
						wordsFlag = true;
						var amount = $(this).val();
						if (amount) {
							$.ajax({
								type: 'POST',
								url: $common.getRestApiURL() + '/common/common/amountToUpperCase',
								dataType: 'json',
								data: {
									amount: amount,
									oaToken: $userInfo.get('token')
								},
								success: function(jsonData) {
									if (jsonData) {
										if (jsonData['result'] == '0') {
											var amountWords = jsonData['amountWords'];
											if (amountWords) {
												$(wordsObj).val(amountWords);
											}
										}
									}
								},
								error: function(jsonData) {}
							});
						}
						window.setTimeout(function() {
							wordsFlag = false;
						}, 500);
					}
				});
				$('#' + linkAcId).off('change').on('change', function() {
					if (!wordsFlag) {
						wordsFlag = true;
						var amount = $(this).val();
						if (amount) {
							$.ajax({
								type: 'POST',
								url: $common.getRestApiURL() + '/common/common/amountToUpperCase',
								dataType: 'json',
								data: {
									amount: amount,
									oaToken: $userInfo.get('token')
								},
								success: function(jsonData) {
									if (jsonData) {
										if (jsonData['result'] == '0') {
											var amountWords = jsonData['amountWords'];
											if (amountWords) {
												$(wordsObj).val(amountWords);
											}
										}
									}
								},
								error: function(jsonData) {}
							});
						}
						window.setTimeout(function() {
							wordsFlag = false;
						}, 500);
					}
				});
			}
		});
		$('li.rd[controlType="magic"]').each(function(i, o) {
			if (i == 0) {
				magicArray = new Array();
				magicMap = new HashMap();
				magicExpMap = new HashMap();
				magicTypeMap = new HashMap();
			}
			var magicUUID = $(o).attr('uuid');
			var expression_status = $(o).attr('expression_status');
			if (magicUUID && expression_status) {
				if (expression_status == 'diy') {
					var expression = $(this).attr('expression');
					if ($.trim(expression).length > 0) {
						var expressionChars = expression.ToCharArray();
						var newExp = '';
						var f = true;
						for (var ei = 0; ei < expressionChars.length; ei++) {
							var exp = expressionChars[ei];
							if (exp) {
								if (exp == 'A' || exp == 'B') {
									newExp += exp;
									f = true;
								} else if (exp == '+' || exp == '-' || exp == '*' || exp == '/' || exp == '(' || exp == ')') {
									f = false;
								} else {
									if (f) {
										var int = parseInt(exp);
										if (int || int >= 0) {
											newExp += exp;
										}
									}
								}
							}
						}
						if ($.trim(newExp).length > 0) {
							expressionChars = newExp.ToCharArray();
							var temp = '';
							for (var ei = 0; ei < expressionChars.length; ei++) {
								var exp = expressionChars[ei];
								if (exp) {
									if (exp == 'A' || exp == 'B') {
										if (temp != '') {
											if (!magicArray.Contains(temp)) {
												magicArray.push(temp);
											}
											temp = '';
										}
										temp += exp;
									} else {
										temp += exp;
									}
									if (ei == expressionChars.length - 1) {
										if (temp != '') {
											if (!magicArray.Contains(temp)) {
												magicArray.push(temp);
											}
										}
									}
								}
							}
							for (var ea = 0; ea < magicArray.length; ea++) {
								var coordinate = magicArray[ea];
								if (coordinate) {
									var coordinateObj = $('li[coordinate="' + coordinate + '"]');
									if (coordinateObj) {
										var uuid = $(coordinateObj).attr('uuid');
										var controlType = $(coordinateObj).attr('controlType');
										if (uuid && controlType) {
											magicMap.put(coordinate, uuid);
											magicExpMap.put(coordinate, magicUUID + '#' + expression);
											magicTypeMap.put(coordinate, controlType);
										}
									}
								}
							}
						}
					}
				} else if (expression_status == 'sys') {
					var expression_sys_type = $(o).attr('expression_sys_type');
					var expression_sys_widget = $(o).attr('expression_sys_widget');
					var expression_sys_col = $(o).attr('expression_sys_col');
					if (expression_sys_col && expression_sys_type && expression_sys_widget) {
						expSysType = expression_sys_type;
						expSysWidget = expression_sys_widget;
						expSysCol = expression_sys_col;
						expSysMagicUUID = $(o).attr('uuid');
					}
				}
			}
		});
		$common.touchSE($('.more', 'ul.item_list[controlType="detail"]'), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
				var uuid = $(o).closest('ul.item_list').attr('uuid');
				var detailJsonData = getSource(uuid);
				if (detailJsonData) {
					$userInfo.put('detailJsonData', detailJsonData);
					var ul = $(o).closest('ul');
					var currentRow = $('section', ul).size();
					currentRow += 1;
					$windowManager.create('apply_addDetail', 'addDetail.html?uuid=' + uuid + '&currentRow=' + currentRow, false, true, function(show) {
						show();
					});
				}
				window.setTimeout(function() {
					$(o).removeClass('active');
				}, 100);
			}
		});

	};
	calculationMagic = function() {
		var params = {};
		var analyze = '';
		var expressionArray = new Array();
		for (var ea = 0; ea < magicArray.length; ea++) {
			var coordinate = magicArray[ea];
			if (coordinate) {
				var uuid = magicMap.get(coordinate);
				var controlType = magicTypeMap.get(coordinate);
				if (uuid && controlType) {
					if (controlType == 'time') {
						params[uuid] = $('#' + uuid + '_hours').val() + ":" + $('#' + uuid + '_minute').val();
					} else {
						params[uuid] = $('#' + uuid).val();
					}
					analyze += coordinate + '|' + uuid + '|' + controlType + ',';
					if (!expressionArray.Contains(magicExpMap.get(coordinate))) {
						expressionArray.push(magicExpMap.get(coordinate));
					}
				}
			}
		}
		var expression = '';
		for (var ea = 0; ea < expressionArray.length; ea++) {
			var exp = expressionArray[ea];
			if (exp) {
				expression += exp + ',';
			}
		}
		params['oaToken'] = $userInfo.get('token');
		params['analyze'] = analyze;
		params['expression'] = expression;
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/common/common/calculationMagic',
			dataType: 'json',
			data: params,
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var magicUUID = jsonData['magicUUID'];
						if (magicUUID) {
							$('#' + magicUUID).val(jsonData['value']).addClass('alignleft');
						}
					}
				}
			},
			error: function(jsonData) {}
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