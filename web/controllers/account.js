var AbsCtrl = require('./abs_ctrl');
var exp = new AbsCtrl('account');

exp.get.signin=function(req, res, next){
	return res.render('account/signin', {});
}

exp.get.signup=function(req, res, next){
	return res.render('account/signup', {});
}

exp.get.forgot=function(req, res, next){
	return res.render('account/forgot', {});
}

module.exports = exp;