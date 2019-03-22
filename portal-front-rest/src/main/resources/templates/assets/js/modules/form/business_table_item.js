var myform;
var heightAndWidth = {height: 300, width: 350};
var businessTableItemOptFlag = {
    show: 'show',
    add: 'add',
    update: 'update',
    handle: 'handle',
    showTitle: '查看业务底表关联',
    addTitle: "添加业务底表关联",
    updateTitle: "修改业务底表关联",
    handleTitle: '创建业务底表关联'
};
var _div = '<div style="word-break:break-all">'; //弹窗提示的时候，内容多了自动换行
$(function () {
    business_table_item.init();
});
/*
function parsePage() {
	business_table_item.init();
};
*/
//业务底表关联管理
var business_table_item = {
    init: function () {
        /*//js中渲染easy-datagrid
        $('#subDg').datagrid({
            fitColumns:false,//显示水平滚动条
            //固定列到左边，不会随着水平滚定条移动
            frozenColumns : [ [ {
                field : 'id',
                checkbox : true
            },{
                title : '操作',
                field : 'opt',
                width : 70,
                align : 'left',
                formatter : optsFormatter
            }, {
                title : '用户名',
                field : 'uname',
                width : 100,
                align : 'left'
            }, {
                title : '用户类型',
                field : 'usertype',
                width : 60,
                align : 'left',
                formatter : presaleapply.usertypeFormatter,
            },{
                title : '申请号',
                field : 'sno',
                width : 150,
                align : 'left'
            },{
                title : '制造商零件编号',
                field : 'title',
                width : 150,
                align : 'left'
            },{
                title : '申请数量',
                field : 'applyCount',
                width : 80,
                align : 'left'
            },{
                title : '审批状态',
                field : 'checkState',
                width : 70,
                align : 'left',
                formatter : presaleapply.checkStateFormatter,
                styler : presaleapply.checkStateStyler
            }] ]
        });
        */
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
        /*business_table_item.initimgLazyload();*/
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
        var id = business_table_item.getId(_id);
        if (id == null || $.trim(id) == "") {
            $.messager.alert('警告', '请选择记录');
            return;
        }
        ygDialog({
            title: businessTableItemOptFlag.showTitle,
            href: basePath + '/oa/form/business_table_item/updateUI.do?id=' + id + '&opt=' + businessTableItemOptFlag.show + '&sessionId=' + _jsSessionId,
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
        ygDialog({
            title: businessTableItemOptFlag.addTitle,
            href: basePath + '/oa/form/business_table_item/updateUI.do?opt=' + businessTableItemOptFlag.add + '&sessionId=' + _jsSessionId,
            data: null,
            /*data : {
                name : "wen",
                floorId : 123
            },*/
            width: 'auto',
            height: 'auto',
            onSave: 'business_table_item.add',
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
                        url: basePath + '/oa/form/business_table_item/add.do?sessionId=' + _jsSessionId,
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
        var id = business_table_item.getId(_id);
        if (id == null || $.trim(id) == "") {
            $.messager.alert('警告', '请选择记录');
            return;
        }
        ygDialog({
            title: businessTableItemOptFlag.updateTitle,
            href: basePath + '/oa/form/business_table_item/updateUI.do?id=' + id + '&opt=' + businessTableItemOptFlag.update + '&sessionId=' + _jsSessionId,
            data: null,
            /*data : {
                name : "wen",
                floorId : 123
            },*/
            width: 'auto',
            height: 'auto',
            onSave: 'business_table_item.update',
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
                        url: basePath + '/oa/form/business_table_item/update.do?sessionId=' + _jsSessionId,
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
        var id = business_table_item.getId(_id);
        if (id == null || $.trim(id) == "") {
            $.messager.alert('警告', '请选择记录');
            return;
        }
        $.messager.confirm('确认', '你确认执行吗？', function(r) {
            if (r) {
                $.mask('正在执行...');
                var url = basePath + '/oa/form/business_table_item/updateStatus.do?sessionId='+_jsSessionId;
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
        var id = business_table_item.getId(_id);
        if (id == null || $.trim(id) == "") {
            $.messager.alert('警告', '请选择记录');
            return;
        }
        $.messager.confirm('确认', '你确认删除记录吗？', function (r) {
            if (r) {
                $.mask('正在执行...');
                var url = basePath + '/oa/form/business_table_item/dels.do?sessionId=' + _jsSessionId;
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
    }
};
