var userVo = {
    // 列表页面
    list: {
        // 初始化
        init: function () {
            mini.parse();   // 必需
            this.searchForm = new mini.Form('jsSearchForm');    // 获取搜索表单对象
            this.grid = mini.get("jsDataGrid");    // 获取表格mini对象
            this.tree = mini.get("companyTree");
            this.loadDatagrid();
            this.bindEvents();
        },
        // 加载
        loadDatagrid:function(){
            var _this = this;
            _this.grid.load();
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
                        //pms:3,
                        iconCls:'remove',
                        click:function(e){
                            var ids  =[];
                            mini.confirm("确定删除记录？", "确定？",
                                function (action) {
                                    if (action == "ok") {

                                        ids.push(e.row.userId);
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

        selectNode:function () {
            var node = this.tree.getSelectedNode();
            this.grid.load({ deptId: node.id });

        },

        // 绑定事件
        bindEvents: function () {
            var _this = this;
            // 添加
            $('#jsAdd').click(function () {
                var node = _this.tree.getSelectedNode();
                if (node!=undefined){
                    _this.openIpt();
                } else{
                    showError("请先选择部门！！")
                }
            });

            // 授权
            $('#addPrivilege').click(function () {
                var row = _this.grid.getSelected();
                if (row) {
                    _this.jsSetPrivilege(row);
                } else {
                    showWarn('请选择要授权的用户');
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
            //同步
            $('#jsSync').click(function () {
                _this.syncData();
            });
            //同步
            $('#jsSetPwd').click(function () {
                var row = _this.grid.getSelected();
                if (row) {
                    _this.jsSetPwdOpt(row);
                } else {
                    showWarn('请选择用户');
                }
            });
            //添加角色
            $('#addUserVo').click(function () {
                var row = _this.grid.getSelected();
                if (row) {
                    _this.viewUserRoles(row);
                } else {
                    showWarn('请选择你要添加的用户');
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
                                    ids.push(o.userId);
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
        },

        // 查看用户的角色列表
        viewUserRoles:function(user){
            var _this = this;
            if(user){
                var title = '给【'+user.userName+'】分配职责';
                mini.open({
                    url: basePath+'/org/userVo/ajaxUserInGroupUi?userId='+user.userId,
                    allowResize:true,
                    title: title,
                    width: 950, height: 500,
                    onload: function () {

                    },
                    ondestroy: function (action) {
                        _this.grid.reload();
                    }
                });
            }else{
                showWarn('请选择用户！');
            }
        },
        jsSetPrivilege:function(user){
            var _this = this;
            if(user){
                var title = '给【'+user.userName+'】授权';
                mini.open({
                    url: basePath+'/org/userVo/setMenuPrivilegeUi?userId='+user.userId,
                    allowResize:true,
                    title: title,
                    width: 450, height: 680,
                    onload: function () {

                    },
                    ondestroy: function (action) {
                        _this.grid.reload();
                    }
                });
            }else{
                showWarn('请选择用户！');
            }
        },

        jsSetPwdOpt:function(user){
            var _this = this;
            if(user){
                var title = '给【'+user.userName+'】变更密码';
                mini.open({
                    url: basePath+'/org/userVo/setPasswordUi?userId='+user.userId,
                    allowResize:true,
                    title: title,
                    width: 450, height: 200,
                    onload: function () {

                    },
                    ondestroy: function (action) {
                        _this.grid.reload();
                    }
                });
            }else{
                showWarn('请选择用户！');
            }
        },
        onGroupRenderer:function (r) {
            var row = r.record;
            var html = "";
            if(row.groups != null) {
                $.each(row.groups, function (i, o) {
                    html += "<div class='tb-list-itm'><span >" + o.groupName + "</span><a style='cursor: pointer' onclick='userVo.list.delGroupData(\""+ o.userId +"\",\""+ o.groupId +"\",null)' class='mini-tab-close'></a></div>"
                });
            }
            return html;
        },

        //手机号验证
        checkTel:function(e){
            if (e.isValid) {
                var re = new RegExp("^1([38]\\d|5[0-35-9]|7[3678])\\d{8}$");
                if (re.test(e.value)) {
                    return true;
                }else {
                    e.errorText = "必须正确的手机号";
                    e.isValid = false;
                }
            }
        },


        /**
         * 删除角色里的人员或所属公司
         * @param userId
         * @param companyId
         * @param sn
         */
        delGroupData:function(userId,sn,id){
            var _this = this;
            mini.confirm("确定删除记录？", "确定？",
                function (action) {
                    if (action == "ok") {
                        $.POST({ url: basePath+'/org/groupVo/group_data', data: {userId:userId,id:id,sn:sn},
                            success:function (res) {
                                if(res.code == ReturnCode.SUCCESS){
                                    _this.grid.reload();
                                    showSucTips(res.msg);
                                }else{
                                    showErrTips(res.msg);
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

        //公司数据同步
        syncData:function(){
            var _this = this
            mini.confirm("同步数据？", "确定？",
                function (action) {
                    if (action == "ok") {
                        $.GET({
                            url:basePath+'/org/userVo/sync',
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
            $.POST({ url: basePath+'/org/userVo/dels', data: {ids:ids.join(',')},
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
        },
        openIpt:function(row, editable){
            var _this = this;
            var title = (row ? (undefined != editable&&!editable?"查看":"编辑") : "添加") + "用户";
            var url = basePath + "/org/userVo/input";
            // 【弹窗模式】 弹窗添加修改页面
            mini.open({
                url: url,
                allowResize:true,
                title: title,
                width: 650, height: 450,
                onload: function () {
                    if(row!=undefined) {
                        var iframe = this.getIFrameEl();
                        iframe.contentWindow.userVo.input.setData(row);
                        if(undefined != editable&&!editable){
                            iframe.contentWindow.userVo.view.init();
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
        //验证编码是否唯一
        uniqueCode:function (e) {
            //判断sn的唯一性
            id = mini.get("#id").getValue();
            code = mini.get("userId").getValue();
            if (code == "" || code == null) {
                e.errorText = "编码不能为空";
                e.isValid = false;
            }else {
                $.POST({
                    url: basePath+"/org/userVo/getAll",
                    data: {id:id,userId:code},
                    async:false,
                    success: function (data) {
                        if(data.code == '100') {
                            e.errorText = "工号不能重复";
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
            mini.get("userId").disable ();
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
            var url = basePath + (formData.id==""?"/org/userVo/insert":"/org/userVo/update");
            // var jsonStr = mini.encode(formData);   //序列化成JSON字符串
            // 异步保存数据
            $.POST({ url: url, data: formData,
                success:function (res) {
                    unmask();
                    if(res.code == ReturnCode.SUCCESS){ // ReturnCode.SUCCESS  ---> '100'
                        // 【弹窗模式】 关闭弹窗
                        CloseWindow("save", _this.form);
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
                // 【弹窗模式】 弹窗关闭窗口
                CloseWindow("cancel", _this.form);
                // 【页签模式】 关闭当前Tab页签
                // closeTab();
            });
        }
    },


    inputPwd: {
        form: null,
        // 初始化
        init: function () {
            mini.parse();   // 必需
            this.form = new mini.Form("#jsPwdMainForm");  //获取form对象
            // 【页签模式】加载数据，弹窗模式下不需要加载此方法
            // this.loadData();
            this.bindEvents();
        },
        // 保存数据
        savePwd:function(){
            var _this = this;
            _this.form.validate();
            if (!_this.form.isValid()){
                return;
            }
            mask('正在保存...');
            var formData = _this.form.getData();
            var url = basePath + "/org/userVo/setPassword";
            // var jsonStr = mini.encode(formData);   //序列化成JSON字符串
            // 异步保存数据
            $.POST({ url: url, data: formData,
                success:function (res) {
                    unmask();
                    if(res.code == ReturnCode.SUCCESS){ // ReturnCode.SUCCESS  ---> '100'
                        // 【弹窗模式】 关闭弹窗
                        showSucTips(res.msg);
                        CloseWindow("save", _this.form);
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
            $('#jsPwdSave').click(function () {
                _this.savePwd();
            });
            // 点击关闭
            $('#jsPwdCancel').click(function () {
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