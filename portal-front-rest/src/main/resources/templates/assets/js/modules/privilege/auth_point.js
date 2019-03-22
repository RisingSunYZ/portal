var authPoint = {
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
                            // to do ...
                        }
                    }
                ]
            };
            // 初始化表格操作按钮
            initOptions(options);
        },
        stateRenderer:function (e) {
            if(e.value=='1'){
                return "是";
            }else{
                return "否";
            }
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
                                var url = basePath + '/flow/privilege/auth_point/dels';
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
        openIpt:function(row, editable){
            var _this = this;
            var title = (row ? (undefined != editable&&!editable?"查看":"编辑") : "添加") + "功能点管理";
            var url = basePath + "/flow/privilege/auth_point/updateUI";
            if(row){
                url = basePath + "/flow/privilege/auth_point/updateUI?id="+row.id;
            }

            // 【弹窗模式】 弹窗添加修改页面
            mini.open({
                url: url,
                allowResize:true,
                title: title,
                width: 400, height: 300,
                onload: function () {
                    if(row!=undefined) {
                        var iframe = this.getIFrameEl();
                        iframe.contentWindow.authPoint.input.form.setData(row);
                        if(undefined != editable&&!editable){
                            //iframe.contentWindow.AuthPoint.input.form.setEnabled(false);
                            iframe.contentWindow.authPoint.view.init();
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
    // 输入页面
    input: {
        form: null,
        // 初始化
        init: function () {
            mini.parse();   // 必需
            this.form = new mini.Form("#jsMainForm");  //获取form对象
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
            var url = formData.id==""?basePath+"/flow/privilege/auth_point/add":basePath+"/flow/privilege/auth_point/update";

            // var jsonStr = mini.encode(formData);   //序列化成JSON字符串
            // 异步保存数据
            $.POST({ url: url, data: formData,
                success:function (res) {
                    unmask();
                    if(res.responseCode == "1"){ // ReturnCode.SUCCESS  ---> '100'
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
        valid:function (e) {
          if(e.isValid){
              $.ajax({
                  type:"POST",
                  dataType:"JSON",
                  async:false,
                  data:{id:$("#jsId").val(),sn:e.value},
                  url:basePath+"/flow/privilege/auth_point/validSn",
                  success:function (data) {
                      if(!data){
                          e.errorText="标识不能重复";
                          e.isValid=false;
                      }
                  }
              })
          }
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