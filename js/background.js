var HAITOU_URL="http://haitoubang.sinaapp.com";
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
			if (mre) {
                mre.lastIndex = 0;
                var show = mre.test(request.url);
                sendResponse({isshow: show});
            } else {
                sendResponse({isshow: false});
            }
		}
		if (request == "get-site"){
			sendResponse(sarr);
		}
	});
})();
/* 读取网站列表 */
var mre,sarr;
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
    			sarr = get('haitou_site_txt')
            }
        }
        xhr.send(null);
    }
    sarr = get('haitou_site_txt');
    mre = new RegExp(get('haitou_mre_txt'), 'i');
})();
function parseConfigXML(doc) {
    if (!doc) return;
    var m = doc.getElementsByTagName("matched")[0];
    var s = doc.getElementsByTagName("sitelist")[0];
    var mre = m.lastChild.nodeValue;
    var sarr = s.lastChild.nodeValue;
    if (mre) set('haitou_mre_txt', mre);
    if (sarr) set('haitou_site_txt', sarr);
}
function get(key) {
    return localStorage[key];
}
function set(key, val) {
    localStorage[key] = val;
}


