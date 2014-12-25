var HAITOU_URL="http://haitoubang.sinaapp.com";
(function(){
	chrome.extension.sendRequest('get-cookie', function( cookie ){
		if(cookie && cookie !=""){
				getApplyList();
   	 	}else{
   	 		var haitou_user = window.localStorage.getItem('haitou-user')||"";
   	 		if(haitou_user && haitou_user!=""){
   	 			haitou_user = typeof haitou_user === 'string' ? $.parseJSON(haitou_user) : haitou_user;
   	 			var post_data={
   	 				email:haitou_user.email,
   	 				password:haitou_user.password,
   	 			}
   	 			$.ajax({
					type:"post",
					url:HAITOU_URL+'/api/accounts/signin',
					async:true,
					data:JSON.stringify(post_data)
				}).success(function(res){
					res = typeof res === 'string' ? $.parseJSON(res) : res;
					if(res && res.res_code===0){
						return getApplyList();
					}else{return getsiteList();}
				}).error(function(){getsiteList();})
   	 		}else{
				getsiteList();
   	 		}
   	 	}
	})
})();
function getApplyList(){
	$.ajax({
		type:"POST",
		url:HAITOU_URL+'/api/apply/list',
		data:JSON.stringify({'offset':'0','limit':'10'})
	}).success(function(res){
		res = typeof res === 'string' ? $.parseJSON(res) : res;
		if(res && res.res_code===0){
			if(res.msg && res.msg.length>0){
				return renderApplyList(res.msg);
			}
		}
		getsiteList();
	});
}
function renderApplyList(){
	
}
function getsiteList(){
	alert(2)
}
