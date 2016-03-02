function CartComputNum(obj, num) {
	if (num > 0) {
		var goods_quantity = $(obj).prev("input[name='goods_quantity']");
		$(goods_quantity).val(parseInt($(goods_quantity).val()) + 1);
	} else {
		var goods_quantity = $(obj).next("input[name='goods_quantity']");
		if (parseInt($(goods_quantity).val()) > 1) {
			$(goods_quantity).val(parseInt($(goods_quantity).val()) - 1);
		}
	}
}
var guigeid = 0;

function demo(id, img_url, title) {
	var content = '';
	content += '<ul class="mui-table-view" id="motaikuang"><li class="mui-table-view-cell" style="padding: 0 15px 5px 15px;">';
	content += '<img src="http://www.guoshe.cc/' + img_url + '" style="border-radius: 50%;width:40px;">';
	content += '<div style="float: right;line-height:40px;">' + title + '</div></li>';
	content += '<li class="mui-table-view-cell"><div style="float: left;padding: 7px;">数量：</div>';
	content += '<div class="mui-numbox" style="float: right;">';
	content += '<button class="mui-btn mui-numbox-btn-minus" type="button" onclick="CartComputNum(this, -1);">-</button>';
	content += '<input class="mui-numbox-input" type="number" value="1" name="goods_quantity"/>';
	content += '<button class="mui-btn mui-numbox-btn-plus" type="button" onclick="CartComputNum(this, 1);">+</button>';
	content += '</div></li>';
	mui.ajax('http://www.guoshe.cc/tools/index.ashx?action=get_goods_attributes_info_title&goodsId='+ id,{
		type: "POST",
		data: {
			"goodsId": id
		},
		dataType: "json",
		timeout: 10000,
		success: function(data) {
			var content1 = "";
			var content2 = "";
			if (data["TableInfo"][0].id == "0") {
				guigeid = 0;
			} else {
				guigeid = 1;
				content2 += '<li class="mui-table-view-cell">规格:';
				content2 += '<div class="mui-card"><form class="mui-input-group">';
				content2 += '</form></div></li>';
				$("#motaikuang").append(content2);
				$.each(data["TableInfo"], function(i, v) {
					content1 += '<div class="mui-input-row mui-radio"><input name="radio1" type="radio"" value="' + v.id + '" checked><label style="font-size:12px;">' + v.title + '</label></div>';
				});
				$(".mui-input-group").append(content1);
			}
		}
	});
	content += '</ul>';
	layer.open({
		btn: ['立即购买', '加入购物车'],
		content: content,
		area: ['100%', '300px'],
		style: 'width:100%;max-width:100%;border-bottom-left-radius:0px;border-bottom-right-radius:0px;',
		yes: function() {
			CartAddindex(1, id);
		},
		no: function(index) {
			CartAddindex(0, id);
		}
	});
}

//添加进购物车
function CartAddindex(linktype, goodsId) {
	var list = 0;
	if (guigeid == 1) {
		list = $('input:radio[name="radio1"]:checked').val();
	}
	// 判断是否登录
	var users = JSON.parse(localStorage.getItem('$users') || '[]');
	var authed = users.some(function(user) {
		return user.account;
	});
	//登录了
	if (authed) {

	} else {
		mui.openWindow({
			id: "login",
			url: "login.html",
			waiting: {
				autoShow: true,
				title: "正在加载,请稍等"
			},
			styles: {
				scrollIndicator: 'none'
			}
		});
		return;
	}
	mui.ajax('http://www.guoshe.cc/tools/submit_ajax.ashx?action=cart_goods_add',{
		type: "post",
		data: {
			"goods_id": goodsId,
			"goods_quantity": $(".mui-numbox-input").val(),
			"goods_attributes_id": list,
			"linktype": linktype
		},
		dataType: "json",
		success: function(data, textStatus) {
			if (data.status == 1) {
				if (linktype == 1) {
					var index = plus.webview.getLaunchWebview();
					mui.fire(index, 'gouwuchenum');
					//获得共用模板组
					var template = getTemplate('default');
					//判断是否显示右上角menu图标；
					var showMenu = false;
					//获得共用父模板
					var headerWebview = template.header;
					//获得共用子webview
					var contentWebview = template.content;
					var title = "填写订单";
					//通知模板修改标题，并显示隐藏右上角图标；
					mui.fire(headerWebview, 'updateHeader', {
						title: title,
						showMenu: showMenu
					});
					var reload = true;
					if (!template.loaded) {
						if (contentWebview.getURL() != this.href) {
							contentWebview.loadURL("confirm.html");
						} else {
							reload = false;
						}
					} else {
						reload = false;
					}
					(!reload) && contentWebview.show();
					headerWebview.show("pop-in", 150);
					//location.href = "http://www.guoshe.cc/app/shopping/confirm.html";

				} else {
					mui.toast('商品成功加入购物车');
					var index = plus.webview.getLaunchWebview();
					mui.fire(index, 'gouwuchenum');

				}
			} else {
				mui.toast(data.msg);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
		},
		timeout: 20000
	});
	layer.closeAll();
	return false;
}