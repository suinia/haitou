function isCheckUrl(){
	return true;
}
if(isCheckUrl()){
    var $BtnWrap=$("<div id='haitou-GZSBUCK' class='haitoubang'></div>").appendTo("body");
    var btnHtml="<div class='haitou-sendtool text-center'><a class='btn btn-primary btn-lg' id='sendBtn'> 投 简 历 </div></div>";
    $BtnWrap.append(btnHtml);
}

var haitou={
	signHtml:	"<div class='haitoubang haitou-login-box signin'><h3>登录</h3>"
			+	"<div class='form-group'><div class='input-group'>"
            +   "	<span class='input-group-addon'><i class='fa fa-user'></i></span>"
            +   "    <input class='form-control' type='text' placeholder='输入用户名/邮箱' name='login_name' required=''>"
            +   "</div></div>"
            +	"<div class='form-group'>"
            +   "     <div class='input-group'>"
            +   "         <span class='input-group-addon fs_17'><i class='fa fa-lock'></i></span>"
            +   "         <input class='form-control' type='password' placeholder='输入密码' name='login_password' required='' >"
            +   "     </div>"
            +   "</div>"
            +	"<div class='form-group'>"
            +   "   <button class='btn btn-success btn-lg btn-block' type='button'> 登 录</button>"
            +   "</div>"
            +	"<p class='clearfix'><a href='javascript:;' id='regLinke' class='pull-left'>没有帐号？去注册</a><a href='javascript:;' class='pull-right'>忘记密码？</a></p>"
            +	"</div>"
    		+	"<div class='haitoubang haitou-login-box register'><h3>注册</h3>"
			+	"<div class='form-group'><div class='input-group'>"
            +   "	<span class='input-group-addon'><i class='fa fa-user'></i></span>"
            +   "    <input class='form-control' type='text' placeholder='输入用户名/邮箱' name='login_name' required=''>"
            +   "</div></div>"
            +	"<div class='form-group'>"
            +   "     <div class='input-group'>"
            +   "         <span class='input-group-addon fs_17'><i class='fa fa-lock'></i></span>"
            +   "         <input class='form-control' type='password' placeholder='输入密码' name='login_password' required='' >"
            +   "     </div>"
            +   "</div>"
            +	"<div class='form-group'>"
            +   "   <button class='btn btn-success btn-lg btn-block' type='button'> 登 录</button>"
            +   "</div>"
            +	"<p class='clearfix'><a href='javascript:;' id='regLink' class='pull-left'>没有帐号？去注册</a><a href='javascript:;' class='pull-right'>忘记密码？</a></p>"
            +	"</div>"
}
$("#sendBtn").click(function(){
	var dialog=new Dialog({
		width:350,
		content:haitou.signHtml
	});
	$(".haitou-login-box").hide();
	$(".haitou-login-box.signin").show();
	dialog._position(window,350);
	$(".haitou-login-box #regLinke").click(function(){
		$(".haitou-login-box").hide();
		$(".haitou-login-box.register").show();
	});
});
