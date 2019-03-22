//ie console.time()
if (window.console && typeof(window.console.time) == "undefined") {
    console.time = function (name, reset) {
        if (!name) {
            return;
        }
        var time = new Date().getTime();
        if (!console.timeCounters) {
            console.timeCounters = {}
        }
        ;
        var key = "KEY" + name.toString();
        if (!reset && console.timeCounters[key]) {
            return;
        }
        console.timeCounters[key] = time;
    };

    console.timeEnd = function (name) {
        var time = new Date().getTime();
        if (!console.timeCounters) {
            return;
        }
        var key = "KEY" + name.toString();
        var timeCounter = console.timeCounters[key];
        if (timeCounter) {
            var diff = time - timeCounter;
            var label = name + ": " + diff + "ms";
            console.info(label);
            delete console.timeCounters[key];
        }
        return diff;
    };
}

// 获取配置
function getConf(){
    if(MainConfig.evn ==='local'){
        return MainConfig.local;
    }else if(MainConfig.evn === 'dev'){
        return MainConfig.dev;
    }else if(MainConfig.evn ==='test'){
        return MainConfig.test;
    }else if(MainConfig.evn ==='prod'){
        return MainConfig.prod;
    }
}

/**
 * 公共操作Cookie的方法，用法如：【base.utils.cookie("cookieName", "cookieValue", { expires: 7 }); //存储一个带7天期限的cookie】
 * @param name 名称 必选
 * @param value 值 value为空时默认为获取对应cookie的值 可选
 * @param options 配置信息 可选
 * @returns {*}   ---》 { expires: 7, path:'/' }
 */
function cookieOpt(name, value, options) {
    if (typeof value != 'undefined') {
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString();
        }
        var path = options.path ? '; path=' + (options.path) : '/';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
}

// ########################################################################消息监听 start
if(top.window!=window){
    //跨域调用方法，sendMessage();
    var messenger = new Messenger('childWindow', 'MessengerMos');
    messenger.addTarget(window.top, 'parent');

    function sendMessage(name, msg) {
        messenger.targets[name].send(msg);
    }
}

// 接收父窗口传来的
var messengerSid = new Messenger('childWindow1', 'MessengerMos');
//跨域调用方法
messengerSid.addTarget(window.top, 'parent');
messengerSid.listen(function (msgs) {
    if(msgs){
        if(msgs.indexOf('__Messenger__')!=-1){
            var msgsTemp = msgs.split('__Messenger__');
            msgs = msgsTemp[1];
        }
        var obj = eval('('+msgs+')');
        if(!window.loginUser || !window.loginUser.username){
            window.loginUser = obj.loginUser;
        }
        if(!window.systemSn){
            window.systemSn = obj.sysSn;
        }
        if(!window.systemName){
            window.systemName = obj.sysName;
        }
        if(!window.moduleSn){
            window.moduleSn = obj.mSn;
        }
        if(!window.moduleName){
            window.moduleName = obj.mName;
        }
        if(!window.companyId){
            window.companyId = obj.companyId;
        }
        if(!window.companyName){
            window.companyName = obj.companyName;
        }
        if(!window.privilegeUrl){
            window.privilegeUrl = obj.privilegeUrl;
        }
        cookieOpt('sid', obj.sid, {path:'/'});
        cookieOpt('miniuiSkin', obj.skin, {path:'/'});
        buttonHasPermission(obj.privilegeUrl);
    }
});

// ########################################################################消息监听 end

function showMsg(msg, t) {
    switch (t) {
        case 1: //成功提示
            showSuc(msg);
            break;
        case 2:
            showWarn(msg);
            break;
        case 3:
            showError(msg);
            break;
        default :
            showInfo(msg);
            break;
    }
}

/**
 * 【全局方法】成功提示框 - 全局遮罩 【自动关闭】3.0秒后自动关闭
 * @param msg 提示信息
 */
function showSuc(msg) {
	try{
		top.mini.showTips({
	        content: '<b>提示</b> <br/>'+msg,
	        state: 'success',	//default|success|info|warning|danger
	        x:'center',			//left|center|right
	        y: 'top',		//top|center|bottom
	        timeout:3000		//自动消失间隔时间。默认2000（2秒）。
	    });
	}catch(e){
		// 如果是跨域过来的，则发送Messenger消息到主框架
		var data = JSON.stringify({fn:'showSuc', msg:msg});
		sendMessage('parent', data);
	}
}

/**
 * 【全局方法】一般信息框 - 全局遮罩 【手动关闭】3.0秒后自动关闭
 * @param msg 提示信息
 */
function showInfo(msg) {
	try{
		top.mini.showMessageBox({
	        showHeader: true,
	        width: 250,
	        title: '提示',
	        buttons: ["ok"],
	        message: '<div style="width: 185px;word-wrap: break-word;word-break: break-word;white-space: normal;">'+msg+'</div>',
	        iconCls: 'mini-messagebox-info'
	    });
	}catch(e){
		// 如果是跨域过来的，则发送Messenger消息到主框架
		var data = JSON.stringify({fn:'showInfo', msg:msg});
		sendMessage('parent', data);
	}
}

/**
 * 【全局方法】警告提示框 - 全局遮罩 【手动关闭】3.0秒后自动关闭
 * @param msg 提示信息
 */
function showWarn(msg) {
	try{
	    top.mini.showMessageBox({
	        showHeader: true,
	        width: 250,
	        title: '警告信息',
	        buttons: ["ok"],
	        message: '<div style="width: 185px;word-wrap: break-word;word-break: break-word;white-space: normal;">'+msg+'</div>',
	        iconCls: 'mini-messagebox-warning'
	    });
	}catch(e){
		// 如果是跨域过来的，则发送Messenger消息到主框架
		var data = JSON.stringify({fn:'showWarn', msg:msg});
		sendMessage('parent', data);
	}
}

/**
 * 【全局遮罩】图片预览功能，弹出预览框
 * @param opt
 * opt = {current:0, imgs:[{name:'test.jpg', url:'/images/test.jpg'}]}
 */
function imgPreview(opt) {
	try{
	    top.imgPreviewCtrl(opt);
	}catch(e){
		// 如果是跨域过来的，则发送Messenger消息到主框架
		var data = JSON.stringify({fn:'imgPreview', msg:opt});
		sendMessage('parent', data);
	}
}

// 图片预览插件，弹出预览框
function imgPreviewCtrl(opt){
    var _box = $('<div />');
    if(opt && opt.imgs){
        $.each(opt.imgs, function (i, o) {
            var img = $('<img />');
            if (new RegExp("http://|https://").test(o.url) ){
                img.attr('src', o.url);
            }else{
                img.attr('src', getConf().staticBasePath + (o.url.indexOf('/')==0?o.url:"/"+o.url));
            }
            img.on('error', function(){
                img.unbind('error')
                this.src = privilegeBasePath + "/a/img/public/img-onerror.png";
            });
            img.attr('alt', o.name);
            _box.append(img);
        });
    }
    var viewer = new Viewer(_box[0], {
        hidden: function () {
            viewer.destroy();
            _box.remove();
        }
    });
    viewer.view(opt.current);
    viewer.show();
}


/**
 * 【全局方法】错误提示框 - 全局遮罩【手动关闭】
 * @param msg 提示信息
 */
function showError(msg) {
	try{
		top.mini.showMessageBox({
	        showHeader: true,
	        width: 250,
	        title: '错误提示',
	        buttons: ["ok"],
	        message: '<div style="width: 185px;word-wrap: break-word;word-break: break-word;white-space: normal;">'+msg+'</div>',
	        iconCls: 'mini-messagebox-error'
	    });
	}catch(e){
		// 如果是跨域过来的，则发送Messenger消息到主框架
		var data = JSON.stringify({fn:'showError', msg:msg});
		sendMessage('parent', data);
	}
}

/**
 * 【全局方法】成功提示框 - 全局遮罩 【自动关闭】3.0秒后自动关闭
 * @param msg 提示信息
 */
function showSucTips(msg) {
    try{
		top.mini.showTips({
	        content: "<b>成功</b> <br/>"+msg,
	        state: 'success',
	        x: 'center',
	        y: 'top',
	        timeout: 3000
	    });
    }catch(e){
		// 如果是跨域过来的，则发送Messenger消息到主框架
		var data = JSON.stringify({fn:'showSucTips', msg:msg});
		sendMessage('parent', data);
	}
}

/**
 * 【全局方法】错误提示框 - 全局遮罩 【自动关闭】3.0秒后自动关闭
 * @param msg 提示信息
 */
function showErrTips(msg) {
    try{
		top.mini.showTips({
	        content: "<b>错误</b> <br/>"+msg,
	        state: 'danger',
	        x: 'center',
	        y: 'top',
	        timeout: 3000
	    });
    }catch(e){
		// 如果是跨域过来的，则发送Messenger消息到主框架
		var data = JSON.stringify({fn:'showErrTips', msg:msg});
		sendMessage('parent', data);
	}
}

/**
 * 【全局方法】警告提示框 - 全局遮罩 【自动关闭】3.0秒后自动关闭
 * @param msg 提示信息
 */
function showWarnTips(msg) {
    try{
		top.mini.showTips({
	        content: "<b>警告</b> <br/>"+msg,
	        state: 'warning',
	        x: 'center',
	        y: 'top',
	        timeout: 3000
	    });
    }catch(e){
		// 如果是跨域过来的，则发送Messenger消息到主框架
		var data = JSON.stringify({fn:'showWarnTips', msg:msg});
		sendMessage('parent', data);
	}
}

/**
 * 【全局方法】普通信息提示框 - 全局遮罩 【自动关闭】3.0秒后自动关闭
 * @param msg 提示信息
 */
function showInfoTips(msg) {
    try{
		top.mini.showTips({
	        content: "<b>信息</b> <br/>"+msg,
	        state: 'info',
	        x: 'center',
	        y: 'top',
	        timeout: 3000
	    });
    }catch(e){
		// 如果是跨域过来的，则发送Messenger消息到主框架
		var data = JSON.stringify({fn:'showInfoTips', msg:msg});
		sendMessage('parent', data);
	}
}

function _getLoginUser(iframe) {
    // 如果是跨域过来的，则发送Messenger消息到主框架
    var data = JSON.stringify({fn:'getLoginUser', msg:"getLoginUser"});
    sendMessage('parent', data);
}

/**
 * 【全局方法】显示进度条 2.5s后自动关闭
 * @param msg 提示信息
 */
function showProcess(msg) {
    try{
        var messageid = top.mini.loading(msg, "Loading");
        setTimeout(function () {
            top.mini.hideMessageBox(messageid);
        }, 2500);
    }catch(e){
        var messageid = mini.loading(msg, "Loading");
        setTimeout(function () {
            mini.hideMessageBox(messageid);
        }, 2500);
    }
}

/**
 * 【全局方法】显示确认对话框 fn()为确认按钮调用函数
 * @param msg 提示消息
 * @param fn 确定后回调函数
 */
function showConfirm(msg, fn) {
	try{
		top.mini.confirm('<div style="width: 185px;word-wrap: break-word;word-break: break-word;white-space: normal;">'+msg+'</div>', "确定？",
	        function (action) {
	            if (action == "ok") {
	            	if (typeof fn == "function") {
	                    fn();
	                }
	            }
	        }
	    );
	}catch(e){
		mini.confirm('<div style="width: 185px;word-wrap: break-word;word-break: break-word;white-space: normal;">'+msg+'</div>', "确定？",
	        function (action) {
	            if (action == "ok") {
	            	if (typeof fn == "function") {
	                    fn();
	                }
	            }
	        }
	    );
	}
}

/**
 * 【全局方法】增加Tab
 * @param opts 配置参数
 * opts = {title:'增加用户', url:'http://www.domain.com'}
 */
function addBlankTab(opts) {
    opts['sid'] = opts.sid||cookieOpt('sid'), opts['systemSn'] = opts.systemSn||window.systemSn, opts['moduleSn']=opts.moduleSn||window.moduleSn;
    try {
        top.addNewTab(opts, true);
    } catch (e) {
        if(opts.text&&!opts.title){
            opts.title = opts.text;
        }

    	var data = JSON.stringify({fn:'showTab', msg:JSON.stringify(opts)});
        sendMessage('parent', data);
    }
};
//增加Tab
function addTab(opts) {
    addNewTab(opts, false);
}

//增加Tab
function addNewTab(opts, blank) {
	var menuTabs = top.mini.get('jsMenuTabs');
    var title = opts.title||opts.text;
    // URL上封装sessionId系统和模块SN
    // ?sessionId=bcb63e56-e3ac-488f-aa71-9ef994a80dd6&moduleSn=demo-list&systemSn=privilege
    var url = opts.url;
    url = changeURLPar(url, 'sessionId', cookieOpt('sid')||opts.sid)
    url = changeURLPar(url, 'systemSn', window.systemSn||opts.systemSn)
    url = changeURLPar(url, 'moduleSn', window.moduleSn||opts.moduleSn)

    var id = opts.id;
    var iframed = opts.iframed || true;
    var refreshed = opts.refreshed || true;
    var closabled = opts.closabled || true;
    var getTb = menuTabs.getTab(title);
    if(getTb){
        var activeTab = menuTabs.getActiveTab();
        if(activeTab.title==getTb.title){
            getTb.url = url;
        	menuTabs.loadTab(url, getTb);
            return;
        }
        menuTabs.activeTab(getTb);
        if (refreshed) {
            getTb.url = url;
            menuTabs.loadTab(url, getTb);
        }
        return;
    }

    var tab = {title: title, name:title, url:url, id:id, showCloseButton:closabled};
	menuTabs.addTab(tab);
	menuTabs.activeTab(tab);
}

/**
 * 【全局方法】刷新指定的Tab
 * @param title Tab标题
 */
function refreshTab(title) {
    try {
        var menuTabs = top.mini.get('jsMenuTabs');
        var tab = null;
        if (!title || title == "current") {
            tab = menuTabs.getActiveTab();
        } else {
        	tab = menuTabs.getTab(title)
        }
        if(tab){
        	menuTabs.activeTab(tab);
        	menuTabs.reloadTab(tab); 
        }
    } catch (e) {
        if (!title) {
            title = "current";
        }
        var data = JSON.stringify({fn:'refreshTab', msg:title});
        sendMessage('parent', data);
    }
}

/**
 * 【全局方法】关闭指定的Tab
 * @param title Tab标题
 */
function closeTab(title) {
    try {
    	var menuTabs = top.mini.get('jsMenuTabs');
        if (!title || title == "current") {
            var tab = menuTabs.getActiveTab();
            menuTabs.removeTab(tab)
        } else {
        	menuTabs.removeTab(title)
        }
    } catch (e) {
        if (!title) {
            title = "current";
        }
        var data = JSON.stringify({fn:'closeTab', msg:title});
        sendMessage('parent', data);
    }
}

function closeTabEx(title) {
    try {
        top.closeTab(title);
    } catch (e) {
    	var data = JSON.stringify({fn:'closeTabEx', msg:title});
        sendMessage('parent', data); //调用  parent的closeTabEx标识 匹配的方法 closeMainTabForNoteIdIsNull
    }
};

//201602196wen
function refreshTabEx(title) {
    try {
        top.refreshTab(title, true);
    } catch (e) {
    	var data = JSON.stringify({fn:'refreshTabEx', msg:title});
        sendMessage('parent', data); //调用  parent的refreshTabEx标识 匹配的方法 refreshMainTabForNoteIdIsNull
    }
};

// js debug
function debug(msg) {
    console.debug(msg);
}


// 页面加载
$(function () {
	//buttonHasPermission();
    // 初始化列表搜索栏功能
    setTimeout(function () {
        baseUtils.Tools.init();

        baseUtils.ListSearchBox.init();
    })
});

(function($){
    $.fn.serializeJson=function(){
        var serializeObj={};
        var array=this.serializeArray();
        // var str=this.serialize();
        $(array).each(function(){
            if(serializeObj[this.name]){
                if($.isArray(serializeObj[this.name])){
                    serializeObj[this.name].push(this.value);
                }else{
                    serializeObj[this.name]=[serializeObj[this.name],this.value];
                }
            }else{
                serializeObj[this.name]=this.value;
            }
        });
        return serializeObj;
    };
})(jQuery);

// 设置Ajax请求头信息
// 获取sid
$.ajaxSetup({beforeSend:function(XMLHttpRequest){
	var sid = cookieOpt('sid');
	var siamTgt = cookieOpt('SIAMTGT');
    XMLHttpRequest.setRequestHeader("sessionId", sid);
    XMLHttpRequest.setRequestHeader("SIAMTGT", siamTgt);
}, statusCode:{
	999: function(){
		showError('登录超时！');
		location.href = getConf().idmLogin?(getConf().portalUrl+"/main.jhtml"):'/p/login.html';
	},
	888: function(){
		showWarnTips('没有权限，请联系管理员！');
	}
}});

/**
 * 【全局方法】获取URL上的请求参数， 如?a=1&b=2  ---》getQueryString('a'); ->1
 * @param name
 * @returns {*}
 */
function getQueryString(name) {
    var url = location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=strs[i].split("=")[1];
        }
    }
    var str=theRequest[name];
    if(typeof str !='undefined'){
        str=str.replace(/\+/g,' ');
    }
    return str;
}


/**
 * 【全局方法】修改指定URL上的请求参数， 如?a=1&b=2  ---》changeURLPar(url, 'a', 5); ->a=5
 * @param url 指定的URL
 * @param key 参数Key， 若不存在则添加此参数
 * @param value 参数要修改的Value
 * @returns {string}
 */
function changeURLPar(url, key, value) {
    var str = "";
    if (url.indexOf('?') != -1)
        str = url.substr(url.indexOf('?') + 1);
    else
        return url + "?" + key + "=" + value;
    var returnurl = "";
    var setparam = "";
    var arr;
    var modify = "0";
    if (str.indexOf('&') != -1) {
        arr = str.split('&');
        for (var i=0; i< arr.length; i++) {
            if (arr[i].split('=')[0] == key) {
                setparam = value;
                modify = "1";
            } else {
                setparam = arr[i].split('=')[1];
            }
            returnurl = returnurl + arr[i].split('=')[0] + "=" + setparam + "&";
        }
        returnurl = returnurl.substr(0, returnurl.length - 1);
        if (modify == "0")
            if (returnurl == str)
                returnurl = returnurl + "&" + key + "=" + value;
    } else {
        if (str.indexOf('=') != -1) {
            arr = str.split('=');
            if (arr[0] == key) {
                setparam = value;
                modify = "1";
            } else {
                setparam = arr[1];
            }
            returnurl = arr[0] + "=" + setparam;
            if (modify == "0")
                if (returnurl == str)
                    returnurl = returnurl + "&" + key + "=" + value;
        } else
            returnurl = key + "=" + value;
    }
    return url.substr(0, url.indexOf('?')) + "?" + returnurl;
    // history.replaceState(window.location.href, ref, url.substr(0, url.indexOf('?')) + "?" + returnurl);
}

/**
 * 改变当前地址的URL参数
 * @param ref
 * @param value
 * @returns {string}
 */
function changeCurrURLPar(ref, value) {
    var url = window.location.href;
    var str = "";
    if (url.indexOf('?') != -1)
        str = url.substr(url.indexOf('?') + 1);
    else
        str = ref + "=" + value;
    var returnurl = "";
    var setparam = "";
    var arr;
    var modify = "0";
    if (str.indexOf('&') != -1) {
        arr = str.split('&');
        for (var i=0; i< arr.length; i++) {
            if (arr[i].split('=')[0] == ref) {
                setparam = value;
                modify = "1";
            } else {
                setparam = arr[i].split('=')[1];
            }
            returnurl = returnurl + arr[i].split('=')[0] + "=" + setparam + "&";
        }
        returnurl = returnurl.substr(0, returnurl.length - 1);
        if (modify == "0")
            if (returnurl == str)
                returnurl = returnurl + "&" + ref + "=" + value;
    } else {
        if (str.indexOf('=') != -1) {
            arr = str.split('=');
            if (arr[0] == ref) {
                setparam = value;
                modify = "1";
            } else {
                setparam = arr[1];
            }
            returnurl = arr[0] + "=" + setparam;
            if (modify == "0")
                if (returnurl == str)
                    returnurl = returnurl + "&" + ref + "=" + value;
        } else
            returnurl = ref + "=" + value;
    }
    history.replaceState(window.location.href, ref, url.substr(0, url.indexOf('?')) + "?" + returnurl);
}

// 当前模块的权限值
var currentPermissions = null;

/**
 * 显示按钮的权限判断，是否显示
 * 注意：这个方法一定要在初始化方法里面调用，而且一定要在mini.parse();之前调用
 */
function buttonHasPermission(privilegeSystemUrl) {
    var systemSn = getQueryString("systemSn")||window.systemSn;
    var moduleSn = getQueryString("moduleSn")||window.moduleSn;
    privilegeSystemUrl = privilegeSystemUrl||window.privilegeSystemUrl;
    var permissions = [];
    var datas = $('[class*="permission-"');
    $.each(datas, function(i, o){
    	var pms = /permission\-(\d+)/g.exec(o.className);
    	permissions.push(pms[1]);
    });

    if(currentPermissions){
        var showItems = [], hidItems = [];
        for (var k in currentPermissions){
            // items.push('.permission-'+k);
            currentPermissions[k+""]?showItems.push('.permission-'+k):hidItems.push('.permission-'+k);
            // dt[k+""]?$(".permission-"+k).fadeIn("fast",function(){$(this).css('display','inline-block').css('color', 'red')}):$(".permission-"+k).hide();
        }
        // showItems.length&&$(showItems.join(',')).fadeIn("fast",function(){$(this).css({'display':'inline-block', 'opacity':'1'})});
        showItems.length&&$(showItems.join(',')).removeClass('hide');
        // showItems.length>0?mini.parse(showItems.join(',')):null;
        hidItems.length&&$(hidItems.join(',')).hide();
        return;
    }

    if(datas.size()>0 && systemSn && moduleSn){
    	var url = (privilegeSystemUrl||"")+'/managment/privilege/acl/hasPermissions';
        currentPermissions||$.POST({
            url:url,
            data:{sessionId:cookieOpt('sid'), systemSn:systemSn,moduleSn:moduleSn},
            async:true,
            success:function(dt){
                currentPermissions = dt;
            	if(dt){
            	    var showItems = [], hidItems = [];
            		for (var k in dt){
            		    // items.push('.permission-'+k);
                        dt[k+""]?showItems.push('.permission-'+k):hidItems.push('.permission-'+k);
            			// dt[k+""]?$(".permission-"+k).fadeIn("fast",function(){$(this).css('display','inline-block').css('color', 'red')}):$(".permission-"+k).hide();
	        	    }
                    // showItems.length&&$(showItems.join(',')).fadeIn("fast",function(){$(this).css({'display':'inline-block', 'opacity':'1'})});
                    showItems.length&&$(showItems.join(',')).removeClass('hide');
                    // showItems.length>0?mini.parse(showItems.join(',')):null;
	        	    hidItems.length&&$(hidItems.join(',')).hide();

        	    }
            }
        });
    }
}

/**
 * 【全局方法】【全局遮罩】开启全局遮罩层
 * @param msg 提示消息
 */
function mask(msg){
    try{
        top.mini.mask({
            el: document.body,
            cls: 'mini-mask-loading',
            html: msg?msg:'加载中...'
        });
    }catch(e){
        // 如果是跨域过来的，则发送Messenger消息到主框架
        var data = JSON.stringify({fn:'mask', msg:msg});
        sendMessage('parent', data);
    }
}

/**
 * 【全局方法】关闭全局遮罩层
 */
function unmask(){
    try{
        top.mini.unmask(document.body);
    }catch(e){
        // 如果是跨域过来的，则发送Messenger消息到主框架
        var data = JSON.stringify({fn:'unmask', msg:""});
        sendMessage('parent', data);
    }
}


/**
 * 表格初始化
 * @param options
   // 使用方法
   JS 部分
   var options = {
        grid:this.grid,       // 操作的datagrid表格对象 【必需设置】
        buttons:[
            {
                text:'添加',  // 操作按钮名称 【必需设置】
                pms:1,       // 权限值  【可选】   不设置则默认显示
                iconCls:'',     // 按钮图标 【可选】
                click:system.list.testClick,    // 点击事件 【必需设置】，如果不设置则此按钮无意义
                filter:function(e){             // 过滤按钮 【可选】 显示/隐藏 返回ture才显示
                    return true;
                }
            },
            {
                text:'修改',
                pms:2,
                click:function(e){
                    console.log('修改');
                }
            },
            {
                text:'删除',
                pms:3,
                click:system.list.testClick
            }
        ]
    };
    initOptions(options);

    HTML部分：
    添加此列 【name="opt" field="opt" cellCls="tbl-columns-opt"】 属性 必需设置
    <div header="操作" name="opt" field="opt" cellCls="tbl-columns-opt" readOnly="true" allowResize="false" allowMove="false" headerAlign="center" width="14">操作</div>
 */
function initOptions(options) {
    // 生成按钮， 返回按钮对象
    var genOptBtn = function (button) {
        var classNames = '';
        if(button.pms!=undefined && button.pms!=null){
            var hide = 'hide';

            if(!currentPermissions){
                var url = (privilegeBasePath||"")+'/managment/privilege/acl/hasPermissions';
                var systemSn = getQueryString("systemSn")||window.systemSn;
                var moduleSn = getQueryString("moduleSn")||window.moduleSn;
                $.POST({
                    url:url,
                    data:{sessionId:cookieOpt('sid'), systemSn:systemSn,moduleSn:moduleSn},
                    async:false,
                    success:function(dt){
                        currentPermissions = dt;
                    }
                });
            }
            if(currentPermissions){
                hide = currentPermissions[button.pms+""]?'':'hide';
            }
            classNames = 'lst-permission-'+button.pms+' '+hide;
        }
        var iconCls = button.iconCls?(' fa fa-' + button.iconCls):' fa';

        // 创建按钮对象
        var btn = $('<a>');
        btn.attr({'class':('lst-btn '+ classNames+' '+iconCls),
            'title':(button.title?button.title:button.text),
            href:'javascript:void(0);'});
        btn.text(button.text?(" "+button.text):"");
        return btn;
    }

    if(!options.grid){
        console.error('找不到datagrid对象，请设置options.grid');
        return;
    }
    options.grid.on('cellclick', function (e) {
        var field = e.field,catchClickCount = 0;
        if(field ==='opt'){
            if(e.htmlEvent.target.tagName.toUpperCase() === "A"){
                $.each(options.buttons, function (i, o)  {
                    // debugger;
                    // 点击事件通过text匹配，如果text匹配不上，再通过title匹配
                    if(" "+o.text === e.htmlEvent.target.text||o.title === e.htmlEvent.target.title){
                        catchClickCount++;
                        if(o.click && (typeof o.click == 'function')){
                            o.click(e);
                            return;
                        }else{
                            showInfoTips("按钮的click属性不是一个方法！");
                            return;
                        }
                    }
                });
                if(catchClickCount==0){
                    showInfoTips("请设置按钮的text/title属性！");
                }
            }
        }
    });

    options.grid.on('drawcell', function (e) {
        var field = e.field;
        if(field=='opt'){
            var html = '', btns = [];
            if(options.buttons){
                var buttons = options.buttons;
                for(var i=0; i< buttons.length; i++){
                    var btnObj = genOptBtn(buttons[i]);
                    // debugger;
                    if(!btnObj.hasClass('hide')){
                        if(buttons[i].filter){
                            if(buttons[i].filter(e)){
                                btns.push(btnObj);
                            }else{
                                continue;
                            }
                        }else{
                            btns.push(btnObj);
                        }
                    }
                }
            }else{
                e.cellHtml = '';
                console.error('请添加表格操作按钮！');
                return;
            }
            // 默认显示两个按钮
            options.showCount = options.showCount==undefined?2:options.showCount==0?0:options.showCount<0?1000:options.showCount;
            html += '<div class="tbl-opts" style="text-align:'+(options.showCount==0?'center':'left')+'">';
            // 超过显示的按钮数量（showCount）后省略...
            if(btns.length>options.showCount){
                for(var i = 0; i < options.showCount; i++){
                    html+=('<span class="separator '+(btns[i][0].className.indexOf('hide')==-1?'':'hide')+'"></span>' + btns[i][0].outerHTML);
                }
                html+='<a href="javascript:void(0)" class="show-more fa fa-ellipsis-h"></a>';
                for(var i = options.showCount; i < btns.length; i++){
                    var a = btns[i];
                    a.addClass('more');
                    html+=('<span class="more separator '+(a[0].className.indexOf('hide')==-1?'':'hide')+'"></span>' + a[0].outerHTML);
                }
            }else{
                $.each(btns, function (i, o) {
                    html+=('<span class="separator '+(o[0].className.indexOf('hide')==-1?'':'hide')+'"></span>' + o[0].outerHTML);
                });
            }

            html+='</div>';
            e.cellHtml = html;
        }
    });

    var timeCount = 0;
    // 判断当前权限值
    var tempTm = setInterval(function () {
        timeCount++;
        if(currentPermissions){
            clearInterval(tempTm);
            var showItems = [];
            for (var k in currentPermissions){
                currentPermissions[k+""]?showItems.push('.lst-permission-'+k):null;
            }
            showItems.length&&$(showItems.join(',')).removeClass('hide');
        }else{
            // 按钮权限值设置，获取不到后延时重试获取
            if(timeCount>10){
                clearInterval(tempTm);
            }
        }
    }, 500);
}


// 基本功能
var baseUtils = {
    Tools:{
        init:function () {
            /**
             * 项目选择器使用方法
             * @param e
             * @constructor
             */
            window.ProSelectorWindow=function(e){
                new ProSelectWindow({
                    companyId:e.sender.companyId,
                    type:e.sender.type, // 选择器类型（1：装饰；2幕墙；其他：装饰幕墙都有）
                    sessionId:e.sender.sessionId,// 用于过滤数据，如果有值则通过此值过滤数据
                    success: function (action) {
                        if (action == "ok") {
                            //获取数据
                            var rows = this.getData();
                            if (rows) {
                                e.sender.selectedData = rows;
                                e.sender.setValue(rows.id);
                                e.sender.setText(rows.name);
                            }
                        }
                    }
                });
            }

            /**
             * 用户选择器
             * @param e
             * @constructor
             */
            window.UserSelectorWindow=function(e){
                new UserSelectWindow({
                    multiSelect:e.sender.multiSelect,
                    currentUserNo:e.sender.currentUserNo,
                    values:e.sender.getValue(),
                    texts:e.sender.getText(),
                    success:function(action){
                        if (action == "ok") {
                            //获取数据
                            var rows = this.getData();
                            if (rows) {
                                var texts = [], values = [];
                                for (var i =0; i< rows.length; i++){
                                    texts.push(rows[i].name);
                                    values.push(rows[i].no);
                                }
                                e.sender.selectedData = rows;
                                e.sender.setValue(values.join(','));
                                e.sender.setText(texts.join(','));
                            }
                        }
                    }
                });
            }

            /**
             * 组织选择器
             * @param e
             * @constructor
             */
            window.OrgSelectorWindow=function(e){
                new OrgSelectWindow({
                    values:e.sender.getValue(),
                    texts:e.sender.getText(),
                    multiSelect:e.sender.multiSelect,
                    orgType:e.sender.orgType,       // 1组织选择器，2公司选择器，3部门选择器
                    success: function (action) {
                        if (action == "ok") {
                            //获取数据
                            var rows = this.getData();
                            if (rows) {
                                var texts = [], values = [];
                                for (var i =0; i< rows.length; i++){
                                    texts.push(rows[i].name);
                                    values.push(rows[i].no);
                                }
                                e.sender.selectedData = rows;
                                e.sender.setValue(values.join(','));
                                e.sender.setText(texts.join(','));
                            }
                        }
                    }
                });
            }

            /**
             * 响应后台的状态码
             * @type {{SUCCESS: string, FAIL: string}}
             */
            window.ReturnCode = {
                SUCCESS:'100',
                FAIL:'101'
            };

            /**
             * 关闭弹出层
             * @param action ---> save/cancel
             * @param form     ---> 要保存的form mini对象
             * @returns {*}
             * @constructor
             */
            window.CloseWindow = function (action, form) {
                if (action == "cancel" && form.isChanged()) {
                    if (confirm("数据被修改了，是否先保存？")) {
                        return false;
                    }
                }
                if (window.CloseOwnerWindow) return window.CloseOwnerWindow(action);
                else window.close();
            }

            /**
             * 【全局方法】文件列表格式化
             * @param files = [{id:'', name:'', url:'', size:''}]
             */
            window.genFileListHtml = function(files){
                return baseUtils.fileListView.genFileListHtml(files);
            };

            /**
             * 【全局方法】单个文件格式化
             * @param file = {id:'', name:'', url:'', size:''}
             * @param canDel  true/false  是否允许删除
             */
            window.genFileItemHtml = function(file, canDel){
                return baseUtils.fileListView.genFileItemHtml(file, canDel);
            };

            // 绑定事件
            baseUtils.bindEvent();
        }
    },
    // 绑定公共事件
    bindEvent:function(){
        // 文件下载统一
        $(document).on('click', '.f-download', function () {
            var itemObj = $(this).closest('li.f-item');
            var downloadUrl = itemObj.attr('fileUrl'), htmlName = itemObj.attr('fileName');
            if(downloadUrl && 'undefined' != downloadUrl){
                // 文件下载操作
                window.location.href = privilegeBasePath + '/file/download?path='+encodeURIComponent(downloadUrl)+'&name='+encodeURIComponent(htmlName);
                //window.open('/downloadFile.shtml?downloadUrl='+downloadUrl+'&htmlName='+htmlName);
            }else{
                var showMsg = '地址错误或文件已删除！';
                try{
                    showErrTips(showMsg);
                }catch(e){
                    alert(showMsg);
                }
            }
        }).on('click', '.img-preview', function () {
            var itemObj = $(this).closest('li.f-item');
            // 图片预览
            var imgUrl = itemObj.attr('fileUrl'), fileName = itemObj.attr('fileName');
            var jsonArr = [];
            if(imgUrl && 'undefined' != imgUrl){
                var current = $('.img-preview', $(this).closest('ul.f-list')).index(this);

                $(this).closest('.f-list').find('li.f-item').each(function (i, o) {
                    if($(o).find('.img-preview')[0]){
                        var _url = $(o).attr('fileUrl');
                        var _name = $(o).attr('fileName');
                        jsonArr.push({name:_name, url:_url});
                    }
                });

                var opt = {current:current, imgs:jsonArr};
                // 图片预览操作
                imgPreview(opt);
                return;
            }else{
                var showMsg = '地址错误或文件已删除！';
                try{
                    showErrTips(showMsg);
                }catch(e){
                    alert(showMsg);
                }
            }
        }).on('click', '.f-preview', function () {
            var itemObj = $(this).closest('li.f-item');
            // 文件预览
            var fileUrl = itemObj.attr('fileUrl'), htmlName = itemObj.attr('fileName');
            if(fileUrl && 'undefined' != fileUrl){
                var path = new RegExp("http://|https://").test(fileUrl)?fileUrl:(getConf().staticBasePath + fileUrl);
                // 文件预览操作
                fileUrl = encodeURIComponent(path);
                htmlName = encodeURIComponent(htmlName);
                window.open(getConf().portalUrl+'/common/fileOnline.jhtml?downloadUrl='+fileUrl+'&htmlName='+htmlName);
            }else{
                var showMsg = '地址错误或文件已删除！';
                try{
                    showErrTips(showMsg);
                }catch(e){
                    alert(showMsg);
                }
            }
        }).on('click', '.f-delete', function () {
            var itemObj = $(this).closest('li.f-item');
            var id = itemObj.attr('id');fileUrl = itemObj.attr('fileUrl'), fileName = itemObj.attr('fileName');
            try{
                baseUtils.fileListView.deleteFileItem({id:id, url:fileUrl, name:fileName});
            }catch(e){
                console.error('删除附件方法【window.deleteFileItem】未找到');
            }
            // 文件删除
            $(this).closest('li').remove();
        });
    },
    // 列表搜索功能初始化
    // 列表按钮显示
    ListSearchBox : {
        init:function(){
            try{
                mini.parse();
                this.searchBoxObj = $('.search-box');
                this.checkSearchItem();
                this.bindEvent();
            }catch(e){ }
        },
        searchBoxObj:null,
        // 一些常规设定
        boxSize:{
            showBtnMaxHeight:88,    // 显示按钮的最大高度。超过此高度会显示按钮
            showBtnMinHeight:44,    // 小于此高度不按钮
            showBtnLimit:90,        // 显示按钮的临界值
            hideBtnLimit:50,         // 隐藏按钮的临界值
            maxHeightLimit:220           // 搜索框最大高度
        },
        // 初始化判断按钮是否显示
        checkSearchItem:function(){
            var _this = this;
            _this.searchBoxObj.each(function (i, o) {
                var formItemsBox = $(o).find(".s-form-items"),
                    searchPanelObj = mini.getByName('searchPanel', '.'+$(this).attr('class'));
                if(formItemsBox.height() > _this.boxSize.showBtnLimit){ // 高度大于90时显示按钮
                    searchPanelObj&&searchPanelObj.addCls('show-more-btn'),
                    searchPanelObj.set({height:_this.boxSize.showBtnMaxHeight});
                    mini.layout();
                    searchPanelObj&&searchPanelObj.set({height:_this.boxSize.showBtnMaxHeight});
                }else if(formItemsBox.height() < _this.boxSize.hideBtnLimit){   // 高度小于50时设置默认高度44
                    searchPanelObj&&searchPanelObj.set({height:_this.boxSize.showBtnMinHeight});
                }else{
                    searchPanelObj&&searchPanelObj.set({height:_this.boxSize.showBtnMaxHeight});
                }
            });
        },
        // 事件绑定
        bindEvent:function () {
            var _this = this;
            _this.searchBoxObj.each(function (i, o) {
                var formItemsBox = $(o).find(".s-form-items"),
                    searchPanelObj = mini.getByName('searchPanel', '.'+$(this).attr('class'));
                $(o).find('.more-btn').each(function (j, m) {
                    // 展开更多
                    $(this).unbind('click').bind('click', function(){
                        if($(this).attr('expand') == '0'){
                            $(this).attr('expand', '1');
                            $(this).find('i').addClass('fa-caret-up');
                            if(formItemsBox.height() > _this.boxSize.maxHeightLimit){
                                searchPanelObj.set({height:_this.boxSize.maxHeightLimit});
                                searchPanelObj.getPaneEl(1).style.overflowY='auto';
                                // 防止样式错位需要设置再次重新布局
                                mini.layout();
                                searchPanelObj.set({height:_this.boxSize.maxHeightLimit});
                            }else{
                                searchPanelObj.set({height:formItemsBox.height()});
                                mini.layout();
                                searchPanelObj.set({height:formItemsBox.height()});
                            }
                        }else{
                            $(this).attr('expand', '0');
                            $(this).find('i').removeClass('fa-caret-up');
                            searchPanelObj.getPaneEl(1).style.overflowY='hidden';
                            searchPanelObj.set({height:_this.boxSize.showBtnMaxHeight});
                            mini.layout();
                        }
                    });
                });
            });

            // 统一重置表单按钮
            $('.do-reset-btn').click(function () {
                var form = new mini.Form($(this).closest('form')[0]);
                form.reset();
            });
        }
    },

    // 文件上传
    fileListView: {
        // 显示单个文件
        genFileItemHtml: function (f, canDel) {
            f.name = f.name||'',f.url = f.url||'',f.size=f.size||0;
            var fileExt = this.getFileExt(f.name);
            var icon = this.getFileIcon(fileExt);
            var showName = f.name + ' (' + this.convertFileSize(f.size)+')';
            // 如果是图片
            var isImg = 'JPG,JPEG,GIF,BMP,PNG'.indexOf(fileExt.toUpperCase()) != -1;
            var html = '';
            html += '<li ' + (f.id ? 'id="' + f.id + '"' : '') + ' fileName="' + f.name + '" fileUrl="' + f.url + '" uid="' + (f.uid?f.uid:f.id?f.id:'') + '" fileSize="' + f.size + '" title="' + showName + '" class="f-item">';
            html += '<div class="f-text">';
            html += '<i class="f-icon fa fa-' + icon + '"></i>';
            html += '<span>' + showName + '</span>';
            html += '</div>';
            html += '<div class="ctrl-opt ' + (canDel ? 'can-del' : '') + '">';
            html += '<a class="f-download fa fa-download" ></a>';
            html += '<a class="' + (isImg ? 'img-preview' : 'f-preview') + ' fa fa-search"></a>';
            html += '<a class="f-delete fa fa-remove"></a>';
            html += '</div>';
            html += '</li>';
            return html;
        },

        // 获取上传后的文件
        getFileData:function(uploadBtnId){
            var files = $('#'+uploadBtnId).siblings('ul.f-list').find('li');
            var fileArr = [];
            if(files && files.size() > 0){
                files.each(function (i, o) {
                    var obj = $(o);
                    var id = obj.attr('id'), fileName = obj.attr('fileName'), fileUrl = obj.attr('fileUrl'), fileSize = obj.attr('fileSize');
                    fileArr.push({id:id, name:fileName, url:fileUrl, size:fileSize});
                });
            }
            return fileArr;
        },

        deleteFileItem:function(item){
            // 删除文件操作
        },

        // 获取文件名格式化
        // fileArr = [{id:'文件id', name:'文件名', path:'文件路径', size:'8002001'}];
        genFileListHtml: function (fileArr, canDel) {
            var html = '<ul class="f-list">';
            for (var i = 0; i < fileArr.length; i++) {
                html += this.genFileItemHtml(fileArr[i], canDel);
            }
            html += '</ul>';
            return html;
        },
        // 获取文件后缀名
        getFileExt: function (file_path) {
            var fileExt = file_path.replace(/.+\./, "");
            return fileExt;
        },
        // 获取文件图标
        getFileIcon: function (sufix) {
            var icon = '';
            sufix = sufix.toUpperCase();
            if ("JPG,JPEG,GIF,BMP,PNG".indexOf(sufix) != -1) {
                icon = 'file-image-o';
            } else if ("DOC,DOCX,DOT,DOTX,DOCM,DOTM".indexOf(sufix) != -1) {
                icon = 'file-word-o';
            } else if ("XLS,XLSX,XLSM,XLT,XLTX,XLTM".indexOf(sufix) != -1) {
                icon = 'file-excel-o';
            } else if ("PPT,PPTX".indexOf(sufix) != -1) {
                icon = 'file-powerpoint-o';
            } else if ("TXT".indexOf(sufix) != -1) {
                icon = 'file-text-o';
            } else if ("PDF".indexOf(sufix) != -1) {
                icon = 'file-pdf-o';
            } else if ("ZIP,RAR".indexOf(sufix) != -1) {
                icon = 'file-zip-o';
            } else {
                icon = 'file';
            }
            return icon;
        },

        // 获得文件大小，文件大小数值转换
        convertFileSize: function (limit) {
            // if (limit === 0) return '0 B';
            // var k = 1024,
            //     sizes = ['B','KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            //     i = Math.floor(Math.log(limit) / Math.log(k));
            // var sizeNum = (limit / Math.pow(k, i)).toFixed(2);
            // var len = sizeNum.indexOf('.');
            // var dec = sizeNum.substr(len + 1, 2);
            // if (dec == '00') {
            //     // 当小数点后为00时 去掉小数部分
            //     return sizeNum.substring(0, len) + sizeNum.substr(len + 3, 2) + sizes[i];
            // }
            // return (limit / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];

            var size = '';
            if (limit < 0.1 * 1024) {
                // 如果小于0.1KB转化成B
                size = limit.toFixed(2) + 'B';
            } else if (limit < 0.1 * 1024 * 1024) {
                // 如果小于0.1MB转化成KB
                size = (limit / 1024).toFixed(2) + 'KB';
            } else if (limit < 0.1 * 1024 * 1024 * 1024) {
                // 如果小于0.1GB转化成MB
                size = (limit / (1024 * 1024)).toFixed(2) + 'MB';
            } else {
                // 其他转化成GB
                size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
            }
            var sizestr = size + '';
            var len = sizestr.indexOf('.');
            var dec = sizestr.substr(len + 1, 2);
            if (dec == '00') {
                // 当小数点后为00时 去掉小数部分
                return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
            }
            return sizestr;
        }
    }
};
