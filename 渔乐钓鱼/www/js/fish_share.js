var getshareids=[{id:"weixin",ex:"WXSceneSession"},{id:"weixin",ex:"WXSceneTimeline"},{id:"qq"}];
var getsharenames=[{title:"发送给微信好友"},{title:"分享到微信朋友圈"},{title:"分享到QQ"}];

function getisshowshare()
{  
	if(GetSystem()=="ios" && CurentDate()<= "2015-11-10")
	{
		return false;
	}
	
	return true;
}
