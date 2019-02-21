
var ProcessDef = {
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
            this.grid.load({ category: node.code });
        },
        // 加载
        loadDatagrid:function(){
            var _this = this;
            _this.grid.load();   // 加载表格数据
            // 重置
            $('#doResetBtn').click(function () {
                _this.grid.load();
            });
            // 表格操作按钮 初始化
            var options = {
                grid:_this.grid,       // 操作的datagrid表格对象 【必需设置】
                buttons:[
                    {
                        text:'挂起',  // 操作按钮名称 【必需设置】
                        //pms:1,       // 权限值  【可选】   不设置则默认显示
                        iconCls:'edit',     // 按钮图标 【可选】
                        click:function(e){    // 点击事件 【必需设置】，如果不设置则此按钮无意义
                            _this.suspendProcessDefinition(e.record.id);
                        },
                        filter:function(e){             // 过滤按钮 【可选】 显示/隐藏 返回ture才显示
                            var row = e.record;
                            if(row.suspensionState==1){
                                return true;
                            }else{
                                return false;
                            }
                            return true;
                        }
                    },
                    {
                        text:'流程图',  // 操作按钮名称 【必需设置】
                        //pms:1,       // 权限值  【可选】   不设置则默认显示
                        iconCls:'fa fa-file-picture-o',     // 按钮图标 【可选】
                        click:function(e){    // 点击事件 【必需设置】，如果不设置则此按钮无意义
                            //console.info(e.record);
                            //_this.viewResource(e.record.id);
                            window.open(basePath+"/flow/operation/process_def/loadByDeployment?processDefinitionId="+e.record.id+"&resourceType=png")

                        },
                        filter:function(e){             // 过滤按钮 【可选】 显示/隐藏 返回ture才显示
                            var row = e.record;
                            return true;
                        }
                    },
                    {
                        text:'查看XML',
                        // pms:2,
                        iconCls:'eye',
                        click:function(e){
                            window.open(basePath+"/flow/operation/process_def/loadByDeployment?processDefinitionId="+e.record.id+"&resourceType=xml")
                        }
                    },
                    {
                        text:'激活',  // 操作按钮名称 【必需设置】
                        //pms:1,       // 权限值  【可选】   不设置则默认显示
                        iconCls:'edit',     // 按钮图标 【可选】
                        click:function(e){    // 点击事件 【必需设置】，如果不设置则此按钮无意义
                            _this.activateProcessDefinition(e.record.id);
                        },
                        filter:function(e){             // 过滤按钮 【可选】 显示/隐藏 返回ture才显示
                            var row = e.record;
                            if(row.suspensionState==1){
                                return false;
                            }else{
                                return true;
                            }
                        }
                    }
                ]
            };
            // 初始化表格操作按钮
            initOptions(options);
        },

        /**
         * 查询定义的图片与xml
         * @param defId
         * @param type
         */
        viewResource:function(defId){
            var _this = this;
            var title = "流程图";
            var url = basePath + "/flow/operation/process_def/viewImage?defId="+defId;
            // 【弹窗模式】 弹窗添加修改页面
            mini.open({
                url: url,
                allowResize: true,
                title: title,
                width: 1000, height: 700,
                onload: function () {
                },
                ondestroy: function (action) {
                    _this.grid.reload();
                }
            });
        },
        //挂起
        suspendProcessDefinition:function(id){
            var _this=this;
            var url = basePath + '/flow/operation/process_def/suspendProcessDefinition';
            mini.confirm("确定挂起吗？", "确定？",
                function (action) {
                    if (action == "ok") {
                        $.POST({ url: url, data: {id:id},
                            success:function (res) {
                                if(res.responseCode == "100"){
                                    _this.grid.reload();
                                    showSucTips("挂起成功！");
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

        },
        //激活
        activateProcessDefinition:function(id){
            var _this=this;
            var url = basePath + '/flow/operation/process_def/activateProcessDefinition';
            mini.confirm("确定激活吗？", "确定？",
                function (action) {
                    if (action == "ok") {
                        $.POST({ url: url, data: {id:id},
                            success:function (res) {
                                if(res.responseCode == "100"){
                                    _this.grid.reload();
                                    showSucTips("激活成功！");
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

        },
        //激活
        convertToModel:function(id){
            var _this=this;
            var url = basePath + '/flow/operation/process_def/convertToModel';
            mini.confirm("确定转化吗？", "确定？",
                function (action) {
                    if (action == "ok") {
                        $.POST({ url: url, data: {id:id},
                            success:function (res) {
                                if(res.responseCode == "100"){
                                    _this.grid.reload();
                                    showSucTips("转化成功！");
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

        },
        // 绑定事件
        bindEvents: function () {
            var _this = this;
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
                                var url = basePath + '/flow/operation/process_def/dels';
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
                _this.grid.reload();
            });

        },
        doSearch:function(){
            this.grid.load(this.searchForm.getData());
        },

    },

};