var release = 1; // true, 1 为正式版本， false, 0 为测试版本, 2 开发版本

var C = {
	URL : "http://hd.hunteron.com",
	HO_URL : "http://www.hunteron.com",
	STATIC_URL : "http://static.hunterdrive.com",
	AUTH_URL: "http://auth.hunteron.com",
	HO_LASTDAY_NEWPOS_STORE: "hoLastdayNewPosStore",
	HO_LASTDAY_NEWPOS_TIMESTAMP: "hoLastdayNewPosStamp",
	STORE_USER : "hdUserStore",
	STORE_PRE_ACCOUNT : "preAccount",
	STORE_VERSION : "preversion",
	IS_LOGIN: false,
	TIMESTAMP : 86400000
};

!release && (function(){
	C.URL = "http://hdtest.hunteron.com";
	C.HO_URL = "http://test.hunteron.com";
	C.AUTH_URL = "http://authtest.hunteron.com";
})();

( release == 2 ) && (function(){
	C.URL = "http://dev.hunterdrive.com/hd";
	C.HO_URL = "http://dev.hunterdrive.com/ho";
	C.STATIC_URL = "http://dev.hunterdrive.com/static";
	C.AUTH_URL = "http://authtest.hunteron.com";
})();

C.HO_URL_LASTDAY_NEWPOS = C.HO_URL + "/newpositiondaily.json";

(function( window, $, undefined ){
	
var c = {};

//默认网站指向地址
//TODO 暂时指向HO
c.url = function( path, url ){
	var url_ = url || C.URL;
	return url_ + ( path || "" );
};

c.url.local = function( path ){
	return chrome.extension.getURL( path );
};

c.url.static = function( path ){
	return C.STATIC_URL + path || '';
};

c.url.auth = function( path ){
	return C.AUTH_URL + path || '';
};

c.protocol = function( url ){
    var _protocol = (("https:" == document.location.protocol) ? "https://" : "http://");
    return url?_protocol+url:_protocol;
};

//合成类选择器
c.selector = function( /** className1[,className2...] */ ){
	var arr = arguments;
	var sl = "";
	$.each( arr, function( i, o ){
		sl = sl + " " + o;
	});
	return sl;
};

//jQuery element
c.sl = function(){
	return $( c.selector.apply( this, arguments ) );
};

/**
 * 保留标签，按条件过滤处理
 */
c.sl.search = function( tag, fn ){
	var $sls = $( tag );
	var arr = [];
	$sls.each(function(){
		var me = this;
		var rst = fn( me );
		c.run( rst, function(argument) {
			arr[ arr.length ] = me;
		});
	});

	if( arr.length = 1 ){
		return $(arr[0]);
	}else{
		return arr;
	}
}

/**
 * equals 比较
 * c.equals (p1[, p2, p3...] )
 * 只要有一项为true, 则返回true
 */
c.equals = function( p1 ){
	var arr = arguments;
	for( var i = 1, j = arr.length; i < j; i++ ){
		if( arr[ i ] == arr[ 0 ] ){
			return true;
		}
	}

	return false;
}

//back cls
c.iconCls = function( sl ){
	return sl.replace(".","");
};

//类选择器返回类名字
c.clsName = function( /** String */ selector ){
	return selector.replace( ".", "" );
};

c.run = function( condition, fn1, fn2 ){
	if( condition ){
		return fn1();
	}
	
	if( fn2 ){
		return fn2();
	}
};

//获得当前域名
c.currentUrl = function(){
	return location.href;
};

//获得当前domain
c.domain = function(){
	var hostname = location.hostname;
	return hostname.replace( /^(.*?)\.(.*?)\..*/g, "$2");
};

//提醒
c.remind = function( sl, opts ){
	var config = $.extend({},{
		style: {
			classes: "qtip-green hdpp-remind"
		},
		position: {
			my: "center right",
			at: "center left"
		},
		hide: {
			leave: true
		}
	},opts);
	
	$( sl ).qtip( config );
};

c.remind.error = function( sl, opts ){
	var config = $.extend({},{
		show : {
			event : false,
			ready : true
		},
		overwrite : false,
		hide : false
	},opts);
	
	c.remind( sl, config );
}

//tip
c.tip = function( sl, opts ){
	var config = $.extend( true, {},{
		style: {
			classes: "qtip-light qtip-shadow hdpp-qtip hdpp-qtip-login",
			width: 250
		},
		position: {
			my: "center right",
			at: "center left",
			viewport: $( window )
		},
		show: {
			event: "mouseover"
		},
		hide: {
			event: 'unfocus'
		},
		events: {
			show: function( event, api ){
				api.elements.tooltip.css({"position":"fixed"});
			}
		}
	},opts);
	
	$( sl ).qtip( config );
};

c.tip.error = function( sl, errText ){
	$( sl ).qtip({
		content: errText,
		style: {
			classes: "ui-tooltip-plain"
		},
		show: {
			ready: true,
			solo: false
		},
		hide: {
			event: false
		},
		position: {
			my: "center right",
			at: "center left"
		}
	});
};

c.tip.destroy = function( sl ){
	var $sl = $(sl);
	c.run( $sl.length>1, function(){
		$sl.each(function(){
			$( this ).qtip( "destroy", true );
		});
	});
};

c.tip.hide = function( sl ){
	var $sl = $(sl);
	c.run( $sl.length>1, function(){
		$sl.each(function(){
			 $( this ).qtip("destroy", false );
		});
	});
};

/**
 * 时间控件
 */

//校验
;;c.validate = function( elForm, opts ){
	//首先去掉文本后面的空格
	var $input = $( elForm ).find("input[type=text]:visible");
	var re = /\s*$/gi;
	$.each( $input, function(){
		$(this).val( $(this).val().replace( re, "" ) );
	});
	
	opts.errorPlacement = function( error, element ){
		var $el = $(element);
		if ( !error.is(':empty') ) {
			c.remind.error( $el.filter(':not(.valid)'), { content: error } );
		} else {
			$el.qtip('destroy');
		}
	};
	
	opts.success = $.noop;
	
	opts.unhighlight = function( element, errorClass, validClass) {
		$( element ).qtip("destroy");
	};
	
	$( elForm ).validate( opts );
};

//获得表单的数据集合
c.formData = function( form ){
	var formArray = form.serializeArray();
	var formData = {};
	c.run( formArray.length, function(){
		$.each( formArray, function( i, o ){
			if( o.value && o.value.replace("[","").replace("]","") ){
				formData[ o.name ] = o.value;
			}
		});
	});
	
	return formData;
};

//判断是否为空对象
c.isEmptyObject = function( object ){
	for( var o in object ){
		 o;
		 return false;
	}
	
	return true;
};

//将json转移参数形式的文本
c.param = function( opts ){
	// var s = "";
	// var a = [];
	// $.each( opts, function( k, v ){
	// 	a[ a.length ] = encodeURIComponent( k ) + "=" + encodeURIComponent( v );
	// });

	// s = a.join("&").replace( /%20/gi, "+");

	return $.param( opts );
};

//异步 
c.ajax = function( opts ){
	var config = {
		url: "",
		type: "get", //get, post; default get
		dataType: "json", //text, xml, json, jsonp, script; default json
		data: {},
		contentType: {
			"get": "text/html; charset=UTF-8",
			"post": "application/x-www-form-urlencoded; charset=UTF-8",
			"json": "application/json"
		}, 
		accepts: {
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},
		success: function( data, rs ){}, //返回成功 success:true
		fail: function( data, rs ){}, //返回失败 sucess:false
		error: function(){} //连接失败 404/500...
	};
	
	config = $.extend({}, config, opts || {} );
	config.dataType = config.dataType.toLowerCase();
	
	/** 
	 * 简单处理url
	 */
	c.run( config.type === "get" && !c.isEmptyObject( config.data ), function(){
		var url = config.url;
		var param = c.param( config.data );
		
		switch ( true ){
			case url.indexOf("?") == -1: 
				url = url + "?" + param;
				break;
			case url.indexOf("?") > 0 :
				url = url + "&" + param;
				break;
		}
		config.url = url;
	});
	
	var xhr = new XMLHttpRequest();
	xhr.open( config.type, config.url, true);
	xhr.onreadystatechange = function() {
		if ( xhr.readyState == 4 ) {
			//正常返回
			c.run( xhr.status == 200, function(){
				var data = xhr.responseText;
				switch ( config.dataType ) {
			  		case "text":
			  		case "html":
			  			data = data.replace(/{base}/gi, C.URL );
			  			break;
			  		case "json":
			  			try {
			  				data = JSON.parse( data );
						} catch (e) {
							data = {};
						}
			  			break;
			  		case "jsonp":
			  			var re = /.*?\((.*?)\)$/gi;
			  			data = data.replace( re, "$1");
			  			data = JSON.parse( data );
			  		case "script":
			  			//TODO 暂不支持
			  			break;
			  		case "xml":
			  			data = xhr.responseXML;
				};
				config.success.call( this, data, xhr.status, xhr );
			});
			
			//404
			c.run( xhr.status == 0 || xhr.status == 404 || xhr.status == 500, function(){
				config.error.call( this, xhr.status, xhr );
			});
		}
	};

	xhr.setRequestHeader('Content-Type', config.contentType[config.type] );
	// c.run( config.contentType[config.dataType], function(){
	// 	xhr.setRequestHeader('Content-Type', config.contentType[config.dataType] );
	// });

	c.run( config.type === "post", function(){
		xhr.send( c.param( config.data ) );
	}, function(){
		xhr.send();
	});
};

//本地存储数据
c.storage = function( key, val ){
	return c.run( val, function(){
		localStorage.setItem( key, val );
	},function(){
		return localStorage.getItem( key );
	});
};

c.storage.text = function( key, val ){  
	return c.run( val, function(){
		localStorage.setItem( key, val );
	},function(){
		return localStorage.getItem( key );
	});
};

c.storage.json = function( key, json ){
	return c.run( json, function(){
		localStorage.setItem( key, JSON.stringify( json ) );
	},function(){
		var s = localStorage.getItem( key ) || "{}";
		return JSON.parse( s );
	});
};

c.storage.integer = function( key, val ){
	return c.run( val, function(){
		localStorage.setItem( key, val );
	},function(){
		var s = localStorage.getItem( key ) || "0";
		return parseInt( s );
	});
}

//本地存储数据 --> 删除
c.storage.remove = function( key ){
	localStorage.removeItem( key );
};

c.format = function( date, format ){
	 format = format || "yyyy-MM-dd";
	 var opts = {
		"yyyy" : date.getFullYear(),
		"MM" : c.leftpad( date.getMonth()+1, 2 ), 
		"dd" : c.leftpad( date.getDate(), 2 ), 
		"HH" : c.leftpad( date.getHours(), 2 ), 
		"mm" : c.leftpad( date.getMinutes(), 2 ), 
		"ss" : c.leftpad( date.getSeconds(), 2 )
	 };
	
	 $.each( opts, function( k, v ){
		format = format.replace( k, v );
	 });
	
	 return format;
};

c.leftpad = function( tk, i, s ){
	s = s ? s : '0';
	var tk_  = String( tk );
	while ( tk_.length < i ) {
		 tk_ = s + tk_; 
	} 
	return tk_;
};

//获得当前页面的高度
c.bodyHeight = function(){
	return $('body').get(0).scrollHeight;
};

/* 
 * 数组
 * 根据查询条件，返回匹配条件的一个新数组
 */
c.infind = function( /*Array*/ array, /*Function*/ fn) {
	var arr = [];
	$.each( array, function(i, v) {
		if ( fn(i, v) === true) {
			arr.push(v);
		}
	});

	return arr;
};


//简单模板处理
c.tpl = function( s, o ){
	return s.replace(/\{([A-Za-z0-9_.\-]+)\}/g, function(p1,p2,p3){ 
        return !!!o[p2] ? p1 : o[p2];
    });
};

c.equals = function( s1, s2 ){

}

/*
 * 版本对比
 * c.version( String)
 * 版本号逻辑均为增长
 */
c.version = function( v1, v2 ){
	var a1 = (v1+"").split( "." );
	var a2 = (v2+"").split( "." );
	for( var i = 0, l = a1.length; i< l; i ++  ){

		if( parseInt( a1[i] ) <  parseInt( a2[i] ) || 0 ){
			return false;
		}

		if( parseInt( a1[i] ) >  parseInt( a2[i] ) || 0 ){
			return true;
		}
	}

	return false;
}

//向background发送信息
c.sr = function( opts, fn ){
	chrome.extension.sendRequest( opts, fn );  
};

window.c = c;

})( window, jQuery );