var AbsCtrl = require('./abs_ctrl');
var exp = new AbsCtrl('apply');

exp.get.index=function(req, res, next){
	return res.render('index', {});
}

exp.get.signin=function(req, res, next){
	return res.render('signin', {});
}

exp.get.signup=function(req, res, next){
	return res.render('signup', {});
}

exp.get.forgot=function(req, res, next){
	return res.render('forgot', {});
}

exp.get.list=function(req, res, next){
	return res.render('apply/list', {});
}
exp.get.feedback=function(req, res, next){
	return res.render('feedback', {});
}

module.exports = exp;