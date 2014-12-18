/**
 * 具体业务处理
 */

(function( window, $, underfined ){

var pop = {
	TIMESTAMP : 86400000, 
	HO_POSITION_STORE : "hoNewPositionStore"
};

pop.login = function(){
	console.debug( C.IS_LOGIN );
	c.run( C.IS_LOGIN, function(){
		pop.login.userinfo();
	},function(){
		var $showlogin = $('.showlogin');
		$showlogin.bind("click", function(){
			console.debug(1);
			var $loginSection = $('.loginSection');
			var $content = $loginSection.find(' .contenter');
			
			$showlogin.hide();
			
			c.ajax({
				url : c.url.local("/template/login.html"),
				dataType: "html",
				success: function( rt ){
					var $form = $( rt );
					$form.find("h2").remove();
					$form.find("input[type=submit]").bind("click", function(){
						pop.login.save( this );
					});

					$content.empty().append( $form );
					$loginSection.slideDown();
					
					//绑定关闭按钮
					$loginSection.find(".icon-remove-sign").bind("click", function(){
						$loginSection.slideUp();
						$showlogin.show();
					});

					//记住帐号信息
					c.sr({ fn: "storage", data: { key: C.STORE_PRE_ACCOUNT, type:"text" } }, function( rdata ){
						$form.find("input[name='login_name']").val( rdata.data || '' );
					});
				}
			});
		});
	});
};

pop.login.save = function( el ){
	var $el = $(el);
	var $form = $el.closest('form');
	var $btnLoad = $form.find(".btn.load");
	var $section = $form.closest('section');
	
	c.validate( $form, {
		submitHandler: function( form ){
			$el.slideUp(function(){
				$btnLoad.slideDown(function(){
					pop.login.timeoutId && clearInterval( pop.login.timeoutId );
					pop.login.timeoutId = setInterval(function(){
						var s = $btnLoad.val().replace(/(.*?)(\.{15})/gi, "$1" );
						$btnLoad.val( s + "." );
					}, 500 );
						
					c.sr({ fn: "login", data: c.formData( $form ) }, function( rdata ){
						c.run( rdata.status == "success", function(){
							C.IS_LOGIN = true;
							c.storage( C.STORE_USER, JSON.stringify( rdata.data.user ) );
							$btnLoad.val("登录成功");
							$section.slideUp(function(){
								$btnLoad.val( $btnLoad.data("val") );
								pop.login.userinfo();
							});
						},function(){
							C.IS_LOGIN = false;
							c.storage.remove( C.STORE_USER );
							$btnLoad.slideUp(function(){
								$el.slideDown(function(){
									c.remind.error( $el, { 
										content: "账户或密码错误，请重新输入", 
										position: {
											my: "top center",
											at: "bottom center"
										} 
									} );
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

pop.login.userinfo = function(){
	var data  = c.storage.json( C.STORE_USER );
	var $f = $('.positionSection h2 .right');
	$f.empty();
	$f.append("<span class='name'>"+ data.name +"</span><a href='#' style='margin-left: 5px;'>退出</a>");
	$f.find("a").bind("click", function(){
		pop.logout();
	});
	pop.position();
};

pop.logout = function(){
	c.sr({ fn:"logout"}, function(){
		C.IS_LOGIN = false;
		c.storage.remove( C.STORE_USER );
		var $f = $('.positionSection h2 .right');
		$f.empty();
		$f.append("<a href='#' class='showlogin'>登录</a>");
		pop.login();
		pop.position();
	});
}

pop.position = function(){
	c.ajax({
		url : c.url.local("/template/hoPosition.html"),
		dataType: "html",
		success: function( rt ){
			var temp = rt;
			var $ol = $('<ol>');
			var $con = $('.positionSection .contenter');
			pop.position.store( function( pos, title ){
				c.run( pos.length, function(){
					$.each( pos, function( i, p ){
						p.reward = parseInt( p.reward );
						p.annualSalary = parseInt( p.annualSalary );
						p.hourl = C.HO_URL;
						$ol.append( c.tpl( temp, p ) );
					});
				}, function(){
					$ol.append( "<li class='nodata'>无新职位发布</li>" );
				});
				
				$con.empty().append( $ol );
				
				//标识时间点
				var current = rt.timestamp - C.TIMESTAMP;
				var pdate = current = c.format( new Date( current ), "MM月dd日" );
				$('.positionSection .title').html( title );
				
			}, function( error ){
				$ol.append( "<li class='nodata'>'+ error +'</li>" );
				$con.empty().append( $ol );
			} );
		}
	});
};

/**
 * 判断用户是否登录：
 * 		若登录，获得职位推荐
 *		若未登录，获得新发布职位
 * 获得新职位的数据源
 * 1. 若当前存储的时间戳为红或距离当前时间超过1天，则异步访问Ho网站获得数据源
 * 		1.1 同时将数据源存储至本地localStorage
 * 2. 若相反，则直接从本地存储的数据读取数据
 */
pop.position.store = function( fn, errfn ){
	c.run( C.IS_LOGIN, function(){
		var error = "暂无推荐职位";
		var title = "猎上网推荐职位";
		c.ajax({
			url: c.url("/old/user/expressPosition.jhtml"),
			dataType: "json",
			success: function( rt ){
				c.run( rt.success, function(){
					var data = [];
					$.each( rt.data, function( i, j){
						j.location = j.address || '-';
						j.reward = j.fixedRewardAmount;
						j.jobdescription = j.jobDescription;
						data[ i ] = j;
					} );
					fn.call( window, data, title );
				}, function(){
					rrfn && errfn( error );
				});
				
			},
			error: function(){
				errfn && errfn( error );
			}
		});
	}, function(){
		var error = "暂无新职位发布";
		var title = "猎上网<span class='positiondate'>{{pdate}}</span>新职位";

		var store = c.storage.json( C.HO_LASTDAY_NEWPOS_STORE );
		c.run( !c.isEmptyObject( store ) && 
				( Date.parse( new Date() ) - store.timestamp || 0 ) < pop.TIMESTAMP , function(){
			var current = store.timestamp - C.TIMESTAMP;
			var pdate = current = c.format(new Date(current), "MM月dd日");
			title = title.replace("{{pdate}}", pdate);
			fn.call(window, store.position, title);
		},function(){
			c.ajax({
				url: C.HO_URL_LASTDAY_NEWPOS,
				dataType: "json",
				success: function( rt ){
					var current = rt.timestamp - C.TIMESTAMP;
					var pdate = current = c.format( new Date( current ), "MM月dd日" );
					title = title.replace( "{{pdate}}", pdate );

					fn.call( window, rt.position, title );
					c.storage.json( C.HO_LASTDAY_NEWPOS_STORE, rt );
				},
				error: function(){
					errfn && errfn( error );
				}
			});
		});
	});
};

pop.init = function(){
	c.sr({ fn: "userstore" }, function( rdata ){
		c.run( rdata && rdata.status == "success", function(){
			c.storage.json( C.STORE_USER, rdata.data.user );
			C.IS_LOGIN = true;
		}, function(){
			c.storage.remove( C.STORE_USER );
			C.IS_LOGIN = false;
		});
		
		pop.position();
		pop.login();
	});
	
};

pop.init();

window.pop = pop;

})( window, jQuery );