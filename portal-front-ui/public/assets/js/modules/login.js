/**
 * 登录页面
 */
define("js/modules/login", function(require, exports, module){
    "require:nomunge,exports:nomunge,module:nomunge";
    var Index = {};
    require('swiper');
    var Index = require('js/modules/work-platform/index');
    require('./base');
    //'js/modules/base', 'js/modules/work-platform/index','swiper'
    Login = {
        init: function () {
        	Login.bindEvent();
        },
        bindEvent : function(){
        	//图片新闻
        	Index.init();
            new Swiper(".news-box", {
                autoplay: 5000,
                loop: true,
                pagination: '.pagination',
                paginationClickable: true
            });
            $('.false-verify').hide();
            $('.eye i').click(function () {
                if ($(this).hasClass('open-eyes')) {
                    $(this).removeClass('open-eyes').addClass('close-eyes');
                    document.getElementById('eye').type = "password"
                } else {
                    $(this).removeClass('close-eyes').addClass('open-eyes');
                    document.getElementById('eye').type = "text"
                }
            });
            //失去焦点事件
            $('.username,.password').blur(function () {
                setTimeout(function () {
                    if ($('.username').val() == '') {//判断是否输入账号
                        $('.false-verify').show().find('.false-text').text('请输入用户名/工号/手机号');
                    } else {
                        if ($('.password').val() == '') {//判断是否输入密码
                            $('.false-verify').show().find('.false-text').text('请输入密码');
                        } else {//账号密码都有
                            $('.false-verify').hide()
                        }
                    }
                }, 100);
            });
            //点击登录时间
            $('.login-btn').live('click', function () {
                if ($('.username').val() == '') {
                    $('.username').focus();
                    $('.false-verify').show().find('.false-text').text('请输入用户名/工号/手机号');
                    return;
                } else {
                    if ($('.password').val() == '') {
                        $('.password').focus();
                        $('.false-verify').show().find('.false-text').text('请输入密码');
                        return;
                    } else {//
                        //$('.login-btn').attr('href', 'main.shtml');
                        $('.false-verify').hide()
                    }
                }
                var url = basePath+'/portal/ulogin/loginVerify.jhtml';
                $.ajax({url:url, data:$("#jsLoginForm").serialize(), type:'POST', dataType:'JSON', success:function(dt){
                	if(dt && dt.code == 1){
                		location.href="/main.jhtml";
                	}else{
                		$('.username').focus();
                        $('.false-verify').show().find('.false-text').text(dt.msg);
                        return;
                	}
                }});
            });
            
            //回车事件
            $('.username,.password').on('keyup', function (event) {
                if (event.keyCode == 13) {
                    if ($('.username').val() == '') {
                        $('.username').focus();
                        $('.false-verify').show().find('.false-text').text('请输入用户名/工号/手机号');
                    } else {
                        if ($('.password').val() == '') {
                            $('.password').focus();
                            $('.false-verify').show().find('.false-text').text('请输入密码');
                        } else {
                            $('.login-btn').attr('href', 'main.shtml');
                            $('.false-verify').hide()
                        }
                    }
                }
            });
            //删除密码
            $('.user-del i').live('click', function () {
                $('.username').val('');
                $('.false-verify').show().find('.false-text').text('请输入用户名/工号/手机号');
            });

            //背景文字自适应
            $(function () {
                fitTitle();
            });
            $(window).resize(function () {
                fitTitle();
            });
            function fitTitle() {
                var oh = $('.main-container').height();
                $('.login-bg-title').css('height', oh*0.16 + "px");
            }
        }
    };
    module.exports = Login;
});