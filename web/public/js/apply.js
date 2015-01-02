function ApplyList(options){
	var defaults = {
        url:"http://haitoubang.sinaapp.com/api/apply/list",
        offset:"0",
        limit:"10",
        current_page:1,
    };
    this.opts = $.extend({}, defaults, options);
    this.init();
}

ApplyList.prototype.init=function(){
    var _this=this;
    this.render();
    this.pagination();
    $("body").on("click",".reply a",function(){
    	var id =this.attr("data-id");
    	_this.getFeedBack(id);
    });
}
ApplyList.prototype.render=function(){
	var _this=this,
		offset=((_this.opts.current_page-1)*_this.opts.limit).toString();
	$.ajax({
		type:"post",
		url:_this.opts.url,
		async:true,
		data:JSON.stringify({"offset":offset,"limit":_this.opts.limit})
	}).success(function(data){
		data = typeof data === 'string' ? $.parseJSON(data) : data;
		if(data && data.res_code === 0){
			var list = doT.template($("#applistTpl").text(), undefined, undefined);
			$("#applist").html(list(data.msg));
		}
	});
}
ApplyList.prototype.statusHtml = function(status){
	switch(status){
		case 1:
			return '<span class="label label-danger">发送失败</span>';
			break;
		case 2:
			return '<span class="label label-primary">发送成功</span>';
			break;
		case 3:
			return '<span class="label label-info">HR已读</span>';
			break;
		case 4:
			return '<span class="label label-success">HR已回复</span>';
			break;
		default:
			return '<span class="label label-default">发送中</span>';
	}
}
ApplyList.prototype.getDateDiff=function(dateTimeStamp) {
	var minute = 1000 * 60;
	hour = minute * 60, day = hour * 24, month = day * 30, year = month * 12;
	var now = new Date().getTime(),
		diffValue = now - dateTimeStamp,
		yearC = diffValue / year,
		monthC = diffValue / month,
		dayC = diffValue / day,
		hourC = diffValue / hour,
		minC = diffValue / minute,
		secC = diffValue / 1000,
		result = "";
	if (yearC >= 1) {
		result = parseInt(yearC) + "年前";
	} else if (monthC >= 1) {
		result = parseInt(monthC) + "个月前";
	} else if (dayC >= 1) {
		result = parseInt(dayC) + "天前";
	} else if (hourC >= 1) {
		result = parseInt(hourC) + "个小时前";
	} else if (minC >= 1) {
		result = parseInt(minC) + "分钟前";
	} else if (secC >= 5) {
		result = parseInt(secC) + "秒前";
	} else {
		result = "刚刚";
	}
	return result;
}
ApplyList.prototype.pagination=function(){
	if(this.opts.current_page == 1){
		return $(".pagination").html('<a href="/apply/list/2" class="pull-right">下一页»</a>');
	}
	if(this.opts.current_page > 1){
		return $(".pagination").html('<a href="/apply/list/'+(this.opts.current_page-1)+'" class="pull-left">«上一页</a><a href="/apply/list/'+(parseInt(this.opts.current_page)+1)+'" class="pull-right">下一页»</a>');
	}
}
ApplyList.prototype.getFeedBack=function(id){
	$.ajax({
		type:"post",
		url:"http://haitoubang.sinaapp.com/api/apply/feedback",
		async:true,
		data:JSON.stringify({"apply_id":id})
	}).success(function(data){
		data = typeof data === 'string' ? $.parseJSON(data) : data;
		if(data && data.res_code === 0){
			new Dialog({
				width:400,
				content:data.mail_body
			});
		}
	});
}
