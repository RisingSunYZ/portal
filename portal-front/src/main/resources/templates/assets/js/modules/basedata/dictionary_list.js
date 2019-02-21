var Dictionary = {
    // 列表页面

    Dicgrid:null,
    Itemgrid:null,
    list: {
        // 初始化
        init: function () {
            mini.parse();   // 必需
            this.dicSearchForm = new mini.Form('jsDicSearchForm');    // 获取搜索表单对象
            this.itemSearchForm = new mini.Form('jsItemSearchForm');
            this.Dicgrid = mini.get("jsDicDataGrid");    // 获取表格mini对象
            this.Itemgrid = mini.get("jsItemDataGrid");
            this.tree = mini.get("DicTree");
            this.loadDatagrid();
            this.bindEvents();
        },
        // 加载
        loadDatagrid: function () {
            var _this = this;
            _this.Dicgrid.load();   // 加载表格数据

        },
        // 绑定事件
        bindEvents: function () {
            var _this = this;
            // 添加
            $('#jsDicAdd').click(function () {
                var node = _this.tree.getSelectedNode();
                if (node!=undefined){
                    _this.openIpt();
                } else{
                    showWarn("请先选择字典类型！！")
                }
            });

            // 添加
            $('#jsItemAdd').click(function () {
                var row = _this.Dicgrid.getSelected();
                if (row!=undefined){
                    _this.openItemIpt();
                } else{
                    showWarn("请先选择数据字典！！")
                }
            });

            // 修改
            $('#jsDicEdit').click(function () {
                var row = _this.Dicgrid.getSelected();
                if (row) {
                    _this.openIpt(row);
                } else {
                    showWarn('请选中一条记录');
                }
            });

            // 修改
            $('#jsItemEdit').click(function () {
                var row = _this.Itemgrid.getSelected();
                if (row) {
                    _this.openItemIpt(row);
                } else {
                    showWarn('请选中一条记录');
                }
            });

            // 删除
            $('#jsDicDel').click(function () {
                var ids = [];
                var rows = _this.Dicgrid.getSelecteds();
                if (rows.length > 0) {
                    $.each(rows, function (i, o) {
                        ids.push(o.id);
                    });
                    _this.delByIds(ids);
                } else {
                    showWarn('请选中一条记录');
                }
            });


            // 删除
            $('#jsItemDel').click(function () {
                var ids = [];
                var rows = _this.Itemgrid.getSelecteds();
                if (rows.length > 0) {
                    $.each(rows, function (i, o) {
                        ids.push(o.id);
                    });
                    _this.delItemByIds(ids);
                } else {
                    showWarn('请选中一条记录');
                }
            });

            // 查询
            $('#doDicSearchBtn').click(function () {
                _this.doDicSearch();
            });

            $('#doItemSearchBtn').click(function () {
                _this.doItemSearch();
            });
            // 搜索框注册回车事件
            _this.dicSearchForm.el.addEventListener('keypress', function (e) {
                // 回车键事件
                if (e.which == 13) {
                    _this.doDicSearch();
                }
            });
            // 搜索框注册回车事件
            _this.itemSearchForm.el.addEventListener('keypress', function (e) {
                // 回车键事件
                if (e.which == 13) {
                    _this.doItemSearch();
                }
            });
            // 行点击查看自字典项
            _this.Dicgrid.on('select', function (e) {
                var row = e.record;
                _this.Itemgrid.load({ mainId: row.id });
            });
        },

        selectNode:function () {
            var node = this.tree.getSelectedNode();
            this.Dicgrid.load({ dicTypeId: node.id });

        },

        /**
         * 数据字典类型列表查询
         */
        doItemSearch: function () {
            this.Itemgrid.load(this.itemSearchForm.getData());
        },
        /**
         * 数据字典类型列表
         */
        doDicSearch: function () {
            this.Dicgrid.load(this.dicSearchForm.getData());
        },
        openIpt: function (row, editable) {
            var _this = this;
            var title = (row ? (undefined != editable && !editable ? "查看" : "编辑") : "添加") + "字典";
            var url = "";
            if(undefined != editable && !editable){
                var node = _this.Dicgrid.getSelected();
                url = basePath + "/basedata/dictionary/input";
            }else {
                var node = _this.tree.getSelectedNode();
                if (node!=undefined) {
                    url = basePath + "/basedata/dictionary/input?dicTypeId="+node.id;
                }else{
                    url = basePath + "/basedata/dictionary/input";
                }
            }
                // 【弹窗模式】 弹窗添加修改页面
            mini.open({
                url: url,
                allowResize: true,
                title: title,
                width: 450, height: 300,
                onload: function () {
                    if (row != undefined) {
                        var iframe = this.getIFrameEl();
                        iframe.contentWindow.Dictionary.input.form.setData(row);
                        if (undefined != editable && !editable) {
                            //iframe.contentWindow.Dictionary.input.form.setEnabled(false);
                            iframe.contentWindow.Dictionary.view.init();
                        }
                    }
                },
                ondestroy: function (action) {
                    _this.Dicgrid.reload();
                }
            });
            // 【页签模式】 添加修改页面【新增Tab页签】
            /*addBlankTab({
                title:title,
                url:url
            });*/
        },


        /**
         * dic_item添加
         * @param row
         * @param editable
         */
        openItemIpt: function (row, editable) {
            var _this = this;
            var node = _this.Dicgrid.getSelected();
            var title = (row ? (undefined != editable && !editable ? "查看" : "编辑") : "添加") + "字典管理";
            var url = basePath + "/basedata/dic_item/input?mainId="+node.id;
            // 【弹窗模式】 弹窗添加修改页面
            mini.open({
                url: url,
                allowResize: true,
                title: title,
                width: 450, height: 300,
                onload: function () {
                    var iframe = this.getIFrameEl();
                    if (row != undefined) {
                        iframe.contentWindow.Dictionary.itemInput.form.setData(row);
                        if (undefined != editable && !editable) {
                            //iframe.contentWindow.Dictionary.input.form.setEnabled(false);
                            iframe.contentWindow.Dictionary.view.init();
                        }
                    }
                    iframe.contentWindow.Dictionary.itemInput.setMainId(node.id);
                },
                ondestroy: function (action) {
                    _this.Dicgrid.reload();
                }
            });
            // 【页签模式】 添加修改页面【新增Tab页签】
            /*addBlankTab({
                title:title,
                url:url
            });*/
        },
        /**
         * dic_item删除
         * @param ids
         */
        delItemByIds: function (ids) {
            var _this = this;
            mini.confirm("确定删除记录？", "确定？",
                function (action) {
                    if (action == "ok") {
                        ids = Array.isArray(ids) ? ids.join(',') : ids;
                        var url = basePath + '/basedata/dic_item/dels';
                        $.POST({
                            url: url, data: {ids: ids},
                            success: function (res) {
                                if (res.code == ReturnCode.SUCCESS) {
                                    _this.Dicgrid.reload();
                                    showSucTips("删除成功！");
                                } else {
                                    showErrTips(res.msg);
                                }
                            },
                            error: function () {
                                showErrTips('网络异常，请稍候再试！');
                            }
                        });
                    }
                }
            );
        },
        delByIds: function (ids) {
            var _this = this;
            mini.confirm("确定删除记录？", "确定？",
                function (action) {
                    if (action == "ok") {
                        ids = Array.isArray(ids) ? ids.join(',') : ids;
                        var url = basePath + '/basedata/dictionary/dels';
                        $.POST({
                            url: url, data: {ids: ids},
                            success: function (res) {
                                if (res.code == ReturnCode.SUCCESS) {
                                    _this.Dicgrid.reload();
                                    showSucTips("删除成功！");
                                } else {
                                    showErrTips(res.msg);
                                }
                            },
                            error: function () {
                                showErrTips('网络异常，请稍候再试！');
                            }
                        });
                    }
                }
            );
        }
    },
    // 输入页面
    input: {
        form: null,
        // 初始化
        init: function () {
            mini.parse();   // 必需
            this.form = new mini.Form("#jsDicMainForm");  //获取form对象
            var cpid = getQueryString("dicTypeId");
            mini.get('dicTypeId').setValue(cpid);
            this.bindEvents();
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
            var url = basePath + (formData.id == "" ? "/basedata/dictionary/insert" : "/basedata/dictionary/update");

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




    itemInput: {
        form: null,
        // 初始化
        init: function () {
            mini.parse();   // 必需
            this.form = new mini.Form("jsItemMainForm");  //获取form对象
            this.bindEvents();
        },
        setMainId:function(mianId){
            mini.get('mainId').setValue(mianId);
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
            var url = basePath + (formData.id == "" ? "/basedata/dic_item/insert" : "/basedata/dic_item/update");

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