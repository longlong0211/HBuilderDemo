if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}
function plusReady(){
	
	var user = userLogin();
			
	InitPage(user);
	
	BindEvent(user);
}

function InitPage(user){
	
	//TODO 暂时不考虑分页
	var postdata = {"userid":user.id,"token":user.token	};
	
	$.ajax({
		type:"POST",
		url: configManager.RequstUrl + "api/agent/profit",
		async:true,
		data:postdata
	}).done(function(data){
		if("success" == data.state){
			PrintPage(data.data);
		}else{
			plus.ui.alert(data.message, function() { }, configManager.alerttip, configManager.alertCtip);			
		}
	});
	
}

function PrintPage(data){
	
	$("#total").html(data.count.profit);
	$("#turnover").html(data.count.turnover);
	var html = [];
	$.each(data.list, function(i, data) {
		html.push('<p><a tip="'+ data.month +'"><span>支付收益：<b>'+ data.profit +'</b></span><span>营业额：<b>'+ data.turnover +'</b></span><font>'+ data.month +'</font> </a></p>');
	});
	$("#incomelist").html(html.join(""));
}

function BindEvent(user){
	$("#incomelist").on("click" , "p a", function(){
		var month = $(this).attr("tip");
		clicked("earndetails.html?month=" + month);
	});
}
