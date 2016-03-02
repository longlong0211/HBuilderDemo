//$(function(){
//	plusReady();
//});
function plusReady() {
	//初始化页面
	var id 		= getUrlParam("id");	//订单号
	var user	= userLogin();			//用户
//	var id = 49;
//	var user = {"id":2,"name":"15158884139","email":"","nick":"掌创0002","real_name":"谢霆锋","avatar_id":0,"code":"03EA","id_no":"330184198406201352","id_pic1":2,"id_pic2":3,"id_pic3":2,"user_type":1,"status":1,"auth_status":0,"parent_id":0,"remark":null,"created_at":"2015-06-14 11:28:24","updated_at":"2015-06-14 11:29:18","token":"MnwkMnkkMTAkNDgvMEgxSlQvWlpyOFU0bVZEcmpYdW1jVDUyNjZFWTB6OUVrR3pnL0xvL00zSlF3MnZSbld8OGEyMTViNjM1YjhhYTJmOTZhOTc4MTgwYmE1NzEyNDk=","account":{"id":2,"user_id":2,"used":"0.00","all":"20050.00","cash":"10050.00","card":"10000.00","coin":"10000.00"}};
    PaintPage(id, user);
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}
// 获取订单详情
 function PaintPage(id, user)
 {
 	$.ajax({
 		type	: "POST",
 		url		: configManager.RequstUrl + "api/order/info",
 		async	: true,
 		data	: { "userid":user.id, "token":user.token, "orderid":id }
 	}).done(function(data){
 		if("success" == data.state){
 			Render(user, data.data);
 			BindEvent(user, data.data);
 		}
 		else{
 			plus.ui.alert(data.message, function() { }, configManager.alerttip, configManager.alertCtip);
 		}
 	});
 }
 
 function BindEvent(order){
 	if(order.status > 1){
	 	//确认消费
	 	$("#orderdetailinfo").on("click", "#confirm", function(){
	 		$.ajax({
	 			type	: "POST",
	 			url		: configManager.RequstUrl + "/api/store/orderdone",
	 			async	: true,
	 			data	: { "userid":user.id,"token":user.token,"order":order.id }
	 		}).done(function(data){	 			
 				plus.ui.alert(data.message, function() { }, configManager.alerttip, configManager.alertCtip);
	 		});
	 	});
 	}else{
 		$("#orderdetailinfo #confirm").hide();
 	}
 }
 
 function Render(user, order){
	
 	var html = [];
 	html.push("");
 	html.push("<div class='sjxqbkbg sjxqckxq' id='orderinfo'>");
 	html.push("<h2>订单详情</h2>");
 	html.push("<p><b>订单号：</b>"+ order.order_sn +"</p>");
 	html.push("<p><b>购买手机号：</b>"+ user.name +"</p>");
 	html.push("<p><b>下单时间：</b>"+ order.created_at +"</p>");
 	html.push("<p><b>数量：</b>1</p>");
 	html.push("<p><b>总价：</b>"+ order.money +"元</p>");
 	html.push("</div>");
 	
 	html.push("<div id='confirm' class='dlkuang mainbottom10'><p class='dlan'><a>确认消费</a></p></div>");
 	
 	html.push("<div class='sjxqbkbg mainbottom80' id='ordergoodslist'>");
 	var src = "";
 	$.each(order.goods, function(i, goods) {
 		src = configManager.storeImgurl.format(goods.goods_pic, "70-47")
 		html.push('<dl class="dlsdlmx smdd"><dt><a><img src="'+ src +'"></a></dt><dd>来伊份</dd><dd>数量：'+ goods.quantity +'</dd><dd>单价：<b>¥'+ goods.goods_pic +'元</b></dd></dl>');
 	});
 	
 	html.push("</div>");

 	$("#orderdetailinfo").html(html.join("")); 	
 }


