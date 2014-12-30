function AbsCtrl(name){
    this.name = name;
    this.get = {};
    this.post = {};
};

var util = require('util');
AbsCtrl.prototype.handler_path = function(h_name){
    return util.format('/%s/%s', this.name, h_name);
};


module.exports = AbsCtrl;
