(function($) {
    var _ajax = $.ajax;
    function req(options, ctrl) {
        //2.每次调用发送ajax请求的时候定义默认的error处理方法
        var fn = {
            beforeSend:function(XMLHttpRequest){
            	//debugger;
                // 获取Cookie里面的值
                //var sid = cookieOpt('sid');
            	// XMLHttpRequest.setRequestHeader("sessionId",sid);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown){
            	if(textStatus == 'parsererror'){
            		showError('数据转换出错！');
            		return;
            	}
                showErrTips('网络异常，请稍后再试！');
            }
        };
        //3.如果在调用的时候写了error的处理方法，就不用默认的
        if (options.error){
            fn.error = options.error;
        }
        //4.扩展原生的$.ajax方法，返回最新的参数
        var _options = $.extend(options, {
            type:ctrl,dataType:options.dataType||'JSON',
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                fn.error(XMLHttpRequest, textStatus, errorThrown);
            }
        });
        //5.将最新的参数传回ajax对象
        _ajax(_options);
    };

    $.GET = function (options) {
        req(options, options.type?options.type:"GET");
    };
    $.PUT = function (options) {
        req(options, options.type?options.type:"PUT");
    };
    $.DEL = function (options) {
        req(options, options.type?options.type:"DELETE");
    };
    $.POST = function (options) {
        req(options, options.type?options.type:"POST");
    };
})(jQuery);