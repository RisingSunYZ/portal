authInfo={
    list:{
        grid:null,
        init:function(){
            mini.parse();
            this.searchForm = new mini.Form('jsSearchForm');
            this.grid = mini.get("jsDataGrid");
            this.loadDatagrid();
            this.bindEvent();
        },

        bindEvent:function(){
            var _this = this;
            $('#jsAdd').click(function(){
                _this.add();
            });

            $('#jsEdit').click(function(){
                _this.edit();
            });
            $('#jsDel').click(function(){
                _this.remove();
            });
            // 查询
            $('#doSearchBtn').click(function () {
                _this.doSearch();
            });
            // 重置
            $('#doResetBtn').click(function () {
                _this.grid.load();
            });
            // 搜索框注册回车事件
            _this.searchForm.el.addEventListener('keypress', function (e) {
                // 回车键事件
                if(e.which == 13) {
                    _this.doSearch();
                }
            });

        },
        openModelSelector:function(){
            var _this = this;
            mini.open({
                allowResize: false,
                url: basePath+"/flow/privilege/auth_info/selectFlow",
                allowResize:true,
                title: "流程模板",
                width: 850, height: 500,
                onload: function () {
                    var iframe = this.getIFrameEl();
                    iframe.contentWindow.authInfo.selector.grid.set({multiSelect:false});
                },
                ondestroy: function (action) {
                    if(action=='save'){
                        var iframe = this.getIFrameEl();
                        var rows = iframe.contentWindow.authInfo.selector.grid.getSelecteds();
                        var authFlowKeysButton=mini.get("authFlowKeys");
                        if(rows.length){
                            authFlowKeysButton.setValue(rows[0].modelKey)
                            authFlowKeysButton.setText(rows[0].modelName)
                        }

                    }
                }
            });
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
                            _this.remove(e.record.id)
                        }
                    }
                ]
            };
            // 初始化表格操作按钮
            initOptions(options);
        },
        // 搜索
        doSearch: function(){
            var curUser = mini.get('jsCurUser').selectedData;
            var authUser = mini.get('jsAuthUser').selectedData;
            var authFlowKeys = mini.get('authFlowKeys').getValue();
            var params = {
                authFlowKeys:authFlowKeys?authFlowKeys:"",
                authUser:authUser?authUser[0].no:"",
                currUser:curUser?curUser[0].no:""
            };
            this.grid.load(params);
        },
        add: function() {
            this.openIpt();
        },
        edit:function (id) {
            var _this=this;
            var row = _this.grid.getSelected();
            if (row) {
                _this.openIpt(row);
            } else {
                showWarn('请选中一条记录');
            }
        },

        openIpt:function(row,editable){
            var id="";
            var _this = this;
            var title = row?(undefined != editable&&!editable?"查看":"编辑"):"添加";
            if(row){
                id=row.id;
            }
            mini.open({
                allowResize: false,
                url: basePath+"/flow/privilege/auth_info/updateUI?id="+id,
                allowResize:true,
                title: title,
                width: 900, height: 600,
                onload: function () {
                    if(row!=undefined) {
                        var iframe = this.getIFrameEl();
                        if(undefined != editable&&!editable){
                            iframe.contentWindow.authInfo.view.init();
                        }
                    }
                },
                ondestroy: function (action) {
                    _this.grid.reload();
                }
            });
        },
        /**
         * 批量删除
         */
        remove:function(id) {
            var _this = this;
            var ids = [];
            if(id){
                ids.push(id);
            }else{
                $.each(_this.grid.getSelecteds(), function (i, o) {
                    ids.push(o.id);
                });
            }
            if(ids.length<=0){
                showWarn("请选择！")
                return;
            }
            mini.confirm("确定删除记录？", "确定？",
                function (action) {
                    if (action == "ok") {
                        $.POST({
                            url:basePath+"/flow/privilege/auth_info/dels",
                            data:{ids:ids.join(',')},
                            success:function(data){
                                if(data.responseCode == '100') {
                                    _this.grid.reload();
                                    showSucTips("成功！")
                                }else {
                                    showError("失败！")
                                }
                            }
                        });
                    }
                }
            );
        },
        dateFormater: function (value, row, index) {
            return _this.dateTimeFormatter(value, 'yyyy-MM-dd HH:mm:ss');
        },
        dateTimeFormatter: function (dateTime, pattern) {
            if (dateTime && '' != dateTime) {
                return $.date.format(new Date(dateTime.replace(/-/g, "/")), (pattern && pattern != '' ? pattern : 'yyyy-MM-dd HH:mm:ss'));
            } else {
                return '-';
            }
        },
    },
    // 输入页面
    input: {
        form: null,
        authFlowKeys:null,
        // 初始化
        init: function () {
            mini.parse();   // 必需
            this.form = new mini.Form("#jsMainForm");  //获取form对象
            this.bindEvents();
            var rbl = mini.get("authType");
            var authFlowKeys = mini.get("authFlowKeys");
            this.authFlowKeys=authFlowKeys;
            var botton = mini.get("jsFlowSel");
            var flowKey = mini.get("authFlowKeys");
            rbl.on("valuechanged", function (e) {
                if(this.value==1){
                    botton.set({enabled:false})
                    flowKey.set({enabled:false})
                }else{
                    botton.set({enabled:true})
                    flowKey.set({enabled:true})
                }
            });

        },
        // 【弹窗模式】加载数据:直接通过表格行数据加载
        setData:function(data){
            this.form.setData(data);
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
            formData.startTimeStr=mini.formatDate(formData.startTimeStr,'yyyy-MM-dd');
            formData.endTimeStr=mini.formatDate(formData.endTimeStr,'yyyy-MM-dd');
            var url = basePath + (formData.id==""?"/flow/privilege/auth_info/add":"/flow/privilege/auth_info/update");
            var curUser = mini.get('jsCurUser').selectedData;
            var authUser = mini.get('jsAuthUser').selectedData;
            formData.authUser=authUser?authUser[0].no:oldAuthUser;
            formData.currUser=curUser?curUser[0].no:oldCurrUser;
            // 异步保存数据
            $.POST({ url: url, data: formData,
                success:function (res) {
                    unmask();
                    if(res.responseCode == ReturnCode.SUCCESS){ // ReturnCode.SUCCESS  ---> '100'
                        // 【弹窗模式】 关闭弹窗
                        CloseWindow("save", _this.form);
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
        openModelSelector:function(){
            var _this = this;
            mini.open({
                allowResize: false,
                url: basePath+"/flow/privilege/auth_info/selectFlow",
                allowResize:true,
                title: "流程模板",
                width: 850, height: 500,
                onload: function () {
                    var iframe = this.getIFrameEl();
                },
                ondestroy: function (action) {
                    if(action=='save'){
                        var iframe = this.getIFrameEl();
                        var rows = iframe.contentWindow.authInfo.selector.grid.getSelecteds();
                        var modelKeys=mini.get("authFlowKeys");
                        if(rows.length){
                            var keys=_this.authFlowKeys.getValue()?_this.authFlowKeys.getValue().split(","):[];
                            var names=_this.authFlowKeys.getText()?_this.authFlowKeys.getText().split(","):[];
                            $.each(rows, function (index, row) {
                                if(keys.indexOf(row.modelKey)<0){
                                    keys.push(row.modelKey);
                                    names.push(row.modelName);
                                }
                            });
                        }
                        _this.authFlowKeys.setValue(keys.join(","));
                        _this.authFlowKeys.setText(names.join(","));
                    }else{

                    }
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
    // 输入页面
    selector: {
        searchForm: null,
        grid:null,
        tree:null,
        // 初始化
        init: function () {
            mini.parse();   // 必需
            this.searchForm = new mini.Form("#jsSearchForm");  //获取form对象
            this.grid=mini.get("modelDg");
            this.tree = mini.get("catTree");
            // 【页签模式】加载数据，弹窗模式下不需要加载此方法
            // this.loadData();
            this.bindEvents();
        },
        doSearch:function(){
            this.grid.load(this.searchForm.getData());
        },
        selectNode:function () {
            var node = this.tree.getSelectedNode();
            this.grid.load({ categoryCode: node.code });
        },
        // 绑定事件
        bindEvents: function () {
            var _this = this;
            // 点击确定
            $('#jsSave').click(function () {
                // _this.saveModel();
                if (window.CloseOwnerWindow)
                    return window.CloseOwnerWindow("save");
                else
                    window.close();
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
            // 点击关闭
            $('#jsCancel').click(function () {
                if (window.CloseOwnerWindow)
                    return window.CloseOwnerWindow("cancel");
                else
                    window.close();
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
            $('#jsFlowSel').remove();
        }
    }
}