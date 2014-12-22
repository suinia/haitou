(function(){
	var haitou_bg={};
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		if (request == "get-cookie"){
			chrome.cookies.get( {
			url: 'http://haitoubang.sinaapp.com', 
			name: 'user_id' }, 
			  	function( cookie ){
			  		sendResponse(cookie)
			  	})
		}
	});
})()


