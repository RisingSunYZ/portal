var myform;
var heightAndWidth = {height: 300, width: 350};
var businessTableFieldOptFlag = {
    show: 'show',
    add: 'add',
    update: 'update',
    handle: 'handle',
    showTitle: '查看业务底表数据',
    addTitle: "添加业务底表数据",
    updateTitle: "修改业务底表数据",
    handleTitle: '创建业务底表数据'
};
var _div = '<div style="word-break:break-all">'; //弹窗提示的时候，内容多了自动换行
$(function () {
    business_table_field.init();
});
var columns = [];//列加载项
var businessTableId;//底表信息id
/*
function parsePage() {
	business_table_field.init();
};
*/
//业务底表数据管理
var business_table_field = {
    init: function () {
        business_table_field.TableData();
        business_table_field.areaTree();
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

        //图片懒加载
        /*business_table_field.initimgLazyload();*/
    },

    TableData: function () {
        //js中渲染easy-datagrid
        $.get(basePath + "/oa/form/business_table_field/getItemByInfoId.do?sessionId=" + _jsSessionId,
            {"businessTableId": businessTableId},
            function (data) {
                columns = [{field: 'id', checkbox: true}];
                data = JSON.parse(data);
                $.each(data, function (index, dom) {
                    columns[index + 1] = {
                        field: dom.businessTableField,
                        fixed: true,
                        width: 150,
                        align: 'left',
                        title: dom.businessTableFieldName
                    };
                });
                $('#subDg').datagrid({
                    url: basePath + "/oa/form/business_table_field/ajaxList.do?sessionId=" + _jsSessionId,
                    singleSelect: true,
                    columns: [columns],
                    queryParams: {"businessTableId": businessTableId}
                });
            }
        );

    },

    //加载树形
    areaTree: function () {
        //加载树形
        $('#leftOrgMenu').tree({
            url: basePath + '/oa/form/business_table_field/categoryTree.do?sessionId=' + _jsSessionId,
            onClick: function (node) {
                //点击后联动表格
                businessTableId = node.id;
                business_table_field.TableData();
                //节点展开/折叠
                $('#leftOrgMenu').tree('toggle', node.target);
            },
            onDblClick: function (node) {
                //节点展开/折叠
                $('#leftOrgMenu').tree('toggle', node.target);
            }
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

    /*
    ygDialog({
            title : '审核友情链接',
            href : basePath + '/cms/setting/frndl/exaUI.do?id=' + id,
            width : 500,
            height : 450,
            maximizable:true,
            buttons : [ {
                text : '通过',
                iconCls : 'icon-ok',
                handler : function(dialog) {
                    frndlkc.exa(1, dialog);
                }
            }, {
                text : '不通过',
                iconCls : 'icon-stop',
                handler : function(dialog) {
                    frndlkc.exa(0, dialog);
                }
            } ]
        });
    */

    /*
    //图片懒加载
    initimgLazyload:function(){
        $('.brandlogo').lazyload({
            effect : 'fade'
        });
    },
    logoFormatter: function(value, row, index){
        if(value==""){
            return '<span class="pro_no_image" title="暂无图片" >暂无图片</span>';
        }else{
            var _path=ftpHost+value;
            return '<a class="jsViewPic" href="'+_path+'"><img class="brandlogo" src="'+_path+'" style="height:32px"/></a>';
        }
    }
    */

    //查看UI
    showUI: function (_id) {
        var id = business_table_field.getId(_id);
        if (id == null || $.trim(id) == "") {
            $.messager.alert('警告', '请选择记录');
            return;
        }
        ygDialog({
            title: businessTableFieldOptFlag.showTitle,
            href: basePath + '/oa/form/business_table_field/updateUI.do?id=' + id + '&opt=' + businessTableFieldOptFlag.show + '&sessionId=' + _jsSessionId,
            data: null,
            /*data : {
                name : "wen",
                floorId : 123
            },*/
            width: 'auto',
            height: 'auto',
            onClose: null
        });
    },

    //添加UI
    addUI: function () {
        if (businessTableId == '' || null == businessTableId || typeof(businessTableId) == "undefined") {
            $.messager.alert('警告', '请选择类型');
            return;
        }
        if (columns === undefined || columns.length == 1) {
            $.messager.alert('警告', '请先设置字段');
            return;
        }
        //columns
        ygDialog({
            title: businessTableFieldOptFlag.addTitle,
            href: basePath + '/oa/form/business_table_field/updateUI.do?opt=' + businessTableFieldOptFlag.add + '&sessionId=' + _jsSessionId + '&businessTableId=' + businessTableId,
            data: null,
            /*data : {
                name : "wen",
                floorId : 123
            },*/
            width: '300px',
            height: '350px',
            onSave: 'business_table_field.add',
            onClose: null
        });
    },
    //添加
    add: function (dialog) {
        //var _name=dialog.getData('name');
        //var _floorId=dialog.getData('floorId');
        myform = $('#myForm');
        if (myform.form('validate')) {
            $.messager.confirm('确认', '你确认添加吗？', function (r) {
                if (r) {
                    $.mask('正在执行...');
                    $.ajax({
                        type: 'POST',
                        dataType: 'JSON',
                        url: basePath + '/oa/form/business_table_field/add.do?sessionId=' + _jsSessionId,
                        data: myform.serialize(),
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            $.unmask();
                        },
                        success: function (data) {
                            $.unmask();
                            if (data.responseCode == 1) {
                                $('#subDg').datagrid('reload');
                                showSuc('添加成功');
                                dialog.close();
                            } else {
                                //$.messager.alert('警告',_div+'添加失败,请联系系统管理员'+'</div>');
                                //$.messager.alert('警告',_div+data.responseMsg+'</div>');
                                showWarn('添加失败,请联系系统管理员');
                                //showWarn(data.responseMsg);
                            }
                        }
                    });
                }
            });
        }
    },
    //修改UI
    updateUI: function (_id) {
        var id = business_table_field.getId(_id);
        if (id == null || $.trim(id) == "") {
            $.messager.alert('警告', '请选择记录');
            return;
        }
        ygDialog({
            title: businessTableFieldOptFlag.updateTitle,
            href: basePath + '/oa/form/business_table_field/updateUI.do?id=' + id + '&opt=' + businessTableFieldOptFlag.update + '&sessionId=' + _jsSessionId + '&businessTableId=' + businessTableId,
            data: null,
            /*data : {
                name : "wen",
                floorId : 123
            },*/
            width: '300px',
            height: '350px',
            onSave: 'business_table_field.update',
            onClose: null
        });
    },
    //修改
    update: function (dialog) {
        //var _name=dialog.getData('name');
        //var _floorId=dialog.getData('floorId');
        myform = $('#myForm');
        if (myform.form('validate')) {
            $.messager.confirm('确认', '你确认修改吗？', function (r) {
                if (r) {
                    $.mask('正在执行...');
                    $.ajax({
                        type: 'POST',
                        dataType: 'JSON',
                        url: basePath + '/oa/form/business_table_field/update.do?sessionId=' + _jsSessionId,
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
                                //$.messager.alert('警告',_div+'修改失败,请联系系统管理员'+'</div>');
                                //$.messager.alert('警告',_div+data.responseMsg+'</div>');
                                showWarn('修改失败,请联系系统管理员');
                                //showWarn(data.responseMsg);
                            }
                        }
                    });
                }
            });
        }
    },

    /*updateStatus : function(status,_id) {
        var id = business_table_field.getId(_id);
        if (id == null || $.trim(id) == "") {
            $.messager.alert('警告', '请选择记录');
            return;
        }
        $.messager.confirm('确认', '你确认执行吗？', function(r) {
            if (r) {
                $.mask('正在执行...');
                var url = basePath + '/oa/form/business_table_field/updateStatus.do?sessionId='+_jsSessionId;
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
                            //$.messager.alert('警告',_div+'修改状态失败,请联系系统管理员'+'</div>');
                            //$.messager.alert('警告',_div+data.responseMsg+'</div>');
                            showWarn('修改状态失败,请联系系统管理员');
                            //showWarn(data.responseMsg);
                        }
                    }
                });
            }
        });
    },*/

    del: function (_id) {
        var id = business_table_field.getId(_id);
        if (id == null || $.trim(id) == "") {
            $.messager.alert('警告', '请选择记录');
            return;
        }
        $.messager.confirm('确认', '你确认删除记录吗？', function (r) {
            if (r) {
                $.mask('正在执行...');
                var url = basePath + '/oa/form/business_table_field/dels.do?sessionId=' + _jsSessionId;
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
                            //$.messager.alert('警告',_div+'删除失败,请联系系统管理员'+'</div>');
                            //$.messager.alert('警告',_div+data.responseMsg+'</div>');
                            showWarn('删除失败,请联系系统管理员');
                            //showWarn(data.responseMsg);
                        }
                    }
                });
            }
        });
    },

    //得到id
    getId: function (_id) {
        var id = "";
        if (_id) {
            id = _id;
        } else {
            var rows = $('#subDg').datagrid('getChecked');
            var ids = [];
            $.each(rows, function (i, row) {
                ids.push(row.id);
            });
            id = ids.join(',');
            id = ids[0];
        }
        return id;
    },

    //刷新
    refresh: function () {
        $('#subDg').datagrid('reload');
    },
    //重置
    reset: function () {
        //$('.jsClearValue').val('');
        //$('#jstype').combobox('select','');
        $("#searchForm").form("reset");
    },

    downloadTemplate: function () {
        if (businessTableId == '' || null == businessTableId || typeof(businessTableId) == "undefined") {
            $.messager.alert('警告', '请选择类型');
            return;
        }
        if (columns === undefined || columns.length == 1) {
            $.messager.alert('警告', '请先设置字段');
            return;
        }
        window.location.href = basePath + "/oa/form/business_table_field/exportExcel.do?businessTableId=" + businessTableId + '&isTemplate=' + true;
    },

    exportExcel: function () {
        if (businessTableId == '' || null == businessTableId || typeof(businessTableId) == "undefined") {
            $.messager.alert('警告', '请选择类型');
            return;
        }
        if (columns === undefined || columns.length == 1) {
            $.messager.alert('警告', '请先设置字段');
            return;
        }
        window.location.href = basePath + "/oa/form/business_table_field/exportExcel.do?businessTableId=" + businessTableId;

    },

    importExcelUI: function () {
        if (businessTableId == '' || null == businessTableId || typeof(businessTableId) == "undefined") {
            $.messager.alert('警告', '请选择类型');
            return;
        }
        if (columns === undefined || columns.length == 1) {
            $.messager.alert('警告', '请先设置字段');
            return;
        }
        //导入底表数据UI
        ygDialog({
            title: '导入流程底表数据',
            href: basePath + '/oa/form/business_table_field/importExcelUI.do?sessionId=' + _jsSessionId,
            data: null,
            /*data : {
                name : "wen",
                floorId : 123
            },*/
            width: '350px',
            height: '250px',
            onClose: function () {
                business_table_field.TableData();
            }

        })
    }
};
