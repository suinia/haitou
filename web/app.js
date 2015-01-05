var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var urlrouter = require('urlrouter');
var  _ = require('underscore');

var _load_ctrls = function(app){
    var jsdir = './controllers';
    require("fs").readdirSync(jsdir).forEach(function(file) {
        if(path.extname(file) != '.js'){ return ;}
        var x = require(jsdir + '/' + file);
        if (!x.get && !x.post) { return; };
        _set_url(app, 'get', x);
        _set_url(app, 'post', x);
    });
	app.get('/', require('./controllers/index').get.index);
	app.get('/feedback', require('./controllers/index').get.feedback);
	app.get('/help', require('./controllers/index').get.help);
	app.get('/apply/list/:id', require('./controllers/index').get.list);
	
};
var _set_url = function(app, verb, ctrl){
    if(!ctrl[verb]){ return; }
    _.each(ctrl[verb], function(handler, key){
        var x_path = ctrl.handler_path(key);
        var real_h = handler;
        if (handler.decs && handler.decs.length > 0) {
            _.each(handler.decs, function(decorator){
                real_h = decorator(real_h);
            });
        }
        app[verb](x_path, real_h);
    });
};


var startApp=function(){

	var app = express();
	
	// view engine setup
	app.set('views', path.join(__dirname, 'html'));
	app.engine('.html', require('ejs').__express);
	app.set('view engine', 'html');
	
	// uncomment after placing your favicon in /public
	//app.use(favicon(__dirname + '/public/favicon.ico'));
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.static('html'));
	
//	app.use('/', routes);
//	app.use('/users', users);

	app.use(urlrouter(_load_ctrls));
	
	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
	    var err = new Error('Not Found');
	    err.status = 404;
	    next(err);
	});
	
	// error handlers
	
	// development error handler
	// will print stacktrace
	if (app.get('env') === 'development') {
	    app.use(function(err, req, res, next) {
	        res.status(err.status || 500);
	        res.render('error', {
	            message: err.message,
	            error: err
	        });
	    });
	}
	
	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
	    res.status(err.status || 500);
	    res.render('error', {
	        message: err.message,
	        error: {}
	    });
	});
	
 	app.listen(3333, function(){
	    console.log('server started`pid=' + process.pid);
	});
}

module.exports =startApp();

