var menuPrivilege = {
    // 列表页面
    list: {
        // 初始化
        userId:null,
        url:null,
        init: function () {
            mini.parse();   // 必需
            this.grid = mini.get("jsTreeGrid");
            this.userId = mini.get("userId").getValue();
            this.url = basePath+'/org/userVo/menuList?userId='+this.userId
            this.loadDatagrid();
            this.bindEvents();
        },
        // 加载
        loadDatagrid:function(){
            var _this = this;
            _this.grid.load(_this.url);
        },

        // 绑定事件
        bindEvents: function () {
            var _this = this;
            $('#jsSpread').click(function(){
                _this.spreadItem();
            });
            $('#jsMerge').click(function(){
                _this.mergeItem();
            });
        },
        delByIds: function (ids) {
            var _this = this;
            $.POST({
                url:basePath+"/org/menuPrivilege/getAll",
                data:{pid:ids.join(',')},
                success:function(data){
                    if(data.length ==0) {
                        $.POST({
                            url: basePath + '/org/menuPrivilege/dels', data: {ids: ids.join(',')},
                            success: function (res) {
                                if (res.code == ReturnCode.SUCCESS) {
                                    _this.grid.reload(_this.url);
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



        clickCheckbox:function(privId,id,pid){
            var _this = this;
            var _userId = _this.userId;
            $.POST({
                url: basePath + '/org/userVo/addPrivMenu', data: {privId:privId,id:id,pid:pid,userId:_userId},
                success: function (res) {
                    if (res.code == ReturnCode.SUCCESS) {
                        showSucTips(res.msg);
                    } else {
                        showErrTips(res.msg);
                    }
                    var currRow = _this.grid.findRow(function(row){
                        if(row.id == id) return true;
                    });
                    currRow.statusStr = currRow.statusStr ==1 ? 0 : 1;
                    if(currRow.children){
                        $.each(currRow.children, function(i, node){
                            var row = _this.grid.findRow(function(row){
                                if(row.id == node.id) return true;
                            });
                            row.statusStr = currRow.statusStr;
                            row && $(_this.grid.getRowEl(row,2)).find('input[name=privId]').prop('checked',currRow.statusStr ==1 ? true : false);
                        })
                    }else{
                        var row = _this.grid.findRow(function(row){
                            if(row.id == pid) return true;
                        });
                        if(row && currRow.statusStr){
                            row.statusStr = currRow.statusStr;
                            $(_this.grid.getRowEl(row,2)).find('input[name=privId]').prop('checked',true);
                        }
                    }

                    //_this.grid.reload(_this.url);
                },
                error: function () {
                    showErrTips('网络异常，请稍候再试！');
                }
            });

        },

        onOptRenderer:function (e) {
           // var userId = mini.get("userId").getValue()
            var opt_str = "";
            var row = e.record;
            _privId = "'"+row.privId+"'";
            _id = "'"+row.id+"'";
            _pid = "'"+row.pid+"'";
            if (row.statusStr=='1'){
                opt_str = '<input type="checkbox" name="privId" checked="checked" onclick="menuPrivilege.list.clickCheckbox('+_privId+','+_id+','+_pid+')">'
            } else{
                opt_str = '<input type="checkbox" name="privId" onclick="menuPrivilege.list.clickCheckbox('+_privId+','+_id+','+_pid+')">'
            }
            return opt_str;

        }


    }
};