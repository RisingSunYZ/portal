var groupInnerUsers = {
    // 列表页面
    groupId:'',
    list: {
        // 初始化
        init: function () {
            mini.parse();   // 必需
            this.grid = mini.get("jsDataGrid");    // 获取表格mini对象
            this.bindEvents();
            this.groupId = mini.get('groupId').getValue();
            this.loadDatagrid();
        },
        // 加载

        loadDatagrid:function(){
            var _this = this;
            _this.grid.load({sn:_this.groupId});   // 加载表格数据
        },

        // 绑定事件
        bindEvents: function () {
            var _this = this;
            $('#addUserVo').click(function () {
                new UserSelectWindow({
                    multiSelect:true,    // 是否多选
                    success:function(action){
                        if (action == "ok") {
                            //获取数据
                            var rows = this.getData();
                            if (rows) {
                                var ids = [];
                                if (rows.length > 0) {
                                    $.each(rows, function (i, o) {
                                        ids.push(o.no);
                                    });
                                    _this.saveData(ids.join(","))
                                }
                            }
                        }
                    }
                });
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
                                var url = basePath + '/org/groupVo/delGroupInnerUser';
                                $.POST({ url: url, data: {groupId:_this.groupId,userId:ids.join(',')},
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
        saveData:function(ids){
            $.POST({ url: basePath+'/org/userVo/addGroupUserBatch', data: {userId:ids,groupId:this.groupId},
                success:function (res) {
                    if(res.code == ReturnCode.SUCCESS){
                        window.CloseOwnerWindow()
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
};