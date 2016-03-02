//function plusReady() {
//	isLogin();
//}
//if (window.plus) {
//	plusReady();
//} else {
//	document.addEventListener('plusready', plusReady, false);
//}

//判断是否登录，如果已经登录 如果未登录跳转到登录页面
function userLogin(){
	var userString = plus.storage.getItem(storageManager.user);
//	console.log("userinfo:" + userString);
	if(userString != null && userString != ""){
		var user =  JSON.parse(userString);
		return user;
	}
	else{
		clicked('/view/account/login.html',false,false,'slide-in-bottom');
	}
	
	
	
}
