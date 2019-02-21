<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>登录页面</title>
    <#include "/inc/include.ftl" />
    <style>
        body{
            background-image:url(${basePath}/a/img/public/bg1920.png); background-repeat:no-repeat; background-size:100% 100%;-moz-background-size:100% 100%;
            position: relative;
        }
        .login-box{
            position: absolute;
            width: 900px;
            height: 450px;
            background: #FFFFFF;
            opacity: 0.95;
            top:0;bottom:0;left: 0;right: 0;
            margin:auto
        }
        .login-box div.left{
            vertical-align:top;
            display: inline-block;
            width: 381px;
        }
        .login-box div.left img{
            width:100%;
        }
        .login-box div.right{
            display: inline-block;
            width: 514px;
            text-align: center;
        }
        .login-box div.right form{
            margin:60px auto 0 auto;
            text-align: center;
            width: 300px;
        }


        .logo-box p{
            color: #A7ADB1;
            height: 25px;
            font-size: 18px;
            text-align: left;
            font-weight: 400;
            color: rgba(167,173,177,1);
            line-height: 25px;
            margin: 0;
        }
        .logo-box img{
            width: 100%;
        }
        #login{
            width: 100%;
            text-align: left;
            margin-top: 40px;
        }
        .login-btn{
            margin-top: 10px;
        }
        .login-btn>a{
            background:rgba(28,129,255,1);border-radius:4px;
        }
        .login-btn>a:hover.mini-button {
            background:#40a9ff !important;
            border-color: #40a9ff;
        }

        #login div.userLogin{
            position: relative;
            margin-bottom: 12px;
        }



        /* textbox */
        #login div.userLogin .mini-textbox
        {
            height:30px;
        }
        #login div.userLogin .mini-textbox-border
        {
            height:30px;
            padding-left: 0;padding-right: 0;
        }
        #login div.userLogin .mini-textbox-input
        {
            height:30px;
            line-height:36px;
            padding-left: 24px;
        }
        /* mini-button */
        #login div.login-btn .mini-button{
            height:30px
        }

        #login a:hover.mini-button{
            background: none;
            padding: 1px;
            border: none;
            text-decoration: none;
        }

        #login div.login-btn .mini-button-text{
            height: 24px;
            font-size: 16px;
            font-weight: 400;
            color: rgba(255,255,255,1);
            line-height: 18px;
        }
        .errorText{
            position: absolute;
            left: 15px;
            top: 35px;
            color:red;
        }
        .login-Icon{
            position: absolute;
            left: 8px;
            top: 2px;
            z-index: 100;
        }

        @media screen and (max-width:1440px){
            .login-box{
                width: 800px;
                height: 400px;
            }
            .login-box div.left{
                width: 339px;
            }
            .login-box div.right{
                width:456px;
            }
            .login-box div.right form{
                margin:50px auto 0 auto;text-align: center;width:276px;
            }

            #login{
                margin-top: 30px;
            }

        }
    </style>
</head>
<body >

<div class="login-box">
    <div class="left">
        <img src="${basePath}/a/img/public/image.png" alt="">
    </div>
    <div class="right">
        <form onsubmit="return false" >
            <div class="logo-box">
                <img src="${basePath}/a/img/public/login-logo.png" alt="">
                <p>欢迎你回来，敬业的管理员</p>
            </div>
            <div id="login" class="row">
                <div class="col-sm-12 userLogin">
                    <a plain="true" class="mini-button login-Icon" iconCls="fa fa-user" ></a>
                    <input width="100%" emptyText="账号"  name="j_username" errorMode="none" onvalidation="onUserNameValidation" vtype="minLength:3" class="mini-textbox" required="true" requiredErrorText="帐号不能为空"/>
                    <span id="j_username_error" class="errorText"></span>
                </div>
                <div class="col-sm-12 userLogin">
                    <a plain="true" class="mini-button login-Icon" iconCls="fa fa-lock" ></a>
                    <input width="100%" emptyText="密码" name="j_password"  errorMode="none" onvalidation="onPwdValidation" class="mini-password" required="true" vtype="minLength:3" minLengthErrorText="密码不能少于3个字符"/>
                    <span id="j_password_error" class="errorText"></span>
                    <span id="jsTipMsg"></span>
                </div>
                <div class="col-sm-12">
                    <div style="text-align: left" id="ck1" name="_spring_security_remember_me" class="mini-checkbox" readOnly="false" text="记住密码" ></div>
                </div>
                <div class="col-sm-12 login-btn" >
                    <a width="100%" class="mini-button mini-button-success" onclick="submitForm()" >登录</a>
                </div>
            </div>
        </form>
    </div>
</div>
</body>
<script>

    // 判断是否在框架内，如果在框架内由跳出框架，防止框架嵌套
    if(window.top!=window.self){//不存在父页面
        window.top.location.href=location.href;
    }

    mini.parse();
    
    $(function () {

        var loginForm = new mini.Form("login");

        loginForm.el.addEventListener('keypress', function (e) {
            // 回车键事件
            if(e.which == 13) {
                submitForm();
            }
        });
    });
    
    function submitForm() {
        var form = new mini.Form("#login");
        form.validate();

        if (form.isValid() == false) {
            alert("账号或者密码不能为空");
            return
        }


        //提交数据
        var data = form.getData();
        var json = mini.encode(data);

        //    <----->
        var url = basePath + "/app/authentication";
        // basePath+'/app/authentication', data: data,dataType:"text",
        $.POST({
            url: url, data: data,dataType:"text",
//            beforeSend: function (XMLHttpRequest) {
//                // $('#jsTipMsg').html('<i class="icon-wait"></i>正在登录...');
//            },
            success: function (msg, textStatus, request) {
                if(textStatus == "success"){
                    $('#jsTipMsg').html("");
                    location.href = basePath+"/main";
                }

                // location.href = basePath+"/main";
                /*if (dt.code == 100) {

                } else {
                    $('#jsTipMsg').text(dt.msg);
                }*/
            },
            error: function (msg) {
                //location.href='main.html';
                // $('#jsTipMsg').text('不被允许！');
                if(msg.status == "401"){
                    $('#jsTipMsg').addClass("errorText").html("账号或者密码错误");
                }

            }
        });

    }

    //////////////////////////////////////////
    function updateError(e) {
        var id = e.sender.name + "_error";
        var el = document.getElementById(id);
        if (el) {
            el.innerHTML = e.errorText;
        }
    }
    function onUserNameValidation(e) {
        updateError(e);
    }
    function onPwdValidation(e) {
        updateError(e);
    }
    function onValueChanged(e) {
        var checked = this.getChecked();
    }

    // var data = {
    //     j_username:admin,
    //     j_password:test,
    //     _spring_security_remember_me:true
    // }

</script>
</html>

































<#--

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>流程中心</title>
    <link href="${basePath}/a/css/login.css" rel="stylesheet" type="text/css"/>
    <#include "/inc/include.ftl" />
</head>

<body class="login-page">
<div id="layout1" class="mini-layout" style="width:100%;height:100%;border-style: none">
    <div title="north" style="border-style: none" region="north" height="150" showHeader="false" showSplitIcon="false"
         showCollapseButton="false" showCloseButton="false" showSplit="false" showSplitIcon="false">
        <div style="width: 60%; height: 100%;margin: auto;line-height: 180px">
            <img src="${basePath}/a/img/main/favicon.png">
            <label style="font-size: 24px; color: #2d8cf0">流程中心</label>
        </div>
    </div>

    <div title="south" region="south" style="border-style: none" region="north" height="150" showHeader="false"
         showSplitIcon="false" showCollapseButton="false" showCloseButton="false" showSplit="false"
         showSplitIcon="false">
        <p style="color: #515a6e;margin: 10px auto; width: 100%;font-size: 12px; text-align: center">
            Copyright©XXXXX网版权所有 2018-2030
        </p>
        <p style="color: #515a6e; width: 100%;font-size: 12px;text-align: center">
            技术支持:信息部-技术开发部
        </p>
    </div>
    <div title="center" region="center" minHeight="600" height="800">
        <div id="login-view">
            <div id="loginFrame">
                <table class="login-logo" width="100%" style="margin-top: 20px"><tr>
                    <td width="150"></td><td>管理员登陆</td>
                </tr>
                </table>
                <form id="jsLoginForm">
                    <table class="login-box" align="center">
                        <tr>
                            <td>&nbsp;</td>
                            <td>
                                <div id="jsTipMsg"></div>
                            </td>
                        </tr>
                        <tr>
                            <td width="70">
                                <label for="jsUserName">帐&nbsp;号：</label>
                            </td>
                            <td>
                                <input id="jsUserName" name="j_username" errorMode="none" vtype="minLength:5"
                                       class="mini-textbox" required="true" width="180" requiredErrorText="帐号不能为空"/>
                            </td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td ><div id="username_error" class="errorText"></div></td>
                        </tr>
                        <tr>
                            <td>
                                <label for="jsPwd">密&nbsp;码：</label>
                            </td>
                            <td>
                                <input id="jsPwd" name="j_password" width="180" errorMode="none"  class="mini-password" required="true"
                                       vtype="minLength:5" minLengthErrorText="密码不能少于5个字符"/>
                            </td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td><div id="pwd_error" class="errorText"></div></td>
                        </tr>

                        <tr>
                            <td>&nbsp;</td>
                            <td>
                                <input  name="_spring_security_remember_me" class="mini-checkbox" text="记住密码" value="true" trueValue="true" falseValue="false" style="color: #f7f7f7"/>
                            </td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td>
                                <a class="mini-button" id="jsDoLogin" style="width:180px;background: #fff" >登录</a>
                            </td>
                        </tr>
                    </table>
                </form>
            </div>
        </div>
    </div>

</div>
</body>

<script src="${basePath}/a/js/modules/login.js" type="text/javascript"></script>
<script>
    $(function () {
        login.init();
    });
</script>
</html>-->
