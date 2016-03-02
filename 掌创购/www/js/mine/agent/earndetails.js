if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}
function plusReady(){
	var month = getUrlParam("month");
	var user = userLogin();
			
	InitPage(user, month);
	
	BindEvent(user, month);
}

function InitPage(user, inputmonth){
	InitByMonth(inputmonth)
	
	var postdata = { "userid":user.id, "token":user.token, "month":inputmonth };
	
	console.log(JSON.stringify(postdata));
	
	$.ajax({
		type:"POST",
		url: configManager.RequstUrl + "api/agent/monthfit",
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

function InitByMonth(inputmonth){

	var arr = inputmonth.split("-");
	var year = parseInt(arr[0]);
	var month = parseInt(arr[1]);
		
	var newyear,newmonth;
	var pre,nex;
	if((month-1) < 1){
	  newyear = year - 1;
	  newmonth = 1;	  
	}
	else{
	  newyear = year;
	  newmonth = month - 1;
	}
	
	if(newmonth<10){
	  pre = newyear.toString() + "-0" +newmonth.toString();
	}
	else{
	  pre = newyear.toString() + "-" +newmonth.toString();
	}
	
	if((month+1)>12){
	  newyear = year + 1;
	  newmonth = 1;
	}
	else{
	  newyear = year;
	  newmonth = month + 1;
	}
	if(newmonth<10){
	  nex = newyear.toString() + "-0" +newmonth.toString();
	}
	else{
	  nex = newyear.toString() + "-" +newmonth.toString();
	}
	
	$("#pre").html(pre);
	$("#cur").html(inputmonth).css("color","#DD524D");
	var currdate = new Date();
	var nexdate = new Date(nex);
	if(nexdate>currdate)
	{	$("#next").html("");	}
	else
	{	$("#next").html(nex);	}	
}

function BindEvent(user, month){
	
	$(".bymonth").on("click", function(){
		var bymonth = $(this).html();
		
		var postdata = { "userid":user.id, "token":user.token, "month":bymonth };
		
		console.log(JSON.stringify(postdata));
		
		$.ajax({
			type:"POST",
			url: configManager.RequstUrl + "api/agent/monthfit",
			async:true,
			data:postdata
		}).done(function(data){
			if("success" == data.state){
				PrintPage(data.data);
				InitByMonth(bymonth);
			}else{
				plus.ui.alert(data.message, function() { }, configManager.alerttip, configManager.alertCtip);
			}
		});			
	});
}


function PrintPage(data){
	
	var html = [];
	$.each(data.list, function(i, list) {
		html.push('<dl class="dlsdlmx">');
		var src = configManager.storeImgurl.format(list.store.store_pic, "80-67")
		html.push('<dt><img src="'+ src +'"></dt>');
		html.push('<dd><span></span>'+ list.store.store_name +'</dd>');
		html.push('<dd><span>&nbsp;</span>'+ list.store.store_address.substr(0,10) +'...</dd>');
		html.push('<dd><span> 支付收益：<b>'+ list.profit +'</b></span>营业：'+ list.turnover +'</dd>');
		html.push('</dl>');
		$("#earnlist").html(html.join(""));
	});
}