function plusReady(){
	console.log("初始化autherized.html");
	init();
	
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

//$(document).ready(function(){
//	init();
//});

function init(){
	var user = userLogin();
	console.log(JSON.stringify(user));
	$("#real_name").html(user.real_name);
	$("#id_no").html(user.id_no);
}
