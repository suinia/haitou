function Haitoubang(){}
Haitoubang.prototype.getUserInfo=function(){
	
}
Haitoubang.prototype.validateEmail=function(email){
	if (email.length == 0) return false;
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
    return re.test(email);
}

var haitoubang =new Haitoubang();
