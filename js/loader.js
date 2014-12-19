var HAITOU_API_URL="http://haitoubang.sinaapp.com";
var HAITOU_ERR_MSG={
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
			+	"<form id='signin_form' action='/api/accounts/signin' method='post'><div class='form-group'><div class='input-group'>"
            +   "	<span class='input-group-addon'><i class='fa fa-user'></i></span>"
            +   "    <input class='form-control' type='text' placeholder='输入邮箱' pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$' name='email' required=''>"
            +   "</div></div>"
            +	"<div class='form-group'>"
            +   "     <div class='input-group'>"
            +   "         <span class='input-group-addon fs_17'><i class='fa fa-lock'></i></span>"
            +   "         <input class='form-control' type='password' placeholder='输入密码（6-16位）' name='passwd' required pattern='^[0-9a-zA-Z]{6,10}$'>"
            +   "     </div>"
            +   "</div>"
            +	"<div class='form-group'>"
            +   "   <button class='btn btn-success btn-lg btn-block' type='submit'> 登 录</button>"
            +   "</div></form>"
            +	"<p class='clearfix'><a href='javascript:;' id='regLinke' class='pull-left'>没有帐号？去注册</a><a href='javascript:;' class='pull-right'>忘记密码？</a></p>"
            +	"</div>"
    		+	"<div class='haitoubang haitou-login-box register'><h3>注册</h3>"
			+	"<form id='reg_form' action='/api/accounts/signup' method='post'><div class='form-group'><div class='input-group'>"
            +   "	<span class='input-group-addon'><i class='fa fa-user'></i></span>"
            +   "    <input class='form-control' type='text' placeholder='输入邮箱' name='email' pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$' required=''>"
            +   "</div></div>"
            +	"<div class='form-group'>"
            +   "     <div class='input-group'>"
            +   "         <span class='input-group-addon fs_17'><i class='fa fa-lock'></i></span>"
            +   "         <input class='form-control' type='password' placeholder='输入密码（6-16位）' name='passwd' required pattern='^[0-9a-zA-Z]{6,10}$'>"
            +   "     </div>"
            +   "</div>"
            +	"<div class='form-group'>"
            +   "   <button class='btn btn-success btn-lg btn-block' type='submit'> 注 册</button>"
            +   "</div></form>"
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
	$('#signin_form').ajaxForm({
		success:signinCallback,
		url: HAITOU_API_URL+'/api/accounts/signin',
		clearForm: true,
    	resetForm: true 
	});
	$('#reg_form').ajaxForm({
		success:signupCallback,
		url: HAITOU_API_URL+'/api/accounts/signup',
		clearForm: true,
    	resetForm: true 
	});
});
function signupCallback(data){
	var para={"offset":0,"limit":10}
	if(data.res_code === 0){
		$.ajax({
			type:"POST",
			url:HAITOU_API_URL+"/api/apply/send",
			data:JSON.stringify(para)
		}).success(function(data){
			console.dir(data);
		});
	}
}
function signinCallback(res){
	var res=JSON.parse(res);
	var para={
"url": "http://www.yingjiesheng.com/job-001-969-615.html",
"job_title": "[广州]广州证券战略管理部招聘实习生",
"mail_addr": "suini_a@163.com",
"mail_subject": "浙江大学张小算申请广州证券战略管理部实习生",
"mail_body": "尊敬的HR经理：\n您好！\n我是...",
"file_name": "浙江大学张小算中文简历.pdf"
};
	if(res.res_code === 0){
		$.ajax({
			type:"POST",
			url:HAITOU_API_URL+"/api/apply/send",
			data:JSON.stringify(para)
		}).success(function(data){
			console.dir(data);
		});
	}
}
