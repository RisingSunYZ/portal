ProSelectWindow = function (options) {
    ProSelectWindow.superclass.constructor.call(this);

    this.set({
        width:'850',
        height:'70%'
    });
    this.set(options);
    this.initControls();
    this.initEvents();
    this.show();    //显示弹窗
    this.search('','0001K310000000000ABV'); //默认搜索装饰
};
mini.extend(ProSelectWindow, mini.Window, {
    keyField: "keyWord",
    companyId: "0001K310000000000ABV", //默认搜索装饰
    multiSelect: true,
    targetWindow: window,
    title: "选择项目",
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
        lay.setRegions([
            {region:'center', style:'border:none;',showHeader:false,
                headerStyle:'height:36px;line-height:36px;background:#EAEEF4;border-bottom:#D5DDE9 1px solid',
                title:'组织架构', showSplit:false, showSplitIcon:false,width:200, showCollapseButton:false, splitSize:0},
            {region:'north', style:'border-width:0; border-left-width:1px;', showHeader:false, showSplit:false, showSplitIcon:false,height:60, showCollapseButton:false, splitSize:0 }
        ]);
        //lay.regions({});
        //body
        this.grid = new mini.DataGrid();
        this.grid.set({
            url:'http://hometest.chinayasha.com/common/ajaxListProject.jhtml',
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
                { type: "checkcolumn", header: "#" },
                {header: "项目编码", field: "code",width:'80' },
                {header: "项目名称", field: "name" },
                {header: "项目负责人", field: "email" },
                {header: "项目经理", field: "proManName" },
                {header: "所属部门", field: "itemLine" }
            ],
            onLoad:function(e){
                _this.grid.select({id:_this.value,name:_this.text});
            },
            onSelect:function (e) {

            },
            onDeSelect:function (e) {

            }
        });
        this.grid.load({companyId: '0001K310000000000ABV'});

        var searchBoxHtml =
            '<div class="search-box" style="margin:auto;border:none" >'
            + '<form onsubmit="return false">'
            + '<div name="searchPanel" class="container-fluid" style="width:100%;height:44px;padding: 0;" handlerSize="0" allowResize="false" >'
            + '<div style="border:none;" showCollapseButton="false">'
            + '<div class="row s-form-items">'
                + '<div class="col-sm-2">'
                    + '<a name="zsBtn" value="0001K310000000000ABV" checkOnClick="true" groupName="search" class="mini-button">装饰</a>'
                    + '<a name="mqBtn" value="0001K310000000000F91" checkOnClick="true" groupName="search" class="mini-button">幕墙</a>'
                + '</div>'
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
        this._zsBtn.on("click", function (e) {
            this._zsBtn.addCls('mini-btn-selected');
            this._mqBtn.removeCls('mini-btn-selected');
            this.grid.load({companyId:this._zsBtn.value});
            this.companyId = this._zsBtn.value;
        }, this);
        this._mqBtn.on("click", function (e) {
            this._mqBtn.addCls('mini-btn-selected');
            this._zsBtn.removeCls('mini-btn-selected');
            this.grid.load({companyId:this._mqBtn.value});
            this.companyId = this._mqBtn.value;
        }, this);
        this._searchBtn.on("click", function (e) {
            var key = this._keyText.getValue();
            var id = this.companyId;
            this.search(key, id);
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
        this._doResetBtn.on("click",function (e) {
            this._keyText.setValue('');
            this._keyText.setText('');
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