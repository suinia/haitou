(function () {
   function getVersionInManifest() {
        var version = 'NaN';
        var xhr = new XMLHttpRequest();
        xhr.open('GET', chrome.extension.getURL('manifest.json'), false);
        xhr.send(null);
        var manifest = JSON.parse(xhr.responseText);
        return manifest.version;
    }

    window.sendLog = function (logParams) {
        var vendor = localStorage["vendor"];
        var browser = localStorage["browser"] || "chrome";
        var extid = localStorage['guid'];
        var version = getVersionInManifest();
        var like = localStorage["like.enable"];
        var logUrlPrefix = "http://zhushou.huihui.cn/log?browser=" + browser + "&version=" + version + "&vendor=" + vendor + "&like=" + like + "&extensionid=" + extid + '&';
        var finalLogUrl = logUrlPrefix + logParams.join("&");
        img = document.createElement('img');
        img.setAttribute('src', finalLogUrl);
        img.setAttribute('style', 'display:none');
    }

    document.addEventListener("click", function (e) {
        var attrs, logAttrs, i, ilen, attr, isLogAttr, logName, img,
           finalLogUrl, matches, logNames;
        var maxlogAncestor, logTagFlag, target;

        target = e.target;
        maxlogAncestor = 5;
        logTagFlag = "log-action";
        while(maxlogAncestor && target) {
            if (target.getAttribute(logTagFlag)) {
                break;
            } else {
                target = target.parentElement;
                maxlogAncestor --;
            }
        }

        if (!!!maxlogAncestor || target === null) {
            return;
        }

        attrs =  target.attributes;
        logAttrs = [];
        logNames = [];
        for (i = 0, iLen = attrs.length; i < iLen; i++) {
            attr = attrs[i];
            isLogAttr = /^log|href/.test((attr.name));
            if (isLogAttr) {
                matches = (attr.name).match(/^log-(\w*)|(href)/);
                logName = matches[1] || matches[2];

                if (logName === "action") {
                    logAttrs.unshift(logName + '=' +attr.value);
                } else if (logName === "href") {
                    if (!/^javascript|\#/.test(attr.value)) {
                        logAttrs.push('toSite=' + encodeURI(attr.value));
                    }
                } else {
                    logAttrs.push(logName + '=' +attr.value);
                }
                logNames.push(logName);
            }
        }
        if (logNames.indexOf("type") < 0) {
            logAttrs.unshift('type=ARMANI_EXTENSION_ACTION');
        }
        sendLog(logAttrs);
   });
}());
