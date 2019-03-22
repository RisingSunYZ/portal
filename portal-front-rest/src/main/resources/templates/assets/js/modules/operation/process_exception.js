
var ProcessException = {
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
        stateRenderer:function (e) {
            if(e.value=='1'){
                return "已处理";
            }else{
                return "待处理";
            }
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
                        text:'查看异常',  // 操作按钮名称 【必需设置】
                        //pms:1,       // 权限值  【可选】   不设置则默认显示
                        iconCls:'eye',     // 按钮图标 【可选】
                        click:function(e){    // 点击事件 【必需设置】，如果不设置则此按钮无意义
                            _this.openExpt(e.record);
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
                            _this.deploy(e.record.id);
                        },
                        filter:function(e){             // 过滤按钮 【可选】 显示/隐藏 返回ture才显示
                            if(e.record.status=='1'){
                                return false;
                            }
                            return true;
                        }
                    }
                ]
            };
            // 初始化表格操作按钮
            initOptions(options);
        },
        deploy:function(id){
            var _this=this;
            var url = basePath + '/flow/operation/process_exception/deploy';
            $.POST({ url: url, data: {id:id},
                success:function (res) {
                    if(res.responseCode == "100"){
                        _this.grid.reload();
                        showSucTips("执行成功！");
                    }else{
                        showErrTips(res.responseMsg);
                    }
                },
                error:function () {
                    showErrTips('网络异常，请稍候再试！');
                }
            });
        },
        openExpt:function(row) {
            var _this = this;
            var title = "异常信息";
            var url = basePath + "/flow/operation/process_exception/updateUI";

            // 【弹窗模式】 弹窗添加修改页面
            mini.open({
                url: url,
                allowResize: true,
                title: title,
                width: 600, height: 500,
                onload: function () {
                    if (row != undefined) {
                        var iframe = this.getIFrameEl();
                        iframe.contentWindow.ProcessException.input.form.setData(row);

                    }
                },
                ondestroy: function (action) {
                    _this.grid.reload();
                }
            });
        },
        // 绑定事件
        bindEvents: function () {
            var _this = this;
            // 重置
            $('#doResetBtn').click(function () {
                _this.grid.load();
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
                                var url = basePath + '/flow/operation/process_exception/dels';
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
            // 重置
            $('#doResetBtn').click(function () {
                _this.grid.reload();
            });

        },
        doSearch:function(){
            this.grid.load(this.searchForm.getData());
        },

    },
    // 输入页面
    input: {
        form: null,
        // 初始化
        init: function () {
            mini.parse();   // 必需
            this.form = new mini.Form("#jsMainForm");  //获取form对象
            this.bindEvents();
        },

        // 绑定事件
        bindEvents: function () {
            var _this = this;


        }
    },

};