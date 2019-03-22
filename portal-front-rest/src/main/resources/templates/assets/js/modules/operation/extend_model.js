var ExtendModel = {
    // 列表页面
    list: {
        tree:null,
        grid:null,
        searchForm:null,
        // 初始化
        init: function () {
            mini.parse();   // 必需
            this.searchForm = new mini.Form('jsSearchForm');    // 获取搜索表单对象
            this.grid = mini.get("jsDataGrid");    // 获取表格mini对象
            this.tree = mini.get("catTree");
            this.loadDatagrid();
            this.bindEvents();
        },
        selectNode:function () {
            var node = this.tree.getSelectedNode();
            this.grid.load({ categoryCode: node.code });
        },
        // 加载
        loadDatagrid:function(){
            var _this = this;
            _this.grid.load();   // 加载表格数据

            // 表格操作按钮 初始化
            var options = {
                grid:_this.grid,       // 操作的datagrid表格对象 【必需设置】
                buttons:[
                    {
                        text:'编辑流程',
                        // pms:2,
                        iconCls:'eye',
                        click:function(e){
                            window.open(basePath+"/index.html#/editor/"+e.record.modelId)
                        }
                    },
                    {
                        text:'部署',
                        iconCls:'edit',
                        click:function(e){
                            _this.deploy(e.record.modelId);
                        }
                    },{
                        text:'查看XML',
                        // pms:2,
                        iconCls:'eye',
                        click:function(e){
                            window.open(basePath+"/flow/operation/extend_model/loadModelXml?id="+e.record.modelId)
                        }
                    }
                ]
            };
            // 初始化表格操作按钮
            initOptions(options);
        },
        // 绑定事件
        bindEvents: function () {
            var _this = this;
            // 重置
            $('#doResetBtn').click(function () {
                _this.grid.reload();
            });
            // 添加
            $('#jsAdd').click(function () {
                var node = _this.tree.getSelectedNode();
                if(node){
                    _this.openIpt();
                }else{
                    showErrTips("请选择类型");
                }
            });
            // 修改
            $('#jsEdit').click(function () {
                var row = _this.grid.getSelected();
                if (row) {
                    _this.openIpt(row);
                } else {
                    showWarn('请选中一条记录');
                }
            });
            // 删除
            $('#jsDel').click(function () {
                var ids = [];
                var rows = _this.grid.getSelecteds();
                if (rows.length > 0) {
                    mini.confirm("确定删除记录？", "确定？",
                        function (action) {
                            if (action == "ok") {
                                $.each(rows, function (i, o) {
                                    ids.push(o.id);
                                });
                                var url = basePath + '/flow/operation/extend_model/deleteModel';
                                $.POST({ url: url, data: {ids:ids.join(',')},
                                    success:function (res) {
                                        if(res.responseCode == "100"){
                                            _this.grid.reload();
                                            showSucTips("删除成功！");
                                        }else{
                                            showErrTips(res.responseMsg);
                                        }
                                    },
                                    error:function () {
                                        showErrTips('网络异常，请稍候再试！');
                                    }
                                });
                            }
                        }
                    );
                } else {
                    showWarn('请选中一条记录');
                }
            });
            // 查询
            $('#doSearchBtn').click(function () {
                _this.doSearch();
            });
            // 搜索框注册回车事件
            _this.searchForm.el.addEventListener('keypress', function (e) {
                // 回车键事件
                if(e.which == 13) {
                    _this.doSearch();
                }
            });
            // 重置
            $('#doResetBtn').click(function () {
                _this.grid.load();
            });
            // 行双击查看数据
            _this.grid.on('rowdblclick', function (e) {
                var row = e.record;
                _this.openIpt(row, false);
            });
        },
        doSearch:function(){
            this.grid.load(this.searchForm.getData());
        },
        deploy:function(modelId){
            var _this=this;
            var url = basePath + '/flow/operation/extend_model/deploy';
            $.POST({ url: url, data: {modelId:modelId},
                success:function (res) {
                    if(res.responseCode == "100"){
                        _this.grid.reload();
                        showSucTips("部署成功！");
                    }else{
                        showErrTips(res.responseMsg);
                    }
                },
                error:function () {
                    showErrTips('网络异常，请稍候再试！');
                }
            });
        },
        openIpt:function(row, editable){
            var node = "";
            var id="";
            if(!row){
                node=this.tree.getSelectedNode().code;
            }else{
                id=row.id;
            }
            var _this = this;
            var title = (row ? (undefined != editable&&!editable?"查看":"编辑") : "添加") + "模型管理";
            var url = basePath + "/flow/operation/extend_model/updateUI?categoryCode="+node+"&id="+id;

            // 【弹窗模式】 弹窗添加修改页面
            mini.open({
                url: url,
                allowResize:true,
                title: title,
                width: 1000, height: 600,
                onload: function () {
                    if(row!=undefined) {
                        var iframe = this.getIFrameEl();
                        // iframe.contentWindow.ExtendModel.input.form.setData(row);
                        // iframe.contentWindow.oldUserNames=row.userNames;
                        // iframe.contentWindow.oldOwnDeptName=row.ownDeptName;
                        // iframe.contentWindow.oldOwnDeptId=row.ownDeptId;
                        // iframe.contentWindow.oldFlowOwnerName=row.flowOwnerName;
                        // iframe.contentWindow.oldFlowOwnerNo=row.flowOwnerNo;
                        // iframe.contentWindow.oldProcessDockingNo=row.processDockingNo;
                        // iframe.contentWindow.oldProcessDockingName=row.processDockingName;
                        // iframe.contentWindow.ExtendModel.input.ownDept.setValue(row.ownDeptId);
                        // iframe.contentWindow.ExtendModel.input.ownDept.setText(row.ownDeptName);
                        // iframe.contentWindow.ExtendModel.input.flowOwner.setValue(row.flowOwnerNo);
                        // iframe.contentWindow.ExtendModel.input.flowOwner.setText(row.flowOwnerName);
                        // iframe.contentWindow.ExtendModel.input.processDocking.setValue(row.processDockingNo);
                        // iframe.contentWindow.ExtendModel.input.processDocking.setText(row.processDockingName);
                        // iframe.contentWindow.ExtendModel.input.name.setValue(row.modelName);
                        if(undefined != editable&&!editable){
                            //iframe.contentWindow.ExtendModel.input.form.setEnabled(false);
                            iframe.contentWindow.ExtendModel.view.init();
                        }
                    }
                },
                ondestroy: function (action) {
                    _this.grid.reload();
                }
            });

            // 【页签模式】 添加修改页面【新增Tab页签】
            /*addBlankTab({
                title:title,
                url:url
            });*/
        }
    },
    authList: {
        tree:null,
        grid:null,
        searchForm:null,
        // 初始化
        init: function () {
            mini.parse();   // 必需
            this.searchForm = new mini.Form('jsSearchForm');    // 获取搜索表单对象
            this.grid = mini.get("jsDataGrid");    // 获取表格mini对象
            this.tree = mini.get("catTree");
            this.loadDatagrid();
            this.bindEvents();
        },
        selectNode:function () {
            var node = this.tree.getSelectedNode();
            this.grid.load({ categoryCode: node.code });
        },
        // 加载
        loadDatagrid:function(){
            var _this = this;
            _this.grid.load();   // 加载表格数据

            // 表格操作按钮 初始化
            var options = {
                grid:_this.grid,       // 操作的datagrid表格对象 【必需设置】
                buttons:[

                    {
                        text:'授权',
                        iconCls:'edit',
                        click:function(e){
                            _this.openAuthModel(e.record);
                        }
                    }
                ]
            };
            // 初始化表格操作按钮
            initOptions(options);
        },
        // 绑定事件
        bindEvents: function () {
            var _this = this;
            // 重置
            $('#doResetBtn').click(function () {
                _this.grid.reload();
            });

            // 授权
            $('#jsAuth').click(function () {
                var row = _this.grid.getSelected();
                if (row) {
                    _this.openAuthModel(row);
                } else {
                    showWarn('请选中一条记录');
                }
            });

            // 查询
            $('#doSearchBtn').click(function () {
                _this.doSearch();
            });
            // 搜索框注册回车事件
            _this.searchForm.el.addEventListener('keypress', function (e) {
                // 回车键事件
                if(e.which == 13) {
                    _this.doSearch();
                }
            });
            // 重置
            $('#doResetBtn').click(function () {
                _this.grid.load();
            });
            // 行双击查看数据
            _this.grid.on('rowdblclick', function (e) {
                var row = e.record;
                _this.openIpt(row, false);
            });
        },
        doSearch:function(){
            this.grid.load(this.searchForm.getData());
        },

        openAuthModel:function(row) {

            var _this = this;
            var title =  "模型授权";
            var url = basePath + "/flow/operation/extend_model/flowAuthModel?id="+row.id;

            // 【弹窗模式】 弹窗添加修改页面
            mini.open({
                url: url,
                allowResize: true,
                title: title,
                width: 500, height: 400,
                onload: function () {
                    if (row != undefined) {
                        var iframe = this.getIFrameEl();
                        iframe.contentWindow.ExtendModel.authModel.name.setValue(row.modelName);
                    }
                },
                ondestroy: function (action) {
                    _this.grid.reload();
                }
            });
        }
    },
    // 输入页面
    input: {
        form: null,
        ownDept:null,
        flowOwner:null,
        processDocking:null,
        user:null,
        name:null,
        tenantId:null,
        // 初始化
        init: function () {
            mini.parse();   // 必需
            this.form = new mini.Form("#jsMainForm");  //获取form对象
            this.ownDept=  mini.get('ownDeptName');
            this.flowOwner=  mini.get('flowOwnerName');
            this.processDocking=  mini.get('processDockingName');
            this.user=  mini.get('userNames');
            this.name=  mini.get('jsName');
            this.tenantId=  mini.get('tenantId');
            this.bindEvents();
        },
        // 保存数据
        save:function(){
            var _this = this;
            _this.form.validate();
            if (!_this.form.isValid()){
                return;
            }
            mask('正在保存...');
            var formData = _this.form.getData();
            var ownDept = mini.get('ownDeptName').selectedData;
            var flowOwner = mini.get('flowOwnerName').selectedData;
            var processDocking = mini.get('processDockingName').selectedData;
            var userNames = mini.get('userNames').selectedData;
            formData.ownDeptName=ownDept?ownDept[0].name:oldOwnDeptName;
            formData.ownDeptId=ownDept?ownDept[0].id:oldOwnDeptId;
            formData.flowOwnerName=flowOwner?flowOwner[0].name:oldFlowOwnerName;
            formData.flowOwnerNo=flowOwner?flowOwner[0].no:oldFlowOwnerNo;
            formData.processDockingName=processDocking?processDocking[0].name:oldProcessDockingName;
            formData.processDockingNo=processDocking?processDocking[0].no:oldProcessDockingNo;
            formData.categoryCode = this.baseInfo.categoryCode;
            debugger;

            if(userNames){
                var name=[];
                var ids=[];
                $.each(userNames,function (index,row) {
                    name.push(row.name);
                    ids.push(row.no);
                })
                formData.userNames=name.join(",");
                formData.userIds=ids.join(",");
            }
            var url = formData.id==""?"/flow/operation/extend_model/add":"/flow/operation/extend_model/update";

            // var jsonStr = mini.encode(formData);   //序列化成JSON字符串
            // 异步保存数据
            $.POST({ url: basePath+url, data: formData,
                success:function (res) {
                    unmask();
                    if(res.responseCode == "100"){ // ReturnCode.SUCCESS  ---> '100'
                        // 【弹窗模式】 关闭弹窗
                        CloseWindow("save", _this.form);

                        // 【页签模式】 关闭并刷新指定页签
                        // closeTab();
                        // refreshTab("测试页面");
                    }else{
                        showErrTips(res.responseMsg);
                    }
                },
                error:function (res) {
                    unmask();
                    showErrTips("网络异常，请稍后再试！");
                }
            });
        },

        // 绑定事件
        bindEvents: function () {
            var _this = this;
            // 点击确定
            $('#jsSave').click(function () {
                _this.save();
            });
            // 点击关闭
            $('#jsCancel').click(function () {
                // 【弹窗模式】 弹窗关闭窗口
                CloseWindow("cancel", _this.form);

                // 【页签模式】 关闭当前Tab页签
                // closeTab();
            });
            setTimeout(function () {
                _this.tenantId.setValue(tenantId);
            },100)

        }
    },
    // 输入页面
    authModel: {
        form: null,
        name:null,
        // 初始化
        init: function () {
            mini.parse();   // 必需
            this.form = new mini.Form("#jsMainForm");  //获取form对象
            this.name=mini.get("jsName");
            this.bindEvents();
        },
        // 保存数据
        saveAuth:function(){
            var _this = this;
            mask('正在保存...');
            var formData = _this.form.getData();

            var url = "/flow/operation/extend_model/saveAuth";

            // 异步保存数据
            $.POST({ url: basePath+url, data: formData,
                success:function (res) {
                    unmask();
                    if(res.responseCode == "100"){ // ReturnCode.SUCCESS  ---> '100'
                        // 【弹窗模式】 关闭弹窗
                        CloseWindow("save", _this.form);

                        // 【页签模式】 关闭并刷新指定页签
                        // closeTab();
                        // refreshTab("测试页面");
                    }else{
                        showErrTips(res.responseMsg);
                    }
                },
                error:function (res) {
                    unmask();
                    showErrTips("网络异常，请稍后再试！");
                }
            });
        },

        // 绑定事件
        bindEvents: function () {
            var _this = this;
            // 点击确定
            $('#jsSave').click(function () {
                _this.saveAuth();
            });
            // 点击关闭
            $('#jsCancel').click(function () {
                // 【弹窗模式】 弹窗关闭窗口
                CloseWindow("cancel", _this.form);

                // 【页签模式】 关闭当前Tab页签
                // closeTab();
            });

        }
    },

    // 查看页面
    view: {
        // 初始化
        init: function () {
            this.form = new mini.Form("#jsMainForm");  //获取form对象
            this.form.setEnabled(false);
            this.bindEvents();
        },
        // 绑定事件
        bindEvents: function () {
            $('#jsSave').remove();
        }
    }
};