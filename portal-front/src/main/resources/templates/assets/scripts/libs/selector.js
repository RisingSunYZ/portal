/**
    标准模板：弹出选择面板
    注意，只需要修改搜索框和mini.DataGrid相关的列配置信息即可。
    人员选择器组件
 new UserSelectWindow({
        multiSelect:true,   // 是否多选
        values:"", // 默认值 string   aaaaa,bbbbb,ccccc
        texts:"",   // 默认显示文本 string   AAAAA,BBBBB,CCCCC

        success:function (action) {
            if (action == "ok") {
                //获取数据
                var rows = win.getData();

                if (rows) {
                    var texts = [], values = [];
                    for (var i =0; i< rows.length; i++){
                        texts.push(rows[i].name);
                        values.push(rows[i].no);
                    }
                    _this.setValue(values.join(','));
                    _this.setText(texts.join(','));
                }
            }
        }
    });

*/
UserSelectWindow = function (options) {
    UserSelectWindow.superclass.constructor.call(this);

    this.set({
        title:'用户选择',
        width:'850',
        height:'70%'
    });
    this.show();
    this.set(options);
    this.initControls();
    this.initEvents();


    this.search();
}
mini.extend(UserSelectWindow, mini.Window, {
    keyField: "keyword",
    multiSelect: false,
    targetWindow: window,
    title: "选择用户",
    keyLable: "名称：",
    searchLable: "查询：",
    showMaxButton: true,
    width: 850,
    height: 650,
    bodyStyle: "padding:0;",
    allowResize: true,
    showModal: true,
    showToolbar: true,
    showFooter: true,
    selectedItems:[],
    initControls: function () {
        var _this = this;
        // var toolbarEl = this.getToolbarEl();
        var footerEl = this.getFooterEl();
        var bodyEl = this.getBodyEl();
        //toolbar
        var topHtml =
            '<div class="search-box"  style="padding:9px 9px 0px 9px;margin:auto;border:none"  >'
            + '<form onsubmit="return false;">'
                + '<div name="searchPanel" class="mini-splitter container-fluid" style="width:100%;height:40px" handlerSize="0" allowResize="false" >'
                    + '<div style="border:none;" showCollapseButton="false" >'
                        + '<div class="row s-form-items">'
                            + '<div class="col-sm-8">'
                                + '<div class="search-item" style="height:28px">'
                                    + '<input  labelField="true" label="姓名/岗位/邮箱/单位搜索" class="mini-textbox" emptyText="" style="width:100%" name="keyText" /> '
                                + '</div>'
                            + '</div>'
                            + '<div class="col-sm-2">'
                                + '<div class="s-btn-group">'
                                    + '<a name="searchBtn" class="mini-button" iconCls="fa fa-search" id="doSearchBtn">查询</a>'
                                + '</div>'
                            + '</div>'
                        + '</div>'
                    + '</div>'
                    + '<div cls="s-btn-box" style="border:none;" showCollapseButton="false" size="180">'
                        + '<a class="fold-btn more-btn" expand="0" href="javascript:void(0);"><i class="fa fa-caret-down"></i></a>'
                    + '</div>'
                + '</div>'
            + '</form>'
        + '</div>';
        //jQuery(toolbarEl).append(topHtml);

        //footer
        var footerHtml =
            '<div style="padding:8px;text-align:center;">'
            + '<a name="okBtn" class="mini-button" style="width:60px;">确定</a>'
            + '<span style="display:inline-block;width:25px;"></span>'
            + '<a name="cancelBtn" class="mini-button" style="width:60px;">取消</a>'
            + '</div>';
        jQuery(footerEl).append(footerHtml);

        /////////////////////////////////////////////////////
        // var fitLay = new mini.Fit();
        var lay = new mini.Layout();
        lay.setWidth('100%');
        lay.setHeight('100%');
        lay.set({
            borderStyle:'border:0px'
        });
        lay.setRegions([
            {region:'north', style:'height:40px;border-width:0;', height:52, showHeader:false,splitSize:0},
            {region:'west', style:'border-width:0;border-top-width:1px;border-right-width:1px;', headerStyle:'height:36px;line-height:36px;background:#EAEEF4;border-bottom:#D5DDE9 1px solid', title:'组织架构', showSplit:false, showSplitIcon:false,width:200, showCollapseButton:false, splitSize:0},
            {region:'center', style:'border-width:1px 0 0 0;', showSplit:false, showSplitIcon:false, showCollapseButton:false, splitSize:0 },
            {region:'east', style:'border-width:0; border-left-width:1px;', showHeader:false, showSplit:false, showSplitIcon:false,width:130, showCollapseButton:false, splitSize:0 }
        ]);
        //lay.regions({});

        this.leftPanel = new mini.Splitter();
        this.leftPanel.set({
            vertical:true,
            allowResize:false,
            handlerSize:0,
            style:'width:100%;height:100%;border:none',
            borderStyle:'border:none'
        });
        this.leftPanel.setPanes([
            {size:50, visible:true, style:'width:100%;border:0px'},{
                visible:true, style:'width:100%;border-width:1px 0 0 0;'
            }
        ]);

        // 左侧组织树
        this.leftTree = new mini.Tree();
        this.grid = new mini.DataGrid();

        // this.grid.setUrl(privilegeBasePath + '/common/ajaxListPerson');

        this.selectedListBox = new mini.ListBox();

        this.selectedListBox.set({
            style: "width: 100%;height: 100%;border:none;",
            borderStyle:'border:0;',
            textField:"name",
            valueField:"no",
            multiSelect:false
        });

        this.selectedListBox.on('itemclick', function (e) {
            if(e.htmlEvent.htmlEvent.target.className.indexOf('remove') != -1){
                e.sender.removeItem(e.item, true);
                _this.grid.getSelecteds();
                var gridSelected = _this.grid.getSelecteds();
                $.each(gridSelected, function (index, obj) {
                    if (obj.no == e.item.no) {
                        _this.grid.deselect(obj);
                    }
                });
                _this.changeSelectedCount();
            }
            this.deselectAll();
        });

        var searchBoxHtml =
            '<div class="search-box" style="padding:9px 9px 0px 9px;margin:auto;border:none" >'
            + '<form onsubmit="return false">'
            + '<div name="searchPanel" class="mini-splitter container-fluid" style="width:100%;height:44px" handlerSize="0" allowResize="false" >'
            + '<div style="border:none;" showCollapseButton="false" >'
            + '<div class="row s-form-items">'
            + '<div class="col-sm-10">'
            + '<div class="search-item" style="height:28px;overflow:hidden;">'
            + '<input  labelField="false"  class="mini-textbox" emptyText="公司/部门" style="width:100%" name="keyTextTree" /> '
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '<div cls="s-btn-box" style="border:none;" showCollapseButton="false" size="32">'
            + '<a name="searchBtnTree" class="mini-button" iconCls="fa fa-search" ></a>'
            + '<a class="fold-btn more-btn" expand="0" href="javascript:void(0);"><i class="fa fa-caret-down"></i></a>'
            + '</div>'
            + '</div>'
            + '</form>'
            + '</div>';

        jQuery(this.leftPanel.getPaneEl(1)).append(searchBoxHtml);
        this.leftTree.render(this.leftPanel.getPaneEl(2));
        this.leftPanel.render(lay.getRegionBodyEl('west'));

        jQuery(lay.getRegionBodyEl('north')).append(topHtml);
        this.grid.render(lay.getRegionBodyEl('center'));
        this.selectedListBox.render(lay.getRegionBodyEl('east'));

        // 设置请求路径
        // this.tree.load(privilegeBasePath + '/common/ajaxListOrgTree');
        // this.tree.load(privilegeBasePath + '/common/ajaxListOrgTree');

        lay.render(bodyEl);

        //组件对象
        mini.parse(this.el);

        // 为避免加载数据出错，延时加载
        setTimeout(function () {
            _this.leftTree.set({
                url:privilegeBasePath + '/common/ajaxListOrgTree',
                ajaxOptions:{dataType:"jsonp",jsonpCallback:"callback"},
                style: "width: 100%;height: 100%;",
                borderStyle: "border:0",
                showTreeIcon: false,
                textField: "text",
                idField: "id",
                expandOnLoad:0,
                parentField: "pId",
                onNodeselect:function (o) {
                    if(o.node.text =="YASHA"){
                        _this.grid.load();
                    }else{
                        _this.grid.load({deptId:o.node.id});
                    }
                },
                resultAsTree: false,
                onLoad:function (e) {
                    // this.grid.setUrl(privilegeBasePath + '/common/ajaxListPerson');
                    _this.grid.load();
                }
            });

            // 人员数据
            _this.grid.set({
                // url:'#',
                url:privilegeBasePath + '/common/ajaxListPerson',
                ajaxOptions:{dataType:"jsonp",jsonpCallback:"callback"},
                multiSelect: this.multiSelect,
                style: "width: 100%;height: 100%;",
                borderStyle: "border:0",
                dataField:"rows",
                pageIndexField:"page",
                pageSize:15,
                showEmptyText:true,
                emptyText:'当前暂无数据',
                pageSizeField:"rows",
                sizeList:[15,25,35,50],
                allowAlternating:true,
                allowUnselect:true,
                allowRowSelect:true,
                columns: [
                    { type: "checkcolumn", header: "" },
                    {header: "姓名", field: "name",width:'70' },
                    // {header: "工号", field: "no", width:'80'},
                    {header: "岗位", field: "jobStation" },
                    {header: "邮箱", field: "email" },
                    {header: "单位", field: "deptName" }
                ],
                onLoad:function(e){
                    var selected = _this.selectedListBox.getData();
                    if(!$.isEmptyObject(selected)){
                        var nos = [];
                        $.each(selected, function (i, o) {
                            nos.push(o.no);
                        });
                        var selectedRows = _this.grid.findRows(function(row){
                            if(nos.indexOf(row.no) != -1) return true;
                        });
                        _this.grid.selects(selectedRows);
                    }
                },
                onSelect:function (e) {
                    if(!_this.multiSelect){
                        _this.selectedListBox.removeAll();
                        _this.selectedListBox.addItem(e.record, 0);
                    }else{
                        var selected = _this.selectedListBox.getData();
                        var record = e.record;
                        var flag = false;
                        $.each(selected, function (i, o) {
                            if(record.no ==o.no){
                                flag = true;
                                return false;
                            }
                        });

                        if(!flag){
                            _this.selectedListBox.addItem(record, 0);
                            _this.changeSelectedCount();
                        }
                    }
                    // 让树选中对应的节点
                    var nodes = _this.leftTree.findNodes(function(node){
                        if(e.record.deptId == node.id) return true;
                    });
                    _this.leftTree.scrollIntoView ( nodes[0] )

                },
                onDeSelect:function (e) {
                    _this.selectedListBox.removeItem(_this.selectedListBox.findItems(e.record.no)[0]);
                    _this.changeSelectedCount();
                }
            });
        }, 10);

        this._okBtn = mini.getbyName("okBtn", this);
        this._cancelBtn = mini.getbyName("cancelBtn", this);
        this._searchBtn = mini.getbyName("searchBtn", this);
        this._searchBtnTree = mini.getbyName("searchBtnTree", this);
        this._keyText = mini.getbyName("keyText", this);
        this._keyTextTree = mini.getbyName("keyTextTree", this);

        // 设置已有数据
        _this.setData({value:_this.values, text:_this.texts}, _this.success);
    },
    initEvents: function () {
        this._searchBtn.on("click", function (e) {
            var key = this._keyText.getValue();
            this.search(key);
        }, this);
        this._searchBtnTree&&this._searchBtnTree.on("click", function (e) {
            var key = this._keyTextTree.getValue();
            this.searchTree(key);
        }, this);

        this._keyText.on("enter", function (e) {
            var key = this._keyText.getValue();
            this.search(key);
        }, this);
        this._keyTextTree&&this._keyTextTree.on("enter", function (e) {
            var key = this._keyTextTree.getValue();
            this.searchTree(key);
        }, this);

        /////////////////////////////////////
        this._okBtn.on("click", function (e) {
            var ret = true;
            if (this._Callback) ret = this._Callback('ok');
            if (ret !== false) {
                this.hide();
            }
        }, this);
        this._cancelBtn.on("click", function (e) {
            var ret = true;
            if (this._Callback) ret = this._Callback('cancel');
            if (ret !== false) {
                this.hide();
            }
        }, this);
        this.on("beforebuttonclick", function (e) {
            if (e.name == "close") {
                e.cancel = true;
                var ret = true;
                if (this._Callback) ret = this._Callback('close');
                if (ret !== false) {
                    this.hide();
                }
            }
        }, this);
    },
    changeSelectedCount:function(){
        var _this = this;
        _this.selectedListBox.set({
            columns:[
                {header:'已选人员<i style="font-size:14px;font-style:normal;color:red;">'+ (_this.multiSelect?('('+_this.selectedListBox.getCount()+')'):'') +'</i>',
                    field:'name', headerStyle:'height:24px;font-size:12px;font-weight:bold;',
                    width:'60'},
                {header:'', width:'25', field:'delete', title:'删除', align:'center', cellCls:'remove', cellStyle:'cursor:pointer', renderer:function(){
                    return '<a title="删除" href="javascript:void(0);" ><i class="fa fa-remove"></i>';
                }
                }]
        });
    },
    setMultiSelect: function (value) {
        this.multiSelect = value;
        // this.grid.setMultiSelect(value);
    },
    search: function (key) {
        var args = {};
        args[this.keyField] = key;
        this.grid.load(args);
    },
    searchTree: function (key) {
        var args = {};
        args[this.keyField] = key;
        if (key==undefined || key == null || key == "") {
            this.leftTree.clearFilter();
        } else {
            key = key.toLowerCase();
            var nodes = [];
            this.leftTree.filter(function (node) {
                var text = node.text ? node.text.toLowerCase() : "";
                if (text.indexOf(key) != -1) {
                    nodes.push(node);
                    return true;
                }
            });

            if(nodes){
                // 展开所有找到的节点
                for (var i = 0, l = nodes.length; i < l; i++) {
                    var node = nodes[i];
                    this.leftTree.expandPath(node);
                }


                //第一个节点选中并滚动到视图
                var firstNode = nodes[0];
                if (firstNode) {
                    // this.tree.selectNode(firstNode);
                    this.leftTree.scrollIntoView(firstNode);
                }
            }else{

            }

        }
    },
    setData: function (data, callback) {
        var _this = this;
        this._Callback = callback;

        setTimeout(function () {
            if(data.value) {
                var values = data.value.split(','), texts = data.text.split(',');
                var datas = [];
                for (var i = 0; i < values.length; i++) {
                    datas.push({no: values[i], name: texts[i]});
                }
                var rows = _this.grid.findRows(function (row) {
                    if (values.indexOf(row.no) != -1) return true;
                });
                _this.grid.selects(rows);
                _this.selectedListBox.setData(datas);
            }
            _this.changeSelectedCount();
        }, 0);
    },

    getData: function () {
        var rows = this.selectedListBox.getData();
        return rows;
    }
});
mini.regClass(UserSelectWindow, "userselectwindow");


/** 组织选择器 */
OrgSelectWindow = function (options) {
    OrgSelectWindow.superclass.constructor.call(this);

    this.set({
        title:'组织选择',
        width:'850',
        height:'70%'
    });
    this.show();
    this.set(options);
    this.initControls();
    this.initEvents();

    this.search();

    this.setExcludeNodes(options);
}
mini.extend(OrgSelectWindow, mini.Window, {
    keyField: "keyText",
    multiSelect: false,
    targetWindow: window,
    title: "选择组织",
    keyLable: "名称：",
    searchLable: "查询：",
    showMaxButton: true,
    width: 850,
    height: 650,
    bodyStyle: "padding:0;",
    allowResize: true,
    showModal: true,
    showToolbar: true,
    showFooter: true,
    selectedItems:[],
    initControls: function () {
        var _this = this;
        var footerEl = this.getFooterEl();
        var bodyEl = this.getBodyEl();
        //footer
        var footerHtml =
            '<div style="padding:8px;text-align:center;">'
            + '<a name="okBtn" class="mini-button" style="width:60px;">确定</a>'
            + '<span style="display:inline-block;width:25px;"></span>'
            + '<a name="cancelBtn" class="mini-button" style="width:60px;">取消</a>'
            + '</div>';
        jQuery(footerEl).append(footerHtml);

        /////////////////////////////////////////////////////
        // var fitLay = new mini.Fit();
        var lay = new mini.Layout();
        lay.setWidth('100%');
        lay.setHeight('100%');
        lay.set({
            borderStyle:'border:none'
        });
        lay.setRegions([
            {region:'center', style:'border:none;',showHeader:true,
                headerStyle:'height:36px;line-height:36px;background:#EAEEF4;border-bottom:#D5DDE9 1px solid',
                title:'组织架构', showSplit:false, showSplitIcon:false,width:200, showCollapseButton:false, splitSize:0},
            {region:'east', style:'border-width:0; border-left-width:1px;', showHeader:false, showSplit:false, showSplitIcon:false,width:300, showCollapseButton:false, splitSize:0 }
        ]);
        //lay.regions({});
        //body
        this.selectedListBox = new mini.ListBox();

        this.selectedListBox.set({
            style: "width: 100%;height: 100%;border:none;",
            borderStyle:'border:0;',
            textField:"text",
            valueField:"id",
            multiSelect:false
        });

        this.selectedListBox.on('itemclick', function (e) {
            if(e.htmlEvent.htmlEvent.target.className.indexOf('remove') != -1){
                e.sender.removeItem(e.item, true);
                var nodes = _this.tree.findNodes(function(node){
                    if(node.id.indexOf(e.item.id) != -1) return true;
                });
                _this.multiSelect?_this.tree.uncheckNodes(nodes):_this.tree.selectNode(null);
                _this.changeSelectedCount();
            }
            this.deselectAll();
        });
        this.leftPanel = new mini.Splitter();
        this.leftPanel.set({
            vertical:true,
            allowResize:false,
            handlerSize:0,
            style:'width:100%;height:100%;',
            borderStyle:'border:none'
        });
        this.leftPanel.setPanes([
            {size:50, visible:true, style:'width:100%;border:0px'},{
                visible:true, style:'width:100%;border-width:1px 0px 0;'
            }
        ]);

        this.tree = new mini.Tree();
        this.tree.set({
            // url:privilegeBasePath + '/common/ajaxListOrgTree',
            ajaxOptions:{dataType:"jsonp",jsonp:"callback",jsonpCallback:"callback"},
            style: "width: 100%;height: 100%;",
            borderStyle: "border:0",
            showTreeIcon: false,
            textField: "text",
            allowSelect: !this.multiSelect,
            idField: "id",
            parentField: "pId",
            expandOnLoad:0,
            checkRecursive:false,
            checkOnTextClick:true,
            showCheckBox: this.multiSelect,
            onNodeselect:function (o) {
                if(_this.orgType == "3"){ // 部门选择器
                    if(o.node.type == 2){
                        if(!_this.multiSelect){
                            _this.selectedListBox.removeAll();
                            _this.selectedListBox.addItem(o.node, 0);
                            _this.changeSelectedCount();
                        }
                    }else{
                        showWarnTips('请选择部门！');
                        setTimeout(function () {
                            _this.tree.selectNode(null)
                        });
                    }
                }else{
                    if(!_this.multiSelect){
                        _this.selectedListBox.removeAll();
                        _this.selectedListBox.addItem(o.node, 0);
                        _this.changeSelectedCount();
                    }
                }
            },
            onNodecheck:function(o){
                if(_this.multiSelect){
                    if(_this.orgType == 3) {// 只能选择部门
                        if (o.node.type == 2) {
                            if(!o.checked){
                                // 获取所有子节点
                                _this.selectedListBox.addItem(o.node, 0);
                            }else{
                                _this.selectedListBox.removeItem(o.node);
                            }
                            _this.changeSelectedCount();
                        }else{
                            showWarnTips('请选择部门！');
                            setTimeout(function () {
                                _this.tree.uncheckNode(o.node)
                            });
                        }
                    }else{
                        if(!o.checked){
                            // 获取所有子节点
                            _this.selectedListBox.addItem(o.node, 0);
                        }else{
                            _this.selectedListBox.removeItem(o.node);
                        }
                        _this.changeSelectedCount();
                    }
                }
            },
            resultAsTree: false
        });
        if(_this.orgType == "2"){
            this.tree.setUrl(privilegeBasePath + "/common/ajaxListCompanyTree");
        }else{
            this.tree.setUrl(privilegeBasePath + "/common/ajaxListOrgTree");
        }
        // this.tree.render(lay.getRegionBodyEl('west'));
        this.tree.on('load', function (o) {
            if(_this.value){
                var datas = _this.tree.findNodes(function (node) {
                    if (_this.value.indexOf(node.id) != -1) {
                        return true;
                    }
                });
                setTimeout(function () {
                    !_this.multiSelect?(_this.tree.selectNode(datas[0]),_this.tree.scrollIntoView(datas[0]))
                        :_this.tree.checkNodes(datas);
                }, 300);
                _this.selectedListBox.setData(datas);
                _this.changeSelectedCount();
            }
        });

        var searchBoxHtml =
            '<div class="search-box" style="padding:9px 9px 0px 9px;margin:auto;border:none" >'
            + '<form onsubmit="return false">'
            + '<div name="searchPanel" class="mini-splitter container-fluid" style="width:100%;height:44px" handlerSize="0" allowResize="false" >'
            + '<div style="border:none;" showCollapseButton="false" >'
            + '<div class="row s-form-items">'
            + '<div class="col-sm-10">'
            + '<div class="search-item" style="height:28px">'
            + '<input  labelField="true" label="公司/部门" class="mini-textbox" emptyText="请输入公司/部门" style="width:100%" name="keyText" /> '
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '<div cls="s-btn-box" style="border:none;" showCollapseButton="false" size="80">'
            + '<a name="searchBtn" class="mini-button" iconCls="fa fa-search" >查询</a>'
            + '<a class="fold-btn more-btn" expand="0" href="javascript:void(0);"><i class="fa fa-caret-down"></i></a>'
            + '</div>'
            + '</div>'
            + '</form>'
            + '</div>';

        jQuery(this.leftPanel.getPaneEl(1)).append(searchBoxHtml);
        this.tree.render(this.leftPanel.getPaneEl(2));

        this.leftPanel.render(lay.getRegionBodyEl('center'));


        this.selectedListBox.render(lay.getRegionBodyEl('east'));
        lay.render(bodyEl);
        //组件对象
        mini.parse(this.el);
        this._okBtn = mini.getbyName("okBtn", this);
        this._cancelBtn = mini.getbyName("cancelBtn", this);
        this._searchBtn = mini.getbyName("searchBtn", this);
        this._keyText = mini.getbyName("keyText", this);

        _this.setData({value:_this.values, text:_this.texts}, _this.success);

    },
    changeSelectedCount:function(){
        var _this = this;
        _this.selectedListBox.set({
            columns:[
                {header:'已选组织<i style="font-size:14px;font-style:normal;color:red;">'+ (_this.multiSelect?('('+_this.selectedListBox.getCount()+')'):'') +'</i>',
                    field:'text', headerStyle:'height:24px;font-size:12px;font-weight:bold;',
                    width:'70',
                    renderer:function(e){
                        return e.record.companyName ? (e.record.companyName + " - " + e.record.text):e.record.text;
                    }},
                {header:'', width:'25', field:'delete', title:'删除', align:'center', cellCls:'remove', cellStyle:'cursor:pointer', renderer:function(){
                        return '<a title="删除" href="javascript:void(0);" ><i class="fa fa-remove"></i>';
                    }
                }]
        });
    },
    initEvents: function () {
        this._searchBtn.on("click", function (e) {
            var key = this._keyText.getValue();
            this.search(key);
        }, this);
        this._keyText.on("enter", function (e) {
            var key = this._keyText.getValue();
            this.search(key);
        }, this);

        /////////////////////////////////////
        this._okBtn.on("click", function (e) {
            var ret = true;
            if (this._Callback) ret = this._Callback('ok');
            if (ret !== false) {
                this.hide();
            }
        }, this);
        this._cancelBtn.on("click", function (e) {
            var ret = true;
            if (this._Callback) ret = this._Callback('cancel');
            if (ret !== false) {
                this.hide();
            }
        }, this);
        this.on("beforebuttonclick", function (e) {
            if (e.name == "close") {
                e.cancel = true;
                var ret = true;
                if (this._Callback) ret = this._Callback('close');
                if (ret !== false) {
                    this.hide();
                }
            }
        }, this);
    },
    setUrl: function (value) {
        this.url = value;
        // this.grid.setUrl(value);
    },
    setExcludeNodes:function (options) {
        var _this = this;
        if(_this.excludes){
            setTimeout(function () {
                var nodes = _this.tree.findNodes(function(node){
                    if(_this.excludes.indexOf(node.id) != -1) return true;
                });

                $.each(nodes, function (i, o) {
                    _this.tree.disableNode(o);
                });
            }, 500)
        }
    },
    setMultiSelect: function (value) {
        this.multiSelect = value;
        // this.grid.setMultiSelect(value);
    },
    search: function (key) {
        var args = {};
        args[this.keyField] = key;
        if (key==undefined || key == null || key == "") {
            this.tree.clearFilter();
        } else {
            key = key.toLowerCase();
            var nodes = [];
            this.tree.filter(function (node) {
                var text = node.text ? node.text.toLowerCase() : "";
                if (text.indexOf(key) != -1) {
                    nodes.push(node);
                    return true;
                }
            });

            if(nodes){
                // 展开所有找到的节点
                for (var i = 0, l = nodes.length; i < l; i++) {
                    var node = nodes[i];
                    this.tree.expandPath(node);
                }


                //第一个节点选中并滚动到视图
                var firstNode = nodes[0];
                if (firstNode) {
                    // this.tree.selectNode(firstNode);
                    this.tree.scrollIntoView(firstNode);
                }
            }else{

            }

        }
    },
    setData: function (data, callback) {
        var _this = this;
        this._Callback = callback;
        this.value = data.value;
    },
    getData: function () {
        var rows = this.selectedListBox.getData();
        $.each(rows, function (i, o) {
            o['no'] = o.id;
            o['name'] = o.text;
        });
        return rows;
    }
});
mini.regClass(OrgSelectWindow, "orgselectwindow");


/** 项目选择器 */
ProSelectWindow = function (options) {
    ProSelectWindow.superclass.constructor.call(this);

    this.set({
        width:'850',
        height:'70%'
    });
    var zsId = '0001K310000000000ABV';
    var mqId = '0001K310000000000F91';
    options.type = options.type||1;
    options.companyId = options.type==1?zsId:(options.type==2?mqId:zsId); //默认搜索装饰
    options.zsId=zsId;
    options.mqId=mqId;

    this.set(options);
    this.initControls();
    this.initEvents();
    this.show();    //显示弹窗
};
mini.extend(ProSelectWindow, mini.Window, {
    keyField: "keyWord",
    multiSelect: false,
    targetWindow: window,
    title: "选择项目",
    showMaxButton: true,
    width: 850,
    height: 650,
    bodyStyle: "padding:0;",
    allowResize: true,
    showModal: true,
    showToolbar: true,
    showFooter: true,
    selectedItems: [],
    initControls: function () {
        var _this = this;
        var footerEl = this.getFooterEl();
        var bodyEl = this.getBodyEl();

        //footer
        var footerHtml =
            '<div style="padding:8px;text-align:center;">'
            + '<a name="okBtn" class="mini-button" style="width:60px;">确定</a>'
            + '<span style="display:inline-block;width:25px;"></span>'
            + '<a name="cancelBtn" class="mini-button" style="width:60px;">取消</a>'
            + '</div>';
        jQuery(footerEl).append(footerHtml);

        /////////////////////////////////////////////////////
        // var fitLay = new mini.Fit();
        var lay = new mini.Layout();
        lay.setWidth('100%');
        lay.setHeight('100%');
        lay.set({
            borderStyle:'border:none'
        });
        lay.setRegions([
            {region:'center', style:'border:none;',showHeader:false,
                headerStyle:'height:36px;line-height:36px;background:#EAEEF4;border-bottom:#D5DDE9 1px solid',
                title:'组织架构', showSplit:false, showSplitIcon:false,width:200, showCollapseButton:false, splitSize:0},
            {region:'north', style:'border-width:0; border-left-width:1px;', showHeader:false, showSplit:false, showSplitIcon:false,height:60, showCollapseButton:false, splitSize:0 }
        ]);
        //body
        this.grid = new mini.DataGrid();
        this.grid.set({
            url:privilegeBasePath + '/common/ajaxListProject.jhtml',
            ajaxOptions:{dataType:"jsonp",jsonp:"jsoncallback",jsonpCallback:"jsoncallback"},
            multiSelect: this.multiSelect,
            style: "width: 100%;height: 100%;",
            borderStyle: "border:0",
            dataField:"rows",
            pageIndexField:"page",
            pageSize:15,
            showEmptyText:true,
            emptyText:'当前暂无数据',
            pageSizeField:"rows",
            sizeList:[15,25,35,50],
            allowAlternating:true,
            allowUnselect:true,
            allowRowSelect:true,
            columns: [
                { type: "checkcolumn", header: "" },
                {header: "项目编码", field: "code",width:'80' },
                {header: "项目名称", field: "name" },
                {header: "项目负责人", field: "email" },
                {header: "项目经理", field: "proManName" },
                {header: "所属部门", field: "itemLine" }
            ],
            onLoad:function(e){
                // _this.grid.select({id:_this.value,name:_this.text});
            }
        });
        this.grid.load({companyId: this.companyId, sessionId:this.sessionId});

        var searchBoxHtml =
            '<div class="search-box" style="margin:auto;border:none" >'
            + '<form onsubmit="return false">'
            + '<div name="searchPanel" class="container-fluid" style="width:100%;height:44px;padding: 0;" handlerSize="0" allowResize="false" >'
            + '<div style="border:none;" showCollapseButton="false">'
            + '<div class="row s-form-items">'

            + ((this.type!=1&&this.type!=2)?('<div class="col-sm-2">'
            + '<a name="zsBtn" value="'+this.zsId+'" checkOnClick="true" groupName="search" class="mini-button">装饰</a>'
            + '<a name="mqBtn" value="'+this.mqId+'" checkOnClick="true" groupName="search" class="mini-button">幕墙</a>'
            + '</div>'):'')

            + '<div class="col-sm-5">'
            + '<div class="search-item" style="height:28px">'
            + '<input  labelField="true" label="项目编码/名称" class="mini-textbox" emptyText="请输入项目编码/项目名称" style="width:100%" name="keyText" />'
            + '</div>'
            + '</div>'
            + '<div class="col-sm-3">'
            + '<div class="s-btn-group">'
            + '<a name="searchBtn" class="mini-button" iconCls="fa fa-search" style="margin-right: 10px;">查询</a>'
            + '<a name="doResetBtn" class="mini-button" iconCls="fa fa-rotate-left">重置</a>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</form>'
            + '</div>';

        this.grid .render(lay.getRegionBodyEl('center'));

        jQuery(lay.getRegionBodyEl('north')).append(searchBoxHtml);
        lay.render(bodyEl);
        //组件对象
        mini.parse(this.el);
        this._okBtn = mini.getbyName("okBtn", this);
        this._cancelBtn = mini.getbyName("cancelBtn", this);
        this._searchBtn = mini.getbyName("searchBtn", this);
        this._doResetBtn = mini.getbyName("doResetBtn", this);
        this._keyText = mini.getbyName("keyText", this);
        this._zsBtn = mini.getbyName("zsBtn", this);
        this._mqBtn = mini.getbyName("mqBtn", this);
        _this.setData({value:_this.value, text:_this.text}, _this.success);
    },
    initEvents: function () {
        (this.type!=1&&this.type!=2)&&((this.companyId == this.zsId) ? this._zsBtn.addCls('mini-button-checked') : this._mqBtn.addCls('mini-button-checked'));

        this._zsBtn&&this._zsBtn.on("click", function (e) {
            this.grid.load({companyId:this._zsBtn.value});
            this.companyId = this._zsBtn.value;
        }, this);
        this._mqBtn&&this._mqBtn.on("click", function (e) {
            this.grid.load({companyId:this._mqBtn.value});
            this.companyId = this._mqBtn.value;
        }, this);
        this._searchBtn&&this._searchBtn.on("click", function (e) {
            var key = this._keyText.getValue();
            var id = this.companyId;
            this.search(key, id);
        }, this);
        this._keyText&&this._keyText.on("enter", function (e) {
            var key = this._keyText.getValue();
            this.search(key);
        }, this);

        /////////////////////////////////////
        this._okBtn.on("click", function (e) {
            var ret = true;
            if (this._Callback) ret = this._Callback('ok');
            if (ret !== false) {
                this.hide();
            }
        }, this);
        this._cancelBtn.on("click", function (e) {
            var ret = true;
            if (this._Callback) ret = this._Callback('cancel');
            if (ret !== false) {
                this.hide();
            }
        }, this);
        this._doResetBtn&&this._doResetBtn.on("click",function (e) {
            this._keyText.setValue('');
            this._keyText.setText('');
            this.search('');
        }, this);
        this.on("beforebuttonclick", function (e) {
            if (e.name == "close") {
                e.cancel = true;
                var ret = true;
                if (this._Callback) ret = this._Callback('close');
                if (ret !== false) {
                    this.hide();
                }
            }
        }, this);
    },
    search: function (key, cpnid) {
        var args = {};
        args.companyId = cpnid;
        args[this.keyField] = key;
        this.grid.load(args);
    },
    setData: function (data, callback) {
        this._Callback = callback;
    },
    getData: function () {
        var rows = this.grid.getSelected ();
        return rows;
    }
});
mini.regClass(ProSelectWindow, "proselectwindow");


/** 文件上传及数据导入 */
UploadWindow = function (options) {
    UploadWindow.superclass.constructor.call(this);
    // 设置默认值
    options = options?options:{};
    options.type = options.type || 1; // type:   1:文件上传   2:数据导入
    options.multiSelect = (options.type==2) ? false : (undefined!=options.multiSelect && options.multiSelect) ? true : false; // 设置默认单选，如果是数据导入则只能单选
    options.title = options.title||(options.type==2?"数据导入":"文件上传");

    options.maxFileSize = options.maxFileSize ? options.maxFileSize:'50mb';// 默认50M

    if(options.type == 2 && !options.uploadPath){
        showErrTips("请添加数据导入属性【uploadPath】");
        return;
    }
    options.uploadPath = options.type ==2 ? options.uploadPath:options.uploadPath ? options.uploadPath : (privilegeBasePath+"/file/uploadFile");


    options.templateName= options.templateName || "";
    options.templateRemark= options.templateRemark || "";

    options.mimeTypes = options.type ==2?"xls,xlsx":(options.mimeTypes||"jpg,gif,png,xls,xlsx,doc,docx,zip,rar,ppt,pptx,pdf,txt");

    if(options.type == 2 && !options.templateUrl){
        showWarnTips("下载模板地址不能为空！");
    }

    this.set({
        width:options.type==2?520:520,
        height:options.type==2 ? 300 : options.multiSelect?350:300,
        title:options.title
    });

    this.set(options);    //设置参数配置对象
    this.initControls();  //初始化控件
    this.initEvents();    //初始化事件
    this.show();          //显示控件
};
mini.extend(UploadWindow, mini.Window, {
    targetWindow: window,
    showMaxButton: true,
    bodyStyle: "padding:20px;",
    allowResize: true,
    showModal: true,
    showFooter: true,
    initControls: function () {
        var _this = this;
        var footerEl = this.getFooterEl();  //获取底部DOM对象
        var bodyEl = this.getBodyEl();  //获取内容区对象

        //body
        var style = '';
        // debugger;
        if(_this.multiSelect){
            style='style="padding:20px 0 0 5px"';
        }else {
            style='style="padding:20px 0 0 125px "';
        }
        var bodyHtml = '<div style="font-size:14px;">';
        bodyHtml+='<div style="color:#1A3050;line-height:1.7;">'+_this.templateRemark+'<br/>';
        bodyHtml+= _this.templateUrl?'<a href="'+_this.templateUrl+'" style="text-decoration:none;color:#007AFF">下载&nbsp;'+_this.templateName+'&nbsp;Excel模版</a>':'';
        bodyHtml+='</div>';
        bodyHtml += '<div style="text-align:center;margin-top:25px;position: relative;">' +
            '<a class="mini-button" name="jsUploadFiles" iconCls="fa fa-cloud-upload">选择文件</a>' +
            '<ul class="f-list" '+style+'></ul></div>';
        bodyHtml += '<div></div></div>';

        jQuery(bodyEl).append(bodyHtml);

        var btnText = _this.type == 2?"开始导入":"开始上传";
        //footer
        var footerHtml =
            '<div style="padding:8px;text-align:center;">'
            + '<a name="okBtn" class="mini-button" >'+btnText+'</a>'
            + '<span style="display:inline-block;width:25px;"></span>'
            + '<a name="cancelBtn" class="mini-button" style="width:60px;">取消</a>'
            + '</div>';
        jQuery(footerEl).append(footerHtml);

        //组件对象
        mini.parse(this.el);
        this._okBtn = mini.getbyName("okBtn", this);  	//根据name获取单个控件
        this._cancelBtn = mini.getbyName("cancelBtn", this);
        this._uploadBtn = mini.getbyName("jsUploadFiles", this);

        _this.setData({}, _this.success);
    },
    initEvents: function () {
        var _this = this;
        this._okBtn.on("click", function (e) {
            if(_this.uploader.files.length <=0){
                showErrTips('请选择文件！');
                return;
            }
            this.uploader.start();  //开始上传
        }, this);
        this._cancelBtn.on("click", function (e) {
            var ret = true;
            if (this._Callback) ret = this._Callback('cancel');
            if (ret !== false) {
                this.hide();
            }
        }, this);

        this.uploader = new plupload.Uploader({  //实例化一个plupload对象
            runtimes : 'html5,html4,flash,silverlight', //用来指定上传方式
            browse_button : this._uploadBtn.getEl(), // 触发文件选择对话框的按钮
            url : this.uploadPath,  //服务器端接收和处理上传文件的脚本地址
            multi_selection: _this.multiSelect,  //是否可以在文件浏览对话框中选择多个文件
            filters : {  //该参数来限制上传文件的类型
                max_file_size : _this.maxFileSize,  //用来限定上传文件的大小
                mime_types: [          //限定上传文件的类型
                    {title : "files", extensions : _this.mimeTypes}
                ],
                prevent_duplicates : true //不允许选取重复文件
            },
            init: {
                FilesAdded: function(up, files) {
                    if(!_this.multiSelect){
                        plupload.each(up.files,function (file) {
                            if(file.id != files[0].id){
                                _this.uploader.removeFile(file);
                            }
                        });
                    }

                    var addBtn = up._options.browse_button[0];
                    plupload.each(files, function(file) {
                        if(_this.type==2){
                            //替换已经添加的文件
                            $(addBtn).siblings("ul.f-list").empty();
                            $(addBtn).siblings("ul.f-list").append(baseUtils.fileListView.genFileItemHtml({name:file.name, size:file.size, uid:file.uid}, true));
                        }else if(_this.type==1 && _this.multiSelect==false) {
                            $(addBtn).siblings("ul.f-list").empty();
                            $(addBtn).siblings("ul.f-list").append(baseUtils.fileListView.genFileItemHtml({name:file.name, size:file.size, uid:file.uid}, true));
                        }else if(_this.type==1 && _this.multiSelect==true){
                            $(addBtn).siblings("ul.f-list").append(baseUtils.fileListView.genFileItemHtml({name:file.name, size:file.size, uid:file.uid}, true));
                        }
                        _this.uploader.addFile(file);
                    });
                },
                UploadProgress: function(up, file) {
                    _this.type==2?mask('正在导入...'):mask('正在上传...');  //遮罩
                },
                // 选择文件错误后
                Error: function(up, err) {
                    if(err.code==-600){
                        showErrTips("请选择以"+_this.maxFileSize+"下的文件！")
                    }
                    unmask();  //取消遮罩
                },
                // 每个文件上传后触发
                FileUploaded:function (uploader,file,responseObject) {
                    var responseDatas = responseObject.response;
                    try{
                        responseDatas = JSON.parse(responseDatas);
                        responseDatas.name = file.name;
                        responseDatas.size = file.size;
                        responseDatas.path = !responseDatas.path?responseDatas.responseMsg?responseDatas.responseMsg:'':responseDatas.path;
                        responseDatas.type = file.name.replace(/.+\./, "");
                        !_this.responseDatas?(_this.responseDatas=[],_this.responseDatas.push(responseDatas)):_this.responseDatas.push(responseDatas);
                    }catch(e){
                        showErrTips("JSON转换异常！");
                    }
                },
                // 所有文件上传完成后
                UploadComplete:function (uploader,files) {
                    unmask();
                    var ret = true;
                    if (_this._Callback) ret = _this._Callback('ok');
                    if (ret !== false) {
                        _this.hide();
                    }
                    // _this.type=='2'?showSucTips('导入成功！'):showSucTips('上传成功！');
                }
            }
        });
        this.uploader.init();


        $(document).on('click', '.f-delete', function (e) {
            var uid = $(this).closest('li').attr('uid');
            var file = _this.uploader.getFile(uid);
            _this.uploader.removeFile(file);
        });
    },
    setUrl: function (value) {

    },
    setData: function (data, callback) {
        this._Callback = callback;
    },
    getData: function () {
        return this.responseDatas;
    }
});
mini.regClass(UploadWindow, "uploadwindow");


/** 文件上传组件 */
mini.YsFileUpload = function () {
    mini.YsFileUpload.superclass.constructor.apply(this, arguments);
    this.initControls();
}
mini.extend(mini.YsFileUpload, mini.Button, {
    uiCls: "ys-fileupload",
    iconCls:'fa fa-upload',
    // id:'',
    text:'附件上传',
    initControls: function () {
        var _this = this;

        setTimeout(function () {
            jQuery(_this.el).after('<ul class="f-list"></ul>');
            _this.initEvents(_this);
        }, 500);
    },
    initEvents: function (options) {
        var _this=this;
        options.mimeTypes = options.mimeTypes||'jpg,gif,png,xls,xlsx,doc,docx,zip,rar,ppt,pptx,pdf,txt';
        options.url = options.url|| privilegeBasePath + '/file/pluploadUpload';
        options.maxFileSize = options.maxFileSize||'100mb';
        options.chunkSize = options.chunkSize||'1024kb';
        options.multiSelection = options.multiSelection!=undefined?options.multiSelection:true;

        if(options.fileList){
            $.each(options.fileList, function (i, file) {
                $(_this.el).siblings("ul.f-list").append(baseUtils.fileListView.genFileItemHtml({id:file.id, name:file.name, url:file.url, size:file.size, uid:file.uid}, options.enabled!=undefined?options.enabled?true:false:true));
            });
        }
        $(_this.el).find('.mini-button-text').text(options.text);
        if(this.uploader || !this.enabled){
            return;
        }
        this.uploader = new plupload.Uploader({
            runtimes : 'html5,flash,silverlight,html4',
            browse_button : _this.el, // you can pass an id...
            url :options.url,
            multi_selection:options.multiSelection,
            chunk_size:options.chunkSize,
            filters : {
                max_file_size :options.maxFileSize,
                mime_types: [
                    {title : "files", extensions : options.mimeTypes}
                ]
            },
            init: {
                FilesAdded: function(up, files) {
                    var addBtn = up._options.browse_button[0];
                    if(!options.multiSelection){
                        // _this.uploader.splice(0, _this.uploader.files.length);
                        $(addBtn).siblings("ul.f-list").empty();
                    }
                    _this.uploader.start();
                    $(addBtn).after('<div class="upload-progress"><div></div><i></i></div>');
                },
                FileUploaded:function (uploader,file,responseObject) {
                    try{
                        var addBtn = uploader._options.browse_button[0];
                        var responseDatas = JSON.parse(responseObject.response);
                        var url = responseDatas.responseMsg;
                        var fileObj = {name:file.name, size:file.size, uid:file.uid, url:url};
                        $(addBtn).siblings("ul.f-list").append(baseUtils.fileListView.genFileItemHtml(fileObj, true));
                        _this.fileList=_this.getData();
                    }catch(e){
                        showErrTips("JSON转换异常！");
                    }
                },
                UploadProgress: function(up, file) {
                    var addBtn = up._options.browse_button[0];
                    $(addBtn).siblings('.upload-progress').find('i').text('正在上传（'+file.percent + '%）');
                    $(addBtn).siblings('.upload-progress').find('div').css('width', file.percent + '%');
                },
                UploadComplete:function (up,files){
                    var addBtn = up._options.browse_button[0];

                    $(addBtn).siblings('.upload-progress').remove();
                },
                Error: function(up, err) {
                    showErrTips("\nError #" + err.code + ": " + err.message);
                }
            }
        });
        this.uploader.init();
        $(document).on('click', '.f-delete', function (e) {
            _this.fileList=_this.getData();
        });
    },
    setData:function(files){
        var _this=this;
        if(files){
            $.each(files, function (i, file) {
                $(_this.el).siblings("ul.f-list").append(baseUtils.fileListView.genFileItemHtml({id:file.id, name:file.name, url:file.url, size:file.size, uid:file.uid}, this.enabled!=undefined?this.enabled?true:false:true));
            });
        }
    },
    getData: function () {
        var files = jQuery(this.el).siblings('ul.f-list').find('li');
        var fileArr = [];
        if(files && files.size() > 0){
            files.each(function (i, o) {
                var obj = $(o);
                var fileName = obj.attr('fileName'), fileUrl = obj.attr('fileUrl'), fileSize = obj.attr('fileSize');

                var dataObj = {name:fileName, url:fileUrl, size:fileSize};
                obj.attr('id')?dataObj.id=id:null;
                fileArr.push(dataObj);
            });
        }
        return fileArr;
    }
});
mini.regClass(mini.YsFileUpload, "ys-fileupload");


