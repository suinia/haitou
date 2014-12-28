var HAITOU_URL="http://haitoubang.sinaapp.com";
function get(key) {
    return localStorage[key];
}
function set(key, val) {
    localStorage[key] = val;
}
(function(){
	var haitou_bg={};
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		if (request == "get-cookie"){
			chrome.cookies.get( {
			url: HAITOU_URL, 
			name: 'user_id' }, 
			  	function( cookie ){
			  		sendResponse(cookie)
			  	})
		}
		if (request.type == "show-haitou"){
			if (reg_url) {
                reg_url.lastIndex = 0;
                var show = reg_url.test(request.url);
                sendResponse({isshow: show});
            } else {
                sendResponse({isshow: false});
            }
		}
		if (request == "get-site"){
			sendResponse(reg_site);
		}
		if (request.type == "get-userinfo"){
			sendResponse(get('haitou_userinfo')||"");
		}
		if (request.type == "set-userinfo"){
			set('haitou_userinfo', request.data);
			sendResponse(true);
		}
		if (request.type == "rm-userinfo"){
			localStorage.removeItem('haitou_userinfo');
			sendResponse(true);
		}
	});
})();
/* 读取网站列表 */
var reg_url,reg_site;
(function updateRegUrl() {
    var last = get('last_update_reggul');
    var now = (new Date).getDate();
    if (!last || last != now) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', HAITOU_URL+'/static/url_regex.xml', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                parseConfigXML(xhr.responseXML.documentElement);
                set('last_update_reggul', now);
                reg_url = new RegExp(get('haitou_reg_url'), 'i');
            }
        }
        xhr.send(null);
    }
    reg_url = new RegExp(get('haitou_reg_url'), 'i');
})();
(function updateSiteList() {
    var last = get('last_update_sitedemo');
    var now = (new Date).getDate();
    if (!last || last != now) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', HAITOU_URL+'/static/demo_site.xml', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                parseConfigXML(xhr.responseXML.documentElement);
                set('last_update_sitedemo', now);
    			reg_site = get('haitou_reg_txt')
            }
        }
        xhr.send(null);
    }
    reg_site = get('haitou_reg_txt');
})();
function parseConfigXML(doc) {
    if (!doc) return;
    var m = doc.getElementsByTagName("matched")[0];
    var s = doc.getElementsByTagName("sitelist")[0];
    if(m){
    	var mre = m.lastChild.nodeValue;
    	if (mre) set('haitou_reg_url', mre);
    }
    if(s){
	    var sarr = s.lastChild.nodeValue;
	    if (sarr) set('haitou_reg_txt', sarr);
    }
}
// 每隔半10分钟拉取查看是否有未读通知
if(chrome.notifications) {
      showNotify();
      var interval = 0;
      var timer = setInterval(function() {
        interval++;
        if (60*10 <= interval) {
              showNotify();
              interval = 0;
        }
      }, 1000);
}
var testNotifyId = 0;
function showNotify(){
	var xhr = new XMLHttpRequest();
    xhr.open('POST', HAITOU_URL+'/api/apply/notice', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
        	var res = typeof xhr.response === 'string' ? JSON.parse(xhr.response) : xhr.response;
        	var options =  {
                type: "basic",
                title: "海投帮 - 投简历快人一步",
                message: "海投帮",
                iconUrl: "images/icon-48.png",
                buttons: [{ title: "去看看"}]
            };
        	if(res && res.res_code === 0 && res.msg.read_cnt){
	            try {
		           	options.message = res.msg.read_cnt+'个职位申请HR已查看了';
	                chrome.notifications.create("haitou.notice." + testNotifyId++, options, function () {});
	            } catch(e) {
	            }
            }
        	if(res && res.res_code === 0 && res.msg.reply_cnt){
	            try {
		           	options.message = res.msg.reply_cnt+'个职位申请收到HR回复了';
	                chrome.notifications.create("haitou.notice." + testNotifyId++, options, function () {});
	            } catch(e) {
	            }
            }
        }
    }
    xhr.send(null);
}
chrome.notifications.onClicked.addListener(function() {
	window.open(HAITOU_URL+'/apply/list')
})
chrome.notifications.onButtonClicked.addListener(function (){
	window.open(HAITOU_URL+'/apply/list');
})
