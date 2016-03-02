function sendtointerface(md5uid,md5id,url_index,doback,dobackerror){
	
	var xhr_index=null;  
	
	if(url_index.indexOf("?")>0){
		url_index = url_index+"&"+getencrypted(md5uid,md5id)
	}
	else{
		url_index = url_index+"?"+ getencrypted(md5uid,md5id)
	}
	
	console.log(url_index);
			 
	xhr_index = new plus.net.XMLHttpRequest();
	xhr_index.onreadystatechange = function () {
		switch ( xhr_index.readyState ) {          
        case 4:
            if ( xhr_index.status == 200 ) {
            	doback(xhr_index.responseText,xhr_index.status);
            	 
            } else {
            	if(typeof(dobackerror)!="undefined"){
            		dobackerror();
            	}else{ 
            		
            		mui.toast( "请求失败："+xhr_index.status+"，请查看网络是否通畅！" );
            	}
            }
            break;
        default : 
            break;
    	}
	}
	
	xhr_index.open( "GET", url_index );
	xhr_index.send();
	
}

//要先加载md5.js 和  global.js
function getencrypted(md5uid,md5id)
{
	md5uid = md5uid.toString()
	md5id = md5id.toString();
	var addtime = CurentDate();
	var md5 = hex_md5(md5uid+md5id+addtime+apikey);
	var back =  "md5uid="+md5uid+"&md5id="+md5id+"&datetime="+addtime+"&md5="+md5;
	return back;
}

function sendposttointerface(md5uid,md5id,url_index,params,doback,dobackerror){
	
	var xhr_index=null;  
	
	if(url_index.indexOf("?")>0){
		url_index = url_index+"&"+getencrypted(md5uid,md5id)
	}
	else{
		url_index = url_index+"?"+ getencrypted(md5uid,md5id)
	}
	
			 
	xhr_index = new plus.net.XMLHttpRequest();
	xhr_index.onreadystatechange = function () {
		switch ( xhr_index.readyState ) {          
        case 4:
            if ( xhr_index.status == 200 ) {
            	doback(xhr_index.responseText,xhr_index.status);
            	 
            } else {
            	if(dobackerror){
            		dobackerror();
            	}else{
            		mui.toast( "请求失败："+xhr_index.status+"，请查看网络是否通畅！" );
            	}
            }
            break;
        default : 
            break;
    	}
	}
	
	xhr_index.open( "GET", url_index );
	xhr_index.send(params);
	
}
