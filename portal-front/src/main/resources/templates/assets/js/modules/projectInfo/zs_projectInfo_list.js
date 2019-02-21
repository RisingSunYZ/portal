var zsProjectInfo = {
    // 列表页面
    list: {
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
                        text:'删除',
                        pms:3,
                        iconCls:'remove',
                        click:function(e){
                            _this.delByIds(e.record.id)
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

            //同步
            $('#jsSync').click(function () {
                _this.syncData();
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
                                _this.delByIds(ids);
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
                _this.searchForm.reset();
            });
        },
        //同时同步幕墙和装饰信息
        syncData:function(){
            var _this = this
            var params = $('#dateForm').serializeJson();
            mini.confirm("同步数据？", "确定？",
                function (action) {
                    if (action == "ok") {
                        mini.mask({
                            el: document.body,
                            cls: 'mini-mask-loading',
                            html: '同步数据中...'
                        });
                        $.GET({
                            url:basePath+'/projectInfo/sync',
                            data:params,
                            success:function(res){
                                mini.unmask()
                                if(res.code == ReturnCode.SUCCESS){
                                    _this.grid.reload();
                                    showSucTips("同步成功！");
                                }else{
                                    showErrTips(res.msg);
                                }
                            }
                        });
                    }
                }
            );
        },
        delByIds:function(ids){
            var _this = this;
            $.POST({ url: basePath+'/projectInfo/dels', data: {ids:ids.join(',')},
                success:function (res) {
                    if(res.code == ReturnCode.SUCCESS){
                        _this.grid.reload();
                        showSucTips("删除成功！");
                    }else{
                        showErrTips(res.msg);
                    }
                },
                error:function () {
                    showErrTips('网络异常，请稍候再试！');
                }
            });
        },
        doSearch:function(){
            this.grid.load(this.searchForm.getData());
        }
    }

};