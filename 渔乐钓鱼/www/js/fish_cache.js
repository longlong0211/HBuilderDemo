//缓存   js 
function setConfigParams(name,value){ 
	plus.storage.setItem(name,value);
	 
}

function getConfigParams(name,value){
	 var temp = plus.storage.getItem(name);

	 if(temp != null){
	 	return temp;
	 }
	 else
	 {
	 	if(value!=null )
	 	{
	 		return value;
	 	}else{
	 		return "";
	 	}
	 }
}

function getConfigParamsInt(name,value){
	 var temp = getConfigParams(name,value);

	 if(temp != null && temp != ""){
	 	return parseInt(temp);
	 }
	 else{
	 	return value;
	 }
}


//用户信息
var uid = 0;
var nickname = "";
var avatarsmall = "";
var avatar = "";
var scores = 0;
var level = 0;
var msg  = "";
var money = 0;
var logintimes = 0;
var username = "";
var realname = "";
var qq = "";
var telphone = "";
var email = "";
var sex = "";

function getlogin(){
	uid = getConfigParamsInt("uid",uid);
	nickname  = getConfigParams("nickname",nickname);
	avatarsmall = getConfigParams("avatarsmall",avatarsmall);
	avatar = getConfigParams("avatar",avatar);
	scores = getConfigParamsInt("scores",scores);
    level = getConfigParamsInt("level",level);
	msg = getConfigParams("msg",msg);
    money = getConfigParamsInt("money",money);
    logintimes = getConfigParamsInt("logintimes",logintimes);
    username = getConfigParams("username",username);
    realname = getConfigParams("realname",realname);
    
    qq = getConfigParams("qq",qq);
    telphone = getConfigParams("telphone",telphone);
    email = getConfigParams("email",email);
    sex = getConfigParams("sex",sex);
}


function setlogin(data)
{ 
	 
	if(typeof(data.uid)!="undefined" &&  data.uid!="") setConfigParams( "uid",  data.uid);
	if(typeof(data.nickname)!="undefined" && data.nickname!="") setConfigParams( "nickname",  data.nickname);
	if(typeof(data.avatar)!="undefined" && data.avatar!="") setConfigParams( "avatar",  data.avatar+ "?v=" + new Date().getTime());
	if(typeof(data.avatarsmall)!="undefined" &&data.avatarsmall!="") setConfigParams( "avatarsmall",  data.avatarsmall+ "?v=" + new Date().getTime());
	if(typeof(data.scores)!="undefined" &&data.scores!="") setConfigParams( "scores",  data.scores);
	if(typeof(data.level)!="undefined" &&data.level!="") setConfigParams( "level",  data.level);
	if(typeof(data.msg)!="undefined" &&data.msg!="") setConfigParams( "msg",  data.msg);
	if(typeof(data.money)!="undefined" &&data.money!="") setConfigParams( "money",  data.money);
	if(typeof(data.logintimes)!="undefined" &&data.logintimes!="") setConfigParams( "logintimes",  data.logintimes); 
	if(typeof(data.username)!="undefined" &&data.username!="") setConfigParams( "username",  data.username);
	if(typeof(data.realname)!="undefined" &&data.realname!="") setConfigParams( "realname",  data.realname);
	if(typeof(data.qq)!="undefined" &&data.qq!="") setConfigParams( "qq",  data.qq);
	if(typeof(data.telphone)!="undefined" &&data.telphone!="") setConfigParams( "telphone",  data.telphone);
	if(typeof(data.email)!="undefined" &&data.email!="") setConfigParams( "email",  data.email);
	if(typeof(data.sex)!="undefined" &&data.sex!="") setConfigParams( "sex",  data.sex);
}

//签到信息
var score_issign = "1";
var score_signlasttime  =  "";
var score_signtimes= 0; 

function getscores()
{
	score_issign = getConfigParams("score_issign",score_issign);
	score_signlasttime  = getConfigParams("score_signlasttime",score_signlasttime);
	score_signtimes= getConfigParamsInt("score_signtimes",score_signtimes); 
	scores = getConfigParamsInt("scores",scores); 
}

function setscores(data)
{
	if(typeof(data.score_issign)!="undefined" &&data.score_issign!="") setConfigParams( "score_issign",  data.score_issign);
	if(typeof(data.score_signlasttime)!="undefined" &&data.score_signlasttime!="") setConfigParams( "score_signlasttime",  data.score_signlasttime);
	if(typeof(data.score_signtimes)!="undefined" &&data.score_signtimes!="") setConfigParams( "score_signtimes",  data.score_signtimes);
	if(typeof(data.scores)!="undefined" &&data.scores!="") setConfigParams( "scores",  data.scores);
}

//通知配置信息
var config_notify_message = "1";
var config_notify_messagedetail  = "1";
var config_notify_groupmsg = "1";
var config_notify_userpostnum = "1";
var config_notify_messagesound = "1";
var config_notify_messageshake = "1";
var config_notify_disturb = "0";


function getconfignotify()
{
	config_notify_message = getConfigParams("config_notify_message",config_notify_message);
	config_notify_messagedetail  = getConfigParams("config_notify_messagedetail",config_notify_messagedetail);
	config_notify_groupmsg= getConfigParams("config_notify_groupmsg",config_notify_groupmsg); 
	config_notify_messagesound = getConfigParams("config_notify_messagesound",config_notify_messagesound); 
	config_notify_messageshake = getConfigParams("config_notify_messageshake",config_notify_messageshake); 
	config_notify_disturb = getConfigParams("config_notify_disturb",config_notify_disturb); 
	config_notify_userpostnum = getConfigParams("config_notify_userpostnum",config_notify_userpostnum); 
}

function setconfignotify(data)
{
	if(typeof(data.config_notify_message)!="undefined" &&data.config_notify_message!="") setConfigParams( "config_notify_message",  data.config_notify_message);
	if(typeof(data.config_notify_messagedetail)!="undefined" &&data.config_notify_messagedetail!="") setConfigParams( "config_notify_messagedetail",  data.config_notify_messagedetail);
	if(typeof(data.config_notify_groupmsg)!="undefined" &&data.config_notify_groupmsg!="") setConfigParams( "config_notify_groupmsg",  data.config_notify_groupmsg);
	if(typeof(data.config_notify_messagesound)!="undefined" &&data.config_notify_messagesound!="") setConfigParams( "config_notify_messagesound",  data.config_notify_messagesound);
	if(typeof(data.config_notify_messageshake)!="undefined" &&data.config_notify_messageshake!="") setConfigParams( "config_notify_messageshake",  data.config_notify_messageshake);
	if(typeof(data.config_notify_disturb)!="undefined" &&data.config_notify_disturb!="") setConfigParams( "config_notify_disturb",  data.config_notify_disturb);
	if(typeof(data.config_notify_userpostnum)!="undefined" &&data.config_notify_userpostnum!="") setConfigParams( "config_notify_userpostnum",  data.config_notify_userpostnum);
}

//隐私配置 
var config_privacy_friendverification= "1";
var config_privacy_recommendaddressbookfriend= "1";
var config_privacy_searchbyaddressbook= "1";
var config_privacy_searchbytelphone= "1";
var config_privacy_searchbyemail= "1";
var config_privacy_searchbyqq= "1";
var config_privacy_searchbyrealname= "1";

function getconfigprivacy()
{
	config_privacy_friendverification = getConfigParams("config_privacy_friendverification",config_privacy_friendverification);
	config_privacy_recommendaddressbookfriend  = getConfigParams("config_privacy_recommendaddressbookfriend",config_privacy_recommendaddressbookfriend);
	config_privacy_searchbyaddressbook= getConfigParams("config_privacy_searchbyaddressbook",config_privacy_searchbyaddressbook); 
	config_privacy_searchbytelphone = getConfigParams("config_privacy_searchbytelphone",config_privacy_searchbytelphone); 
	config_privacy_searchbyemail = getConfigParams("config_privacy_searchbyemail",config_privacy_searchbyemail); 
	config_privacy_searchbyqq = getConfigParams("config_privacy_searchbyqq");
	config_privacy_searchbyrealname = getConfigParams("config_privacy_searchbyrealname");
	 
}

function setconfigprivacy(data)
{ 
	 
	if(typeof(data.config_privacy_friendverification)!="undefined" &&data.config_privacy_friendverification!="") setConfigParams( "config_privacy_friendverification",  data.config_privacy_friendverification);
	if(typeof(data.config_privacy_recommendaddressbookfriend)!="undefined" &&data.config_privacy_recommendaddressbookfriend!="") setConfigParams( "config_privacy_recommendaddressbookfriend",  data.config_privacy_recommendaddressbookfriend);
	if(typeof(data.config_privacy_searchbyaddressbook)!="undefined" &&data.config_privacy_searchbyaddressbook!="") setConfigParams( "config_privacy_searchbyaddressbook",  data.config_privacy_searchbyaddressbook);
	if(typeof(data.config_privacy_searchbytelphone)!="undefined" &&data.config_privacy_searchbytelphone!="") setConfigParams( "config_privacy_searchbytelphone",  data.config_privacy_searchbytelphone);
	if(typeof(data.config_privacy_searchbyemail)!="undefined" &&data.config_privacy_searchbyemail!="") setConfigParams( "config_privacy_searchbyemail",  data.config_privacy_searchbyemail);
	if(typeof(data.config_privacy_searchbyqq)!="undefined" &&data.config_privacy_searchbyqq!="") setConfigParams( "config_privacy_searchbyqq",  data.config_privacy_searchbyqq);
	if(typeof(data.config_privacy_searchbyrealname)!="undefined" &&data.config_privacy_searchbyrealname!="") setConfigParams( "config_privacy_searchbyrealname",  data.config_privacy_searchbyrealname);
}
 
var position_provincename = ""; //名称  
var position_cityname = ""; //名称 
var position_longt = ""; //东经
var position_lat = "";  //北纬

function setposition(provincename,cityname,longt,lat)
{
	 
	setConfigParams( "position_longt",longt.toString() );
	setConfigParams( "position_lat",lat.toString() );
	setConfigParams( "position_provincename",provincename);
	setConfigParams( "position_cityname",cityname);
} 
 
function getposition()
{ 
	position_longt = getConfigParams( "position_longt",position_longt);
	position_lat = getConfigParams( "position_lat",position_lat);
	position_cityname = getConfigParams( "position_cityname",position_cityname);
	position_provincename= getConfigParams( "position_provincename",position_provincename);  
} 



//钓点查询的方式
var pondlist_length = "100"; //50公里范围之内  
var pondlist_type = "0"; //钓点类型
var pondlist_money = "0"; //收费类型
var pondlist_sort = "length";  //排序类型

function setpondlist(length,type,money,sort)
{
	setConfigParams( "pondlist_length",length);
	setConfigParams( "pondlist_type",type);
	setConfigParams( "pondlist_money",money);
	setConfigParams( "pondlist_sort",sort);
}

function getpondlist()
{ 
	pondlist_length = getConfigParams( "pondlist_length",pondlist_length);
	pondlist_type = getConfigParams( "pondlist_type",pondlist_type);
	pondlist_money = getConfigParams( "pondlist_money",pondlist_money);
	pondlist_sort= getConfigParams( "pondlist_sort",pondlist_sort);  
} 

