var AbsCtrl = require('./abs_ctrl');
var exp = new AbsCtrl('apply');

exp.get.index=function(req, res, next){
	return res.render('index', {});
}

exp.get.list=function(req, res, next){
	return res.render('apply/list', {});
}

module.exports = exp;