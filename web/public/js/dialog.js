(function ($,window) {
	window.DialogIndex=1000;
	function Dialog(options) {
	    var defaults = {
	        opacity:1,
	        target:'body',
	        style:'common',
	        width:300,
	        height:180,
	        content:$("<div style='line-height: 150px;text-align: center'>加载中...</div>"),
	        autoSize:'false',
	        showMask:'true',
	        customClass:'',
	        closeCallBack:function(){}
	    };
	    this.opts = $.extend({}, defaults, options);
	    this.init(this.opts);
	};
	window.Dialog=Dialog;
	Dialog.prototype.init=function(){
		var targetWin=this.opts.target=='body'?window:this.opts.target;
	    this.create(this.opts);
	    this._setZIndex(this.opts);
	    this.open();
	    this.closeCallBack=this.opts.closeCallBack;
	    this._position(targetWin,this.opts.width);
	}
	Dialog.prototype.create=function(){
	    if(this.opts.showMask=='true'){
	        this._createMask(this.opts);
	    }
	    this.content = this.opts.content;
	    this.$wrapdiv=$("<div></div>").addClass('haitou-dialog '+this.opts.customClass)
	    this.dialogContentWrap=$("<div>").addClass('haitou-dialogContent');
	    var that=this;
	    this.dialogCloseBtn=$("<div class='haitou-close'>×</div>").click(function(){
	        that.close();
	    });
	    this.dialogContentWrap.append(this.dialogCloseBtn);
	    this.dialogContentWrap.append("<div class='haitou-background fade in' style='display:none'><i class='light-blue fa fa-2x fa-spinner fa-spin'></i></div>");
	    this.dialogContent=this.content;
	    this.$wrapdiv.append(this.dialogContentWrap);
	    $(this.dialogContentWrap).append(this.dialogContent);
	    this.$wrapdiv.appendTo($("#haitou-GZSBUCK"));
	    this._setSize(this.opts.width,this.opts.height);
	}
	Dialog.prototype._createMask=function(){
	    this.$dialogMask=$("<div class='haitou-dialogMask'></div>").appendTo($("#haitou-GZSBUCK"));
	    var targetHeight;
	    if(this.opts.target=='body'){
	        targetHeight = Math.max($(window).height(),$(document).height())
	    } else{
	        targetHeight = $(this.opts.target).height();
	    }
	    this.$dialogMask.css({'width':'100%',height:targetHeight})
	}
	Dialog.prototype._setSize=function(width,height){
	    this.$wrapdiv.css({"width":width+26,'position':'absolute'});
	}
	Dialog.prototype._setZIndex=function(){
	    this.$dialogMask.css('z-index',DialogIndex);
	    DialogIndex++;
	    this.$wrapdiv.css('z-index',DialogIndex+1);
	    DialogIndex++;
	}
	Dialog.prototype._position=function(targetWin,width,height){
	    var targetHeight = window.innerHeight,
	        scrollTop = $(targetWin).scrollTop(),
	        availTop = 0,
	        content=this.dialogContent,
	        contentWidth = width || content.width(),
	        contentHeight = (height || this.$wrapdiv.height())+30;
	    if (targetHeight - contentHeight > 0) {
	        availTop = (targetHeight - contentHeight) / 2 + scrollTop;
	    }
	    else {
	        availTop = 20 + scrollTop;
	    }
	    var targetWidth = $(targetWin).width(),
	        scrollLeft = $(targetWin).scrollLeft(),
	        availLeft = 0;
	    if (targetWidth - contentWidth > 0) {
	        availLeft = (targetWidth - contentWidth) / 2 + scrollLeft;
	    }
	    this.$wrapdiv.css({'top':availTop,'left':availLeft});
	}
	Dialog.prototype.open=function(){
	    $(this.dialogContent).show();
	    this.$dialogMask.show();
	    this.$wrapdiv.show();
	}
	Dialog.prototype.hide=function(){
	    this.$wrapdiv.hide();
	    this.$dialogMask.hide();
	}
	Dialog.prototype.close=function(){
	    this.$wrapdiv.remove();
	    this.$dialogMask.remove();
	    if(this.closeCallBack){
	        this.closeCallBack();
	    }
	}
})(typeof jQuery === 'function' ? jQuery : this,window);