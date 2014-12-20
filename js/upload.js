$.ajaxPrefilter(function(options, origOptions, jqXHR) {
	if (options.iframe) {
		options.originalURL = options.url;
		return "iframe";
	}
});
$.ajaxTransport("iframe", function(options, origOptions, jqXHR) {
	var form = null,
		iframe = null,
		name = "iframe-" + $.now(),
		files = $(options.files).filter(":file:enabled"),
		markers = null,
		accepts = null;

	function cleanUp() {
		markers.prop("disabled", false);
		form.remove();
		iframe.one("load", function() {
			iframe.remove();
		});
		iframe.attr("src", "javascript:false;");
	}
	options.dataTypes.shift();
	options.data = origOptions.data;
	if (files.length) {
		form = $("<form enctype='multipart/form-data' method='post'></form>").hide().attr({
			action: options.originalURL,
			target: name
		});
		if (options.data && typeof options.data !== "string") {
			options.data = $.param(options.data, options.traditional);
		}
		var splitString = decodeURIComponent(options.data).split("&");
		for (var i = 0; i < splitString.length; i++) {
			var keyValuePair = splitString[i].split("=");
			$("<input type='hidden' />").attr({
				name: keyValuePair[0],
				value: keyValuePair[1]
			}).appendTo(form);
		}
		$("<input type='hidden' value='IFrame' name='X-Requested-With' />").appendTo(form);
		if (options.dataTypes[0] && options.accepts[options.dataTypes[0]]) {
			accepts = options.accepts[options.dataTypes[0]] + (options.dataTypes[0] !== "*" ? ", */*; q=0.01" : "");
		} else {
			accepts = options.accepts["*"];
		}
		$("<input type='hidden' name='X-HTTP-Accept'>").attr("value", accepts).appendTo(form);
		markers = files.after(function(idx) {
			return $(this).clone().prop("disabled", true);
		}).next();
		files.appendTo(form);
		return {
			send: function(headers, completeCallback) {
				iframe = $("<iframe src='javascript:false;' name='" + name + "' id='" + name + "' style='display:none'></iframe>");
				iframe.one("load", function() {
					iframe.one("load", function() {
						var doc = this.contentWindow ? this.contentWindow.document : this.contentDocument ? this.contentDocument : this.document,
							root = doc.documentElement ? doc.documentElement : doc.body,
							body = root.getElementsByTagName("body")[0] || root,
							textarea = root.getElementsByTagName("textarea")[0],
							type = textarea && textarea.getAttribute("data-type") || null,
							status = textarea && textarea.getAttribute("data-status") || 200,
							statusText = textarea && textarea.getAttribute("data-statusText") || "OK",
							content = {
								html: body.innerHTML,
								text: type ? textarea.value : body ? body.textContent || body.innerText : null
							};
						cleanUp();
						completeCallback(status, statusText, content, type ? "Content-Type: " + type : null);
					});
					form[0].submit();
				});
				$("body").append(form, iframe);
			},
			abort: function() {
				if (iframe !== null) {
					iframe.unbind("load").attr("src", "javascript:false;");
					cleanUp();
				}
			}
		};
	}
});

function Upload($dom, options) {
	var defaults = {
		uploadUrl: "/api/upload",
		uploadingText: '<i class="light-blue fa fa-spinner fa-spin"></i>',
		callback: ""
	};
	this.options = $.extend(defaults, options);
	this.$dom = $($dom);
	this.init();
}
Upload.prototype.init = function() {
	var html = '<div class="uploadWidget"><input class="uploadFile" type="file" name="attachment" />' + '<div class="uploadProgress"><div class="uploadCloseBtn">×</div><div class="text"><span class="vMiddle">' + this.options.uploadingText + '</span><span class="vHeight"></span></div><div class="preview"><span class="vMiddle"><img src="" /></span><span class="vHeight"></span></div></div>' + '</div>';
	this.$dom.append(html);
	this.$progress = this.$dom.find(".uploadProgress");
	this.$preview = this.$progress.find(".preview");
	this.onFileChange();
	this.removeFile();
};
Upload.prototype.onFileChange = function() {
	var _this = this;
	this.$dom.off("change");
	this.$dom.on("change", ".uploadFile", function() {
		return _this.onUploading();
	});
};
Upload.prototype.onUploading = function() {
	this.$preview.hide();
	this.$progress.show();
	this.$dom.attr("uploading", 'true');
	var options = this.options;
	return this.xhr = $.ajax({
		url: this.options.uploadUrl,
		type: "post",
		dataType: "text",
		iframe: true,
		files: this.$dom.find(".uploadFile")
	}).done(function(_this) {
		return function(res) {
			res = typeof res === 'string' ? $.parseJSON(res) : res;
			if (!res || res.res_code !== 0) {
				return alert("附件上传出错!");
			}
//			_this.$preview.find("img").attr("src", res.obj.url || '');
//			_this.$preview.show();
			_this.$dom.attr("uploading", '');
//			_this.$dom.find('input[name="imgUrl"]').val(res.obj.url || '').change();
//			_this.$dom.find('input[name="imgUrl"]').attr("data-w", res.obj.w).attr("data-h", res.obj.h);
			if (options.callback) {
				options.callback(res, _this.$dom);
			}
		};
	}(this)).fail(function(_this) {
		return function() {
			return alert("附件上传失败!");
		};
	}(this));
};
Upload.prototype.removeFile = function() {
	this.$dom.off("click", ".uploadCloseBtn");
	return this.$dom.on("click", ".uploadCloseBtn", function(_this) {
		return function(e) {
			e.preventDefault();
			_this.$preview.find("img").attr("src", "");
			_this.$dom.find('input[name="imgUrl"]').val("").change();
			_this.$progress.hide();
		};
	}(this));
};
$.fn.upload = function(options) {
	return this.each(function() {
		var upload = $(this).data("uploadWidget");
		if (!upload) {
			return $(this).data("uploadWidget", new Upload(this, options));
		}
	});
};