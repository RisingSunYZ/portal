var nodesCount = {
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
        loadDatagrid: function () {
            var _this = this;
            _this.grid.load();   // 加载表格数据

        },
        // 绑定事件
        bindEvents: function () {
            var _this = this;
            //同步
            $('#jsExport').click(function () {
                _this.exportExcel();
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
            });

        },

        doSearch: function () {
            this.grid.load(this.searchForm.getData());
        },
        exportExcel() {
           // var myForm = $('#userNo').val();
            var userNo = mini.get("userNo").getValue();
            if (userNo==""||userNo==''){
                showWarn("请选择人员！");
            } else {
                window.location.href = basePath+'/flow/count/nodes_count/exportExcel?userNo='+userNo;
            }
        }
    }
};