
var ProcessTask = {
    // 列表页面
    list: {
        grid:null,
        searchForm:null,
        // 初始化
        init: function () {
            mini.parse();   // 必需
            this.searchForm = new mini.Form('jsSearchForm');    // 获取搜索表单对象
            this.grid = mini.get("jsDataGrid");    // 获取表格mini对象
            this.loadDatagrid();
            this.bindEvents();
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
                        text:'流程图',  // 操作按钮名称 【必需设置】
                        //pms:1,       // 权限值  【可选】   不设置则默认显示
                        iconCls:'fa fa-file-picture-o',     // 按钮图标 【可选】
                        click:function(e){    // 点击事件 【必需设置】，如果不设置则此按钮无意义
                            _this.openImg(e.record.processInstanceId);
                        },
                        filter:function(e){             // 过滤按钮 【可选】 显示/隐藏 返回ture才显示
                            var row = e.record;
                            return true;
                        }
                    },
                    {
                        text:'执行',  // 操作按钮名称 【必需设置】
                        //pms:1,       // 权限值  【可选】   不设置则默认显示
                        iconCls:'edit',     // 按钮图标 【可选】
                        click:function(e){    // 点击事件 【必需设置】，如果不设置则此按钮无意义
                            _this.deploy(e.record.taskId);
                        },
                        filter:function(e){             // 过滤按钮 【可选】 显示/隐藏 返回ture才显示
                            var row = e.record;
                            return true;
                        }
                    },
                    {
                        text:'终止',  // 操作按钮名称 【必需设置】
                        //pms:1,       // 权限值  【可选】   不设置则默认显示
                        iconCls:'edit',     // 按钮图标 【可选】
                        click:function(e){    // 点击事件 【必需设置】，如果不设置则此按钮无意义
                            _this.endProcess(e.record.processInstanceId);
                        },
                        filter:function(e){             // 过滤按钮 【可选】 显示/隐藏 返回ture才显示
                            var row = e.record;

                            return true;
                        }
                    }
                ]
            };
            // 初始化表格操作按钮
            initOptions(options);
        },
        openImg:function(id) {
            var _this = this;
            var title = "流程图";
            var url = basePath + "/flow/operation/process_inst/viewImg?id="+id;
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
        assigneeRender:function (e) {
            return e.value+" <a class='mini-button' style='padding:3px;' onClick='ProcessTask.list.changeAssignee(\""+e.record.taskId+"\")' >变更</a>"
        },
        changeAssignee:function (taskId) {
            var _this=this;
            new UserSelectWindow({
                multiSelect:false,    // 是否多选
                currentUserNo:'',    // 当前登录用户工号
                success:function(action){
                    if (action == "ok") {
                        //获取数据
                        var rows = this.getData();
                        if (rows) {
                            var url = basePath+ "/flow/operation/process_task/changeAssignee";
                            // 异步保存数据
                            $.POST({ url: url, data: {taskId:taskId,assignee:rows[0].no},
                                success:function (res) {
                                    unmask();
                                    if(res.responseCode == ReturnCode.SUCCESS){ // ReturnCode.SUCCESS  ---> '100'
                                        _this.grid.reload();
                                        showSucTips("变更成功！");
                                    }else{
                                        showErrTips(res.responseMsg);
                                    }
                                },
                                error:function (res) {
                                    unmask();
                                    showErrTips("网络异常，请稍后再试！");
                                }
                            });
                        }
                    }
                }
            });
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
                                var url = basePath + '/flow/operation/process_task/dels';
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
        endProcess:function(id){
            var _this = this;

            var url = basePath+ "/flow/operation/process_task/endProcess";
            mini.confirm("确定终止吗？", "确定？",
                function (action) {
                    if (action == "ok") {
                        // 异步保存数据
                        $.POST({ url: url, data: {id:id},
                            success:function (res) {
                                unmask();
                                if(res.responseCode == ReturnCode.SUCCESS){ // ReturnCode.SUCCESS  ---> '100'
                                    _this.grid.reload();
                                    showSucTips("终止成功！");
                                }else{
                                    showErrTips(res.responseMsg);
                                }
                            },
                            error:function (res) {
                                unmask();
                                showErrTips("网络异常，请稍后再试！");
                            }
                        });
                    }
                }
            );

        },
        deploy:function(id){
            var _this = this;
            var url = basePath + "/flow/operation/process_task/execute";
            mini.confirm("确定执行吗？", "确定？",
                function (action) {
                    if (action == "ok") {
                        // 异步保存数据
                        $.POST({ url: url, data: {id:id},
                            success:function (res) {
                                unmask();
                                if(res.responseCode == ReturnCode.SUCCESS){ // ReturnCode.SUCCESS  ---> '100'
                                    _this.grid.reload();
                                    showSucTips("执行成功！");
                                }else{
                                    showErrTips(res.responseMsg);
                                }
                            },
                            error:function (res) {
                                unmask();
                                showErrTips("网络异常，请稍后再试！");
                            }
                        });
                    }
                }
            );

        },

    },

};