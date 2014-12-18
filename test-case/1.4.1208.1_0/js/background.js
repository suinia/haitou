(function( window, $, undefined ){
var bg = {};

bg.login = function( data, sendResponse ){
	c.ajax({
		url: c.url("/old/login.jhtml"),
		data: data,
		dataType: "json",
		success: function( rst ){
			c.run( rst.status == "success", function(){
				c.storage.json( C.STORE_USER, rst.data.user );
				c.storage( C.STORE_PRE_ACCOUNT, rst.data.user.email );
				sendResponse( rst );  
            }, function(){
            	sendResponse( {} ); 
            });
		}
	});
};

bg.logout = function( data, sendResponse ){
	c.ajax({
		url: c.url("/old/logout.jhtml"),
		data: data,
		success: function( rdata ){
			c.storage.remove( C.STORE_USER );
			sendResponse( rdata );  
		},
		error: function(){ 
			sendResponse( {} );  
		}
	});
};

bg.userstore = function( data, sendResponse ){
	var loginInfo = function( rdata ){
		c.run( rdata.success, function(){
			c.storage.json( C.STORE_USER, rdata.data.user );
		}, function(){
			c.storage.remove( C.STORE_USER );
		});

		sendResponse( rdata || {} ); 
	};

	c.ajax({
		url: c.url("/old/checkLogin.jhtml"),
		dataType: "json",
		success: function( rst ){
			if( rst.status == "success" ){
				loginInfo( rst );
			}else{
				c.ajax({
					url: c.url("/login.jhtml" ),
					type : "get",
					success: function( rdata ){
						 loginInfo( rdata );
					},
					error: function(){ 
						sendResponse( {} );  
					}
				});
			}
		}
	});
};

/** 桌面通知 */
bg.notify = function( data ){
  	var pos = data.position;
	var pdate = c.format( new Date( data.timestamp - C.TIMESTAMP ), "MM月dd日" );

	c.run( chrome.notifications, function(){
		var options = {
			type: "basic",
			title: "新职位通知",
			message: "猎上网"+ pdate +"共有"+ pos.length +"个新职位发布，敬请关注。",
			iconUrl: c.url.local("/images/hd128.png"),
			buttons: [{
				title: decodeURI("马上去看看"),
				iconUrl: c.url.local("/images/hd32.png")
			}]
		};

		chrome.notifications.create( "newpositiondaily", options, function(){} );
	}, function(){
		var options = {
			img : c.url.local( "images/hd32.png" ),
			title : "新职位通知",
			content : "猎上网"+ pdate +"共有"+ pos.length +"个新职位发布，敬请关注。"
		};
		var notification = window.webkitNotifications.createNotification( img, title, content );
		notification.show();
	});

 
};

bg.notify.html = function( url ){
  	var notification = webkitNotifications.createHTMLNotification( url );
  	notification.show();
};


/** 获得页面cookie */
bg.cookies = function(detail, sendResponse) {
	chrome.cookies.getAll(detail, function(cookie) {
		var arr = [];
		$.each(cookie, function(i, o) {
			arr[i] = o.name + "=" + o.value;
		});
		var cookiestr = arr.join("; ");

		sendResponse({
			cookies: cookiestr
		});
	});
};

bg.storage = function( data, sendResponse ){
	sendResponse({
		data : c.storage[ data.type || "text" ]( data.key )
	});
};

/**
 * 具体业务区域
 */
 bg.bs = {}

 /**
  * 前一天新职位数通知
  * 1. 若有新职位，显示通知
  * 2. 若无新职位，则不显示
  */
 bg.bs.lastDayNewPosNotify = function(){
 	var timestamp = c.storage.integer( C.HO_LASTDAY_NEWPOS_TIMESTAMP );
 
 	c.run( ( ( + new Date() - timestamp ) > C.TIMESTAMP ), function(){
 		bg.bs.lastDayNewPosNotify.store(function( store ){
 			var pos = store.position;
 			c.run( pos.length, function(){
 				c.storage( C.HO_LASTDAY_NEWPOS_TIMESTAMP, + new Date() );
 				c.storage.json( C.HO_LASTDAY_NEWPOS_STORE, store );

 				//Google Chrome 不支持 createHTMLNotification
 				c.run( window.webkitNotifications.createHTMLNotification, function(){
					bg.notify.html("template/notifyByHoNewPosition.html");
				}, function(){
					bg.notify( store );
				} );

 			} );
 		});
 	}, function(){
 		bg.bs.lastDayNewPosNotify.timeoutId = setInterval( function(){
 			var h = ( new Date() ).getHour();
 			c.run( h > 8 && h < 20, function(){
 				clearInterval( bg.bs.lastDayNewPosNotify.timeoutId );
 				bg.bs.lastDayNewPosNotify();
 			} );
 		}, 1000*60*60*4 );
 	});
 };

 bg.bs.lastDayNewPosNotify.store = function( fn, errfn ){
 	var store = c.storage.json( C.HO_LASTDAY_NEWPOS_STORE );
	c.run( !c.isEmptyObject( store ) && 
			( Date.parse( new Date() ) - store.timestamp ) < C.TIMESTAMP , function(){
		fn.call( window, store );
	},function(){
		c.ajax({
			// url : C.HO_URL + "/newpositiondaily.json",
			url: C.HO_URL_LASTDAY_NEWPOS,
			dataType: "json",
			success: function( rt ){
				fn.call( window, rt );
			},
			error: function(){
				errfn && errfn();
			}
		});

	});
 }

 bg.init = function(){
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		var fn = request["fn"];
		var data = request["data"] || {};
		bg[ fn ].call( request, data, sendResponse );
	}); 
	
	bg.init.checkUpdate();

	bg.bs.lastDayNewPosNotify();

	bg.init.tongji();

	bg.init.notifications();
	
};

/** Google Analytics 统计 */
bg.init.tongji = function(){
	// (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	//   (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	//   m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	// })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

 //  	ga('create', 'UA-46481545-1', 'hunterdrive.com');
 //  	ga('send', 'pageview');
};

//通知信息
bg.init.notifications = function(){
	var action = function( notificationId ){
		switch( notificationId ){
			case "newpositiondaily":
				chrome.tabs.create({ selected: true, url: "http://www.hunteron.com/listPosition/"});
				break;
			case "newVersion":
				chrome.tabs.create({ selected: true, url: "http://hd.hunterdrive.com/survey/extension.shtml"});
				break;
		}
	};
	c.run( chrome.notifications, function(){
		 chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonsIndex) {
		 	action( notificationId );
	    });
	    chrome.notifications.onClicked.addListener(function (notificationId) {
	    	action( notificationId );
	    });
	});
};

//安装或更新提醒
bg.init.checkUpdate = function(){
	var preVersion = c.storage( C.STORE_VERSION );

	c.ajax({
		url : c.url.local("/manifest.json"),
		dataType: "json",
		success: function( rt ){
			var currentVersion = rt.version;
			c.run( !preVersion, function(){
				chrome.tabs.create({ selected: true, url: c.url.static("/extension/cvider-installed.html") });
			}, function(){
				c.run( currentVersion !== preVersion, function(){
					//TODO extension update
				}, function(){
					//检测服务器上是否有最新的版本
					c.ajax({
						url: c.url.static("/extension/hdce/hdpp.json"),
						dataType: "json",
						success: function( rt ){
							var version = rt.version;
							console.debug( version, currentVersion, c.version( version, currentVersion ) );
							c.run( c.version( version, currentVersion ), function(){
								c.run( chrome.notifications, function(){
									var options = {
										type: "basic",
										title: "历来新版本发布",
										message: "去更新新版本简历宝历来插件",
										iconUrl: c.url.local("/images/hd128.png"),
										buttons: [{
											title: decodeURI("马上去看看"),
											iconUrl: c.url.local("/images/hd32.png")
										}]
									};

									chrome.notifications.create( "newVersion", options, function(){} );
								});
							} );
						}
					})
				} );
			});

			c.storage( C.STORE_VERSION,  currentVersion );
		}
	});
};

bg.init();	


window.bg = bg;
	
})( window, jQuery );



