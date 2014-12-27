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
		},
		send:{
			1:"未上传简历",
			2:"邮件发送失败",
			3:"重复申请",
			254:"参数缺失"
		}
	}
	this.isLogin = false;
}
Haitoubang.prototype.showMask=function(){
	$("#haitou-GZSBUCK .haitou-background").show();
}
Haitoubang.prototype.hideMask=function(){
	$("#haitou-GZSBUCK .haitou-background").hide();
}
Haitoubang.prototype.get = function(key) {
    return localStorage[key];
}
Haitoubang.prototype.set = function(key, val) {
    localStorage[key] = val;
}
Haitoubang.prototype.parseConfigXML = function(doc) {
    if (!doc) return;
    var m = doc.getElementsByTagName("matched")[0];
    var mre = m.lastChild.nodeValue;
    if (mre) this.set('haitou_mre_txt', mre);
}
Haitoubang.prototype.validateEmail=function(email){
	if (email.length == 0) return false;
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
    return re.test(email);
}
Haitoubang.prototype.init=function(){
	var _this=this;
//	if(_this.getEmailAddr() && _this.getEmailAddr().length>0){
//		chrome.extension.sendRequest(
//		    {type: "show-haitou", url: location.href},
//		    function(response) {
//		        if (response.isshow) {
//				    var $BtnWrap=$("<div id='haitou-GZSBUCK' class='haitoubang'></div>").appendTo("body");
//				    var btnHtml="<div class='haitou-placeholder'></div><div class='haitou-sendtool text-center'><a class='btn btn-primary btn-lg' id='sendBtn'> 投 简 历 </div></div>";
//				    $BtnWrap.append(btnHtml);
//					_this.getLoginStatus(function(){
//						_this.bindEvent();
//					});
//				} 
//		    }
//		);
//	}
var $BtnWrap=$("<div id='haitou-GZSBUCK' class='haitoubang'></div>").appendTo("body");
				    var btnHtml="<div class='haitou-placeholder'></div><div class='haitou-sendtool text-center'><a class='btn btn-primary btn-lg' id='sendBtn'> 投 简 历 </div></div>";
				    $BtnWrap.append(btnHtml);
					_this.getLoginStatus(function(){
						_this.bindEvent();
					});
}
Haitoubang.prototype.htmlTpl={
	accountHtml:	"<div class='haitoubang haitou-login-box register'><h3>注册</h3>"
			+	"<div class='form-group'><div class='input-group'>"
            +   "	<span class='input-group-addon'><i class='fa fa-user'></i></span>"
            +   "    <input class='form-control' name='email'type='text' placeholder='输入邮箱' >"
            +   "</div></div>"
            +	"<div class='form-group'>"
            +   "     <div class='input-group'>"
            +   "         <span class='input-group-addon fs_17'><i class='fa fa-lock'></i></span>"
            +   "         <input class='form-control' name='passwd' type='password' placeholder='输入密码（6-16位）' >"
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
//	var text=$("body").html(),reg=/[\w\.\+-]+@[\w\.\+-]+/g;
//	return text.match(reg);
	return ['530561526@qq.com']
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
			var fileHtml="<div class='pull-left'><span id='resume-filename' class='pull-left' style='padding-right:10px'></span><div class='pull-left haitou-upload'><a href='javascript:;'>上传简历</a></div></div>";
			if(res.msg.file_name){
				fileHtml="<div class='pull-left'><span id='resume-filename' class='pull-left' style='padding-right:10px'>"+res.msg.file_name+"</span><div class='pull-left haitou-upload'><a href='javascript:;'>更换简历</a></div><a href='javascript:;' class='pull-left haitou-download'>下载简历</a></div>";
			}
			html+="<div class='haitoubang haitou-send-box'><h3 class='clearfix'><span class='pull-left'>投递简历</span><a class='pull-right haitou-logout' href='javascript:;'>退出登录</a></h3>"
				+	"<p>投递邮箱：</p<a href='javascript:;'></a>"
				+	"<select name='mail_addr' class='form-control'>"
				+	optionHtml
				+	"</select><p>标题：</p>"
				+	"<input name='mail_subject' class='form-control' type='text' value='"+res.msg.mail_subject+"'></input>"
				+	"<p>正文：</p>"
				+	"<textarea name='mail_body' class='form-control'>"+res.msg.mail_body+"</textarea >"
				+	"<div style='margin:-5px 0 10px 0' class='clearfix'><span class='pull-left'>附件简历：</span>"+fileHtml+"</div>"
				+	"<p class='hide haitou-upload-tip haitou-red-text'>请上传小于2m的简历</p>"
				+	"<div class='haitou-upload-progress'><div class='haitou-upload-loaded'></div></div>"
				+	"<p class='text-danger hide'></p><button class='btn btn-success btn-lg btn-block' type='button'> 投 递 </button>"
				+"</div>";
			$("#haitou-GZSBUCK #haitou-send-resume").removeAttr("style").html(html);
			_this.dialog._position(window,400);
			_this.upload($("#haitou-GZSBUCK .haitou-upload"));
			$("#haitou-GZSBUCK .haitou-upload").hover(function() {
				$(".haitou-upload-tip").removeClass('hide');
			}, function() {
				$(".haitou-upload-tip").addClass('hide');
			});
		}
	});
}
Haitoubang.prototype.bindEvent=function(){
	var _this=this;
	$("#sendBtn").click(function(){
		if(_this.isLogin){
			_this.dialog=new Dialog({
				width:400,
				content:"<div id='haitou-send-resume' style='line-height: 150px;text-align: center'>加载中。。。</div>"
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
				type='forgot',
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
					successCallback=_this.signCallback,
					type='signin',
					errorMsg="登陆失败，请重试！";
			}
			if($objParent.hasClass("register")){
				var url='/api/accounts/signup',
					successCallback=_this.signCallback,
					type='register',
					errorMsg="注册失败，请重试！";
			}
			post_data.passwd=$.md5(post_data.passwd)
		}
		_this.showMask()
		$.ajax({
			type:"post",
			url: _this.HAITOU_API_URL+url,
			async:true,
			data:JSON.stringify(post_data),
			success:function(res){successCallback.call(_this,res,post_data,type)},
			error:function(){alert(errorMsg)}
		}).complete(function(){_this.hideMask()});
		return false;
	});
	$("#haitou-GZSBUCK").on("click",".haitou-send-box button",function(){
		var $parentObj=$(this).parents(".haitou-send-box "), errorMSG=[];;
		$parentObj.find(".text-danger").addClass("hide");
		var post_data={
			url:location.href,
			job_title:document.title||location.href,
//			mail_addr:$parentObj.find("select").val(),
			mail_addr:'530561526@qq.com',
			mail_subject:$parentObj.find("input[name='mail_subject']").val(),
			mail_body:$parentObj.find("textarea[name='mail_body']").val()
		}
		if(!post_data.mail_addr){errorMSG.push("邮箱不能为空！");}
		if(!post_data.mail_subject){errorMSG.push("邮件标题不能为空！");}
		if(!post_data.mail_body){errorMSG.push("正文不能为空！");}
		if(errorMSG && errorMSG.length>0){
			return $objParent.find(".text-danger").html(errorMSG[0]).removeClass("hide");
		}
		_this.showMask();
		$.ajax({
			type:"post",
			url: _this.HAITOU_API_URL+"/api/apply/send",
			async:true,
			data:JSON.stringify(post_data),
			success:function(res){
				_this.sendCallback(res)
			},
			error:function(){alert(errorMsg)}
		}).complete(function(){_this.hideMask();});
		return false;
	});
	$("#haitou-GZSBUCK").on("click",".haitou-download",function(){
		$.ajax({
			type:"post",
			url: _this.HAITOU_API_URL+'/api/attachment/download',
			success:function(res_down){
				res_down = typeof res_down === 'string' ? $.parseJSON(res_down) : res_down;
				if(res_down && res_down.res_code===0){
					window.open(res_down.msg.url); 
				}else{
					alert("下载请求失败，请重试！")
				}
			},
			error:function(){alert("下载请求失败，请重试！")}
		});
		return false;
	});
	$("#haitou-GZSBUCK").on("click",".haitou-logout",function(){
		$.ajax({
			type:"post",
			url: _this.HAITOU_API_URL+'/api/accounts/signout',
			success:function(res_down){
				localStorage.removeItem('haitou-user');
				_this.isLogin = false;
				_this.dialog.close();
				$("#haitou-GZSBUCK #sendBtn").click();
			},
			error:function(){alert("退出失败，请重试！")}
		});
		return false;
	});
}
Haitoubang.prototype.sendCallback=function(res){
	var _this=this,res=JSON.parse(res),$obj=$("#haitou-GZSBUCK").find("#haitou-send-resume")
	if(res && res.res_code === 0){
		$obj.html("<div class='send-success'><p><a href='"+this.HAITOU_API_URL+"/list' class='text-danger' target='_blank'>查看投递记录</a></p><p class='text-success'>投递成功!</p></div>");
	}else{
		$obj.find(".text-danger").html(_this.HAITOU_ERR_MSG.send[res.res_code]||"投递失败，请重试！").removeClass('hide');
	}
}
Haitoubang.prototype.forgotCallback=function(res){
	var  _this=this,res=JSON.parse(res),$obj=$(".haitou-login-box.forgot");
	if(res && res.res_code === 0){
		$obj.find(".form-group").html("<p class='text-danger'>重置密码链接已发至邮箱，请查收!</p>")
		$obj.find("button").hide();
	}else{
		$obj.find(".text-danger").html(_this.HAITOU_ERR_MSG.forgot[res.res_code]||"重置密码出错，请重试！").removeClass('hide');
	}
}
Haitoubang.prototype.signCallback=function(res,post_data,type){
	var  _this=this;
	res = typeof res === 'string' ? $.parseJSON(res) : res;
	if(res && res.res_code==0){
		if(post_data.passwd){
			this.set('haitou-user', JSON.stringify(post_data));
		}
		_this.dialog.close();
		_this.dialog=new Dialog({
			width:400,
			content:"<div id='haitou-send-resume' style='line-height: 150px;text-align: center'>加载中。。。</div>"
		});
		_this.sendHtml();
	}else{
		if(type=='register'){
			$(".haitou-login-box.register").find(".text-danger").html(_this.HAITOU_ERR_MSG.signup[res.res_code]||"注册失败").removeClass("hide");
		}
		if(type=='signin'){
			$(".haitou-login-box.signin").find(".text-danger").html(_this.HAITOU_ERR_MSG.signin[res.res_code]||"登录失败").removeClass("hide");
		}
	}
}
Haitoubang.prototype.upload=function($domObj,options){
	var _this=this;
	var defaults={
		uploadUrl: "http://upload.qiniu.com",
		callback:""
	};
	var options = $.extend(defaults, options);
	var html = '<div class="uploadWidget"><input class="uploadFile" type="file" name="attachment" />' + '<div class="uploadProgress"><div class="text"></div><div class="preview"></div></div>' + '</div>';
	$domObj.append(html);
	var $progress = $domObj.find(".uploadProgress");
    var $preview = $progress.find(".preview");
	$domObj.off("change");
	$domObj.on("change", ".uploadFile",
    	function() {
    		var _this_input=this;
    		var upload_file = $domObj.find('input[name="attachment"]')[0].files[0];
          	if (upload_file.size > 2 * 1024 * 1024){
				_this_input.value = "";
				return alert("请上传小于2m的附件！");
          	}
			$.ajax({
				type: "post",
				url: _this.HAITOU_API_URL+"/api/attachment/token",
				data:JSON.stringify({"file_name":upload_file.name})
			}).success(function(res_token) {
				res_token = typeof res_token === 'string' ? $.parseJSON(res_token) : res_token;
				if (res_token && res_token.res_code==0) {
					$preview.hide();
			        $progress.show();
			        var fd = new FormData();
			        fd.append("token", res_token.msg.token);
			        fd.append("key", res_token.msg.key);
		            fd.append("file", $domObj.find('input[name="attachment"]')[0].files[0]);
		            var xhr = new XMLHttpRequest();
		            xhr.upload.addEventListener("progress", uploadProgress, false);
		            xhr.addEventListener("load", uploadComplete, false);
		            xhr.addEventListener("error", uploadFailed, false);
		            xhr.addEventListener("abort", uploadCanceled, false);
		            xhr.open("POST", defaults.uploadUrl);
		            xhr.send(fd);
				} else {
					_this_input.value = "";
					return alert("上传失败！");
				}
			}).error(function() {
				_this_input.value = "";
				return alert("上传失败！");
			});
   	 	}
    );
    var uploadProgress=function(evt){
    	if (evt.lengthComputable) {
            var percentComplete = Math.round(evt.loaded * 100 / evt.total);
            $("#haitou-GZSBUCK .haitou-upload-progress").show().find(".haitou-upload-loaded").css({"width":percentComplete.toString() + '%'});
        }
    };
    var uploadComplete=function(evt){
    	var upload_res = evt.target.responseText;
    	upload_res = typeof upload_res === 'string' ? $.parseJSON(upload_res) : upload_res;
		$("#haitou-GZSBUCK #resume-filename").html(upload_res.msg.file_name);
		$preview.show();
        $progress.hide();
        $("#haitou-GZSBUCK .haitou-upload-progress").hide();
    };
    var uploadFailed=function(evt){
    	 $preview.html("<span class='text-drang'>上传失败！</span>");
        $("#haitou-GZSBUCK .haitou-upload-progress").hide();
    };
    var uploadCanceled = function(){
		$preview.show();
        $progress.hide();
        $("#haitou-GZSBUCK .haitou-upload-progress").hide();
    	alert("取消上传");
    };
}
var haitoubang=new Haitoubang;
haitoubang.init();
