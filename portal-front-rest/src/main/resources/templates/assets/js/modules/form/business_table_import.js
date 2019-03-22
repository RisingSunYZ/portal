$(function () {
    $("#filebox").click(function () {
        $("#msg").text("");
    });
    $('#jsUploadExcelExample').live('click', function () {
        //获取planInfo表的code
        var $this = $(this);
        if ($this.hasClass('execing')) {
            return false;
        }
        $this.addClass('execing');

        var file = $('#jsFileExcelExample').val();
        if (file != '' && file != null) {
            $.mask({
                target: 'body .window'
            });
            jQuery.ajaxFileUpload({
                    url: basePath + '/oa/form/business_table_field/importExcel.do?sessionId=' + _jsSessionId + '&businessTableId=' + businessTableId,
                    secureuri: false,
                    fileElementId: 'jsFileExcelExample',
                    dataType: 'json',
                    success: function (data) {
                        $this.removeClass('execing');
                        $.unmask({
                            target: 'body .window'
                        });
                        $("#msg").text("");
                        if (data.code == 0) {
                            $("#msg").text(decodeURI(data.msg, "UTF-8"));//js中的 转码
                            $('#subDg').datagrid('reload');
                            $("#jsFileExcelExample").after($("#jsFileExcelExample").clone().val(""));
                            $("#jsFileExcelExample").remove();
                        }
                        if (data.code == 1) {
                            $("#msg").text(decodeURI(data.msg, "UTF-8"));//js中的 转码
                            $('#subDg').datagrid('reload');
                            $("#jsFileExcelExample").after($("#jsFileExcelExample").clone().val(""));
                            $("#jsFileExcelExample").remove();
                        }
                    },
                    error: function (data, e) {
                        $this.removeClass('execing');
                        $.unmask({
                            target: 'body .window'
                        });
                        showWarn("操作异常，请检查模版等信息是否正确,如有疑问请联系系统管理员！");
                        $("#jsFileExcelExample").after($("#jsFileExcelExample").clone().val(""));
                        $("#jsFileExcelExample").remove();
                    }
                }
            );
        }
        else {
            $this.removeClass('execing');
            $("#msg").text('请选择Excel文件');
        }
    });
});


