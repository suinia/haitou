//chrome.extension.sendRequest('get-cookie', {
//		url: 'http://haitoubang.sinaapp.com', 
//	name: 'user_id' }, function( cookie ){ 
//  	alert( cookie ); 
//});
function Haitoubang(){
	this.HAITOU_API_URL="http://haitoubang.sinaapp.com";
	this.HAITOU_ERR_MSG={
		signup:{
			1:"邮箱已被注册",
			2:"邮箱格式不合法",
			245:"参数缺失"
		},
		signin:{
			1:"邮箱不存在",
			2:"密码不正确",
			245:"参数缺失"
		},
		forgot:{
			1:"邮箱不存在",
			2:"邮件发送失败",
			245:"参数缺失"
		},
		rest:{
			1:"两次输入的密码不一致",
			2:"密钥不存在",
			3:"密钥已过期",
			245:"参数缺失"
		}
	}
	this.isLogin = false;
}
Haitoubang.prototype.validateEmail=function(email){
	if (email.length == 0) return false;
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
    return re.test(email);
}
Haitoubang.prototype.isCheckUrl=function(email){
	return true;
}
Haitoubang.prototype.init=function(){
	var _this=this;
	if(this.isCheckUrl()){
	    var $BtnWrap=$("<div id='haitou-GZSBUCK' class='haitoubang'></div>").appendTo("body");
	    var btnHtml="<div class='haitou-placeholder'></div><div class='haitou-sendtool text-center'><a class='btn btn-primary btn-lg' id='sendBtn'> 投 简 历 </div></div>";
	    $BtnWrap.append(btnHtml);
	}
	this.getLoginStatus(function(){
		_this.bindEvent();
	});
}
Haitoubang.prototype.htmlTpl={
	accountHtml:	"<div class='haitoubang haitou-login-box register'><h3>注册</h3>"
			+	"<div class='form-group'><div class='input-group'>"
            +   "	<span class='input-group-addon'><i class='fa fa-user'></i></span>"
            +   "    <input class='form-control' type='text' placeholder='输入邮箱' >"
            +   "</div></div>"
            +	"<div class='form-group'>"
            +   "     <div class='input-group'>"
            +   "         <span class='input-group-addon fs_17'><i class='fa fa-lock'></i></span>"
            +   "         <input class='form-control' type='password' placeholder='输入密码（6-16位）' >"
            +   "     </div>"
            +   "</div><p class='text-danger hide'></p>"
            +	"<div class='form-group'>"
            +   "   <button class='btn btn-success btn-lg btn-block' type='button'> 注 册 </button>"
            +   "</div>"
            +	"<p class='clearfix'><a href='javascript:;' class='pull-left signin-link'>已有账号？去登陆</a><a href='javascript:;' class='pull-right forgot-link'>忘记密码？</a></p>"
            +	"</div>"
    		+	"<div class='haitoubang haitou-login-box signin'><h3>登录</h3>"
			+	"<div class='form-group'><div class='input-group'>"
            +   "	<span class='input-group-addon'><i class='fa fa-user'></i></span>"
            +   "    <input class='form-control' type='text' placeholder='输入邮箱' name='email'>"
            +   "</div></div>"
            +	"<div class='form-group'>"
            +   "     <div class='input-group'>"
            +   "         <span class='input-group-addon fs_17'><i class='fa fa-lock'></i></span>"
            +   "         <input class='form-control' type='password' placeholder='输入密码（6-16位）' name='passwd'>"
            +   "     </div>"
            +   "</div><p class='text-danger hide'></p>"
            +	"<div class='form-group'>"
            +   "   <button class='btn btn-success btn-lg btn-block' type='button'> 登 录 </button>"
            +   "</div>"
            +	"<p class='clearfix'><a href='javascript:;' class='pull-left reg-link'>没有帐号？去注册</a><a href='javascript:;' class='pull-right forgot-link'>忘记密码？</a></p>"
            +	"</div>"
            +	"<div class='haitoubang haitou-login-box forgot'><h3>重置密码</h3>"
            +	"<div class='form-group'>"
            +   "         <input class='form-control' type='text' placeholder='输入邮箱地址' name='email'>"
            +   "</div><p class='text-danger hide'></p>"
            +	"<p class='clearfix'><a href='javascript:;' class='pull-left signin-link'>返回登录</a><button class='btn btn-success pull-right' type='button'> 重置密码 </button></p>"
            +	"</div>"
}
Haitoubang.prototype.getLoginStatus=function(callback){
	var _this=this;
	chrome.extension.sendRequest('get-cookie', function( cookie ){ 
	    	if(cookie && cookie !=""){
				_this.isLogin = true;
				callback();
				return 
	   	 	}else{
	   	 		var haitou_user = window.localStorage.getItem('haitou-user')||"";
	   	 		if(haitou_user && haitou_user!=""){
	   	 			haitou_user = JSON.parse(haitou_user)
	   	 			var post_data={
	   	 				email:haitou_user.email,
	   	 				password:haitou_user.password,
	   	 			}
	   	 			$.ajax({
						type:"post",
						url:_this.HAITOU_API_URL+'/api/accounts/signin',
						async:true,
						data:JSON.stringify(post_data)
					}).success(function(res){
						var res=JSON.parse(res);
						if(res && res.res_code===0){
							_this.isLogin = true;
						}
					}).complete(function(){callback();})
	   	 		}else{
					callback();
					return 
	   	 		}
	   	 	}
	});
}
Haitoubang.prototype.getEmailAddr=function(){
	var text=$("body").html(),reg=/[\w\.\+-]+@[\w\.\+-]+/g;
	return text.match(reg);
}
Haitoubang.prototype.sendHtml=function(){
	var _this=this, html="",email=this.getEmailAddr(),optionHtml="";
	for(var i=0;i<email.length;i++){
		optionHtml+="<option value='"+email[i]+"'>"+email[i]+"</option>"
	}
	$.ajax({
		type:"post",
		url:_this.HAITOU_API_URL+"/api/apply/default",
	}).success(function(res){
		var res=res?JSON.parse(res):'';
		if(res && res.res_code ===0){
			var fileHtml="<div class='pull-left'><span id='resume-filename' style='padding-right:10px'></span>><div class='pull-left haitou-upload'><a href='javascript:;'>上传简历</a></div></div>";
			if(res.msg.file_name){
				fileHtml="<div class='pull-left'><span id='resume-filename' class='pull-left' style='padding-right:10px'>"+res.msg.file_name+"</span><div class='pull-left haitou-upload'><a href='javascript:;'>更换简历</a></div><a href='javascript:;' class='pull-left'>下载简历</a></div>";
			}
			html+="<div class='haitoubang haitou-send-box'><h3>投递简历</h3>"
				+	"<p>投递邮箱：</p<a href='javascript:;'></a>"
				+	"<select name='mail_addr' class='form-control'>"
				+	optionHtml
				+	"</select><p>标题：</p>"
				+	"<input name='mail_subject' class='form-control' type='text' value='"+res.msg.mail_subject+"'></input>"
				+	"<p>正文：</p>"
				+	"<textarea name='mail_body' class='form-control'>"+res.msg.mail_body+"</textarea >"
				+	"<div style='margin:-5px 0 10px 0' class='clearfix'><span class='pull-left'>附件简历：</span>"+fileHtml+"</div>"
				+	"<button class='btn btn-success btn-lg btn-block' type='button'> 投 递 </button>"
				+"</div>";
			$("#haitou-GZSBUCK #send-resume").removeAttr("style").html(html);
			_this.dialog._position(window,400);
			$("#haitou-GZSBUCK .haitou-upload").upload({
				uploadUrl:_this.HAITOU_API_URL+"/api/attachment/upload",
				callback:function(upload_res,$dom){
					$("#haitou-GZSBUCK .resume-filename").html(upload_res.msg.file_name);
					$dom.find(".uploadProgress").hide();
				}
			})
		}
	});
}
Haitoubang.prototype.bindEvent=function(){
	var _this=this;
	$("#sendBtn").click(function(){
		if(_this.isLogin){
			_this.dialog=new Dialog({
				width:400,
				content:"<div id='send-resume' style='line-height: 150px;text-align: center'>加载中。。。</div>"
			});
			_this.sendHtml();
		}else{
			_this.dialog=new Dialog({
				width:350,
				content:_this.htmlTpl.accountHtml
			});
			$(".haitou-login-box").hide();
			$(".haitou-login-box.register").show();
			_this.dialog._position(window,350);
		}
	});
	$("#haitou-GZSBUCK").on("click",".haitou-login-box a",function(){
		$(".haitou-login-box").hide();
		if($(this).hasClass("signin-link")){
			$(".haitou-login-box.signin").show();
		}
		if($(this).hasClass("reg-link")){
			$(".haitou-login-box.register").show();
		}
		if($(this).hasClass("forgot-link")){
			$(".haitou-login-box.forgot").show();
		}
	});
	$("#haitou-GZSBUCK").on("click",".haitou-login-box button",function(){
		var $objParent=$(this).parents(".haitou-login-box");
		if($objParent.hasClass("forgot")){
			var post_data={
				email:$objParent.find("input[name='email']").val()
			}
			$objParent.find("input").parents(".input-group").removeClass("has-error");
			$objParent.find(".text-danger").addClass("hide");
			var errorMSG=[];
			if(!post_data.email || !_this.validateEmail(post_data.email)){
				$objParent.find("input[name='email']").parents(".input-group").addClass("has-error");
				errorMSG.push("邮箱格式错误！");
			}
			if(errorMSG && errorMSG.length>0){
				return $objParent.find(".text-danger").html(errorMSG[0]).removeClass("hide");
			}
			var url='/api/accounts/forgotpasswd',
				successCallback=_this.forgotCallback,
				errorMsg="请求失败，请重试！";
		}else{
			var post_data={
				email:$objParent.find("input[name='email']").val(),
				passwd:$objParent.find("input[name='passwd']").val()
			}
			$objParent.find("input").parents(".input-group").removeClass("has-error");
			$objParent.find(".text-danger").addClass("hide");
			var errorMSG=[];
			if(!post_data.email || !_this.validateEmail(post_data.email)){
				$objParent.find("input[name='email']").parents(".input-group").addClass("has-error");
				errorMSG.push("邮箱格式错误！");
				
			}
			if(!post_data.passwd||post_data.passwd.length<6||post_data.passwd>16){
				$objParent.find("input[name='passwd']").parents(".input-group").addClass("has-error");
				errorMSG.push("密码格式错误！");
			}
			if(errorMSG && errorMSG.length>0){
				return $objParent.find(".text-danger").html(errorMSG[0]).removeClass("hide");
			}
			if($objParent.hasClass("signin")){
				var url='/api/accounts/signin',
					successCallback=_this.signinCallback,
					errorMsg="登陆失败，请重试！";
			}
			if($objParent.hasClass("register")){
				var url='/api/accounts/signup',
					successCallback=_this.signupCallback,
					errorMsg="注册失败，请重试！";
			}
			post_data.passwd=$.md5(post_data.passwd)
		}
		$.ajax({
			type:"post",
			url: _this.HAITOU_API_URL+url,
			async:true,
			data:JSON.stringify(post_data),
			success:function(res){successCallback.call(_this,res)},
			error:function(){alert(errorMsg)}
		});
		return false;
	});
	$("#haitou-GZSBUCK").on("click",".haitou-send-box button",function(){
		var $parentObj=$(this).parents(".haitou-send-box ");
		var post_data={
			url:location.href,
			job_title:document.title,
			mail_addr:$parentObj.find("select").val(),
			mail_subject:$parentObj.find("input[name='mail_subject']").val(),
			mail_body:$parentObj.find("textarea[name='mail_body']").val()
		}
		$.ajax({
			type:"post",
			url: _this.HAITOU_API_URL+"/api/apply/send",
			async:true,
			data:JSON.stringify(post_data),
			success:function(res){successCallback.call(_this,res)},
			error:function(){alert(errorMsg)}
		});
		return false;
	});
}
Haitoubang.prototype.forgotCallback=function(res){
	var  _this=this,res=JSON.parse(res),$obj=$(".haitou-login-box.forgot");
	if(res && res.res_code === 0){
		$obj.find(".form-group").html("<p class='text-danger'>重置密码链接已发至邮箱，请查收!</p>")
		$obj.find("button").hide();
	}else{
		$obj.find(".text-danger").html(_this.HAITOU_ERR_MSG.forgot[res.res_code]||"重置密码出错，请重试！")
	}
}
Haitoubang.prototype.signupCallback=function(res){
	var _this=this,res=JSON.parse(res);
	var post_data={
		"offset":"1",
		"limit":"10"
	}
	if(res && res.res_code === 0){
		$.ajax({
			type:"POST",
			url:_this.HAITOU_API_URL+"/api/apply/list",
			data:JSON.stringify(post_data)
		}).success(function(data){
			console.dir(data);
		});
	}
}
Haitoubang.prototype.signinCallback=function(res){
	var  _this=this,res=JSON.parse(res);
	var post_data={
		"offset":"1",
		"limit":"10"
	}
	if(res && res.res_code === 0){
		$.ajax({
			type:"POST",
			url:_this.HAITOU_API_URL+"/api/apply/list",
			data:JSON.stringify(post_data)
		}).success(function(data){
			console.dir(data);
		});
	}
}
var haitoubang=new Haitoubang;
haitoubang.init();
