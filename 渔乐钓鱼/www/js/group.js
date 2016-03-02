mui('.title').on('tap', 'a', function(e) {
	 
	var targetTab = this.getAttribute('href');
	var titletab = this.querySelector('h5').innerHTML;
	
 
	if(targetTab=="#"){return;}

	mui.fire(index,'gotaburl',{targetsub:targetTab,titlesub:titletab});
	
	//close();  
}); 