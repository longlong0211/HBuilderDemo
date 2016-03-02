define(function(require, exports, module) {
	exports.getUpdate = function() {
		var update = new StringBuilder();
		update.append('<p class="font14">{title}</p>\n');
		update.append('<p>最新版本：{version}</p>\n');
		update.append('<p>{note}</p>\n');
		return update.toString();
	};
	exports.getWorkType = function(batchFlag) {
		var workTypeTemp = new StringBuilder();
		workTypeTemp.append('<p class="list_tilte alignright clearfix" dir="{dir}">\n');
		workTypeTemp.append('<span class="floatleft marl10 color-8 desc" dir={typeCount}>{typeText} (<em>{typeCount}</em>)</span>\n');
		if (batchFlag) {
			workTypeTemp.append('<span class="more batchCancelAction floatleft" style="display:none;">取消</span>\n');
			workTypeTemp.append('<span class="more batchAction" >批量操作</span>\n');
		}
		workTypeTemp.append('</p>\n');
		return workTypeTemp.toString();
	};
	exports.getWorkDataCardStart = function() {
		return '<ul class="list" dir="{dir}">\n';
	};
	exports.getWorkDataCardEnd = function() {
		return '</ul>\n';
	};
	exports.getWorkData = function(batchFlag, quickPreview,dataView) {
		var workDataTemp = new StringBuilder();
		workDataTemp.append('<li uid="{uid}" reqId="{reqId}" quickPreview="{quickPreview}" backYn="{backYn}">\n');
		if (batchFlag) {
			workDataTemp.append('<span class="radio_ico"><i class="icon-check2"></i></span>\n');
		}
		workDataTemp.append('<div class="list_li">\n');
		if (quickPreview && quickPreview == 'Y') {
			workDataTemp.append('<i class="icon-expand-more"></i>\n');
		}
		workDataTemp.append('<p class="font14">{applyName}</p>\n');
		workDataTemp.append('<p>{desc}</p>\n');
		workDataTemp.append('</div>\n');
		if(dataView){
			workDataTemp.append(dataView);
		}
		workDataTemp.append('</li>\n');
		return workDataTemp.toString();
	};
	exports.getWorkDataView = function() {
		var workDataViewTemp = new StringBuilder();
		workDataViewTemp.append('<section class="preview details" style="display:none;">\n');
		workDataViewTemp.append('<em class="arrow_t"></em>\n');
		workDataViewTemp.append('<p class="alignright clearfix title">申请信息</p>\n');
		workDataViewTemp.append('<table>\n');
		workDataViewTemp.append('<tbody>\n');
		workDataViewTemp.append('</tbody>\n');
		workDataViewTemp.append('</table>\n');
		workDataViewTemp.append('<p class="alignright mart10 clearfix approveAction">\n');
		workDataViewTemp.append('<span class="btn_inline floatleft" dir="view">详情...</span>\n');
		workDataViewTemp.append('<span class="btn_inline marl5 marr5 btn_yes" dir="pass">通 过</span>\n');
		workDataViewTemp.append('<span class="btn_inline btn_no" dir="reject">否 决</span>\n');
		workDataViewTemp.append('</p>\n');
		workDataViewTemp.append('</section>\n');
		return workDataViewTemp.toString();
	};
	exports.getWorkDataViewTitle = function() {
		return '<p class="alignright clearfix title">{title}</p>';
	};
	exports.getWorkDataViewSearch = function(dataView) {
		var workDataViewTemp = new StringBuilder();
		workDataViewTemp.append('<section class="preview details">\n');
		workDataViewTemp.append('<em class="arrow_t"></em>\n');
		if(dataView){
			workDataViewTemp.append(dataView);
		}
		workDataViewTemp.append('</section>\n');
		return workDataViewTemp.toString();
	};
	exports.getBankData = function() {
		var bankDataTemp = new StringBuilder();
		bankDataTemp.append('<div class="aligncenter p-top30">\n');
		bankDataTemp.append('<p>\n');
		bankDataTemp.append('<img src="{img}" style="width:90px">\n');
		bankDataTemp.append('</p>\n');
		bankDataTemp.append('<p class="color-8">暂无数据</p>\n');
		bankDataTemp.append('</div>\n');
		return bankDataTemp.toString();
	};
	exports.getReqViewRowData = function(preFlag) {
		var reqViewRowDataTemp = new StringBuilder();
		reqViewRowDataTemp.append('<tr>\n');
		reqViewRowDataTemp.append('<th>{label}：</th>\n');
		if (preFlag) {
			reqViewRowDataTemp.append('<td><pre>{value}</pre></td>\n');
		} else {
			reqViewRowDataTemp.append('<td>{value}</td>\n');
		}
		reqViewRowDataTemp.append('</tr>\n');
		return reqViewRowDataTemp.toString();
	};
	exports.getReqViewDetailData = function(content) {
		var reqViewRowDetailTemp = new StringBuilder();
		reqViewRowDetailTemp.append('<section class="form_box mart10">\n');
		reqViewRowDetailTemp.append('<p class="color-3">{label}</p>\n');
		reqViewRowDetailTemp.append('<table class="mart5">\n');
		reqViewRowDetailTemp.append(content);
		reqViewRowDetailTemp.append('</table>\n');
		reqViewRowDetailTemp.append('</section>\n');
		return reqViewRowDetailTemp.toString();
	};
	exports.getApproveActionForTask = function() {
		var approveActionTemp = new StringBuilder();
		approveActionTemp.append('<span class="btn_inline btn_yes" dir="pass">通 过</span>\n');
		approveActionTemp.append('<span class="btn_inline btn_no" dir="reject">否 决</span>\n');
		approveActionTemp.append('<span class="btn_inline" dir="forward">转 审</span>\n');
		return approveActionTemp.toString();
	};
	exports.getApproveActionForConfirm = function() {
		var approveActionTemp = new StringBuilder();
		approveActionTemp.append('<span class="btn_inline btn_yes" dir="confirm">确认完成</span>\n');
		return approveActionTemp.toString();
	};
	exports.getApproveActionForManage = function() {
		var approveActionTemp = new StringBuilder();
		approveActionTemp.append('<span class="btn_inline btn_yes" dir="manage">经办完成</span>\n');
		return approveActionTemp.toString();
	};
	exports.getApproveActionForBack = function() {
		var approveActionTemp = new StringBuilder();
		approveActionTemp.append('<span class="btn_inline btn_no" dir="back">撤销申请</span>\n');
		return approveActionTemp.toString();
	};

	exports.getAttItem = function() {
		var attItemTemp = new StringBuilder();
		attItemTemp.append('<li class="clearfix {viewAction}" uid="{fileKey}" type="{icon_postfix}" url="{url}" fileName="{fileName}.{postfix}">\n');
		attItemTemp.append('<span class="floatleft"><img src="../../img/fu_{icon_postfix}.gif"></span>\n');
		attItemTemp.append('<span class="marl10 txt_hidden">{fileName}.{postfix}</span>\n');
		attItemTemp.append('<span class="floatright marr10">{userName}</span>\n');
		attItemTemp.append('</li>\n');
		return attItemTemp.toString();
	};
	exports.getApproveComments = function(content) {
		var approveCommentsTemp = new StringBuilder();
		approveCommentsTemp.append('<li class="{state}">\n');
		approveCommentsTemp.append('<span class="circle"><i></i></span>\n');
		approveCommentsTemp.append('<p>{typeName}：{nodeUserName}，{desc}</p>\n');
		approveCommentsTemp.append('<p class="alignright clearfix">\n');
		approveCommentsTemp.append('<span class="floatleft">{dateTime}</span>\n');
		approveCommentsTemp.append('<span>{useTime}</span>\n');
		approveCommentsTemp.append('</p>\n');
		if (content && content.length > 0) {
			approveCommentsTemp.append('<div class="apply_txt">\n');
			approveCommentsTemp.append('<i></i>\n');
			approveCommentsTemp.append('<p><pre>' + content + '</pre></p>\n');
			approveCommentsTemp.append('</div>\n');
		}
		approveCommentsTemp.append('</li>\n');
		return approveCommentsTemp.toString();
	};
	exports.getApplyTypeItem = function() {
		var applyTypeItem = new StringBuilder();
		applyTypeItem.append('<span uid="{id}" name="{name}">{name}</span>\n');
		return applyTypeItem.toString();
	};
	exports.getApplyItem = function() {
		var applyItem = new StringBuilder();
		applyItem.append('<td uid={id}>\n');
		applyItem.append('<span><i class="icon-0{applyIco}"></i></span>\n');
		applyItem.append('<p>{applyName}</p>\n');
		applyItem.append('</td>\n');
		return applyItem.toString();
	};
	exports.getEditCardStart = function() {
		return '<ul class = "item_list editList {class}" >';
	};
	exports.getEditCardEnd = function() {
		return '</ul>';
	};
	exports.getEditLiAttrDetail = function(cls) {
		var liItem = new StringBuilder();
		liItem.append('<li class="' + cls + ' {class}" uuid="{uuid}" controlType="{controlType}" coordinate="{coordinate}" ');
		liItem.append('widgetIndex1="{widgetIndex1}" widgetIndex2="{widgetIndex2}" rightNote="{rightNote}" blankYn="{blankYn}" regData="{regData}" controlTip="{controlTip}" defaultValue="{defaultValue}" ');
		liItem.append('>\n');
		return liItem.toString();
	};
	exports.getEditLiAttr = function(cls) {
		var liItem = new StringBuilder();
		liItem.append('<li class="' + cls + ' {class}" uuid="{uuid}" controlType="{controlType}" coordinate="{coordinate}" ');
		liItem.append(' rightNote="{rightNote}" blankYn="{blankYn}" regData="{regData}" controlTip="{controlTip}" defaultValue="{defaultValue}" ');
		liItem.append('>\n');
		return liItem.toString();
	};
	exports.getEditDesc = function(radio) {
		var applyItem = new StringBuilder();
		applyItem.append('<li class="noboder" uuid="{uuid}" blankYn="{blankYn}" controlType="{controlType}" coordinate="{coordinate}">\n');
		applyItem.append('<p class="color-8 marl10 ">\n');
		applyItem.append('{controlName}');
		applyItem.append('<span class="floatright marr10 error" style="display:none;">\n');
		applyItem.append('</span>\n');
		applyItem.append('</p>\n');
		applyItem.append('<input type="hidden"  id="{uuid}_cr" name="{uuid}_cr">\n');
		if (radio) {
			applyItem.append('<input type="hidden"  name="{uuid}">\n');
		}
		applyItem.append('</li>\n');
		return applyItem.toString();
	};
	exports.getEditReadonlyItem = function() {
		var editItem = new StringBuilder();
		editItem.append('<li class="{class}">\n');
		editItem.append('<div class="inner">\n');
		editItem.append('<div class="Inmask">\n');
		editItem.append('<span class="floatleft">{controlName}</span>\n');
		editItem.append('<span class="text_int">{value}</span>\n');
		editItem.append('</div>\n');
		editItem.append('</div>\n');
		editItem.append('</li>\n');
		return editItem.toString();
	};
	exports.getEditVarcharItemReadonly = function() {
		var editItem = new StringBuilder();
		editItem.append(exports.getEditLiAttrDetail('ipt'));
		editItem.append('<div class="inner">\n');
		editItem.append('<div class="Inmask">\n');
		editItem.append('<span class="floatleft">{controlName}</span>\n');
		editItem.append('<span class="text_int">\n');
		editItem.append('<input type="text" id="{uuid}" name="{uuid}"  value="" maxlength="30" readonly="readonly">\n');
		editItem.append('</span>\n');
		editItem.append('</div>\n');
		editItem.append('</div>\n');
		editItem.append('</li>\n');
		return editItem.toString();
	};
	exports.getEditVarcharItem = function() {
		var editItem = new StringBuilder();
		editItem.append(exports.getEditLiAttr('ipt'));
		editItem.append('<div class="inner">\n');
		editItem.append('<div class="Inmask">\n');
		editItem.append('<span class="floatleft">{controlName}</span>\n');
		editItem.append('<span class="text_int">\n');
		editItem.append('<input type="text" id="{uuid}" name="{uuid}"  value="" maxlength="30">\n');
		editItem.append('</span>\n');
		editItem.append('</div>\n');
		editItem.append('</div>\n');
		editItem.append('</li>\n');
		return editItem.toString();
	};
	exports.getEditNumberItem = function() {
		var editItem = new StringBuilder();
		editItem.append(exports.getEditLiAttr('ipt'));
		editItem.append('<div class="inner" minLength="{minLength}" maxLength="{maxLength}">\n');
		editItem.append('<div class="Inmask">\n');
		editItem.append('<span class="floatleft">{controlName}</span>\n');
		editItem.append('<span class="text_int">\n');
		editItem.append('<input type="number" id="{uuid}" name="{uuid}" placeholder="" value="">\n');
		editItem.append('</span>\n');
		editItem.append('</div>\n');
		editItem.append('</div>\n');
		editItem.append('</li>\n');
		return editItem.toString();
	};
	exports.getEditAmountItem = function() {
		var editItem = new StringBuilder();
		editItem.append(exports.getEditLiAttr('ipt'));
		editItem.append('<div class="inner" minAmount="{minAmount}" maxAmount="{maxAmount}">\n');
		editItem.append('<div class="Inmask">\n');
		editItem.append('<span class="floatleft">{controlName}</span>\n');
		editItem.append('<span class="text_int">\n');
		editItem.append('<input type="number" id="{uuid}" name="{uuid}" placeholder="" value="">\n');
		editItem.append('</span>\n');
		editItem.append('</div>\n');
		editItem.append('</div>\n');
		editItem.append('</li>\n');
		return editItem.toString();
	};
	exports.getEditSelectUserItem = function() {
		var editItem = new StringBuilder();
		editItem.append(exports.getEditLiAttr('choose'));
		editItem.append('<div class="inner">\n');
		editItem.append('<div class="Inmask">\n');
		editItem.append('<span class="floatleft">{controlName}</span>\n');
		editItem.append('<span class="text_int">请选择人员</span>\n');
		editItem.append('</div>\n');
		editItem.append('<i class="icon-expand-more"></i>\n');
		editItem.append('</div>\n');
		editItem.append('<input type="hidden" id="{uuid}" name="{uuid}">\n');
		editItem.append('<input type="hidden" id="{uuid}_hd" name="{uuid}_hd">\n');
		editItem.append('</li>\n');
		return editItem.toString();
	};
	exports.getEditSelectItem = function() {
		var editItem = new StringBuilder();
		editItem.append(exports.getEditLiAttr('choose'));
		editItem.append('<div class="inner">\n');
		editItem.append('<div class="Inmask">\n');
		editItem.append('<span class="floatleft">{controlName}</span>\n');
		editItem.append('<span class="text_int">请选择</span>\n');
		editItem.append('</div>\n');
		editItem.append('<i class="icon-expand-more"></i>\n');
		editItem.append('</div>\n');
		editItem.append('<input type="hidden" id="{uuid}" name="{uuid}">\n');
		editItem.append('</li>\n');
		return editItem.toString();
	};
	exports.getEditSelectDeptItem = function() {
		var editItem = new StringBuilder();
		editItem.append(exports.getEditLiAttr('choose'));
		editItem.append('<div class="inner">\n');
		editItem.append('<div class="Inmask">\n');
		editItem.append('<span class="floatleft">{controlName}</span>\n');
		editItem.append('<span class="text_int">请选择部门</span>\n');
		editItem.append('</div>\n');
		editItem.append('<i class="icon-expand-more"></i>\n');
		editItem.append('</div>\n');
		editItem.append('<input type="hidden" id="{uuid}" name="{uuid}">\n');
		editItem.append('</li>\n');
		return editItem.toString();
	};
	exports.getEditSelectProvinceItem = function() {
		var editItem = new StringBuilder();
		editItem.append(exports.getEditLiAttr('choose'));
		editItem.append('<div class="inner">\n');
		editItem.append('<div class="Inmask">\n');
		editItem.append('<span class="floatleft">{controlName}</span>\n');
		editItem.append('<span class="text_int">请选择省份</span>\n');
		editItem.append('</div>\n');
		editItem.append('<i class="icon-expand-more"></i>\n');
		editItem.append('</div>\n');
		editItem.append('<input type="hidden" id="{uuid}" name="{uuid}">\n');
		editItem.append('<input type="hidden" id="{uuid}_province" name="{uuid}_province">\n');
		editItem.append('</li>\n');
		return editItem.toString();
	};
	exports.getEditSelectProvinceCityItem = function() {
		var editItem = new StringBuilder();
		editItem.append(exports.getEditLiAttr('choose'));
		editItem.append('<div class="inner">\n');
		editItem.append('<div class="Inmask">\n');
		editItem.append('<span class="floatleft">{controlName}</span>\n');
		editItem.append('<span class="text_int">请选择省份和城市</span>\n');
		editItem.append('</div>\n');
		editItem.append('<i class="icon-expand-more"></i>\n');
		editItem.append('</div>\n');
		editItem.append('<input type="hidden" id="{uuid}" name="{uuid}">\n');
		editItem.append('<input type="hidden" id="{uuid}_province" name="{uuid}_province">\n');
		editItem.append('<input type="hidden" id="{uuid}_city" name="{uuid}_city">\n');
		editItem.append('</li>\n');
		return editItem.toString();
	};
	exports.getEditWordsItem = function() {
		var editItem = new StringBuilder();
		editItem.append(exports.getEditLiAttr('rd'));
		editItem.append('<div class="inner" linkAcId="{linkAcId}" linkWidgetName="{linkWidgetName}">\n');
		editItem.append('<div class="Inmask">\n');
		editItem.append('<span class="floatleft">{controlName}</span>\n');
		editItem.append('<span class="text_int">\n');
		editItem.append('<input type="varchar" id="{uuid}" name="{uuid}" placeholder="" value="" readonly="readonly">\n');
		editItem.append('</span>\n');
		editItem.append('</div>\n');
		editItem.append('</div>\n');
		editItem.append('</li>\n');
		return editItem.toString();
	};
	exports.getEditMagicItem = function() {
		var editItem = new StringBuilder();
		editItem.append('<li class="rd {class}" uuid="{uuid}" controlType="{controlType}" coordinate="{coordinate}" ');
		editItem.append(' blankYn="{blankYn}" regData="{regData}" controlTip="{controlTip}" defaultValue="{defaultValue}" ');
		editItem.append(' expression_status="{expression_status}" expression="{expression}" expression_sys_type="{expression_sys_type}" expression_sys_widget="{expression_sys_widget}" expression_sys_col="{expression_sys_col}" ');
		editItem.append('>\n');
		editItem.append('<div class="inner">\n');
		editItem.append('<div class="Inmask">\n');
		editItem.append('<span class="floatleft">{controlName}</span>\n');
		editItem.append('<span class="text_int">\n');
		editItem.append('<input type="varchar" id="{uuid}" name="{uuid}" placeholder="" value="" readonly="readonly">\n');
		editItem.append('</span>\n');
		editItem.append('</div>\n');
		editItem.append('</div>\n');
		editItem.append('</li>\n');
		return editItem.toString();
	};
	exports.getEditTextAreaItem = function() {
		var editItem = new StringBuilder();
		editItem.append(exports.getEditLiAttr('ipt mart10 autoHeight'));
		editItem.append('<div class="inner">\n');
		editItem.append('<textarea class="article" placeholder="{controlName}" id="{uuid}" name="{uuid}" maxlength="300"></textarea>\n');
		editItem.append('<span class="textnumber font14">最多300字</span>\n');
		editItem.append('</div>\n');
		editItem.append('</li>\n');
		return editItem.toString();
	};
	exports.getEditDateItem = function() {
		var editItem = new StringBuilder();
		editItem.append(exports.getEditLiAttr('choose'));
		editItem.append('<div class="inner">\n');
		editItem.append('<div class="Inmask">\n');
		editItem.append('<span class="floatleft">{controlName}</span>\n');
		editItem.append('<span class="text_int">请选择日期</span>\n');
		editItem.append('</div>\n');
		editItem.append('<i class="icon-expand-more"></i>\n');
		editItem.append('</div>\n');
		editItem.append('<input type="hidden" id="{uuid}" name="{uuid}">\n');
		editItem.append('</li>\n');
		return editItem.toString();
	};
	exports.getEditTimeItem = function() {
		var editItem = new StringBuilder();
		editItem.append(exports.getEditLiAttr('choose'));
		editItem.append('<div class="inner" defaultHours="{defaultHours}" defaultMinute="{defaultMinute}">\n');
		editItem.append('<div class="Inmask">\n');
		editItem.append('<span class="floatleft">{controlName}</span>\n');
		editItem.append('<span class="text_int">请选择时间</span>\n');
		editItem.append('</div>\n');
		editItem.append('<i class="icon-expand-more"></i>\n');
		editItem.append('</div>\n');
		editItem.append('<input type="hidden" id="{uuid}" name="{uuid}">\n');
		editItem.append('<input type="hidden" id="{uuid}_hours" name="{uuid}_hours">\n');
		editItem.append('<input type="hidden" id="{uuid}_minute" name="{uuid}_minute">\n');
		editItem.append('</li>\n');
		return editItem.toString();
	};
	exports.getEditDateIntervalItem = function() {
		var editItem = new StringBuilder();
		editItem.append(exports.getEditLiAttr('choose'));
		editItem.append('<div class="inner">\n');
		editItem.append('<div class="Inmask">\n');
		editItem.append('<span class="floatleft">{controlName}</span>\n');
		editItem.append('<span class="text_int">请选择日期范围</span>\n');
		editItem.append('</div>\n');
		editItem.append('<i class="icon-expand-more"></i>\n');
		editItem.append('</div>\n');
		editItem.append('<input type="hidden" id="{uuid}" name="{uuid}">\n');
		editItem.append('<input type="hidden" id="{uuid}_startDate" name="{uuid}_startDate">\n');
		editItem.append('<input type="hidden" id="{uuid}_endDate" name="{uuid}_endDate">\n');
		editItem.append('</li>\n');
		return editItem.toString();
	};
	exports.getEditCheckBoxItem = function() {
		var editItem = new StringBuilder();
		editItem.append('<li class="choose {class}" value="{itemValue}">\n');
		editItem.append('<div class="inner">\n');
		editItem.append('<div class="alignright font14 color-8 marr10 clearfix">\n');
		editItem.append('<em class="floatleft">{itemName}</em>\n');
		editItem.append('<span class="font18 icon-square-check""></span>\n');
		editItem.append('</div>\n');
		editItem.append('</div>\n');
		editItem.append('<input type="hidden"  name="{uuid}">\n');
		editItem.append('</li>\n');
		return editItem.toString();
	};
	exports.getEditRadioItem = function() {
		var editItem = new StringBuilder();
		editItem.append('<li class="choose {class}" value="{itemValue}">\n');
		editItem.append('<div class="inner">\n');
		editItem.append('<div class="alignright font14 color-8 marr10 clearfix">\n');
		editItem.append('<em class="floatleft">{itemName}</em>\n');
		editItem.append('<span class="font18 icon-check2" style="display:none;"></span>\n');
		editItem.append('</div>\n');
		editItem.append('</div>\n');
		editItem.append('</li>\n');
		return editItem.toString();
	};
	exports.getSelectItemItem = function(next) {
		var selectItem = new StringBuilder();
		selectItem.append('<li class="clearfix" value="{itemValue}" text="{itemName}">\n');
		if (!next) {
			selectItem.append('<span class="radio_ico"><i class="icon-check2"></i></span>\n');
		}
		selectItem.append('<div class="floatleft">\n');
		selectItem.append('<p>{itemName}</p>\n');
		selectItem.append('</div>\n');
		if (next) {
			selectItem.append('<i class="icon-expand-more"></i>\n');
		}
		selectItem.append('</li>\n');
		return selectItem.toString();
	};
	exports.getContactsKeyWordItem = function() {
		return '<li class="word-title" dir="{keyWord}"><p class="color-6">{keyWord}</p></li>';
	};
	exports.getContactsItem = function() {
		var contactsItem = new StringBuilder();
		contactsItem.append('<li class="clearfix" uid="{id}" userId="{userId}" name="{userName}" dir="{keyWord}">\n');
		contactsItem.append('<span class="radio_ico"><i class="icon-check2"></i></span>\n');
		contactsItem.append('<span class="block floatleft"><img src="{userImg}"></span>\n');
		contactsItem.append('<div class="floatleft">\n');
		contactsItem.append('<p>{userName}</p>\n');
		contactsItem.append('<p><span>{deptName}</span><span>{jobName}</span></p>\n');
		contactsItem.append('</div>\n');
		contactsItem.append('</li>\n');
		return contactsItem.toString();
	};

	exports.getContactsSelectItem = function() {
		var contactsItem = new StringBuilder();
		contactsItem.append('<span class="userimg">\n');
		contactsItem.append('<img src="{userImg}">\n');
		contactsItem.append('</span>\n');
		contactsItem.append('<span>{userName}</span>\n');
		return contactsItem.toString();
	};
	exports.getAddDetailItem = function() {
		var addDetailItem = new StringBuilder();
		addDetailItem.append('<ul class="item_list" uuid="{uuid}" controlName="{controlName}" controlType="{controlType}">\n');
		addDetailItem.append('<li class="noboder"><p class="color-8 marl10">{controlName}</p></li>\n');
		addDetailItem.append('<li class="content">\n');
		addDetailItem.append('<div class="details" >\n');
		addDetailItem.append('</div>\n');
		addDetailItem.append('</li>\n');
		addDetailItem.append('<li><div class="inner more aligncenter">+添加一条明细</div></li>\n');
		addDetailItem.append('<input type="hidden" id="{uuid}_rows" name="{uuid}_rows" value="0">\n');
		addDetailItem.append('</ul>\n');
		return addDetailItem.toString();
	};
	exports.getAddDetailContentItem = function(content) {
		var addDetailContentItem = new StringBuilder();
		addDetailContentItem.append('<section class="form_box">\n');
		addDetailContentItem.append('<p class="color-3 alignright clearfix">\n');
		addDetailContentItem.append('<span class="floatleft">{index}</span>\n');
		addDetailContentItem.append('<span class="btn_inline btn_no marl10 delAction" style="display:none;">删 除</span>\n');
		addDetailContentItem.append('</p>\n');
		addDetailContentItem.append('<table class="mart5">\n');
		if (content) {
			addDetailContentItem.append(content);
		}
		addDetailContentItem.append('</table>\n');
		addDetailContentItem.append('</section>\n');
		return addDetailContentItem.toString();
	};
	exports.getAddDetailContentColItem = function() {
		var addDetailContentItem = new StringBuilder();
		addDetailContentItem.append('<tr>\n');
		addDetailContentItem.append('<th>{detailName}：</th>\n');
		addDetailContentItem.append('<td>{detailText}<input type="hidden" id="{detailId}" name="{detailId}" value="{detailValue}"></td>\n');
		addDetailContentItem.append('</tr>\n');
		return addDetailContentItem.toString();
	};
	exports.getAddDetailContentColItemForTime = function() {
		var addDetailContentItem = new StringBuilder();
		addDetailContentItem.append('<tr>\n');
		addDetailContentItem.append('<th>{detailName}：</th>\n');
		addDetailContentItem.append('<td>{detailText}');
		addDetailContentItem.append('<input type="hidden" id="{detailId}_hours" name="{detailId}_hours" value="{detailValue1}">');
		addDetailContentItem.append('<input type="hidden" id="{detailId}_minute" name="{detailId}_minute" value="{detailValue2}"></td>\n');
		addDetailContentItem.append('</tr>\n');
		return addDetailContentItem.toString();
	};
	exports.getFlowItem = function() {
		var flowItem = new StringBuilder();
		flowItem.append('<li userId="{userId}" approveType="{approveType}" type="{type}">\n');
		flowItem.append('<div class="inner">\n');
		flowItem.append('<span>{text}：</span>\n');
		flowItem.append('<span class="userimg"><img src="{userImg}"></span>\n');
		flowItem.append('<span class="name">{nodeName}</span>\n');
		flowItem.append('</div>\n');
		flowItem.append('</li>\n');
		return flowItem.toString();
	};
	exports.getMore = function() {
		return '<div class="p-top5 p-bt10 aligncenter more" style="display:block;">{text}</div>'
	};
});