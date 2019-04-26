
var login = {
    init: function () {
        mini.parse();
        this.bindEvent();
    },
    bindEvent: function () {
        mini.get('jsUserName').on('validate', function (e) {
            login.updateError(e);
        });
        mini.get('jsPwd').on('validate', function (e) {
            login.updateError(e);
        });

        // 登录按钮点击事件
        mini.get('jsDoLogin').on('click', function (e) {
            login.submitForm(e);
        });
    },
    // 显示错误信息
    updateError: function (e) {
        var id = e.sender.name + "_error";
        var el = document.getElementById(id);
        if (el) {
            el.innerHTML = e.errorText;
        }
    },
    // 提交表单
    submitForm: function () {
        var form = new mini.Form("#jsLoginForm");
        form.validate();
        // if (form.isValid() == false) return;

        //提交数据
        var data = form.getData();
        var json = mini.encode(data);
        $.POST({
            url: basePath+'/app/authentication', data: data,dataType:"text",
            beforeSend: function (XMLHttpRequest) {
                $('#jsTipMsg').html('<i class="icon-wait"></i>正在登录...');
            },
            success: function (dt, textStatus, request) {
                location.href = basePath+"/main";
                /*if (dt.code == 100) {

                } else {
                    $('#jsTipMsg').text(dt.msg);
                }*/
            },
            error: function (r) {
                //location.href='main.html';
                $('#jsTipMsg').text('不被允许！');
            }
        });
    }
};


$(document).keypress(function (e) {
    // 回车键事件
    if (e.which == 13) {
        login.submitForm();
    }
});


