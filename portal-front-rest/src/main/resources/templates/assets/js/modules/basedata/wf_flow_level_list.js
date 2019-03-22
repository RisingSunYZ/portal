var wfFlowLevel = {
    // 列表页面
    list: {
        // 初始化
        init: function () {
            mini.parse();   // 必需
            this.searchForm = new mini.Form('jsSearchForm');    // 获取搜索表单对象
            this.grid = mini.get("jsDataGrid");    // 获取表格mini对象
            this.editWindow = mini.get("editWindow");
            this.editWindow.hide();
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
                        text:'修改',  // 操作按钮名称 【必需设置】
                        //pms:1,       // 权限值  【可选】   不设置则默认显示
                        iconCls:'edit',     // 按钮图标 【可选】
                        click:function(e){    // 点击事件 【必需设置】，如果不设置则此按钮无意义
                            _this.openIpt(e.record);
                        },
                        filter:function(e){             // 过滤按钮 【可选】 显示/隐藏 返回ture才显示
                            var row = e.record;
                            // 如:判断状态为0的行不显示此按钮
                            if(row.status == '0'){
                                return false;
                            }
                            return true;
                        }
                    },
                    {
                        text:'查看',
                        // pms:2,
                        iconCls:'eye',
                        click:function(e){
                            _this.openIpt(e.record, false);
                        }
                    },
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

        onCloseClick:function(e){
            e.sender.setValue(null);
            e.sender.setText(null);
        },

        // 绑定事件
        bindEvents: function () {
            var _this = this;
            // 添加
            $('#jsAdd').click(function () {
                _this.openIpt();
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
            //同步
            $('#jsSync').click(function () {
                _this.syncData();
            });

            //导出
            $('#jsExport').click(function () {
                _this.exportOpt();
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
                _this.doSearch();
            });
            // 行双击查看数据
            _this.grid.on('rowdblclick', function (e) {
                var row = e.record;
                _this.openIpt(row, false);
            });

            //禁用
            $('#jsPause').click(function(){
                var ids = [];
                var rows = _this.grid.getSelecteds();
                if (rows.length > 0) {
                    mini.confirm("确定修改记录？", "确定？",
                        function (action) {
                            if (action == "ok") {
                                $.each(rows, function (i, o) {
                                    ids.push(o.id);
                                });
                                _this.changeStatus(ids,0);
                            }
                        }
                    );
                } else {
                    showWarn('请选中一条记录');
                }

            });
            //启用
            $('#jsPlay').click(function(){
                var ids = [];
                var rows = _this.grid.getSelecteds();
                if (rows.length > 0) {
                    mini.confirm("确定修改记录？", "确定？",
                        function (action) {
                            if (action == "ok") {
                                $.each(rows, function (i, o) {
                                    ids.push(o.id);
                                });
                                _this.changeStatus(ids,1);
                            }
                        }
                    );
                } else {
                    showWarn('请选中一条记录');
                }
            });
        },
        //导出
        exportOpt:function(){
            var formData = this.searchForm.getData();
            window.location.href = basePath + "/basedata/wf_flow_level/exportExcel?personWorld="+formData.personWorld;
        },
        //公司数据同步
        syncData:function(){
            var _this = this
            mini.confirm("同步数据？", "确定？",
                function (action) {
                    if (action == "ok") {
                        $.GET({
                            url:basePath+'/basedata/wf_flow_level/sync',
                            success:function(res){
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
            $.POST({ url: basePath+'/basedata/wf_flow_level/dels', data: {ids:ids.join(',')},
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

        /**
         * 启用、禁用
         */
        changeStatus:function(_id,_validState){
            var _this = this;
            var url = basePath+"/basedata/wf_flow_level/updateStatus";
            $.POST({
                url: url,
                data: {
                    ids:_id.join(","),
                    status:_validState
                },
                cache: false,
                success: function (data) {
                    if(data.code == '100') {
                        _this.grid.reload();
                        showSuc("修改成功！")
                    }
                },
                error:function (res) {
                    unmask();
                    showErrTips("网络异常，请稍后再试！");
                }
            });
        },
        doSearch:function(){
            this.grid.load(this.searchForm.getData());
        },
        openIpt:function(row, editable){
            var _this = this;
            var title = (row ? (undefined != editable&&!editable?"查看":"编辑") : "添加") + "底表";
            // 【弹窗模式】 弹窗添加修改页面
            this.form = new mini.Form("#jsMainForm");  //获取form对象
            this.form.setEnabled(true);
            this.form.reset();
            if(row!=undefined) {
                wfFlowLevel.input.setData(row);
                if(undefined != editable&&!editable){
                    wfFlowLevel.view.init();
                }
            }
            this.editWindow.show();
            /*mini.open({
                url: url,
                allowResize:true,
                title: title,
                width: 780, height: 450,
                onload: function () {
                    if(row!=undefined) {
                        var iframe = this.getIFrameEl();
                        iframe.contentWindow.wfFlowLevel.input.setData(row);
                        if(undefined != editable&&!editable){
                            iframe.contentWindow.wfFlowLevel.view.init();
                        }
                    }
                },
                ondestroy: function (action) {
                    _this.grid.reload();
                }
            });*/
            // 【页签模式】 添加修改页面【新增Tab页签】
            /*addBlankTab({
                title:title,
                url:url
            });*/
        },

        onOptRenderer:function (r) {
            var row = r.record;
            id = "'"+row.id+"'";
            status_ = "";
            opt_str = "";
            if (row.status=='0'){
                opt_str = "<span style='color: darkred'>禁用</span>"

            } else{
                opt_str = "<span style='color: green'>启用</span>"
            }
            return opt_str;
        },


        //验证编码是否唯一
        uniqueCode:function (e) {
            //判断sn的唯一性
            id = mini.get("#id").getValue();
            code = mini.get("#code").getValue();
            if (code == "" || code == null) {
                e.errorText = "编码不能为空";
                e.isValid = false;
            }else {
                $.POST({
                    url: basePath+"/basedata/wf_flow_level/checkCode",
                    data: {id:id,code:code},
                    async:false,
                    success: function (data) {
                        if(data.code == '100') {
                            e.errorText = "编码不能重复";
                            e.isValid = false;
                        }
                    }});
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
        setData:function(data){


            this.form.setData(data);

            mini.get("threeDeptName").setText(data.threeDeptName);
            mini.get("threeDeptName").setValue(data.threeDeptName);

            mini.get("startDeptName").setText(data.startDeptName);
            mini.get("startDeptName").setValue(data.startDeptName);

            mini.get("oneDeptName").setText(data.oneDeptName);
            mini.get("oneDeptName").setValue(data.oneDeptName);

            mini.get("twoDeptName").setText(data.twoDeptName);
            mini.get("twoDeptName").setValue(data.twoDeptName);

            mini.get("deptHeaderName").setText(data.deptHeaderName);
            mini.get("deptHeaderName").setValue(data.deptHeaderName);

            mini.get("areaOneName").setText(data.areaOneName);
            mini.get("areaOneName").setValue(data.areaOneName);

            mini.get("areaDeputyName").setText(data.areaDeputyName);
            mini.get("areaDeputyName").setValue(data.areaDeputyName);

            mini.get("areaHeaderName").setText(data.areaHeaderName);
            mini.get("areaHeaderName").setValue(data.areaHeaderName);

            mini.get("centerdeputyHeaderName").setText(data.centerdeputyHeaderName);
            mini.get("centerdeputyHeaderName").setValue(data.centerdeputyHeaderName);


            mini.get("centerHeaderName").setText(data.centerHeaderName);
            mini.get("centerHeaderName").setValue(data.centerHeaderName);

            mini.get("groupLeaderName").setText(data.groupLeaderName);
            mini.get("groupLeaderName").setValue(data.groupLeaderName);

            mini.get("companyHeaderName").setText(data.companyHeaderName);
            mini.get("companyHeaderName").setValue(data.companyHeaderName);

        },


        userSelector: function (value,text) {
            var _this = this;
            new UserSelectWindow({
                multiSelect: true,    // 是否多选
                success: function (action) {
                    if (action == "ok") {
                        var rows = this.getData();
                        if (rows) {
                            mini.get(value).setValue(null)
                            mini.get(text).setText(null)
                            var texts = [], values = [];
                            for (var i =0; i< rows.length; i++){
                                texts.push(rows[i].name);
                                values.push(rows[i].no);
                            }
                            mini.get(value).setValue(values.join(','))
                            mini.get(text).setText(texts.join(','))
                            mini.get(text).setValue(texts.join(','))
                        }
                    }
                }
            });
        },

        orgSelector: function (value,text) {
            new OrgSelectWindow({
                multiSelect: false,    // 是否多选
                success: function (action) {
                    if (action == "ok") {
                        //获取数据
                        var rows = this.getData();
                        if (rows) {
                            mini.get(value).setValue(null)
                            mini.get(text).setText(null)
                            var texts = [], values = [];
                            for (var i =0; i< rows.length; i++){
                                texts.push(rows[i].name);
                                values.push(rows[i].no);
                            }
                            mini.get(value).setValue(values.join(','))
                            mini.get(text).setText(texts.join(','))
                            mini.get(text).setValue(texts.join(','))
                        }
                    }
                }
            });
        },

        resetData:function(data){
            this.form.reset();

        },

        onCloseClick:function(e){
            e.sender.setValue(null);
            e.sender.setText(null);
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
            var url = basePath + (formData.id==""?"/basedata/wf_flow_level/insert":"/basedata/wf_flow_level/update");
            // var jsonStr = mini.encode(formData);   //序列化成JSON字符串
            // 异步保存数据
            $.POST({ url: url, data: formData,
                success:function (res) {
                    unmask();
                    if(res.code == ReturnCode.SUCCESS){ // ReturnCode.SUCCESS  ---> '100'
                        // 【弹窗模式】 关闭弹窗
                        //CloseWindow("save", _this.form);
                        wfFlowLevel.list.editWindow.hide();
                        wfFlowLevel.list.doSearch();
                      //  _this.grid.reload();


                       // _this.grid.reload();
                        // 【页签模式】 关闭并刷新指定页签
                        // closeTab();
                        // refreshTab("测试页面");
                    }else{
                        showErrTips(res.msg);
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
                wfFlowLevel.list.editWindow.hide();
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