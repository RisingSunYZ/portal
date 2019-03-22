var callBack = {

    init: function () {
        mini.parse();   // 必需
        this.form = new mini.Form('myForm');
        this.formGd = new mini.Form('myFormGd');
    },

    submitForm: function () {
        let _this = this;
        _this.form.validate();
        let formData = _this.form.getData();
        if (!_this.form.isValid()) {
            return;
        }
        showConfirm('确认执行吗？', function (r) {
            if (r) {
                mask('正在执行...');
                $.ajax({
                    type: 'POST',
                    dataType: 'JSON',
                    url: basePath + "/flow/msg/msg_callback/invoke",
                    data: formData,
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        unmask();
                    },
                    success: function (data) {
                        unmask();
                        if (data.responseCode == 1) {
                            showSucTips("回调成功！");
                        } else {
                            showErrTips(data.responseMsg);
                        }
                    }
                })
            }
        })
    },

    submitFormGd: function () {
        let _this = this;
        _this.formGd.validate();
        let formData = _this.formGd.getData();
        if (!_this.form.isValid()) {
            return;
        }
        showConfirm('确认执行吗？', function (r) {
                if (r) {
                    mask('正在执行...');
                    $.ajax({
                        type: 'POST',
                        dataType: 'JSON',
                        url: basePath + "/flow/msg/msg_callback/invokeGd",
                        data: formData,
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            unmask();
                        },
                        success: function (data) {
                            unmask();
                            if (data.responseCode == 1) {
                                showSucTips("回调成功！");
                            } else {
                                showErrTips(data.responseMsg);
                            }
                        }
                    })
                }
            })
    }
}