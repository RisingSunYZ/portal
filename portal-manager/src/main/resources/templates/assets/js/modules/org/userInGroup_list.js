var userInGroup = {
    // 列表页面
    userId:'',
    list: {
        // 初始化
        init: function () {
            mini.parse();   // 必需
            //this.searchForm = new mini.Form('jsSearchForm');    // 获取搜索表单对象
            this.grid = mini.get("jsDataGrid");    // 获取表格mini对象
            this.bindEvents();
            this.userId = mini.get('userId').getValue();
            this.loadDatagrid();
        },
        // 加载

        loadDatagrid:function(){
            var _this = this;
            _this.grid.load({userNo:_this.userId});   // 加载表格数据
        },
        // 绑定事件
        bindEvents: function () {
            var _this = this;
            // 添加
            $('#jsAdd').click(function () {
                _this.openIpt();
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
                                var url = basePath + '/org/userVo/delUserInGroup';
                                $.POST({ url: url, data: {userId:_this.userId,groupId:ids.join(',')},
                                    success:function (res) {
                                        if(res.code == ReturnCode.SUCCESS){
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
        },
        openIpt:function(row, editable){
            var _this = this;
            var title = "组选择器";
            var url = basePath+"/common/groupSelectorUi?userId="+this.userId;
            // 【弹窗模式】 弹窗添加修改页面
            mini.open({
                url: url,
                allowResize:true,
                title: title,
                width: 1200, height: 600,
                onload: function () {
                    /*var iframe = this.getIFrameEl();
                    iframe.contentWindow.userInGroup.input.setData(_this.userId);
                    if(row!=undefined) {
                        iframe.contentWindow.userInGroup.input.form.setData(row);
                        if(undefined != editable&&!editable){
                            //iframe.contentWindow.userInGroup.input.form.setEnabled(false);
                            iframe.contentWindow.userInGroup.view.init();
                        }
                    }*/
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

};