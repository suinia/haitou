(function(){
	var haitou_bg={};
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		if (request == "get-cookie"){
			chrome.cookies.get( {
			url: 'http://haitoubang.sinaapp.com', 
			name: 'user_id' }, 
			  	function( cookie ){
			  		sendResponse(cookie)
			  	})
		}
		if (request.type == "show-haitou"){
			if (mre) {
                mre.lastIndex = 0;
                var show = mre.test(request.url);
                sendResponse({isshow: show});
            } else {
                sendResponse({isshow: false});
            }
		}
	});
})();
/* 读取网站列表 */
var mre;
(function updateConfig() {
    var last = get('last_update_hour');
    var now = (new Date).getDate();
    if (!last || last != now) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', chrome.extension.getURL("/js/config.xml"), true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                parseConfigXML(xhr.responseXML.documentElement);
                set('last_update_hour', now);
                mre = new RegExp(get('haitou_mre_txt'), 'i');
            }
        }
        xhr.send(null);
    }
    mre = new RegExp(get('haitou_mre_txt'), 'i');
})();
function parseConfigXML(doc) {
    if (!doc) return;
    var m = doc.getElementsByTagName("matched")[0];
    var mre = m.lastChild.nodeValue;
    if (mre) set('mre_txt', mre);
}
function get(key) {
    return localStorage[key];
}
function set(key, val) {
    localStorage[key] = val;
}

