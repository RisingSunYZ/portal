var Area = {
    // 列表页面
    list: {
        // 初始化
        init: function () {
            mini.parse();   // 必需
            this.searchForm = new mini.Form('jsSearchForm');    // 获取搜索表单对象
            this.grid = mini.get("jsTreeGrid");    // 获取表格mini对象

            this.bindEvents();
        },
        // 绑定事件
        bindEvents: function () {
            var _this = this;

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
                _this.grid.reload();
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
        /*doSearch:function(){
            var _keyText = mini.get("#jsKeyword");
            var key = _keyText.getValue();
            var _this = this;
            if(key){
                key = key.toLowerCase();
                var nodes = [];
                _this.grid.filter(function (node) {
                    var text = node.name ? node.name.toLowerCase() : "";
                    var code = node.code ? node.code.toLowerCase() : "";
                    if (text.indexOf(key) != -1 || code.indexOf(key) != -1) {
                        nodes.push(node);
                        return true;
                    }
                });

                if(nodes){
                    // 展开所有找到的节点
                    for (var i = 0, l = nodes.length; i < l; i++) {
                        var node = nodes[i];
                        _this.grid.expandPath(node);
                    }


                    //第一个节点选中并滚动到视图
                    var firstNode = nodes[0];
                    if (firstNode) {
                        // this.tree.selectNode(firstNode);
                        _this.grid.scrollIntoView(firstNode);
                    }
                }
            }
        },*/

    }


};