var groupVoSelector = {
    // 列表页面
    list: {
        // 初始化
        userId:"",
        init: function () {
            mini.parse();   // 必需
            this.searchForm = new mini.Form('jsSearchForm');    // 获取搜索表单对象
            this.grid = mini.get("jsDataGrid");    // 获取表格mini对象
            this.tree = mini.get("companyTree");
            this.userId = mini.get("userId").getValue();
            this.loadDatagrid();
            this.bindEvents();
        },
        // 加载
        loadDatagrid:function(){
            var _this = this;
            _this.grid.load();   // 加载表格数据
        },

        selectNode:function () {
            var node = this.tree.getSelectedNode();
            this.grid.load({ systemId: node.id });

        },

        // 绑定事件
        bindEvents: function () {
            var _this = this;
            // 保存组数据
            $('#jsSave').click(function () {
                var ids = [];
                var rows = _this.grid.getSelecteds();
                if (rows.length > 0) {
                    $.each(rows, function (i, o) {
                        ids.push(o.id);
                    });
                    _this.saveData(ids.join(","))
                } else {
                    showWarn('请选中一条记录');
                }
            });
            // 取消弹窗
            $('#jsCancel').click(function () {
                window.CloseOwnerWindow()
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

        },

        saveData:function(id){
           var _this = this;
            $.POST({ url: basePath+'/org/userVo/addGroupUserBatch', data: {userId:this.userId,groupId:id},
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
        },
        onCompanyRenderer:function (r) {
            var row = r.record;
            var html = "";
            if(row.companyList != null) {
                $.each(row.companyList, function (i, o) {
                    html += "<div class='tb-list-itm'><span >" + o.cName + "</span><a style='cursor: pointer' onclick='groupVo.list.delGroupData(null,null,\""+ o.id +"\")' class='mini-tab-close'></a></div>"
                });
            }
            return html;
        },
        doSearch:function(){
            var node = this.tree.getSelectedNode();
            var keyWord_ = mini.get("keyWord").getValue();
            if (node==undefined){
                this.grid.load({ keyWord:keyWord_ });
            } else{
                this.grid.load({ keyWord:keyWord_ ,systemId:node.id});
            }
        }
    }
};