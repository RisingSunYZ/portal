var myform;
var heightAndWidth = {height: 300, width: 350};
var _div = '<div style="word-break:break-all">'; //弹窗提示的时候，内容多了自动换行
$(function () {
    formType.init();
});
/*
function parsePage() {
	formType.init();
};
*/
//表单类型管理
var formType = {
    init: function () {
        /*//js中渲染easy-datagrid
        $('#treegrid').datagrid({
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
            /*$('#treegrid').datagrid({
                url:basePath+'/search/sku/ajaxList.do',
                queryParams:data
            });*/
            $('#treegrid').treegrid('load', data);
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

    pagerFilter: function (data) {
        if ($.isArray(data)) {    // is array  
            data = {
                total: data.length,
                rows: data
            };
        }
        //table
        var dg = $(this);
        //treegrid
        var state = dg.data('treegrid');
        var opts = dg.treegrid('options');
        var pager = dg.treegrid('getPager');
        pager.pagination({
            onSelectPage: function (pageNum, pageSize) {
                opts.pageNumber = pageNum;
                opts.pageSize = pageSize;
                pager.pagination('refresh', {
                    pageNumber: pageNum,
                    pageSize: pageSize
                });
                dg.treegrid('loadData', data);
            }
        });
        if (!data.topRows) {
            data.topRows = [];
            data.childRows = [];
            for (var i = 0; i < data.rows.length; i++) {
                var row = data.rows[i];
                row._parentId ? data.childRows.push(row) : data.topRows.push(row);
            }
            data.total = (data.topRows.length);
        }
        var start = (opts.pageNumber - 1) * parseInt(opts.pageSize);
        var end = start + parseInt(opts.pageSize);
        data.rows = $.extend(true, [], data.topRows.slice(start, end).concat(data.childRows));
        return data;
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
            var rows = $('#treegrid').datagrid('getChecked');
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
                var url = basePath + '/oa/form/formType/dels.do?sessionId=' + _jsSessionId;
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
                            $('#treegrid').treegrid('reload');
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

    addChild: function (id) {
        formType.addUI(id);
    },

    addUI: function (pId) {
        if (pId == null) {
            pId = '';
        }
        ygDialog({
            title: '添加表单类型',
            href: basePath + '/oa/form/formType/updateUI.do?sessionId=' + _jsSessionId + '&pid=' + pId,
            data: null,
            /*data : {
                name : "wen",
                floorId : 123
            },*/
            width: heightAndWidth.width,
            height: heightAndWidth.height,
            onSave: 'formType.add',
            onClose: null
        });
    },

    add: function (dialog) {
        //var _name=dialog.getData('name');
        //var _floorId=dialog.getData('floorId');
        myform = $('#myForm');
        if (myform.form('validate')) {
            $.mask('正在执行...');
            $.ajax({
                type: 'POST',
                dataType: 'JSON',
                url: basePath + '/oa/form/formType/add.do?sessionId=' + _jsSessionId,
                data: myform.serialize(),
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $.unmask();
                },
                success: function (data) {
                    $.unmask();
                    if (data.responseCode == 1) {
                        $('#treegrid').treegrid('reload');
                        showSuc('添加成功');
                        dialog.close();
                    } else {
                        $.messager.alert('警告', _div + '添加失败,请联系系统管理员' + '</div>');
                        //$.messager.alert('警告',_div+data.responseMsg+'</div>');
                        //showWarn('添加失败,请联系系统管理员');
                        //showWarn(data.responseMsg);
                    }
                }
            });
        }
    },

    updateUI: function (_id) {
        if (_id) {
            id = _id;
        } else {
            var rows = $('#treegrid').datagrid('getChecked');
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
            title: '修改表单类型',
            href: basePath + '/oa/form/formType/updateUI.do?id=' + id + '&sessionId=' + _jsSessionId,
            data: null,
            /*data : {
                name : "wen",
                floorId : 123
            },*/
            width: heightAndWidth.width,
            height: heightAndWidth.height,
            onSave: 'formType.update',
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
                url: basePath + '/oa/form/formType/update.do?sessionId=' + _jsSessionId,
                data: myform.serialize(),
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $.unmask();
                },
                success: function (data) {
                    $.unmask();
                    if (data.responseCode == 1) {
                        $('#treegrid').treegrid('reload');
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

    /*updateStatus : function(status,_id) {
        var id ;
        if(_id){
            id=_id;
        }else{
            var rows = $('#treegrid').datagrid('getChecked');
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
        var url = basePath + '/oa/form/formType/updateStatus.do?sessionId='+_jsSessionId;
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
                    $('#treegrid').datagrid('reload');
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
        $('#treegrid').treegrid('reload');
    },
    //重置
    reset: function () {
        //$('.jsClearValue').val('');
        //$('#jstype').combobox('select','');
        $("#searchForm").form("reset");
    }
};
