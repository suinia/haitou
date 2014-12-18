/**
 * 具体业务处理
 */

(function( window, $, underfined ){
var bs = {
	LOCATIONS : [], //地址
	POSITIONS : [], //职位
	RANKS : [],  //职级
	DEGREES : [],  //学历
	CATEGORY : [],  //类目
	COMPANYS : [],  //公司
	TITLE : [],  // 新职能
	TITLE_SIMPLE : [],  //新职能simple
	USER_PROFILE : {}
};	

/**
 * 获得各大网站的主体部分
 */
bs.main = function( domain ){
	switch ( domain ){
		case "51job": 
			var sls = ['#divResume > table > tbody > tr > td','table#divResume > tbody > tr > td'];
			return bs.main.exist( sls );
		case "zhaopin":
			return $('#resumeContentBody');

		case "highpin":
			return $('.detailbox');
		case "chinahr":
			var sls = ['.resumeBody .resumeZt','.resume_body','table tr:nth-child(2) td'];
			return bs.main.exist( sls );
		case "liepin":
		case "lietou":
			// return $('#resume-view .resume-main .content');
			return $('.resume .content');
		case "headin":
			var sls = ['#resume-content','.resume-content','#ResumeBasic:parent'];
			return bs.main.exist( sls );
		case "linkedin":
			return $("#profile");

	}
};

bs.main.exist = function( /* Array */ sls ){
	for( var i = 0, j = sls.length; i < j; i ++ ){
		var $sl = $( sls[i] );
		if( $sl.length ){
			return $sl;
		}
	}

	return [];
};

/**
 * 获得简历内容
 * 1. 重构简历框架（使用html5 标签 section 对内容进行分段处理 ）
 * 2. 去除不必要内容
 * 3. 过滤无效HTML标签
 */
bs.main.content = function( domain ){
	var $_ = function( sl ){
		return $_content.find( sl );
	};
	
	var $_content = bs.main( domain ).clone();
	
	/**
	 * 解析简历，获得基本属性
	 */
	bs.main.userprofile( domain, $_content, $_ );

	/**
	 * 分别处理各简历
	 */
	switch ( domain ){
		
		case "51job": 
			(function(){
				//【操作记录】内容
				$_("#ifrPrintInfo").closest('tr').remove();
				// tab
				$_(".rs_tab3").closest('tr').remove();
				
				// 保存【简历关键字】信息, 并移除该标签所在的table
				c.run( $_("#spanTitled").length, function(){
					var $tags = $_("#spanTitled");
					$_content.data( "tags", $tags.text() );
					$tags.closest('table').remove();
				});
				
				// 删除【点击查看联系方式】链接，并删除所在的 tr, 同时也删除上兄的tr
				c.run( $_("#UndownloadLink").length, function(){
					 var $tr = $_("#UndownloadLink").closest('tr');
						 $tr.prev().remove();
						 $tr.remove();
				});
				
				//删除ID
				var $name = null;
				(function(){
					var $tr = $_('#spanLabelTitleHead').closest("tr");
					c.run( $tr.find("b").length, function(){
						$name = $("<h2 />").html( $tr.find("b").html() );
					});
					$tr.remove();
				})();
				
				// 去除无用图片，并处理头像文件
				$_("img").each( function( i, el ){
					//头像图片有链接
					$(el).closest('a').length ? (function(){
						var $tb = $(el).closest("table");
						var id = $(el).closest("td").text();
						var $b = $tb.find("b").clone();
						$tb.find("b").closest('tr').remove();
						$tb.find("tr:first-child td").each( function( i, el ){
							$(el).html( $(el).html() + "&nbsp;&nbsp;&nbsp;" );
						} );
						$tb.after("<div>"+ $tb.text()  +"</div>").after( $b ).after( "<div>" + id + "</div>" ).after( $(el) );
						$tb.remove();
						
						$(el).attr("src", "http://ehire.51job.com" + $(el).attr("src").replace("..", "") );
						c.run( $name, function(){
							$(el).after( $name );
						});
					})() :  /resume_match_.*manpic.gif/.test( $(el).attr("src") ) ? (function(){
						var $tb = $(el).closest("table");
						var id = $(el).closest("td").text();
						var $b = $tb.find("b").clone();
						$tb.find("b").closest('tr').remove();
						$tb.find("tr:first-child td").each( function( i, el ){
							$(el).html( $(el).html() + "&nbsp;&nbsp;&nbsp;" );
						} );
						
						$tb.after("<div>"+ $tb.text()  +"</div>").after( $b ).after( "<div>" + id + "</div>" );
						$name && $tb.after( $name );
						$tb.remove();
					})() : $(el).remove();			
				} );
				
				//清除没有子元素的表格
				$_("table").each(function( i, el ){
					c.run( !$(el).find('tr').length, function(){
						$(el).remove();
					}, function(){
						!$.trim( $(el).text() ) && $(el).remove();
					});
				});
				
				//清除没有子元素的td
				$_("tr").each(function( i, el ){
					!$.trim( $(el).find('td').html() ) && $(el).remove();
				});
				
				$_("hr").closest('tr').remove();
				
				//--template 1 
				$_('#tab_tableResumeMenu, #divHead, #divChart').remove();
				
			})();
			
			//转移或替换标签
			(function(){
				c.run( $_('#divInfo').length, function(){
					var $info = $_('#divInfo');
					var $tb = $info.closest( "table" );
					var $tb_ = $info.find(">table:last-child");
					var $tb__ = $info.find(">table:not(:last-child)");
					var $tb___ = $info.find(">table:first-child");
					
					$info.find('td.cvtitle').wrapInner("<section><h3 /></section>");
					
					$tb_.find(">tbody>tr:even").each( function( i, el ){
						var $el = $(el);
						var $next = $el.next();
						$el.find("td section").append( $next.find("table") );
						$next.remove();					
					});
					
					$tb__.find(">tbody>tr:even").each( function( i, el ){
						var $el = $(el);
						var $next = $el.next();
						$el.find("td section").append( $next.find("td").html() );
						$next.remove();					
					});
					
					$tb___.find("td:first-child").each( function( i, el ){
						var $el = $(el);
						var $next = $el.next();
						$el.wrapInner("<section><h3 /></section>").find("section").append( $next.html() );
						$next.remove();					
					});
					
					$tb.before( $info.find(">table section") );
					$tb.remove();
				});
				
				$_(">table").wrap("<section />");
				
				c.run( $_(">section section").length, function(){
					var $sc = $_(">section section").filter(":first");
					var $td = $sc.closest("td");
						 $td.find(">table").wrap("<section />");
					var $scs = $td.find(">section").clone();
					$_content.html('').append( $scs );
				} );
			})();
		
			break;
		case "zhaopin":
			//移动替换标签
			(function(){
				//统一格式将名字放置在头像后面
				$_('.headerImg').after( $_(".resume-preview-main-title") ) ;
				
				//名字
				$_('#userName').replaceWith(function(){
					return "<h3>" + $( this ).html() + "</h3>";
				});

				$_(".summary, .resume-preview-all").replaceWith(function(){
					return "<section>" + $( this ).html() + "</section>";
				});
				
				$_(":not(.workExperience) h2").replaceWith(function(){
					return "<h6>" + $( this ).html() + "</h6>";
				});
			})();

			//移除标签
			(function(){
				//删除头像链接
				$_('.headerImg').unwrap();
				
				$_('.preview-table-body-add').remove();

				//删除段落中的第一个br
				$_('.summary-bottom br:first-child').remove();
			})();

			break;
		case "chinahr":
			
			//移动替换标签
			(function(){
				$_(".rssTitle").replaceWith(function(){
					return "<section><h3>" + $( this ).text().replace(/\&nbsp\;|\s/gi,'') + "</h3></section>";
				});
				
				$_('section').each( function( i, el ){
					var $el = $(el);
					while( true ){
						if( $el.find('+div, +table, +p').length ){
							$el.find('+div, +table, +p').appendTo( $el );
						}else{
							break;
						}
					}
				});	

				//将头像移至顶部，并删除所在的td
				(function(){
					var $img = $_('.nameImg img');
					var $td = $img.closest('td');
					$img.closest('section').before( $img );
					$td.remove();
				})();
				
			})();
			
			//移除标签
			(function(){
				$_('.resume_shadow').remove();
				$_('.clear').remove();
				$_(".resume_upper, .resume_title img, .resume_div1 a, .resume_div4, colgroup").remove();
				$_('.resume_bottom').remove();

				$_('>table:first-child').remove();

				$_('td a').remove();
				$_('.rssBz').remove();
			})();
			
			
			c.run( bs.main[ domain ] && bs.main[ domain ] == "t2", function(){
				$_("table strong").each(function(){
					var $el = $(this);
					var $tb = $el.closest("table");
					var txt = $el.text();
					$tb.wrap("<section><h3></h3></section>").closest("h3").html( txt );
				});
				
				$_('section').each( function( i, el ){
					var $el = $(el);
					while( true ){
						if( $el.find('+table').length ){
							$el.find('+table').appendTo( $el );
						}else{
							break;
						}
					}
				});	
				
				(function(){
					var $img = $_('section img');
					var $st = $img.closest("section");
					var $tb = $img.closest("table");
					$st.append( $img );
					$st.append( $tb.find("table") );
					$tb.remove();
				})();
				
			});
					
			break;
		case "liepin":
		case "lietou":
			
			//样式格式化
			(function(){
				$_("div>h2, div>h3").each( function( i, el ){
					var $el = $( el ), $next = $el.next();
					$el.wrap("<section>");
					$el.after( $next );				
				} );

				$_("#workexps").replaceWith(function(){
					return "<section>" + $( this ).html() + "</section>";
				});	

				$_("h2").replaceWith(function(){
					return "<h3>" + $( this ).html() + "</h3>";
				});	
				
				//头像位置调整
				var $face = $_('.face img');
				$face.closest('section').prepend( $face );
				
				$_('img.email').attr( "data-imgtype", "email" );
				$_('img.telephone').attr(  "data-imgtype", "mobile" );

			})();

			//删除标签
			(function(){
				$_('.alert').remove();
				$_('.buttons, .btn').remove();
				$_('.icon-16, .tel-report, .text-success').remove();
				$_('#workexp_anchor a').remove();
				//去除按钮
				$_('.resume-language').remove();
				$_('.basic-info-buttons').remove();
				$_('.super-title').remove();

				$_('.mobile-number i').remove();
				$_('.rewardusercstatus').remove();
			})();
			
			break;
		case "headin":
			//样式格式化，替换标签
			(function(){
				$_("h3").replaceWith(function(){
					return "<h5>" + $( this ).html() + "</h5>";
				});

				$_("h2").replaceWith(function(){
					return "<h3>" + $( this ).html() + "</h3>";
				});

				$_(".resume-left, .rblock").replaceWith(function(){
					return "<section>" + $( this ).html() + "</section>";
				});
			
			})();

			//删除标签
			(function(){
				//打印，下载按钮
				$_('.operates').remove();

				//tab
				$_('.tab').remove();
				
				//部分页面，在线购买
				$_('.jq_user-pop').remove();
				
				$_('.disabled').remove();
				
				//教育经历表单，去除无用标签
				$_("[colspan=4]").remove();
			})();

			break;
		case "linkedin":
			//删除标签
			(function(){
				$_('#guided-edit-promo').remove();
				$_('#activity').remove();
				$_('.hidden').remove();
				$_('form').remove();
				$_('.endorse-v2').remove();
				$_('.edit-photo').remove();
				$_('.profile-card-extras').remove();
				$_('.treasury-promo').remove();
				$_('.media-desc').remove();
				$_('.treasury-form-container-upload').remove();
				$_('.jump-to-section').remove();
				
				//联系，发送email按钮
				$_('.profile-aux, .show-more-info, .account-icons, .edit-tools, .no-contact-info-data, .profile-actions ').remove();

				//tab
				$_('.tab').remove();
				
				//教育经历表单，去除无用标签
				$_("[colspan=4]").remove();

				//background
				$_("#background > h2").remove();
				$_("#background section:first-child").unwrap();								
				$_("#background .education-associated").remove();
				$_("#background .endorsers-container").remove();
				$_("#background .endorse-count").unwrap();
				$_("#background .endorse-count").remove();

				$_("#endorsements,#connections,#groups-container,#following-container").remove();
				
			})();
			
			//样式格式化，替换标签
			(function(){
				(function(){
					var $name = $_(".full-name");
					var $h1 = $name.closest("h1");
					$h1.after( $name );
					$h1.remove();
					$name.replaceWith(function(){
						return "<h3>" + $( this ).text() + "</h3>";
					});
				})();
				

				$_("#headline-container").replaceWith(function(){
					return "<h5>" + $( this ).text() + "</h5>";
				});

				$_("#location").replaceWith(function(){
					$( this ).find('dt').html("");
					$( this ).find('dt:nth-child(2)').html("&nbsp;|&nbsp;");
					return "<div>" + $( this ).text() + "</div>";
				});

				$_('#top-card').replaceWith(function(){
					return "<section>" + $( this ).html() + "</section>";
				});

				$_('.background-section').replaceWith(function(){
					return "<section>" + $( this ).html() + "</section>";
				});
			
			})();
			
		case "highpin": 		
			
			//删除不要的标签
			(function(){
				$_('.detail-logo').remove();
				$_('.detail-con .resume').remove();
				$_('.per').remove();
				$_('.right-bar').remove();
				$_('div[class$="alert"]').remove();
			})();

			//修正标签及内容
			(function(){
				//将职业意向补全
				$_('p.sub-title-s span').each(function(){
					var me = $(this);
					me.attr("title") && me.html( me.attr("title") );
				});

				$_('.resume-basic').insertAfter( $_('.simple-info') );

				$_('.detail-mar, .new-border-bottom').replaceWith(function(){
					return "<section>" + $( this ).html() + "</section>";
				});

				$_('section>h4, .per_bar_cell_checked').replaceWith(function(){
					return "<h3>" + $( this ).text() + "</h3>";
				});

				//横向显示列表
				$_('.detail-lables-statusgoal, .detail-lables ').replaceWith(function(){
					return "<b>" + $( this ).text() + "</b>";
				});

				//横向显示列表
				$_('.detail-cons, .detail-cons2').replaceWith(function(){
					return "<cite>" + $( this ).text() + "</cite>";
				});

			})();

			break;

	};

	var html = $_content.html();

	/** 去除行尾空白 */
	html = html.replace(/[ | ]*\n/g,'\n'); 

	/** 去除无用标签 */
	var igronTags = [ "script","noscript","object","button","select","textarea","optgroup","command","datalistframe","frameset","noframes","style","link","script","noscript","canvas","applet","map","marquee","area","base" ];
	
	$.each( igronTags, function( i, k ){
		var re = new RegExp("<"+k+"[^>]*?>([\\s\\S]*?)<\\/"+k+">","ig"); 
		html = html.replace( re , '');
		re =  new RegExp("<"+k+"[^>]*?\\/>","ig"); 
		html = html.replace( re , '');
	});

	/** 删除单标签 */
	//目前就单标签
		var re = /<input.*?>/gi;
		html = html.replace( re , '');


	/** 
	 * 去掉标签内的属性/样式 
	 * 保留 <a> 的 href 和 <img> 的 src
	 */
	html = ( function( str ){
		//1. 将标签中未加引号的标签匹配引号
		var re = /(\s+\w+)\s*=\s*([^<>\"\s]+)(?=[^<>]*>)/ig, re1 = /\"\'([^\'\"]*)\'\"/ig;
		str = str.replace( re,'$1="$2"' ).replace( re1,'\"$1\"' ); 
		
		//2. 去除标签内的属性， 除了例外
		var re2 = /<([a-z0-9]+).*?>/gi, re3 = /src=".*?"|href=".*?"|colspan=".*?"|data-.*?=".*?"/gi;
		str = str.replace( re2 ,function( proerty, tagName ){
			if( re3.test( proerty ) ){
				proerty = proerty.match( re3 ).join(" ");
				return "<" + tagName + " " + proerty + " > ";
			}else{
				return "<" + tagName + " > ";
			}
		});
	
		return str;
	})( html );

	/** 去除两个或多个重复的br */
	re = /(<br\s*\/*>)\s*<br\s*\/*>/gi;
	while (true) {
		if (re.test(html)) {
			html = html.replace(re, "$1");
		} else {
			break;
		}
	};

	/** 去除空标签 */
	re = /<(.*)>\s*<\/\1>/gi;
	while (true) {
		if (re.test(html)) {
			html = html.replace(re, '');
		} else {
			break;
		}
	};
	
	return html;
};

//通过DOM解析，获得用户属性
bs.main.userprofile = function( domain, $_content, $_ ){
	var trim = function( str ){
		return $.trim( str );
	};
	
	var $_t = function( sl ){
		return trim( $(sl).text() );
	}
	
	var name = null,
		companyName = null,
		email = null,
		phone = null,
		birthday = null,
		jobTitle = null;
	
	switch ( domain ) {
		case "linkedin":
			name = $_t(".full-name");
			jobTitle = $_t("#headline .title");
			companyName = (function(){
				var companyName = $_t("#overview-summary-current td a");
				if( !companyName ){
					//若当前公司不存在，则返回之前工作过的公司的第一家
					companyName = $_t("#overview-summary-past td li:first-child a");
				}
				return companyName ? companyName : null;
			})();
			email = $_t("#email-view li a");
			phone = (function(){
				var phone = $_t("#phone-view li");
				phone = phone.replace( /(.*)(\(.*?\))(.*)/gi, "$1$3" )
				phone = phone.replace( /(.*)(1\d{11}).*/gi, "$2" )
				phone = phone.replace( /\s*/gi, "" )
				phone = phone.replace( /^[+0]*86/gi, "" )
				return phone;
			})();
			
			birthday = (function(){
				var $th = $_("#personal-info-view th");
				var birthday = null;
				var re = /(.*)(\d{4}).*/gi;
				$th.each(function(){
					var title = $_t( this );
					if( title == "Birthday" ){
						birthday = $(this).closest("tr").find("td").text();
						if( re.test( birthday ) ){
							birthday = birthday.replace( re, "$2" );
							birthday = birthday + "-01-01 00:00:00";
						}
						
						return true;
					}
				})
				return birthday;
			})();
			break;
	}
	
	c.run( name, function(){
		bs.USER_PROFILE.name = name;
	} );
	c.run( companyName, function(){
		bs.USER_PROFILE.company = { name: companyName };
	} );
	c.run( email, function(){
		bs.USER_PROFILE.email = email;
	} );
	c.run( phone, function(){
		bs.USER_PROFILE.phone = phone;
	} );
	c.run( birthday, function(){
		bs.USER_PROFILE.birthYear = birthday;
	} );
	c.run( jobTitle, function(){
		bs.USER_PROFILE.jobTitle = jobTitle;
	} );
	
	return bs.USER_PROFILE;
}

/**
 * 预载本地化数据
 */
bs.load = {};
bs.load.store = function( filename, key, fn ){
	c.run( !bs[key].length, function(){
		$.ajax({
			url: c.url.local( "/category/"+ filename ),
			dataType: "json",
			success: function( r ){
				bs[key] = $.extend( true, [], r );
				fn && fn( bs[key], key );
			}
		});
	}, function(){
		fn && fn( bs[key] );
	});
};

/**
 * 初始化载入数据-地址
 * 将原JSON格式，转为单一数组 ["北京-朝阳"，"上海-黄浦区"，"福建省-福州市"]
 */
bs.load.locations = function( fn ){
	c.run( !bs.LOCATIONS.length, function(){
		$.ajax({
			url: c.url.local("/category/location.min.json"),
			dataType: "json",
			success: function( r ){
				var lt = [];
				$.each( r, function( i, o ){
					$.each( o.c, function( j, sub ){
						lt.push( o.z + "-" + sub.z  );
					});
				});
				
				bs.LOCATIONS = $.extend( true, [], lt );
				fn && fn( bs.LOCATIONS );
			}
		});
	}, function(){
		fn && fn( bs.LOCATIONS );
	});
};

/**
 * 预载职级
 */
bs.load.companys = function( fn ){
	bs.load.store( "company.json", "COMPANYS", fn );
};

/**
 * 预载职级
 */
//bs.load.ranks = function( fn ){
//	bs.load.store( "rank.json", "RANKS", fn );
//};

/**
 * 预载学历
 */
bs.load.degrees = function( fn ){
	bs.load.store("degree.json", "DEGREES", fn );
};

/**
 * 预载职位
 */
bs.load.positions = function( fn ){
	bs.load.store("position.json", "POSITIONS", fn );
};

/**
 * 预载职能
 */
bs.load.title = function( fn ){
	bs.load.store("title.json", "TITLE", fn );
};

/*
 * 职能数据处理
 */
bs.load.title.simple = function( callback ){
	var key = "TITLE_SIMPLE";
	c.run( !bs[key].length, function(){
		bs.load.title( function( data ){
			var nd = [];
			var toArray = function( arr, level ){
				if( !arr ){ return false };
				$.each( arr, function( i, a1 ){
					var j = {};
					j.z = a1.z;
					j.i = a1.i;
					j.p = "p"+level;
					nd.push( j );

					if( i == arr.length - 1 ){
						return false;
					}
					toArray( a1.c, level + 1 );
				})
			};
			toArray( data, 1 );
			bs[key] = nd;
			callback.call( window, nd );
		});
	}, function(){
		callback.call( window, bs[key] );
	});
};


/**
 * 预载类目
 */
bs.load.category = function( fn ){
	c.run( !bs.CATEGORY.length, function(){
		$.getJSON( c.url.local( "/category/industry.min.json" ), function( indJson ){
			$.getJSON( c.url.local("/category/function.min.json"), function( fnJson ){
				var categoryJson = allJson( indJson, fnJson );
				bs.CATEGORY = $.extend( true, [], spiltJson( categoryJson ) );
				fn && fn( bs.CATEGORY );
			});
		});
	}, function(){
		fn && fn( bs.CATEGORY );
	});
	
	//将类目数组（4层）继续转为2层结构
	var spiltJson = function( allJson ){
		var sj = $.extend( true, [], allJson );
		var sj_ = [];
		$.each( sj, function( i, o ){
			var oj = $.extend( true, {}, o );
			delete oj.c;
			sj_.push( oj );
			$.each( o.c, function( j, sub ){
				sub.pi = o.i;
				sub.pz = o.z;
				if( sub.c && sub.c.length ){
					sub.c = spiltJson( sub.c );
				}
				sj_.push( sub );
			});
		});
		
		return sj_;
	};
	
	//将industry.json完善
	var allJson = function( indJson, fnJson ){
		var allJson = $.extend( true, [], indJson );
		$.each( indJson, function( i, o ){
			$.each( o.c, function( j, k ){
				allJson[i].c[j].c = getFunctionByIndustry( fnJson, k.c );
			});
		});
		
	    return allJson;
	};
	
	//获得单一行业下的function信息
	var getFunctionByIndustry = function( fnJson, fnArr ){
		//深拷贝职能数组
		var fnJson_ = $.extend( true, [], fnJson );
		
		//遍历
		$.each( fnJson, function( i, o ){
			//判断职能是否在行业数组里，若存在，则生成新的数组
			var arr = $.grep( o.c, function( j, k ){
	            return $.inArray( j.i, fnArr ) > -1;
			});
			
			fnJson_[i].c = arr || [];
		});
	    
	    fnJson_ = $.grep( fnJson_, function( j, k ){
	    	return j.c.length > 0;
	    });
	    	
		return fnJson_;
	};
};

/**
 * 候选人编辑表单内容
 */
bs.cv = {};
bs.cv.formStyleInit = function( $rt ){
	//显示推荐标签        
	var recommendTags = ["偏技术","偏管理","能带人","已婚","看职位"];
	c.run( recommendTags.length, function(){
		var $rtags = $("<ul />");
		$.each( recommendTags, function( i, v ){
			var $li = $("<li />");
			$li.bind("click", function(){
				$rt.find('textarea.tags').textext()[0].tags().addTags([ v ]);
			}).html(  v );
			$rtags.append( $li );
		});
		$rt.find('.recommended').html( $rtags.addClass("recommendTags") );
	});
	
	//标签
	$rt.find('textarea.tags').textext({
        plugins : 'tags prompt focus autocomplete ajax',
        prompt : '添加标签(按回车添加标签)...',
//        tagsItems : eval( formData ? formData.tags || "[]" : "[]" ),
        ajax : {
            url : c.url("/old/tag/dropTag.jhtml"),
            dataCallback: function( query ){
            	return { "taDto.dropKey": query };
            },
            dataType : 'json',
            cacheResults : false
        }
    });
	
	$rt.find(".gohd a").attr("href", c.url("/old/talent.html") );
};

bs.cv.formValueInit = function( $el, data ){
	var $sl = $el.find("input[type=text]:not('.nosign'), textarea:not('.nosign'), input[type=hidden], select");
	$sl.each(function( i, dom ){
		var $o = $( dom );
		var name = $o.attr("name");
		//单值name处理，先清除数组信息
		//TODO 处理多值时，需处理方式
		// name = name.replace("[0]","");
		var arr = name.split(".");
		var l = arr.length;

		switch( l ){
			case 2:
				$o.val( data[arr[1]] );
				break;
			case 3:
				var o = data[ arr[1] ] || {};
				var v = o[ arr[2] ];

				//处理简历内容htmlContent为空时，用文本代替
				if( arr[2]=='htmContent' ){
					v = v || o['txtContent'];
				}
				v && $o.val(v);
				break;
		}
			
		c.run( $o.attr("format"), function(){
			var date = new Date( $o.val() );
			$o.val( c.format( date, "yyyy" ) );
		});
		
	});

	c.run( data.industry && data.industry.functionId, function(){
		var $slc_c = $el.find("[name='tl.industry.functionId']" );
		$slc_c.val( data.industry.functionId );
	});
};

//控件初始化
bs.cv.formEventInit = function( $el ){
	//学历
	bs.load.degrees( function( data ){
		var degreeId = $el.find( "[name='tl.degreeId']" );

		$el.find("[name='tl.degree']").autocomplete( data, {
			matchContains: true, //全文匹配
			mustMatch: true,
			minChars:0,  
			max: 0,
			scrollHeight: 220,
			autoFill: false,
			formatItem: function( data, i, max ){
				return data.name;
			}
		} ).result(function( e, data ){
			data = data || {};
			degreeId.val( data.id || '' );
		} ).change(function( data ) {
			data = data || {};
			degreeId.val( data.id || '' );
		});
	});
	
	//公司
	bs.load.companys(function( data ){
		$el.find("[name='tl.companyList.name']" ).autocomplete( data, {
			matchContains: true, //全文匹配
//			mustMatch: true, //必须匹配
			minChars:2,  
			max: 30,
			scrollHeight: 220,
			autoFill: false
		} );
	});
	
	//地址
	bs.load.locations(function( data ){
		$el.find("[name='tl.location']" ).autocomplete( data, {
			matchContains: true, //全文匹配
			mustMatch: true, //必须匹配
			minChars:0,  
			max: 0,
			scrollHeight: 220,
			autoFill: false
		} );
	});
	
//	//职级
//	bs.load.ranks( function( data ){
//		$el.find("[name='tl.rank']" ).autocomplete( data, {
//			matchContains: true, //全文匹配
//			minChars:0,  
//			max: 0,
//			scrollHeight: 220,
//			autoFill: false
//		} );
//	});
	
	//职位
	bs.load.positions( function( data ){
		$el.find("[name='tl.jobTitle']" ).autocomplete( data, {
			matchContains: true, //全文匹配
			minChars:0,  
			max: 0,
			scrollHeight: 220,
			autoFill: false
		} );
	});
	
	//类目
	bs.load.category( function( data ){
		var $slp =  $el.find("[name='tl.industry.industryName']" );
		var $slp_c = $el.find("[name='tl.industry.industryId']" );
		
		$slp.autocomplete( data, {
			matchContains: true, //全文匹配
			mustMatch: true, //必须匹配
			minChars:0,  
			max: 0,
			scrollHeight: 220,
			autoFill: false,
			formatItem: function( data, i, max ){
				var val = data.z || "无记录...";
				if( !data.pi ){
					return "<div class='disabled'>"+val+"</div>";
				}else{
					return "<div>　"+ val +"</div>";
				}
			},
			formatMatch: function( data, i, max) {
				if( data.pz ){
					return data.pz + " " + data.z;
				}
				return data.z;
			},
			formatResult: function( data, i, max) {
				return data.z;
			}
		} ).result(function( e, data ){
			c.run( data, function(){
				$slp_c.val( data.i );
			}, function(){
				$slp_c.val('');
			});
		} ).change(function( data ){
			$slp_c.val('');
		});
	});

	/*
	 * 新职能
	 */
	bs.load.title.simple(function( data ){
		var slc =  $el.find("[name='tl.industry.functionName']");
		var $slc_c = $el.find("[name='tl.industry.functionId']" );
		
		$( slc ).autocomplete( data, {
			matchContains: true, //全文匹配
			mustMatch: true, //必须匹配
			minChars:0,  
			max: 0,
			scrollHeight: 300,
			width: 200,
			autoFill: false,
			formatItem: function( data, i, max ){
				var val = data.z;

				if( !val ){
					return "<div class='disabled'>无记录</div>";
				}
				
				if( data.p == "p1" ){
					return "<div class='disabled'>"+ val +"</div>";
				}else if( data.p == "p2" ){
					return "<div class='disabled'>|--"+ val +"</div>";
				}else{
					return "<div>|--|--"+ val +"</div>";
				}
			},
			formatResult: function( data, i, max) {
				return data.z;
			}
		}).result(function( e, data ){
			c.run( data, function(){
				$slc_c.val( data.i );
			}, function(){
				$slc_c.val('');
			});
		});
	});
};

bs.cv.img2val = function( $el ){
	//获得邮件/电话图片
	(function(){
		c.sr( { fn: "cookies", data: { url: c.currentUrl() } }, function( data ){
			var cookies = data.cookies;

			var $content = $( hdpp.CONTENT );
			
			c.run( $('img.telphone').length, function(){
				var src = $('img.telphone').attr("src");
				c.ajax({
					url: c.url("/old/talent/discernImage.jhtml"),
					type: "post",
					dataType: "json",
					data: {
						imageUrl: c.protocol(location.hostname + src),
						cookies: cookies,
						imgType: "mobile"
					},
					success: function( rst ) {
						c.run( rst.success, function(){
							$el.find('[name="tl.phone"]').val( rst.data  );
							var $img = c.sl.search(".hunterDrive-overlay .contenter img", function( el ){
								return $(el).data("imgtype") == "mobile";
							});

							$img.after("<span>" + rst.data + "</span>");
							$img.remove();
						});
					}
				});
			});

			setTimeout( function(){
				c.run( $('img.email').length, function(){
					var src = $('img.email').attr("src");
					c.ajax({
						url: c.url("/old/talent/discernImage.jhtml"),
						type: "post",
						dataType: "json",
						data: {
							imageUrl: c.protocol(location.hostname + src),
							cookies: cookies,
							imgType: "email"
						},
						success: function( rst ) {
							c.run( rst.success, function(){
								$el.find('[name="tl.email"]').val( rst.data  );
								var $img = c.sl.search(".hunterDrive-overlay .contenter img", function( el ){
									return $(el).data("imgtype") == "email";
								});

								$img.after("<span>" + rst.data + "</span>");
								$img.remove();
							});
						}
					});
				});
			}, 300 );

			
		} );
	})();
}

window.bs = bs;

})( window, jQuery );