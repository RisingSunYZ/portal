var dicType = {
    // 列表页面
    list: {
        // 初始化
        init: function () {
            mini.parse();   // 必需
            this.searchForm = new mini.Form('jsSearchForm');    // 获取搜索表单对象
            this.grid = mini.get("jsTreeGrid");
            this.loadDatagrid();
            this.bindEvents();
        },
        // 加载
        loadDatagrid: function () {
            var _this = this;
            // _this.grid.load();   // 加载表格数据
            // 表格操作按钮 初始化
            var options = {
                grid: _this.grid,       // 操作的datagrid表格对象 【必需设置】
                buttons: [
                    {
                        text: '添加',
                        //pms:3,
                        iconCls: 'plus',
                        click: function (e) {
                            _this.openIpt(e.record,true,false);
                        }
                    },
                    {
                        text: '修改',  // 操作按钮名称 【必需设置】
                        //pms:1,       // 权限值  【可选】   不设置则默认显示
                        iconCls: 'edit',     // 按钮图标 【可选】
                        click: function (e) {    // 点击事件 【必需设置】，如果不设置则此按钮无意义
                            _this.openIpt(e.record);
                        },
                        filter: function (e) {             // 过滤按钮 【可选】 显示/隐藏 返回ture才显示
                            var row = e.record;
                            // 如:判断状态为0的行不显示此按钮
                            if (row.status == '0') {
                                return false;
                            }
                            return true;
                        }
                    },
                    {
                        text: '查看',
                        // pms:2,
                        iconCls: 'eye',
                        click: function (e) {
                            _this.openIpt(e.record, false);
                        }
                    },
                    {
                        text: '删除',
                        // pms:2,
                        iconCls: 'remove',
                        click:function(e){
                            var ids  =[];
                            mini.confirm("确定删除记录？", "确定？",
                                function (action) {
                                    if (action == "ok") {
                                        ids.push(e.row.id);
                                        _this.delByIds(ids);
                                    }
                                }
                            );

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
            // 添加
            $('#jsAdd').click(function () {
                _this.openIpt();
            });
            $('#jsSpread').click(function(){
                _this.spreadItem();
            });
            $('#jsMerge').click(function(){
                _this.mergeItem();
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
                if (e.which == 13) {
                    _this.doSearch();
                }
            });
            // 重置
            $('#doResetBtn').click(function () {
                _this.searchForm.reset();
                _this.doSearch();
            });
            // 行双击查看数据
            _this.grid.on('rowdblclick', function (e) {
                var row = e.record;
                _this.openIpt(row, false);
            });


        },
        delByIds: function (ids) {
            var _this = this;
            $.POST({
                url:basePath+"/basedata/dic_type/getAll",
                data:{pid:ids.join(',')},
                success:function(data){
                    if(data.length ==0) {
                        $.POST({
                            url: basePath + '/basedata/dic_type/dels', data: {ids: ids.join(',')},
                            success: function (res) {
                                if (res.code == ReturnCode.SUCCESS) {
                                    _this.grid.reload();
                                    showSucTips("删除成功！");
                                } else {
                                    showErrTips(res.msg);
                                }
                            },
                            error: function () {
                                showErrTips('网络异常，请稍候再试！');
                            }
                        });
                    }else {
                        showError("有子模块，请先删除子模块！")
                    }
                }
            });
        },
        doSearch: function () {
            this.grid.load(this.searchForm.getData());
        },

        /**
         * 合并菜单
         */
        spreadItem:function(){
            this.grid.expandAll ()
        },

        /**
         * 展开菜单
         */

        mergeItem:function(){
            this.grid.collapseAll ()
        },

        openIpt: function (row, editable,isAddChildren) {
            var _this = this;
            var title = (row ? (undefined != editable && !editable ? "查看" : "编辑") : "添加") + "模块";
            var url = basePath + "/basedata/dic_type/input";
            // 【弹窗模式】 弹窗添加修改页面
            mini.open({
                url: url,
                allowResize: true,
                title: title,
                width: 450, height: 300,
                onload: function () {
                    if (row != undefined) {
                        if (isAddChildren== undefined) {
                            var iframe = this.getIFrameEl();
                            iframe.contentWindow.dicType.input.setData(row);
                        }else{
                            var iframe = this.getIFrameEl();
                            iframe.contentWindow.dicType.input.setChildrenData(row);
                        }
                        if (undefined != editable && !editable) {
                            iframe.contentWindow.dicType.view.init();
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
        },
        onEnglishValidation:function(e){
            if (e.isValid) {
                var re = new RegExp("^[a-zA-Z\_]+$");
                if (re.test(e.value)) {
                    return true;
                }else {
                    e.errorText = "必须输入英文";
                    e.isValid = false;
                }
            }
        },
        //验证编码是否唯一
        uniqueCode: function (e) {
            //判断sn的唯一性
            id = mini.get("#id").getValue();
            code = mini.get("#code").getValue();
            if (code == "" || code == null) {
                e.errorText = "编码不能为空";
                e.isValid = false;
            } else {
                $.POST({
                    url: basePath + "/basedata/dic_type/checkCode",
                    data: {id: id, code: code},
                    async: false,
                    success: function (data) {
                        if (data.code == '101') {
                            e.errorText = "编码不能重复";
                            e.isValid = false;
                        }
                    }
                });
            }
        }
    },
    // 输入页面
    input: {
        form: null,
        // 初始化
        init: function () {
            mini.parse();   // 必需
            this.form = new mini.Form("#jsMainForm");  //获取form对象
            // 【页签模式】加载数据，弹窗模式下不需要加载此方法
            // this.loadData();
            this.bindEvents();
        },
        // 【页签模式】加载数据，需要异步请求加载数据
        /*loadData:function(){
            var _this = this;
            var id = getQueryString('id');    // 获取地址栏的参数
            var url = basePath+'/portal/com/dictionary/getById.do';
            $.GET({
                url:url,
                data:{id:id},
                success:function(res){
                    if(res.status=='1'){
                        _this.form.setData(res.data);
                    }else{
                        showErrTips(res.message);
                    }
                }
            });
        },*/
        // 【弹窗模式】加载数据:直接通过表格行数据加载
        setData: function (data) {
            this.form.setData(data);
        },
        setChildrenData:function(row){
            mini.get("pid").setValue(row.id)
        },
        // 保存数据
        save: function () {
            var _this = this;
            _this.form.validate();
            if (!_this.form.isValid()) {
                return;
            }
            mask('正在保存...');
            var formData = _this.form.getData();
            var url = basePath + (formData.id == "" ? "/basedata/dic_type/insert" : "/basedata/dic_type/update");
            // var jsonStr = mini.encode(formData);   //序列化成JSON字符串
            // 异步保存数据
            $.POST({
                url: url, data: formData,
                success: function (res) {
                    unmask();
                    if (res.code == ReturnCode.SUCCESS) { // ReturnCode.SUCCESS  ---> '100'
                        // 【弹窗模式】 关闭弹窗
                        CloseWindow("save", _this.form);
                        // 【页签模式】 关闭并刷新指定页签
                        // closeTab();
                        // refreshTab("测试页面");
                    } else {
                        showErrTips(res.msg);
                    }
                },
                error: function (res) {
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