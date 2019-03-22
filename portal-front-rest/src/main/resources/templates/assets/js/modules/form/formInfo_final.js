var myform;
var _formInfoId;
var heightAndWidth = {height: 300, width: 350};
var fornInfOptFlag = {
    show: 'show',
    add: 'add',
    update: 'update',
    details: 'details',
    detailsTitle: '查看表单信息',
    addTitle: "表单设计",
    updateTitle: "修改表单信息",
    desFormData: "desFormData",
    desFormDataTitle: "自定义表单数据"
};
var _div = '<div style="word-break:break-all">'; //弹窗提示的时候，内容多了自动换行

/*
function parsePage() {
	formInfo.init();
};
*/
//表单管理管理
var formInfo = {
    init: function () {
        formInfo.areaTree();
        formInfo.tableData('');
        //查询方法
        var doSearch = function doSearch() {
            var myForm = $('#searchForm');
            var data = myForm.serializeJson();
            $.each(data, function (index, dom) { //去空格
                if (index && dom) {
                    data[index] = $.trim(dom);
                }
            });
            //data.name=$.trim(data.name);
            /*$('#subDg').datagrid({
                url:basePath+'/search/sku/ajaxList.do',
                queryParams:data
            });*/
            $('#subDg').datagrid('load', data);
        };
        //查询按钮
        $('#SearchBtn').click(function () {
            doSearch();
        });
        //回车事件
        $('#searchForm').on('keydown', function (event) {
            if (event.keyCode == 13) {
                doSearch();
            }
        });
    },

    //查看详情
    detail: function (id, opt) {
        //var _show	=fornInfOptFlag.show;
        var _add = fornInfOptFlag.add;
        var _update = fornInfOptFlag.update;
        var _handle = fornInfOptFlag.details;
        var _desFormData = fornInfOptFlag.desFormData;
        //var _showTitle		=fornInfOptFlag.showTitle;
        var _addTitle = fornInfOptFlag.addTitle;
        var _updateTitle = fornInfOptFlag.updateTitle;
        var _handleTitle = fornInfOptFlag.detailsTitle;
        var _desFormDataTitle = fornInfOptFlag.desFormDataTitle;
        switch (opt) {
//		case _show:
//			formInfo.openTab(id,_showTitle,opt);
//			closeTabEx(_addTitle);
//			closeTabEx(_updateTitle);
//			closeTabEx(_handleTitle);
//			break;
            case _desFormData:
                formInfo.openDataTab(id, _desFormDataTitle, opt);
                //closeTabEx(_showTitle);
                closeTabEx(_updateTitle);
                closeTabEx(_handleTitle);
                break;
            case _add:
                formInfo.openTab(id, _addTitle, opt);
                //closeTabEx(_showTitle);
                closeTabEx(_updateTitle);
                closeTabEx(_handleTitle);
                break;
            case _update:
                formInfo.openTab(id, _updateTitle, opt);
                //closeTabEx(_showTitle);
                closeTabEx(_addTitle);
                closeTabEx(_handleTitle);
                break;
            case _handle:
                formInfo.openTab(id, _handleTitle, opt);
                //closeTabEx(_showTitle);
                closeTabEx(_addTitle);
                closeTabEx(_updateTitle);
                break;
            default:
                break;
        }
    },

    openTab: function (id, _title, opt) {
        var _myurl = basePath + "/oa/form/formItem/list.do?sessionId=" + _jsSessionId + '&opt=' + opt + '&formInfoId=' + id;
        ;
        //添加tab
        addBlankTab({
            text: _title,
            url: _myurl,
            refresh: true
        });
    },
    //打开自定义表单数据页面
    openDataTab: function (id, _title, opt) {
        var _myurl = basePath + "/oa/form/formDes/listDesFormData.do?sessionId=" + _jsSessionId + '&opt=' + opt + '&formInfoId=' + id;
        ;
        //添加tab
        addBlankTab({
            text: _title,
            url: _myurl,
            refresh: true
        });
    },

    //加载树形
    areaTree: function () {
        //加载树形
        $('#leftOrgMenu').tree({
            url: basePath + '/wf/model/categoryTree.do?sessionId=' + _jsSessionId,
            onClick: function (node) {
                //点击后联动表格
                formInfo.tableData(node.code);

                //节点展开/折叠
                $('#leftOrgMenu').tree('toggle', node.target);
            },
            onDblClick: function (node) {
                //节点展开/折叠
                $('#leftOrgMenu').tree('toggle', node.target);
            },
        });

    },

    // 表格数据
    tableData: function (code) {
        var url = basePath + "/oa/form/formInfo/ajaxList.do?sessionId=" + _jsSessionId;
        $('#subDg').datagrid({
            url: url,
            queryParams: {"categoryId": code, "formStatus": 2},
            /* rowStyler: function(index,row){
                 if (row.processDefinitionKey != '' && row.processDefinitionKey != null && typeof(row.processDefinitionKey)!="undefined"){
                     return 'background-color:#66AFE9;color:#fff;';
                 }
             }*/

        });
    },

    /*typeFormatter : function(value, row, index) {
        if (value == '1') {
            return "全站";
        } else if(value == '2') {
            return "产品分类";
        }else if(value == '3') {
            return "产品详细";
        }else {
            return "--";
        }
    },*/

    /*statusFormatter : function(value, row, index) {
        if (value == 0) {
            return "禁用";
        } else if(value==1) {
            return "启用";
        } else {
            return "--";
        }
    },
    
    statusStyler : function(value, row, index) {
        if (value == 0) {
            return 'color:#FF0000;';
        } else if(value == 1) {
            return 'color:green;';
        } else {
            return 'color:gray;';
        }
    },*/
    delFlagFormatter: function (value, row, index) {
        if (value == 0) {
            return "已删除";
        } else if (value == 1) {
            return "未删除";
        } else {
            return "-";
        }
    },

    delFlagStyler: function (value, row, index) {
        if (value == 0) {
            return 'color:#FF0000;';
        } else if (value == 1) {
            return 'color:green;';
        } else {
            return 'color:gray;';
        }
    },


    del: function (_id) {
        var id;
        if (_id) {
            id = _id;
        } else {
            var rows = $('#subDg').datagrid('getChecked');
            var ids = [];
            $.each(rows, function (i, row) {
                ids.push(row.id);
            });
            id = ids.join(',');
            if (id == null || id == "") {
                $.messager.alert('警告', '请选择记录');
                return;
            }
        }

        $.messager.confirm('确认', '你确认删除记录吗？', function (r) {
            if (r) {
                $.mask('正在执行...');
                var url = basePath + '/oa/form/formInfo/dels.do?sessionId=' + _jsSessionId;
                $.ajax({
                    type: 'POST',
                    dataType: 'JSON',
                    url: url,
                    data: {
                        ids: id
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        $.unmask();
                    },
                    success: function (data) {
                        $.unmask();
                        if (data.responseCode == 1) {
                            $('#subDg').datagrid('reload');
                            showSuc('删除成功');
                        } else {
                            $.messager.alert('警告', _div + '删除失败,请联系系统管理员' + '</div>');
                            //$.messager.alert('警告',_div+data.responseMsg+'</div>');
                            //showWarn('删除失败,请联系系统管理员');
                            //showWarn(data.responseMsg);
                        }
                    }
                });
            }
        });
    },

    addUI: function (_id) {
        if (_id) {
            id = _id;
        } else {
            var rows = $('#subDg').datagrid('getChecked');
            var ids = [];
            $.each(rows, function (i, row) {
                ids.push(row.id);
            });
            id = ids.join(',');
            if (id == null || id == "") {
                $.messager.alert('警告', '请选择记录');
                return;
            }
            id = ids[0];
            _formInfoId = id;
        }
        ygDialog({
            title: '流程数据',
            href: basePath + '/oa/form/formDes/updateUI.do?sessionId=' + _jsSessionId + '&formInfoId=' + _formInfoId,
            data: null,
            width: 600,
            height: 600,
            onSave: 'formInfo.add',
            onClose: null
        });
    },

    add: function (desDialog) {
        data = {};
        data.form_id = _formInfoId;
        var l = $("li.widget-view").length, i = 0;
        $.each($("li.widget-view"), function (d, e) {
            var a = {}, f = $(e).data("widget");
            if (f.options.type != "separator" && f.checkValidate()) {//验证成功
                i++;
                if (f.getValue()) {
                    data[f.options.fieldName] = "" + f.getValue();
                }
            } else if (!f.checkValidate()) {
                if (!f.options.fieldIsnull && !f.getValue()) {
                    $.messager.alert('警告', '<div>' + f.options.labelName + '不能为空</div>');
                } else {
                    $.messager.alert('警告', '<div>请输入正确的' + f.options.labelName + '</div>');
                }
                return false;
            }
        });
        if (l > i) {
            return false
        }
        //后续添加参数保存 
        $.mask('正在执行...');
        $.ajax({
            type: 'POST',
            dataType: 'JSON',
            url: basePath + '/oa/form/formDes/add.do?sessionId=' + _jsSessionId,
            data: {"data": JSON.stringify(data)},
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $.unmask();
            },
            success: function (data) {
                $.unmask();
                if (data.responseCode == 1) {
                    $('#subDg').datagrid('reload');
                    showSuc('添加成功');
                    desDialog.close();
                } else {
                    $.messager.alert('警告', _div + '添加失败,请联系系统管理员' + '</div>');
                    //$.messager.alert('警告',_div+data.responseMsg+'</div>');
                    //showWarn('添加失败,请联系系统管理员');
                    //showWarn(data.responseMsg);
                }
            }
        });
    },

    updateUI: function (_id) {
        if (_id) {
            id = _id;
        } else {
            var rows = $('#subDg').datagrid('getChecked');
            var ids = [];
            $.each(rows, function (i, row) {
                ids.push(row.id);
            });
            id = ids.join(',');
            if (id == null || id == "") {
                $.messager.alert('警告', '请选择记录');
                return;
            }
            id = ids[0];
        }
        ygDialog({
            title: '修改表单管理',
            href: basePath + '/oa/form/formInfo/updateUI.do?id=' + id + '&sessionId=' + _jsSessionId,
            data: null,
            /*data : {
                name : "wen",
                floorId : 123
            },*/
            width: heightAndWidth.width,
            height: heightAndWidth.height,
            onSave: 'formInfo.update',
            onClose: null
        });
    },

    update: function (dialog) {
        //var _name=dialog.getData('name');
        //var _floorId=dialog.getData('floorId');
        myform = $('#myForm');
        if (myform.form('validate')) {
            $.mask('正在执行...');
            $.ajax({
                type: 'POST',
                dataType: 'JSON',
                url: basePath + '/oa/form/formInfo/update.do?sessionId=' + _jsSessionId,
                data: myform.serialize(),
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $.unmask();
                },
                success: function (data) {
                    $.unmask();
                    if (data.responseCode == 1) {
                        $('#subDg').datagrid('reload');
                        showSuc('修改成功');
                        dialog.close();
                    } else {
                        $.messager.alert('警告', _div + '修改失败,请联系系统管理员' + '</div>');
                        //$.messager.alert('警告',_div+data.responseMsg+'</div>');
                        //showWarn('修改失败,请联系系统管理员');
                        //showWarn(data.responseMsg);
                    }
                }
            });
        }
    },
    //自定义表单设计页面
    desForm: function (_id) {
        if (_id) {
            id = _id;
        } else {
            var rows = $('#subDg').datagrid('getChecked');
            var ids = [];
            $.each(rows, function (i, row) {
                ids.push(row.id);
            });
            id = ids.join(',');
            if (id == null || id == "") {
                $.messager.alert('警告', '请选择记录');
                return;
            }
            id = ids[0];
        }
        formInfo.detail(id, fornInfOptFlag.add);
    },

    //自定义表单数据页面
    formDetail: function (_id) {
        if (_id) {
            id = _id;
        } else {
            var rows = $('#subDg').datagrid('getChecked');
            var ids = [];
            $.each(rows, function (i, row) {
                ids.push(row.id);
            });
            id = ids.join(',');
            if (id == null || id == "") {
                $.messager.alert('警告', '请选择记录');
                return;
            }
            id = ids[0];
        }
        formInfo.detail(id, fornInfOptFlag.desFormData);
    },


    //激活表单
    activeForm: function (_id) {
        if (_id) {
            id = _id;
        } else {
            var rows = $('#subDg').datagrid('getChecked');
            var ids = [];
            $.each(rows, function (i, row) {
                ids.push(row.id);
            });
            id = ids.join(',');
            if (id == null || id == "") {
                $.messager.alert('警告', '请选择记录');
                return;
            }
            id = ids[0];
            if (rows[0].processDefinitionKey == '' || rows[0].processDefinitionKey == null || typeof(rows[0].processDefinitionKey) == "undefined") {
                $.messager.alert('警告', '请先绑定流程定义');
                return;
            }
        }
        $.ajax({
            url: basePath + '/oa/form/formItem/activeForm.do?sessionId=' + _jsSessionId,
            dataType: "JSON",
            type: "POST",
            data: {"formInfoId": id},
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $.unmask();
            },
            success: function (data) {
                $.unmask();
                if (data.responseCode == 1) {
                    $('#subDg').datagrid('reload');
                    showSuc(data.responseMsg);
                } else {
                    $.messager.alert('警告', _div + data.responseMsg + '</div>');
                    //$.messager.alert('警告',_div+data.responseMsg+'</div>');
                    //showWarn('修改失败,请联系系统管理员');
                    //showWarn(data.responseMsg);
                }
            }
        });
    },

    //绑定流程定义key
    setKey: function (_id) {
        if (_id) {
            id = _id;
        } else {
            var rows = $('#subDg').datagrid('getChecked');
            var ids = [];
            $.each(rows, function (i, row) {
                ids.push(row.id);
            });
            id = ids.join(',');
            if (id == null || id == "") {
                $.messager.alert('警告', '请选择记录');
                return;
            }
            id = ids[0];
            if (rows[0].processDefinitionKey != '' && rows[0].processDefinitionKey != null && typeof(rows[0].processDefinitionKey) != "undefined") {
                $.messager.confirm('提醒', '该表单已绑定流程定义，继续操作将重新绑定', function (r) {
                    if (r) {
                        formInfo.diaLog(_jsSessionId);
                    }
                });
            } else {
                formInfo.diaLog(_jsSessionId);
            }
        }
    },

    diaLog: function (_jsSessionId) {
        ygDialog({
            title: '绑定流程定义key',
            href: basePath + '/oa/form/formInfo/selectPDKey.do?id=' + id + '&sessionId=' + _jsSessionId,
            data: null,
            /*data : {
        name : "wen",
        floorId : 123
    },*/
            width: 800,
            height: 500,
            onSave: 'formInfo.saveKey',
            onClose: null
        });
    },

    saveKey: function (dialog) {
        id = $('#formId').val();
        var row = $('#subDg2').datagrid('getSelected');
        if (row == null || row == "") {
            $.messager.alert('警告', '请选择记录');
            return;
        }
        var key = row.key;
        myform = $('#myForm');
        if (myform.form('validate')) {
            $.mask('正在执行...');
            $.ajax({
                type: 'POST',
                dataType: 'JSON',
                url: basePath + '/oa/form/formInfo/update.do?sessionId=' + _jsSessionId,
                data: {"id": id, "processDefinitionKey": key},
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $.unmask();
                },
                success: function (data) {
                    $.unmask();
                    if (data.responseCode == 1) {
                        $('#subDg').datagrid('reload');
                        showSuc('修改成功');
                        dialog.close();
                    } else {
                        $.messager.alert('警告', _div + data.responseMsg + '</div>');
                        //$.messager.alert('警告',_div+data.responseMsg+'</div>');
                        //showWarn('修改失败,请联系系统管理员');
                        //showWarn(data.responseMsg);
                    }
                }
            });
        }
    },

    /*updateStatus : function(status,_id) {
        var id ;
        if(_id){
            id=_id;
        }else{
            var rows = $('#subDg').datagrid('getChecked');
            var ids = [];
            $.each(rows, function(i, row) {
                ids.push(row.id);
            });
            id = ids.join(',');
            if (id == null || id == "") {
                $.messager.alert('警告', '请选择记录');
                return;
            }
        }
        $.mask('正在执行...');
        var url = basePath + '/oa/form/formInfo/updateStatus.do?sessionId='+_jsSessionId;
        $.ajax({
            type : 'POST',
            dataType : 'JSON',
            url : url,
            data : {
                ids : id,
                status : status
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $.unmask();
            },
            success : function(data) {
                $.unmask();
                if (data.responseCode == 1) {
                    $('#subDg').datagrid('reload');
                    showSuc('修改状态成功');
                } else {
                    $.messager.alert('警告',_div+'修改状态失败,请联系系统管理员'+'</div>');
                    //$.messager.alert('警告',_div+data.responseMsg+'</div>');
                    //showWarn('修改状态失败,请联系系统管理员');
                    //showWarn(data.responseMsg);
                }
            }
        });
    },*/
    //刷新
    refresh: function () {
        $('#subDg').datagrid('reload');
    },
    //重置
    reset: function () {
        //$('.jsClearValue').val('');
        //$('#jstype').combobox('select','');
        $("#searchForm").form("reset");
    }
};
