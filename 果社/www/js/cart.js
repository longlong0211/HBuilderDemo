//添加进购物车
function CartAdd(linktype) {
	if (goodsId == 0 || $(".mui-numbox-input").val() == "") {
		console.log("s");
		return false;
	}
	var list = 0;
	if (guigeid == 1) {
		list = $('input:radio[name="radio1"]:checked').val();
		if (list == null) {
			alert("请选择商品规格!");
			return false;
		}
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
	$.ajax({
		type: "post",
		url: "http://www.guoshe.cc/tools/submit_ajax.ashx?action=cart_goods_add",
		data: {
			"goods_id": goodsId,
			"goods_quantity": $(".mui-numbox-input").val(),
			"goods_attributes_id": list
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
					var btnArray = ['去结算', '再逛逛'];
					mui.confirm('购物车共有' + data.quantity + '件商品，合计：' + data.amount + '元', '提示信息', btnArray, function(e) {
						var index = plus.webview.getLaunchWebview();
						mui.fire(index, 'gouwuchenum');
						if (e.index == 0) {
							mui.openWindow({
								id: "shopping.html",
								url: "shopping.html",
								waiting: {
									autoShow: true,
									title: "正在加载,请稍等"
								},
								styles: {
									scrollIndicator: 'none'
								}
							});

						} else {

						}

					})

				}
			} else {
				mui.alert(data.msg);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

		},
		timeout: 20000
	});
	return false;
}

function changePrice(goods_attribute_info_id) {
		$.ajax({
			type: "post",
			url: "http://www.guoshe.cc/tools/submit_ajax.ashx?action=get_kucunandprice",
			data: {
				"goods_attribute_info_id": goods_attribute_info_id
			},
			dataType: "json",
			success: function(data) {
				var count = $(".mui-numbox-input").val();
				$("#stock_quantity").text("库存数量:" + data.kucunshuliang);
				$("#sell_price").text(data.price);
				$(".mui-numbox").attr("data-numbox-max", data.kucunshuliang);
				//document.getElementById("goods_amount").innerHTML = "￥" + data.price * count;
			},
			timeout: 20000
		});
	}
	//删除购物车商品

function DeleteCart(goods_id, goods_attributes_id) {
		if (goods_id == "") {
			return false;
		}
		var btnArray = ['是', '否'];
		mui.confirm('您确认要从购物车中移除吗？', '果社', btnArray, function(e) {
			if (e.index == 0) {
				$.ajax({
					type: "post",
					url: "http://www.guoshe.cc/tools/submit_ajax.ashx?action=cart_goods_delete",
					data: {
						"goods_id": goods_id,
						"goods_attributes_id": goods_attributes_id
					},
					dataType: "json",
					success: function(data, textStatus) {
						if (data.status == 1) {
							GetCartList();
							GetTotal();
//							plus.webview.currentWebview().reload(true);
						} else {
							$.dialog.alert(data.msg);
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						$.dialog.alert("状态：" + textStatus + "；出错提示：" + errorThrown);
					},
					timeout: 20000
				});
			}
		})

		return false;
	}
	//购物车统计

function GetTotal() {
	mui.ajax('http://www.guoshe.cc/tools/index.ashx?action=GetTotal', {
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			if (data.TableInfo[0].id != "0") {
				$("#heji").text('合计:￥' + data.TableInfo[0].real_amount);
			} else {
				$("#heji").text('合计:￥');
			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理；
			$("#heji").text('合计:￥');
		}
	});
}

function GetCartList() {
		//购物车列表
		var table = document.body.querySelector('.mui-table-view');
		$('.mui-table-view').empty();
		mui.ajax('http://www.guoshe.cc/tools/index.ashx?action=get_cart_list', {
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				var content = "";
				var content2 = "";
				if (data.TableInfo[0]) {
					count = 1;
					$.each(data["TableInfo"], function(i, v) {
						content += '<li class="mui-table-view-cell">';
						content += '<div class="mui-slider-cell">';
						content += '<div class="oa-contact-cell mui-table">';
						content += '<div class="oa-contact-avatar mui-table-cell">';
						content += '<img src="http://www.guoshe.cc' + v.img_url + '" style="width:60px;"/>';
						content += '</div>';
						content += '<div class="oa-contact-content mui-table-cell">';
						content += '<div class="mui-clearfix">';
						content += '<h4 class="oa-contact-name">' + v.title + '</h4><h5 style="float:right;">' + v.goods_attributes + '</h5>';
						content += '</div>';
						content += '<p class="oa-contact-email mui-h6">￥' + v.user_price + '</p><button class="mui-btn mui-btn-negative" onclick="DeleteCart(' + v.id + ',' + v.goods_attributes_id + ')" style="float:right;border-top-left-radius:20px;border-top-right-radius:20px;border-bottom-left-radius:20px;border-bottom-right-radius:20px;">×</button>';
						content += '</div></div>';
						content += '</div>';
						content += '<div class="mui-numbox">';
						content += '<button class="mui-btn mui-numbox-btn-minus" type="button" onclick="CartComputNum(this, ' + v.id + ', -1,' + v.goods_attributes_id + ');">-</button>';
						content += '<input class="mui-numbox-input" name="goods_quantity" type="number" value="' + v.quantity + '" />';
						content += '<button class="mui-btn mui-numbox-btn-plus" type="button" onclick="CartComputNum(this, ' + v.id + ', 1,' + v.goods_attributes_id + ');">+</button>';
						content += '</div>';
						content += '</li>';
					});
				} else {
					count = 0;
					content += '<h4 style="padding:60px 0 100px 0;color:red;text-align:center;margin-top:50px;">您的购物车内还没有任何商品</h4>';
				}
				$(".mui-table-view").append(content);
			},
			error: function(xhr, type, errorThrown) {
				count = 0;
				//异常处理；
				var content = '<h4 style="padding:60px 0 100px 0;color:red;text-align:center;margin-top:50px;">您的购物车内还没有任何商品</h4>';
				$(".mui-table-view").append(content);
			}
		});
	}
	//购物车数量加减

function CartComputNum(obj, goods_id, num, goods_attributes_id) {
		if (num > 0) {
			var goods_quantity = $(obj).prev("input[name='goods_quantity']");
			$(goods_quantity).val(parseInt($(goods_quantity).val()) + 1);
			//计算购物车金额
			CartAmountTotal($(goods_quantity), goods_id, goods_attributes_id);
		} else {
			var goods_quantity = $(obj).next("input[name='goods_quantity']");
			if (parseInt($(goods_quantity).val()) > 1) {
				$(goods_quantity).val(parseInt($(goods_quantity).val()) - 1);
				//计算购物车金额
				CartAmountTotal($(goods_quantity), goods_id, goods_attributes_id);
			}
		}
	}
	//计算购物车金额

function CartAmountTotal(obj, goods_id, goods_attributes_id) {
	if (isNaN($(obj).val())) {
		$.dialog.alert('商品数量只能输入数字!', function() {
			$(obj).val("1");
		});
	}
	$.ajax({
		type: "post",
		url: "http://www.guoshe.cc/tools/submit_ajax.ashx?action=cart_goods_update",
		data: {
			"goods_id": goods_id,
			"goods_quantity": $(obj).val(),
			"goods_attributes_id": goods_attributes_id
		},
		dataType: "json",
		success: function(data, textStatus) {
			if (data.status == 1) {
				//GetCartList();
				GetTotal();
			} else {
				$.dialog.alert(data.msg, function() {
					location.reload();
				});
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			$.dialog.alert("状态：" + textStatus + "；出错提示：" + errorThrown);
		},
		timeout: 20000
	});
	return false;
}