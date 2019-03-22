__CreateJSPath = function (js) {
    var scripts = document.getElementsByTagName("script");
    var path = "";
    for (var i = 0, l = scripts.length; i < l; i++) {
        var src = scripts[i].src;
        if (src.indexOf(js) != -1) {
            var ss = src.split(js);
            path = ss[0];
            privilegeBasePath = path.split('/a/')[0];
            break;
        }
    }
    var href = location.href;
    href = href.split("#")[0];
    href = href.split("?")[0];
    var ss = href.split("/");
    ss.length = ss.length - 1;
    href = ss.join("/");
    if (path.indexOf("https:") == -1 && path.indexOf("http:") == -1 && path.indexOf("file:") == -1 && path.indexOf("\/") != 0) {
        path = href + "/" + path;
    }
    return path;
}
checkJQuery = function(){
    var scripts = document.getElementsByTagName("script");
    var result = false;
    for (var i = 0, l = scripts.length; i < l; i++) {
        var src = scripts[i].src;
        if (src.indexOf("jquery.min.js") != -1) {
            result = true;
            break;
        }
    }
    return result;
}
var privilegeBasePath = '';
var bootPATH = __CreateJSPath("scripts/boot.js")+"scripts/";

// 静态资源版本号
var jsVersion = getCookie("jsVersion") || '2.0.0';
// 使用默认皮肤
//mode
var skin = getCookie("miniuiSkin") || 'ys';             //skin cookie   cupertino
var mode = getCookie("miniuiMode") || 'large';                 //mode cookie     medium

mini_debugger = false;

// 加载配置信息
document.write('<script src="' + bootPATH + 'config.js" type="text/javascript" ></sc' + 'ript>');

// miniui
if(!checkJQuery()){
	document.write('<script src="' + bootPATH + 'jquery.min.js" type="text/javascript"></sc' + 'ript>');
}
document.write('<link href="' + bootPATH + 'miniui/themes/bootstrap.css?v='+jsVersion+'" rel="stylesheet" type="text/css" />');

//miniui
document.write('<script src="' + bootPATH + 'miniui/miniui.js" type="text/javascript" ></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'libs/messenger.js" type="text/javascript" ></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'libs/sea.js" type="text/javascript" ></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'ajax.js?v='+jsVersion+'" type="text/javascript" ></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'base.js?v='+jsVersion+'" type="text/javascript" ></sc' + 'ript>');
document.write('<link href="' + bootPATH + 'miniui/themes/default/miniui.css?v='+jsVersion+'" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPATH + 'miniui/themes/icons.css?v='+jsVersion+'" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPATH + 'miniui/res/font-awesome/css/font-awesome.min.css?v='+jsVersion+'" rel="stylesheet" type="text/css" />');

//mode
if (mode && mode != "default") document.write('<link href="' + bootPATH + 'miniui/themes/default/' + mode + '-mode.css?v='+jsVersion+'" rel="stylesheet" type="text/css" />');

// skin
if (skin) {
    document.write('<link href="' + bootPATH + 'miniui/themes/' + skin + '/skin.css?v='+jsVersion+'" rel="stylesheet" type="text/css" />');
    document.write('<link href="' + bootPATH + 'miniui/themes/' + skin + '/anticon.css?v='+jsVersion+'" rel="stylesheet" type="text/css" />');
    document.write('<link href="' + bootPATH + 'miniui/themes/' + skin + '/'+mode+'-mode.css?v='+jsVersion+'" rel="stylesheet" type="text/css" />');
}
document.write('<link href="' + bootPATH + 'miniui/themes/custom.css?v='+jsVersion+'" rel="stylesheet" type="text/css" />');


// 加载常用组件
// 富文本编辑器
document.write('<script src="' + bootPATH + 'libs/kindeditor/kindeditor-all-min.js" type="text/javascript" ></sc' + 'ript>');// 加载百度编辑器
document.write('<script src="' + bootPATH + 'libs/kindeditor/lang/zh-CN.js" type="text/javascript" ></sc' + 'ript>');// 加载百度编辑器

// 附件上传控件
document.write('<script src="' + bootPATH + 'libs/plupload/plupload.full.min.js" type="text/javascript" ></sc' + 'ript>');

// 选择器组件
document.write('<script src="' + bootPATH + 'libs/selector.js" type="text/javascript" ></sc' + 'ript>');

// 图片预览插件
document.write('<link href="' + bootPATH + 'libs/viewer/viewer.css?v='+jsVersion+'" rel="stylesheet" type="text/css" />');
document.write('<script src="' + bootPATH + 'libs/viewer/viewer.js" type="text/javascript" ></sc' + 'ript>');

//////////////////////////////////////////////////////////////////////////////////////// cookie操作
function getCookie(sName) {
    var aCookie = document.cookie.split("; ");
    var lastMatch = null;
    for (var i = 0; i < aCookie.length; i++) {
        var aCrumb = aCookie[i].split("=");
        if (sName == aCrumb[0]) {
            lastMatch = aCrumb;
        }
    }
    if (lastMatch) {
        var v = lastMatch[1];
        if (v === undefined) return v;
        return unescape(v);
    }
    return null;
}