<!--*****************************************************模式、字体-->

	document.getElementById("mySwitch").addEventListener("toggle",	function(event){
	  if(event.detail.isActive){
	    $("body").addClass("nightMode");
		setConfigParams("readMode","night");

	  }else{
	    $(".nightMode").removeClass("nightMode");
		 setConfigParams("readMode","day");
	  }
	})

	

	
	$("#sizeUl").delegate("li","tap",function(event){
	  
	  //保存之前样式
		var oldDataFontsize = 1;

		oldDataFontsize = parseInt($("li .mui-active").attr("data-fontsize"));
		
		
		$("#sizeUl .mui-active").removeClass("mui-active");
		
		$(this).addClass("mui-active");
		var dataFontsize = parseInt($(this).attr("data-fontsize")); 
		
		changeFontSize(dataFontsize,oldDataFontsize);
		
	});
	
	function changeFontSize(dataFontsize,oldDataFontsize){
		
	switch(oldDataFontsize){
			case 1:
				 $("body").removeClass("size-small");

				 break;
			case 2:
				$("body").removeClass("size-medium");

				break;
			case 3:
				$("body").removeClass("size-large");

				break;
			case 4:
				$("body").removeClass("size-b-large");

				break;
			default:
				alert("移除错误")
		}
		
		switch(dataFontsize){
			case 1:
				 $("body").addClass("size-small");
				 setConfigParams("readFontSize","small");
				 break;
			case 2:
				$("body").addClass("size-medium");
				setConfigParams("readFontSize","medium");
				break;
			case 3:
				$("body").addClass("size-large");
				setConfigParams("readFontSize","large");
				break;
			case 4:
				$("body").addClass("size-b-large");
				setConfigParams("readFontSize","b-large");
				break;
			default:
				alert("错误，重新选择")
		}
		

		
	}




	<!--********离线缓存*********************************************--->





//阅读模式缓存写入
	
//	var read_mode_json; 
//	var read_str;
//
//function readModeIn(readMode,readFontSize){
//
//		try{
//			read_mode_json = {read_mode:readMode,read_font_size:readFontSize};
//			read_str = JSON.stringify(read_mode_json); 
//			//存入
//			localStorage.readmode = read_str;
//			//写出
//			read_mode_json_id = JSON.parse(read_str);
//			alert(read_str)
//		
//		}catch(err){
//			alert(err);
//		}
//}

