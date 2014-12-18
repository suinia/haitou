(function( window, $, undefined ){

var hdpp = {};
var _ = hdpp;

hdpp.TOOLBAR = ".hunterDrive-toolbar";
hdpp.INTERFACE = ".hunterDrive-interface";
hdpp.OVERLAY = ".hunterDrive-overlay";
hdpp.CONTENT = ".hunterDrive-overlay .contenter";
hdpp.ICON_EDIT = ".hunterDrive-edit";
hdpp.ICON_USER = ".hunterDrive-user";
hdpp.ICON_INFO = ".hunterDrive-info";
hdpp.ICON_OUT = ".hunterDrive-out";
hdpp.ICON_IN = ".hunterDrive-in";
hdpp.ICON_PRINT = ".hunterDrive-print";
hdpp.ICON_EDIT_TARGER = ".hunterDrive-edit-target";
hdpp.ICON_HOME = ".hunterDrive-home";

hdpp.WEBSITE = {
	"51job": "前程无忧",
	"zhaopin": "智联招聘",
	"lietou": "猎聘网",
	"liepin": "猎聘网",
	"headin":"海丁网",
	"linkedin": "linkedin",
	"chinahr": "中华英才网"
};

//网站名称
hdpp.siteName = function( domain ){
	return hdpp.WEBSITE[ domain ];
};

//用户信息
hdpp.userstore = function(){
	var data = c.storage.json( C.STORE_USER );
	try {
		data = JSON.parse( data );
	} catch (e) {
		data = {};
	}
	return data;
};

//在页面中生成工具条
hdpp.pageInit = function(){
	var domain = c.domain();
	var url = c.currentUrl();
	
	var $tl = c.sl( hdpp.TOOLBAR ).length ? c.sl( hdpp.TOOLBAR ) 
			: $("<div/>")
				.addClass( c.clsName( hdpp.TOOLBAR ) )
				.addClass( "hunterDrive hdload" )
				.html(
					"<ul>\
						<li class='"+ c.iconCls( hdpp.ICON_HOME ) +" callin'><i class='home'></i></li>\
						<li class='name' style='display:none;'></li>\
					</ul>"
				).appendTo("body");
	
	// 生成 Interface 操作界面
	var $if = c.sl( hdpp.INTERFACE ).length ? c.sl( hdpp.INTERFACE ) 
		: $("<div />")
			.addClass( c.clsName( hdpp.INTERFACE ) )
			.addClass( "hunterDrive" )
			.appendTo("body")
			.append("<div class='contenter'></div><div class='footer'></div>");
	
	var offset = $if.offset(), w = $if.width(), h = $if.height();
	
	$tl.one("mouseover", function(){
		$tl.removeClass("hdload");
	});

	setTimeout(function() {
		$tl.removeClass("hdload");
	}, 600 );
	
	$tl.find( hdpp.ICON_HOME ).bind("click", function(){
		//1. 隐藏ICON
		$tl.fadeOut(0);
		//2. 生成遮罩层
		var $of = c.sl( hdpp.OVERLAY ).length 
			? c.sl( hdpp.OVERLAY ).html('')
			:  $("<div />")
				.addClass( c.clsName ( hdpp.OVERLAY ) )
				.addClass( "hunterDrive" )
				.css( { "min-height": c.bodyHeight() } )
				.appendTo('body');	

		var $contenter = $("<div />")
				.addClass("contenter")
				.addClass( domain )
				.css( { "min-height": h } )
				.appendTo( $of );

		//3. 遮罩层载入效果
		$of.animate( { width: "100%" }, 200, function(){
			hdpp.pageInit.content( this );
			
			//5. 控制样式
			$( window ).one( "scroll", function(){
				//改变样式
				var bodyHeight = c.bodyHeight();
				var h = ( $contenter.height() < bodyHeight ? bodyHeight : $contenter.height() ) + 300;
				$contenter.css( { "min-height": h } );
				$of.css( { "min-height": h } );
			});
		} );
	});
};

hdpp.pageInit.content = function( el ){
	//载入内容
	$( el ).find(".contenter").addClass("nobg").fadeOut( 300, function(){
		var $o = $( this );
		$o.html( hdpp.content() );
		
		hdpp.TEXT = (function(){
			var content = $o.text();
			content = content.replace(/\r\n/gi, " " );
			content = content.replace(/\n\r/gi, " " );
			content = content.replace(/\n/gi, " " );
			content = content.replace(/\r/gi, " " );
			content = content.replace(/\s{2,}/gi, " " );
			return content;
		})();
		
		$o.fadeIn( 500, function(){
			hdpp.pageInit.interfaces();

			c.run( $('html').css("overflow-y") == "hidden", function(){
				$('html').css("overflow-y", "scroll");
				$('body').height( $o.height() );
			});

		} ).css( { "min-height": c.bodyHeight() } );


	} );
};

// 操作面板载入效果
hdpp.pageInit.interfaces = function(){
	c.sl( hdpp.INTERFACE ).animate( { right: 0 }, 200, "linear", function(){
		var $el = $( this );
		// 低分辨率样式兼容
		c.run( $el.offset().left < 850, function(){
			c.sl( hdpp.OVERLAY ).find(".contenter").animate( { "margin-left": 100 }, 200);
		});
		
		// 用户登录状态 ? 编辑表单 : 登录表单
		c.run( C.IS_LOGIN, function(){
			hdpp.event.edit();
		}, function(){
			hdpp.event.login();
		});
	} );
};

hdpp.pageInit.out = function(){
	var $if = c.sl( hdpp.INTERFACE );
	var $out = $if.find("i.out");
	var $of = c.sl( hdpp.OVERLAY );
	var $tl = c.sl( hdpp.TOOLBAR );
	$out.bind("click", function(){
		$of.animate( { width: "0%" }, 200, function(){
			
		} );
		
		$if.animate( { right: -$if.width() }, 200, function(){
			
		} );
		
		$tl.fadeIn(500);
	});
};

hdpp.pageInit.show = function(){
	var $tl = c.sl( hdpp.TOOLBAR );
	$tl.fadeIn();
};

hdpp.pageInit.hide = function(){
	var $tl = c.sl( hdpp.TOOLBAR );
	$tl.fadeOut();
};

/**
 * 每个按钮相应事件
 */
hdpp.event = {};

//判断用户是否容量超限
hdpp.event.capactity =function( fn ){
	c.ajax({
		url : c.url("/old/user/statCapacity.jhtml"),
		dataType : "json",
		success: function( rst ) {
			c.run( rst.success, function(){
				var data = rst.data;
				c.run( data.usedCapacity >= data.totalCapacity, function(){
					hdpp.event.capactity.show( data );
				}, function(){
					fn && fn();
				});
			}, function(){
				fn && fn();
			});
		},
		error: function(){
			fn && fn();
		}
	});
};

hdpp.event.capactity.show = function( data ){
	var $el = c.sl( hdpp.INTERFACE ).find( ".contenter" );
	c.ajax({
		url : c.url.local("/template/capacity.html"),
		dataType: "html",
		success: function( rt ){
			var $rt = $( rt );
			$rt.find('em').html( data.usedCapacity );
			$el.empty().append( $rt );
			hdpp.event.userinfo();
		}
	});
};

hdpp.event.edit = function(){
	hdpp.event.capactity( hdpp.event.edit.show );
};

hdpp.event.edit.show = function(){
	var $el = c.sl( hdpp.INTERFACE ).find( ".contenter" );
	c.ajax({
		url : c.url.local("/template/talentEdit.html"),
		dataType: "html",
		success: function( rt ){
			var $rt = $( rt );
			//样式初始化
			bs.cv.formStyleInit( $rt );
			//事件初始化
			bs.cv.formEventInit( $rt );
			
			//CV内容
			$rt.find("[name='tl.cv.sourceWebName']").val( c.domain() );
			$rt.find("[name='tl.cv.sourceUrl']").val( c.currentUrl() );
			$rt.find("[name='tl.cv.txtContent']").val( hdpp.TEXT );
			$rt.find("[name='tl.cv.htmContent']").val( hdpp.HTML );
			
			//绑定表单值
			var $btn = $rt.find("input[type=submit]");
			$btn.bind("click", function(){
				hdpp.event.edit.save( this );
			});

			//猎聘网图片（电话，email)解析
			bs.cv.img2val( $rt );

			//自动解析表单值初始化
			c.ajax({
				url: c.url("/old/talent/analyzePluginResume.jhtml"),
				data : { "cv.txtContent": hdpp.TEXT, "cv.sourceWebName": c.domain() },
				type: "post",
				dataType: "json",
				success : function( data ){
					data = $.extend(true, {}, bs.USER_PROFILE || {}, data);
					bs.cv.formValueInit( $rt, data );
				}
			});
			
			//将表单填入操作面板
			$el.empty().append( $rt );
			//绑定退出
			hdpp.pageInit.out();
		}
	});
	
	hdpp.event.userinfo();
};

hdpp.event.edit.save = function( el ){
	var $el = $(el);
	var $form = $el.closest('form');
	var $btnLoad = $form.find(".btn.load");
	var $gohd = $form.find(".gohd");
	
	c.validate( $form, {
		submitHandler: function( form ){
			el.disabled = true;
			$el.closest("div").find(">div").hide();
			$el.slideUp(function(){
				$btnLoad.slideDown(function(){
					
					hdpp.event.edit.timeoutId && clearInterval( hdpp.event.edit.timeoutId );
					hdpp.event.edit.timeoutId = setInterval(function(){
						var s = $btnLoad.val().replace(/(.*?)(\.{15})/gi, "$1" );
						$btnLoad.val( s + "." );
					}, 500 );

					var data = {};
					
					if( $('#headidforhunterdrive').length ){
						data["tl.cv.webOwnerId"] = $('#headidforhunterdrive').val();
					}
					
					$( form ).ajaxSubmit({
						url: c.url('/old/talent/saveTalentFromPlugin.jhtml'),
						type: "post",
						dataType: "json",
						data: data || {},
						success: function( r ){
							var data = r.data;
							clearInterval( hdpp.event.edit.timeoutId );
							$btnLoad.val( "保存成功" );
							$btnLoad.slideUp( 500, function(){
								$( this ).val( "保存中." );
								$el.slideDown();
								el.disabled = false;
								$gohd.fadeIn(function(){
									$gohd.find("a").attr( "href", c.url("/hh/#/talent/edit/"+data.id ) );
								});
							});
							
							$(form).find("[name='tl.id']").val( data.id );
							$(form).find("[name='tl.cv.id']").val( data.cv.id );
						}
					});
				});
			});
		}
	});
};

//登录表单
hdpp.event.login = function(){
	var $el = c.sl( hdpp.INTERFACE ).find(".contenter");
	c.ajax({
		url : c.url.local("/template/login.html"),
		dataType: "html",
		success: function( rt ){
			var $form = $( rt );
			$form.find("input[type=submit]").bind("click", function(){
				hdpp.event.login.save( this );
			});

			//避免浏览器记住帐号密码
			$form.find("input[name='userDto.password']").bind("focus", function(){
				$(this).attr("type","password");
			});			

			$el.empty().append( $form );
			hdpp.pageInit.out();

			//记住帐号信息
			c.sr({ fn: "storage", data: { key: C.STORE_PRE_ACCOUNT, type:"text" } }, function( rdata ){
				$el.find("input[name='userDto.email']").val( rdata.data || '' );
			});
		}
	});
};

hdpp.event.login.save = function( el ){
	var $el = $(el);
	var $form = $el.closest('form');
	var $btnLoad = $form.find(".btn.load");
	
	c.validate( $form, {
		submitHandler: function( form ){
			$el.slideUp(function(){
				$btnLoad.slideDown(function(){
					hdpp.event.login.timeoutId && clearInterval( hdpp.event.login.timeoutId );
					hdpp.event.login.timeoutId = setInterval(function(){
						var s = $btnLoad.val().replace(/(.*?)(\.{15})/gi, "$1" );
						$btnLoad.val( s + "." );
					}, 500 );
						
					c.sr({ fn: "login", data: c.formData( $form ) }, function( rdata ){
						c.run( rdata.status == "success", function(){
							C.IS_LOGIN = true;
							c.storage.json( C.STORE_USER, rdata.data.user );
							$btnLoad.val("登录成功");
							$btnLoad.slideUp();
							setTimeout(function(){
								$el.slideDown();
								$btnLoad.val( $btnLoad.data("val") );
								hdpp.event.edit();
								hdpp.init.user();
							},1000);
						},function(){
							C.IS_LOGIN = false;
							c.storage.remove( C.STORE_USER );
							$btnLoad.slideUp(function(){
								$el.slideDown(function(){
									c.remind.error( $el, { content: "账户或密码错误，请重新输入" } );
								});
								$btnLoad.val( $btnLoad.data("val") );
							});
							/** 监控表单变化，清楚错误信息 */
							$form.find("input").bind("keydown", function(){
								$el.qtip("destroy");
							});
						});
					});
				});
			});
		}
	});
};

hdpp.event.logout = function(){
	c.sr({ fn:"logout"}, function(){
		C.IS_LOGIN = false;
		localStorage.clear();
		c.sl( hdpp.INTERFACE ).find(".footer").empty().removeClass("cbg");
		hdpp.event.login();
		hdpp.init.user.out();
	});
};

hdpp.event.userinfo = function(){
	var data  = c.storage.json( C.STORE_USER );
	var $f = c.sl( hdpp.INTERFACE ).find(".footer").addClass("cbg");
	$f.empty();
	$f.append("<i class='login'></i>");
	$f.append("<span class='name'>当前账户：<em>"+ data.name +"</em><a href='javascript:;'>退出</a></span>");
	$f.find("a").bind("click", function(){
		hdpp.event.logout();
	});
};

/** 不删除 */
//hdpp.event.print = function(){
//	c.sl( hdpp.ICON_PRINT ).bind( "click", function(){
//		window.print();
//	});
//};

//简历内容
hdpp.content = function(){
	var domain = c.domain();
	var html = bs.main.content( domain );
	hdpp.HTML = html;
	return html;
};

//初始化页面
hdpp.init = function(){
	hdpp.init.userstore( null, function(){
		hdpp.init.page(function(){
			hdpp.pageInit();
			hdpp.init.user();
			hdpp.init.event();
		});
	});
};

//页面在没找到简历主体时，不显示载体icon
hdpp.init.page = function( fn ){
	var domain = c.domain();
	var url = c.currentUrl();

	//针对Chrome extenstion content_script 对 css 和 js 匹配规则处理方式不一样的处理
	switch ( domain ) {
		case "chinahr":
			var re = /c\=preview/gi;
			if( !re.test( url ) ){
				return false;
			}
			
			break;

		case "hunterdrive": 
			//告诉页面是否装了插件
			var timeoutId = null;
			timeoutId = setInterval(function(){
				var checkExtension = $("body").attr( "checkExtension" ) || false
				c.run( checkExtension, function(){
					var lis = $('li.task:not(".taskDone")');
					c.run( lis.length, function(){
						lis.each(function(){
							var $el = $(this);
							c.run( $el.data("task") == "INSTALL_PLUGIN", function(){
								var $p =$el.find("p");
								$p.html( $p.html().replace("未安装","已完成") );
								var $a = $el.find("a");
								$a.addClass("btn-get")
									.attr("href", "javascript:;")
									// .attr("onclick", "btnAction( this )" )
									.html("领取奖励");
							});
						});
					});

					clearInterval( timeoutId );
				});
			}, 300);

			

			//HD dashboard 今日关注 去除提醒安装插件链接
			var $nt = $('.tn-extension');
			c.run( $nt.length, function(){
				$nt.closest('li').remove();
			});

			return false;
			break;
	}

	//若找不到简历主体部分
	if( !bs.main( domain ).length ){
		//同时监控某些特殊事件，启用icon
		switch( domain ){
			case "headin": 
				$(".openResumeLeft,.showfavdetail").bind("click", function(){
					c.run( $('.hunterDrive').length, function() {
						hdpp.pageInit.show();
					}, function() {
						hdpp.pageInit();
						hdpp.init.user();
						hdpp.init.event();
					});
				});

				$('body').click(function( e ){
					if( c.equals( e.target.className, "closeResume" ) ){
						hdpp.pageInit.hide();
					}
				});

				break;
		}

		return false;
	}

	fn && fn();
};

/*
 * 初始化事件
 * 1. 操作提示
 */
hdpp.init.event = function(){
	//操作提示
	c.remind( hdpp.ICON_HOME, { 
		content: {
			text: "点击按钮，使用HunterDrive插件，<br />保存简历到我的HunterDrive"
		},
		events: {
			hide: function( event, api ){
				api.set( 'show.event', false );
			}
		}
	} );
};

hdpp.init.userstore = function( data, fn ){
	c.run( data, function(){
		c.storage.json( C.STORE_USER , data );
	}, function(){
		c.sr({ fn: "userstore" }, function( rdata ){
			c.run( rdata.status == "success", function(){
				hdpp.init.userstore( rdata.data.user );
				C.IS_LOGIN = true;
			}, function(){
				c.storage.remove( C.STORE_USER );
				C.IS_LOGIN = false;
			});
			
			fn && fn();
		});
	});
};

hdpp.init.user = function(){
	var $n = $( hdpp.TOOLBAR ).find(".name");
	c.run( C.IS_LOGIN, function(){
		var data = c.storage.json( C.STORE_USER );
		$n.show(0).css({
			"display" : "inline-block"
		}).html( data.name );
	},function(){
		$n.hide(0);
	});
};

hdpp.init.user.out = function(){
	var $n = $( hdpp.TOOLBAR ).find(".name");
	$n.empty().hide();
};

hdpp.init();

window.hdpp = hdpp;

})( window, jQuery );


