var FlowInfo = {
    // 列表页面
    list: {
        // 初始化
        init: function () {
            mini.parse();   // 必需
            this.searchForm = new mini.Form('jsSearchForm');    // 获取搜索表单对象
            this.grid = mini.get("jsDataGrid");    // 获取表格mini对象
            this.grid.load();
            this.tree = mini.get("catTree");    // 获取树mini对象
            this.systemList = mini.get('tenantId');
            this.bindEvents();
        },
        // 绑定事件
        bindEvents: function () {
            var _this = this;

            this.copyToCategoryTree = mini.get('jsNewCategory');

            this.copyToCategoryTree.on('showpopup', function(){
                _this.copyToCategoryTree.tree.scrollIntoView (_this.copyToCategoryTree.tree.getNode(_this.copyToCategoryTree.getValue()));
            });

            // 新增表单表单
            mini.get('jsAddBizFormInfo').on('click', function () {
                var treeNode = this.tree.getSelectedNode();
                var categoryId = '';
                if (treeNode) {
                    categoryId = treeNode.code;
                } else {
                    showWarnTips("请选择类型");
                    // showWarnTips("请选择类型");
                    return;
                }
                this.openFormInfoIpt('', '', '', categoryId);
            }, this);

            // 修改表单
            mini.get('jsEditFormInfo').on('click', function () {
                var rows = this.grid.getSelecteds();
                if (rows.length>0) {
                } else {
                    showWarn("请选择!");
                    return;
                }
                this.openFormInfoIpt(rows[0].id, rows[0].modelName, rows[0].modelId, rows[0].categoryCode);
            }, this);

            // 发布表单
            mini.get('jsPublicFormInfo').on('click', function () {
                var rows = this.grid.getSelecteds();
                if (rows.length>0) {
                } else {
                    showWarn("请选择!");
                    return;
                }
                this.activeForm(rows[0].modelKey);
            }, this);

            // 停用表单
            mini.get('jsStopFormInfo').on('click', function () {
                var rows = this.grid.getSelecteds();
                if (rows.length>0) {
                } else {
                    showWarn("请选择!");
                    return;
                }
                this.stopForm(rows[0].modelKey);
            }, this);
            
            // 查询
            $('#doSearchBtn').on('click',function (e) {
                _this.doSearch();
            });
            // 重置
            $('#doResetBtn').on('click',function (e) {
                mini.getbyName("keyWord").set({value:'', text:''});
                _this.systemList.set({value:''});
                _this.doSearch();
            });
            this.systemList.on('valuechanged', function (e) {
                _this.doSearch();
            }, this);
            // 树节点点击事件
            this.tree.on('nodeclick', function (e) {
                _this.grid.load({"categoryId": e.node.code})
            }).on('beforeload', function (e) {
                _this.onBeforeTreeLoad(e);
            });

            // 搜索框注册回车事件
            _this.searchForm.el.addEventListener('keypress', function (e) {
                // 回车键事件
                if(e.which == 13) {
                    _this.doSearch();
                }
            });

            // 表格事件
            this.grid.on('select', function (e) {
                if(e.record.categoryCode){
                    var findedNodes = this.tree.findNodes (function (node) {
                        if(node.code == e.record.categoryCode)return true;
                    });
                    findedNodes&&this.tree.selectNode(findedNodes[0]),this.tree.scrollIntoView(findedNodes[0]);
                }
            }, this);

            // 复制流程
            mini.get('jsCopyFormInfo').on('click', function () {
                var rows = this.grid.getSelecteds();
                if (rows.length>0) {
                } else {
                    showWarn("请选择!");
                    return;
                }
                this.showCopyForm(rows[0]);
            }, this);

            // 关闭复制流程弹窗
            mini.get('jsCloseCopyWindow').on('click', function () {
                this.copyCustFormWindow.hide();
            }, this);

            this.copyCustFormWindow = mini.get('jsCopyFormWindow');

            // 开始复制流程
            mini.get('jsDoCopyForm').on('click', function () {
                var copyFormForm = new mini.Form('jsCopyFormForm');
                var rows = this.grid.getSelecteds();
                var formCode = rows[0].modelKey;
                var newSystemSn = rows[0].systemSn;
                var category = this.copyToCategoryTree.tree.getNodesByValue(this.copyToCategoryTree.getValue())[0].code;
                var newFormName = mini.get('newFormName').getValue();
                var newModelKey = mini.get('newModelKey').getValue();
                if(newFormName == rows[0].modelName){
                    mini.get('newFormName').focus();
                    showErrTips("名称重复，请修正！");
                    return;
                }
                if(newModelKey == formCode){
                    mini.get('newModelKey').focus();
                    showErrTips("编码重复，请修正！");
                    return;
                }
                if(copyFormForm.validate()){
                    mask();
                    $.POST({
                        url: basePath + '/flow/form/biz_form_info/copyBizForm',
                        data:{fromModelKey:formCode, newModelName:newFormName, newModelKey:newModelKey, newSystemSn:newSystemSn, newCategory:category},
                        success:function(dt){
                            unmask();
                            if(dt.code == '100'){
                                showSucTips("拷贝成功！");
                                _this.copyCustFormWindow.hide();
                                _this.grid.reload();
                                // 进入编辑

                            }else{
                                showErrTips(dt.msg);
                            }
                        },
                        error:function () {
                            unmask();
                        }
                    });
                }
            }, this);

        },

        // 复制弹窗
        showCopyForm:function (row) {
            (new mini.Form('jsCopyFormForm')).reset();
            if (row) {
                mini.get('newFormName').set({value:row.modelName});
                mini.get('newModelKey').set({value:row.modelKey});
                var nodes = this.copyToCategoryTree.tree.findNodes(function(node){
                    if(node.code == row.categoryCode) return true;
                });
                this.copyToCategoryTree.setValue(nodes[0].id);
            } else {
                showWarnTips('请选择记录!');
                return;
            }
            this.copyCustFormWindow.show();
        },
        onBeforeTreeLoad:function (e) {
            var tree = e.sender;    //树控件
            var node = e.node;      //当前节点
            var params = e.params;  //参数对象

            //可以传递自定义的属性
            params.id = node.id; //后台：request对象获取"myField"

        },
        // 刷新
        refresh: function() {
            this.grid.reload();
        },

        openFormInfoIpt:function (id, name, modelId, catId) {
            addBlankTab({title:(name?name:'业务表单')+(id?"修改":"添加"), url: basePath+'/flow/form/form_info/bizDetailUI?id='+id+'&modelId=' + modelId + '&categoryId=' + catId+"&formType=2"});
        },

        // 发布
        activeForm:function(_modelKey) {
            var _this = this;
            var modelKey = '';
            if (_modelKey) {
                modelKey = _modelKey;
            } else {
                var row = this.grid.getSelected();
                if (row) {
                    modelKey = row.modelKey;
                } else {
                    showWarn('请选择记录');
                    return;
                }
                if (row.processDefinitionKey == '' || row.processDefinitionKey == null || typeof(row.processDefinitionKey) == "undefined") {
                    showWarn('请先绑定流程定义');
                    return;
                }
            }
            mask();
            $.ajax({
                url: basePath + '/flow/form/form_item/activeBizForm',
                dataType: "JSON",
                type: "POST",
                data: {modelKey: modelKey},
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    unmask();
                },
                success: function (data) {
                    unmask();
                    if (data.code == 100) {
                        _this.grid.reload();
                        showSuc(data.msg);
                    } else {
                        showWarnTips(data.msg);
                    }
                }
            });
        },
        // 停用
        stopForm:function(_modelKey) {
            var _this = this;
            var modelKey;
            if (_modelKey) {
                modelKey = _modelKey;
            } else {
                var row = this.grid.getSelected();
                if (row) {
                    modelKey = row.modelKey;
                } else {
                    showWarn('请选择记录');
                    return;
                }
            }

            showConfirm('你确认停用吗？', function (r) {
                if (r) {
                    mask('正在执行...');
                    var url = basePath + '/flow/form/form_info/stopBizForm';
                    $.ajax({
                        type: 'POST',
                        dataType: 'JSON',
                        url: url,
                        data: {
                            modelKey: modelKey
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            unmask();
                        },
                        success: function (data) {
                            unmask();
                            if (data.code == 100) {
                                _this.grid.reload();
                                showSuc('停用成功');
                            } else {
                                showWarn('停用失败,请联系系统管理员');
                            }
                        }
                    });
                }
            });
        },
        // 搜索
        doSearch:function(){
            var myForm = new mini.Form("#jsSearchForm");
            this.grid.load(myForm.getData());
        },
        // 渲染表格状态
        renderState:function(row){
            var color = '';
            if(row.record.showStatus == 1){
                color='red';
            }else if(row.record.showStatus == 2){
                color='#ffc600';
            }else if(row.record.showStatus == 3){
                color='green';
            }else if(row.record.showStatus == 4){
                color='grey';
            }
            return '<span style="color: '+color+'">'+row.value+'</span>';
        },
        // 渲染表格状态
        appliedRangeState:function(row){
            value = row.value;
            // UNKNOW(-1, "未知类型"), ZDYBD(1, "自定义(门户)"), YWXTMH(2, "业务流程(门户发起)"), YWXTYW(3, "业务流程(业务发起)"), XTLC(4, "系统流程"), ZDYBDYW(5, "自定义(业务)");
            if (value == -1) {
                return '<span style="">未知类型</span>';
            }
            if (value == 1) {
                return '<span style="">自定义(门户)</span>';
            }
            if (value == 2) {
                return '<span style="">业务流程(门户发起)</span>';
            }
            if (value == 3) {
                return '<span style="">业务流程(业务发起)</span>';
            }
            if (value == 4) {
                return '<span style="">系统流程</span>';
            }
            if (value == 5) {
                return '<span style="">自定义(业务)</span>';
            }
        }
    },
    // 输入页面
    input: {
        form: null,
        // 初始化
        init: function () {
        },
        // 绑定事件
        bindEvents: function () {
        }
    },

    // 查看页面
    view: {
        // 初始化
        init: function () {
        },
        // 绑定事件
        bindEvents: function () {
        }
    }
};






















//
// var myform;
// var heightAndWidth = {height: 300, width: 350};
// var fornInfOptFlag = {
//     show: 'show',
//     add: 'add',
//     update: 'update',
//     details: 'details',
//     detailsTitle: '查看表单信息',
//     addTitle: "表单设计",
//     updateTitle: "修改表单信息",
//     desFormData: "desFormData",
//     desFormDataTitle: "自定义表单数据"
// };
// var _div = '<div style="word-break:break-all">'; //弹窗提示的时候，内容多了自动换行
//
// /*
// function parsePage() {
// 	formInfo.init();
// };
// */
// //表单管理管理
// var formInfo = {
//     init: function () {
//         mini.parse();
//         this.lefetTree = mini.get('leftOrgMenu');
//         this.grid = mini.get('jsDataGrid');
//
//         this.grid.load();
//         formInfo.areaTree();
//         // formInfo.tableData('');
//         //查询方法
//         var doSearch = function doSearch() {
//             var myForm = $('#searchForm');
//             var data = myForm.serializeJson();
//             $.each(data, function (index, dom) { //去空格
//                 if (index && dom) {
//                     data[index] = $.trim(dom);
//                 }
//             });
//             //data.name=$.trim(data.name);
//             /*$('#subDg').datagrid({
//                 url:basePath+'/search/sku/ajaxList.do',
//                 queryParams:data
//             });*/
//             $('#subDg').datagrid('load', data);
//         };
//         //查询按钮
//         $('#SearchBtn').click(function () {
//             doSearch();
//         });
//         //回车事件
//         $('#searchForm').on('keydown', function (event) {
//             if (event.keyCode == 13) {
//                 doSearch();
//             }
//         });
//     },
//
//     //查看详情
//     detail: function (id, opt) {
//         //var _show	=fornInfOptFlag.show;
//         var _add = fornInfOptFlag.add;
//         var _update = fornInfOptFlag.update;
//         var _handle = fornInfOptFlag.details;
//         var _desFormData = fornInfOptFlag.desFormData;
//         //var _showTitle		=fornInfOptFlag.showTitle;
//         var _addTitle = fornInfOptFlag.addTitle;
//         var _updateTitle = fornInfOptFlag.updateTitle;
//         var _handleTitle = fornInfOptFlag.detailsTitle;
//         var _desFormDataTitle = fornInfOptFlag.desFormDataTitle;
//         switch (opt) {
// //		case _show:
// //			formInfo.openTab(id,_showTitle,opt);
// //			closeTabEx(_addTitle);
// //			closeTabEx(_updateTitle);
// //			closeTabEx(_handleTitle);
// //			break;
//             case _desFormData:
//                 formInfo.openDataTab(id, _desFormDataTitle, opt);
//                 //closeTabEx(_showTitle);
//                 closeTabEx(_updateTitle);
//                 closeTabEx(_handleTitle);
//                 break;
//             case _add:
//                 formInfo.openTab(id, _addTitle, opt);
//                 //closeTabEx(_showTitle);
//                 closeTabEx(_updateTitle);
//                 closeTabEx(_handleTitle);
//                 break;
//             case _update:
//                 formInfo.openTab(id, _updateTitle, opt);
//                 //closeTabEx(_showTitle);
//                 closeTabEx(_addTitle);
//                 closeTabEx(_handleTitle);
//                 break;
//             case _handle:
//                 formInfo.openTab(id, _handleTitle, opt);
//                 //closeTabEx(_showTitle);
//                 closeTabEx(_addTitle);
//                 closeTabEx(_updateTitle);
//                 break;
//             default:
//                 break;
//         }
//     },
//
//     openTab: function (id, _title, opt) {
//         var _myurl = basePath + "/flow/form/form_info/detailUI.do?sessionId=" + _jsSessionId + '&opt=' + opt + '&formInfoId=' + id;
//         ;
//         //添加tab
//         addBlankTab({
//             text: _title,
//             url: _myurl,
//             refresh: true
//         });
//     },
//     //打开自定义表单数据页面
//     openDataTab: function (id, _title, opt) {
//         var _myurl = basePath + "/flow/form/form_info/detailUI.do?sessionId=" + _jsSessionId + '&opt=' + opt + '&formInfoId=' + id;
//         ;
//         //添加tab
//         addBlankTab({
//             text: _title,
//             url: _myurl,
//             refresh: true
//         });
//     },
//
//     //加载树形
//     areaTree: function () {
//         //加载树形
//         this.lefetTree.load(basePath + '/basedata/flow_category/ajaxList');
//         // $('#leftOrgMenu').tree({
//         //     url: basePath + 'basedata/flow_category/ajaxList?sessionId=' + _jsSessionId,
//         //     onClick: function (node) {
//         //         //点击后联动表格
//         //         formInfo.tableData(node.code);
//         //
//         //         //节点展开/折叠
//         //         $('#leftOrgMenu').tree('toggle', node.target);
//         //     },
//         //     onDblClick: function (node) {
//         //         //节点展开/折叠
//         //         $('#leftOrgMenu').tree('toggle', node.target);
//         //     },
//         // });
//
//     },
//
//     // 表格数据
//     tableData: function (code) {
//
//         var url = basePath + "/flow/form/form_info/ajaxList.do?sessionId=" + _jsSessionId;
//         $('#subDg').datagrid({
//             url: url,
//             queryParams: {"categoryId": code},
//             singleSelect: true
//             // ,
//             // rowStyler: function(index,row){
//             // 	if (row.formStatus == '3'){
//             // 		return 'background-color:#66AFE9;color:#fff;';
//             // 	}
//             // }
//         });
//     },
//
//     /*typeFormatter : function(value, row, index) {
//         if (value == '1') {
//             return "全站";
//         } else if(value == '2') {
//             return "产品分类";
//         }else if(value == '3') {
//             return "产品详细";
//         }else {
//             return "--";
//         }
//     },*/
//
//     /*statusFormatter : function(value, row, index) {
//         if (value == 0) {
//             return "禁用";
//         } else if(value==1) {
//             return "启用";
//         } else {
//             return "--";
//         }
//     },
//
//     statusStyler : function(value, row, index) {
//         if (value == 0) {
//             return 'color:#FF0000;';
//         } else if(value == 1) {
//             return 'color:green;';
//         } else {
//             return 'color:gray;';
//         }
//     },*/
//     delFlagFormatter: function (value, row, index) {
//         if (value == 0) {
//             return "已删除";
//         } else if (value == 1) {
//             return "未删除";
//         } else {
//             return "-";
//         }
//     },
//
//     delFlagStyler: function (value, row, index) {
//         if (value == 0) {
//             return 'color:#FF0000;';
//         } else if (value == 1) {
//             return 'color:green;';
//         } else {
//             return 'color:gray;';
//         }
//     },
//
//     stopFrom: function (_id) {
//         var id;
//         if (_id) {
//             id = _id;
//         } else {
//             var rows = $('#subDg').datagrid('getChecked');
//             var ids = [];
//             $.each(rows, function (i, row) {
//                 ids.push(row.id);
//             });
//             id = ids.join(',');
//             if (id == null || id == "") {
//                 $.messager.alert('警告', '请选择记录');
//                 return;
//             }
//         }
//
//         $.messager.confirm('确认', '你确认停用吗？', function (r) {
//             if (r) {
//                 $.mask('正在执行...');
//                 var url = basePath + '/flow/form/form_info/stopForm.do?sessionId=' + _jsSessionId;
//                 $.ajax({
//                     type: 'POST',
//                     dataType: 'JSON',
//                     url: url,
//                     data: {
//                         id: id
//                     },
//                     error: function (XMLHttpRequest, textStatus, errorThrown) {
//                         $.unmask();
//                     },
//                     success: function (data) {
//                         $.unmask();
//                         if (data.responseCode == 1) {
//                             $('#subDg').datagrid('reload');
//                             showSuc('停用成功');
//                         } else {
//                             $.messager.alert('警告', _div + '停用失败,请联系系统管理员' + '</div>');
//                             //$.messager.alert('警告',_div+data.responseMsg+'</div>');
//                             //showWarn('删除失败,请联系系统管理员');
//                             //showWarn(data.responseMsg);
//                         }
//                     }
//                 });
//             }
//         });
//     },
//
//
//     del: function (_id) {
//         var id;
//         if (_id) {
//             id = _id;
//         } else {
//             var rows = $('#subDg').datagrid('getChecked');
//             var ids = [];
//             $.each(rows, function (i, row) {
//                 ids.push(row.id);
//             });
//             id = ids.join(',');
//             if (id == null || id == "") {
//                 $.messager.alert('警告', '请选择记录');
//                 return;
//             }
//         }
//
//         $.messager.confirm('确认', '你确认删除记录吗？', function (r) {
//             if (r) {
//                 $.mask('正在执行...');
//                 var url = basePath + '/flow/form/form_info/dels.do?sessionId=' + _jsSessionId;
//                 $.ajax({
//                     type: 'POST',
//                     dataType: 'JSON',
//                     url: url,
//                     data: {
//                         ids: id
//                     },
//                     error: function (XMLHttpRequest, textStatus, errorThrown) {
//                         $.unmask();
//                     },
//                     success: function (data) {
//                         $.unmask();
//                         if (data.responseCode == 1) {
//                             $('#subDg').datagrid('reload');
//                             showSuc('删除成功');
//                         } else {
//                             $.messager.alert('警告', _div + '删除失败,请联系系统管理员' + '</div>');
//                             //$.messager.alert('警告',_div+data.responseMsg+'</div>');
//                             //showWarn('删除失败,请联系系统管理员');
//                             //showWarn(data.responseMsg);
//                         }
//                     }
//                 });
//             }
//         });
//     },
//
//     addUI: function () {
//         var treeNode = $('#leftOrgMenu').tree('getSelected');
//         var categoryId = '';
//         if (treeNode) {
//             categoryId = treeNode.code;
//         } else {
//             $.messager.alert('警告', '请选择类型');
//             return;
//         }
//         ygDialog({
//             title: '添加表单管理',
//             href: basePath + '/flow/form/form_info/detailUI.do?sessionId=' + _jsSessionId,
//             data: null,
//             isFrame: true,
//             /*data : {
//                 name : "wen",
//                 floorId : 123
//             },*/
//             width: heightAndWidth.width,
//             height: heightAndWidth.height,
//             onSave: 'formInfo.add',
//             onClose: null
//         });
//     },
//
//     add: function (dialog) {
//         //var _name=dialog.getData('name');
//         //var _floorId=dialog.getData('floorId');
//         var treeNode = $('#leftOrgMenu').tree('getSelected');
//         var categoryId = '';
//         if (treeNode) {
//             categoryId = treeNode.code;
//         } else {
//             $.messager.alert('警告', '请选择类型');
//             return;
//         }
//         $('#jsCategoryId').val(categoryId);
//         myform = $('#myForm');
//         if (myform.form('validate')) {
//             $.mask('正在执行...');
//             $.ajax({
//                 type: 'POST',
//                 dataType: 'JSON',
//                 url: basePath + '/flow/form/form_info/add.do?sessionId=' + _jsSessionId,
//                 data: myform.serialize(),
//                 error: function (XMLHttpRequest, textStatus, errorThrown) {
//                     $.unmask();
//                 },
//                 success: function (data) {
//                     $.unmask();
//                     if (data.responseCode == 1) {
//                         $('#subDg').datagrid('reload');
//                         showSuc('添加成功');
//                         dialog.close();
//                     } else {
//                         $.messager.alert('警告', _div + '添加失败,请联系系统管理员' + '</div>');
//                         //$.messager.alert('警告',_div+data.responseMsg+'</div>');
//                         //showWarn('添加失败,请联系系统管理员');
//                         //showWarn(data.responseMsg);
//                     }
//                 }
//             });
//         }
//     },
//
//     updateUI: function (_id) {
//         if (_id) {
//             id = _id;
//         } else {
//             var rows = $('#subDg').datagrid('getChecked');
//             var ids = [];
//             $.each(rows, function (i, row) {
//                 ids.push(row.id);
//             });
//             id = ids.join(',');
//             if (id == null || id == "") {
//                 $.messager.alert('警告', '请选择记录');
//                 return;
//             }
//             id = ids[0];
//         }
//         ygDialog({
//             title: '修改表单管理',
//             href: basePath + '/flow/form/form_info/detailUI.do?id=' + id + '&sessionId=' + _jsSessionId,
//             data: null,
//             /*data : {
//                 name : "wen",
//                 floorId : 123
//             },*/
//             width: heightAndWidth.width,
//             height: heightAndWidth.height,
//             onSave: 'formInfo.update',
//             onClose: null
//         });
//     },
//
//     update: function (dialog) {
//         //var _name=dialog.getData('name');
//         //var _floorId=dialog.getData('floorId');
//         myform = $('#myForm');
//         if (myform.form('validate')) {
//             $.mask('正在执行...');
//             $.ajax({
//                 type: 'POST',
//                 dataType: 'JSON',
//                 url: basePath + '/flow/form/form_info/update.do?sessionId=' + _jsSessionId,
//                 data: myform.serialize(),
//                 error: function (XMLHttpRequest, textStatus, errorThrown) {
//                     $.unmask();
//                 },
//                 success: function (data) {
//                     $.unmask();
//                     if (data.responseCode == 1) {
//                         $('#subDg').datagrid('reload');
//                         showSuc('修改成功');
//                         dialog.close();
//                     } else {
//                         $.messager.alert('警告', _div + '修改失败,请联系系统管理员' + '</div>');
//                         //$.messager.alert('警告',_div+data.responseMsg+'</div>');
//                         //showWarn('修改失败,请联系系统管理员');
//                         //showWarn(data.responseMsg);
//                     }
//                 }
//             });
//         }
//     },
//     //自定义表单设计页面-新增
//     desFormAdd: function (_id) {
//         var treeNode = $('#leftOrgMenu').tree('getSelected');
//         var categoryId = '';
//         if (treeNode) {
//             categoryId = treeNode.code;
//         } else {
//             $.messager.alert('警告', '请选择类型');
//             return;
//         }
//         $('#jsCategoryId').val(categoryId);
//
//         window.open(basePath + "/flow/form/form_info/detailUI.do?formInfoId=" + '' + "&sessionId=" + _jsSessionId + "&categoryId=" + categoryId);
//         //formInfo.detail(id,fornInfOptFlag.add);
//     },
//
//     //自定义表单设计页面-修改
//     desFormEdit: function (_id) {
//         if (_id) {
//             id = _id;
//         } else {
//             var rows = $('#subDg').datagrid('getChecked');
//             var ids = [];
//             $.each(rows, function (i, row) {
//                 ids.push(row.id);
//             });
//             id = ids.join(',');
//             if (id == null || id == "") {
//                 $.messager.alert('警告', '请选择记录');
//                 return;
//             }
//             else {
//                 id = ids[0];
//             }
//         }
//         window.open(basePath + "/flow/form/form_info/detailUI.do?formInfoId=" + id + "&sessionId=" + _jsSessionId + "&categoryId=" + '');
//         //formInfo.detail(id,fornInfOptFlag.add);
//     },
//
//     //自定义表单数据页面
//     formDetail: function (_id) {
//         if (_id) {
//             id = _id;
//         } else {
//             var rows = $('#subDg').datagrid('getChecked');
//             var ids = [];
//             $.each(rows, function (i, row) {
//                 ids.push(row.id);
//             });
//             id = ids.join(',');
//             if (id == null || id == "") {
//                 $.messager.alert('警告', '请选择记录');
//                 return;
//             }
//             id = ids[0];
//         }
//         formInfo.detail(id, fornInfOptFlag.desFormData);
//     },
//
//
//     //激活表单
//     activeForm: function (_id) {
//         if (_id) {
//             id = _id;
//         } else {
//             var rows = $('#subDg').datagrid('getChecked');
//             var ids = [];
//             $.each(rows, function (i, row) {
//                 ids.push(row.id);
//             });
//             id = ids.join(',');
//             if (id == null || id == "") {
//                 $.messager.alert('警告', '请选择记录');
//                 return;
//             }
//             id = ids[0];
//             if (rows[0].processDefinitionKey == '' || rows[0].processDefinitionKey == null || typeof(rows[0].processDefinitionKey) == "undefined") {
//                 $.messager.alert('警告', '请先绑定流程定义');
//                 return;
//             }
//         }
//         $.ajax({
//             url: basePath + '/oa/form/formItem/activeForm.do?sessionId=' + _jsSessionId,
//             dataType: "JSON",
//             type: "POST",
//             data: {"formInfoId": id},
//             error: function (XMLHttpRequest, textStatus, errorThrown) {
//                 $.unmask();
//             },
//             success: function (data) {
//                 $.unmask();
//                 if (data.responseCode == 1) {
//                     $('#subDg').datagrid('reload');
//                     showSuc(data.responseMsg);
//                 } else {
//                     $.messager.alert('警告', _div + data.responseMsg + '</div>');
//                     //$.messager.alert('警告',_div+data.responseMsg+'</div>');
//                     //showWarn('修改失败,请联系系统管理员');
//                     //showWarn(data.responseMsg);
//                 }
//             }
//         });
//     },
//
//     //绑定流程定义key
//     setKey: function (_id) {
//         if (_id) {
//             id = _id;
//         } else {
//             var rows = $('#subDg').datagrid('getChecked');
//             var ids = [];
//             $.each(rows, function (i, row) {
//                 ids.push(row.id);
//             });
//             id = ids.join(',');
//             if (id == null || id == "") {
//                 $.messager.alert('警告', '请选择记录');
//                 return;
//             }
//             id = ids[0];
//             if (rows[0].processDefinitionKey != '' && rows[0].processDefinitionKey != null && typeof(rows[0].processDefinitionKey) != "undefined") {
//                 $.messager.confirm('提醒', '该表单已绑定流程定义，继续操作将重新绑定', function (r) {
//                     if (r) {
//                         formInfo.diaLog(_jsSessionId);
//                     }
//                 });
//             } else {
//                 formInfo.diaLog(_jsSessionId);
//             }
//         }
//     },
//
//     diaLog: function (_jsSessionId) {
//         ygDialog({
//             title: '绑定流程定义key',
//             href: basePath + '/flow/form/form_info/selectPDKey.do?id=' + id + '&sessionId=' + _jsSessionId,
//             data: null,
//             /*data : {
//         name : "wen",
//         floorId : 123
//     },*/
//             width: 800,
//             height: 500,
//             onSave: 'formInfo.saveKey',
//             onClose: null
//         });
//     },
//
//     saveKey: function (dialog) {
//         id = $('#formId').val();
//         var row = $('#subDg2').datagrid('getSelected');
//         if (row == null || row == "") {
//             $.messager.alert('警告', '请选择记录');
//             return;
//         }
//         var key = row.key;
//         myform = $('#myForm');
//         if (myform.form('validate')) {
//             $.mask('正在执行...');
//             $.ajax({
//                 type: 'POST',
//                 dataType: 'JSON',
//                 url: basePath + '/flow/form/form_info/update.do?sessionId=' + _jsSessionId,
//                 data: {"id": id, "processDefinitionKey": key},
//                 error: function (XMLHttpRequest, textStatus, errorThrown) {
//                     $.unmask();
//                 },
//                 success: function (data) {
//                     $.unmask();
//                     if (data.responseCode == 1) {
//                         $('#subDg').datagrid('reload');
//                         showSuc('修改成功');
//                         dialog.close();
//                     } else {
//                         $.messager.alert('警告', _div + data.responseMsg + '</div>');
//                         //$.messager.alert('警告',_div+data.responseMsg+'</div>');
//                         //showWarn('修改失败,请联系系统管理员');
//                         //showWarn(data.responseMsg);
//                     }
//                 }
//             });
//         }
//     },
//
//     /*updateStatus : function(status,_id) {
//         var id ;
//         if(_id){
//             id=_id;
//         }else{
//             var rows = $('#subDg').datagrid('getChecked');
//             var ids = [];
//             $.each(rows, function(i, row) {
//                 ids.push(row.id);
//             });
//             id = ids.join(',');
//             if (id == null || id == "") {
//                 $.messager.alert('警告', '请选择记录');
//                 return;
//             }
//         }
//         $.mask('正在执行...');
//         var url = basePath + '/flow/form/form_info/updateStatus.do?sessionId='+_jsSessionId;
//         $.ajax({
//             type : 'POST',
//             dataType : 'JSON',
//             url : url,
//             data : {
//                 ids : id,
//                 status : status
//             },
//             error: function (XMLHttpRequest, textStatus, errorThrown) {
//                 $.unmask();
//             },
//             success : function(data) {
//                 $.unmask();
//                 if (data.responseCode == 1) {
//                     $('#subDg').datagrid('reload');
//                     showSuc('修改状态成功');
//                 } else {
//                     $.messager.alert('警告',_div+'修改状态失败,请联系系统管理员'+'</div>');
//                     //$.messager.alert('警告',_div+data.responseMsg+'</div>');
//                     //showWarn('修改状态失败,请联系系统管理员');
//                     //showWarn(data.responseMsg);
//                 }
//             }
//         });
//     },*/
//     //刷新
//     refresh: function () {
//         $('#subDg').datagrid('reload');
//     },
//     //重置
//     reset: function () {
//         //$('.jsClearValue').val('');
//         //$('#jstype').combobox('select','');
//         $("#searchForm").form("reset");
//     }
// };
