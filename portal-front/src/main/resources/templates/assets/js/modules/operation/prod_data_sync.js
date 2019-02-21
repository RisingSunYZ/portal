
var ProdDataSync = {
    index:{
        init:function () {
            mini.parse();

            this.loadSourceEvents();
            this.loadTargetEvents();

            this.bindEvents();
            mini.get('lookupCustCateTarget').hide();
        },

        // 加载源数据
        loadSourceEvents:function () {
            // 自定义流程，表单源数据
            this.custSourceGrid = mini.get("custSourceGrid");
            this.custSourceKeyText = mini.get("custSourceKeyText");
            this.custSourceGrid.on('preload', function (e) {
                for(var i = 0; i<e.data.length; i++){
                    e.data[i]['showText'] = e.data[i].title + "-【" + e.data[i].code + "】";
                }
            });
            this.custSourceGrid.load();


            // 业务表单源数据
            this.bizSourceGrid = mini.get("bizSourceGrid");
            this.bizSourceKeyText = mini.get("bizSourceKeyText");
            this.bizSourceGrid.on('preload', function (e) {
                for(var i = 0; i<e.data.length; i++){
                    e.data[i]['showText'] = e.data[i].modelName + "-【" + e.data[i].modelKey + "】";
                }
            });
            this.bizSourceGrid.load();



        },

        // 加载目标数据
        loadTargetEvents:function () {
            // 自定义流程，表单目标数据
            this.custTargetGrid = mini.get("custTargetGrid");
            this.custTargetKeyText = mini.get("custTargetKeyText");
            this.custTargetCateKeyText = mini.get("custTargetCateKeyText");
            this.custTargetCateGrid = mini.get("custTargetCateGrid");
            this.custTargetGrid.on('preload', function (e) {
                for(var i = 0; i<e.data.length; i++){
                    e.data[i]['showText'] = e.data[i].title + "-【" + e.data[i].code + "】";
                }
            });
            this.custTargetGrid.load();


            // 类型筛选
            mini.get('jsDoSearchCustCateTarget').on('click', function (e) {
                this.custTargetCateGrid.load({
                    keyword: this.custTargetCateKeyText.value
                });
            }, this);


        },

        bindEvents:function () {
            mini.get('jsDoSearchCustSource').on('click', function () {
                this.custSourceGrid.load({
                    keyWord: this.custSourceKeyText.value
                });
            }, this);

            mini.get('jsDoSearchCustTarget').on('click', function () {
                this.custTargetGrid.load({
                    keyWord: this.custTargetKeyText.value
                });
            }, this);

            mini.get('lookupCustSource').on('valuechanged', function(e){
                mask('正在加载...');
                var selected = e.sender.grid.getSelected();
                var formName = selected.title, cateCode = selected.categoryId;
                mini.get('lookupCustSource').hidePopup();
                mini.get('lookupCustTarget').grid.load({keyWord:formName});
                mini.get('custTargetKeyText').setValue(formName);
                setTimeout(function () {
                    unmask();
                    var datas = mini.get('lookupCustTarget').grid.getData();
                    // 根据名称查询目标是否存在
                    if(datas.length > 0){ // 如果存在

                        mini.get('lookupCustCateTarget').hide();
                        mini.get('lookupCustTarget').show();
                        var data = datas[0];
                        mini.get('lookupCustTarget').grid.select(data);
                        mini.get('lookupCustTarget').set({value:data.code, text:data.showText});
                        mini.get('jsCustFormDataSyncType').setValue('1');
                        mini.get('lookupCustTarget').showPopup();
                    }else{  // 否则提示用户创建

                        mini.get('lookupCustTarget').hide();
                        mini.get('lookupCustCateTarget').show();
                        // 获取当前数据的类型，默认选中目标类型
                        mini.get('jsCustFormDataSyncType').setValue('2');
                        mini.get('lookupCustTarget').set({value:'', text:''});
                        mini.get('custTargetKeyText').setValue('');
                        mini.get('lookupCustTarget').grid.load({keyWord:''});

                        var selectedNodes = mini.get('lookupCustCateTarget').grid.findNodes(function (node) {
                            if(node.code == cateCode) return true;
                        });
                        if(selectedNodes){
                            setTimeout(function () {
                                mini.get('lookupCustCateTarget').grid.expandPath(selectedNodes[0]);
                                mini.get('lookupCustCateTarget').grid.scrollIntoView(selectedNodes[0]);
                                mini.get('lookupCustCateTarget').grid.selectNode(selectedNodes[0]);
                                mini.get('lookupCustCateTarget').set({value:selectedNodes[0].code, text:selectedNodes[0].name});
                            }, 300);
                        }
                        mini.get('lookupCustCateTarget').showPopup();
                    }
                }, 500);



                console.log(e.value);
                mini.get('lookupCustTarget')
                // 默认将此值赋值给目标搜索框
                // 改变更新方式

            }, this);


            // 更改自定义表单更新方式
            mini.get('jsCustFormDataSyncType').on('valuechanged', function (e) {
                if(e.value == '2'){
                    // 创建新数据
                    mini.get('lookupCustCateTarget').show();
                    mini.get('lookupCustTarget').hide();
                }else if(e.value == '1'){
                    // 覆盖已有数据
                    mini.get('lookupCustCateTarget').hide();
                    mini.get('lookupCustTarget').show();
                }
            }, this);


            this.custSourceKeyText.on('enter', function () {
                this.custSourceGrid.load({
                    keyWord: this.custSourceKeyText.value
                });
            }, this);
            this.custTargetKeyText.on('enter', function () {
                this.custTargetGrid.load({
                    keyWord: this.custTargetKeyText.value
                });
            }, this);
            mini.get('jsDoClearCustBoxSource').on('click', function () {
                this.custSourceKeyText.setValue('');
                this.custSourceGrid.load({
                    keyWord: this.custSourceKeyText.value
                });
            }, this);
            mini.get('jsDoClearCustBoxTarget').on('click', function () {
                this.custTargetKeyText.setValue('');
                this.custTargetGrid.load({
                    keyWord: this.custTargetKeyText.value
                });
            }, this);

            // 开始拷贝-自定义表单
            mini.get('doCopyCustBtn').on('click', function () {
                var fm = new mini.Form("#jsCustForm");
                fm.validate();
                if(!fm.isValid()){
                    return;
                }
                var type = mini.get('jsCustFormDataSyncType').getValue();
                var targetKey = '', categoryId = '', categoryName = '';
                if(type == '1'){    // 覆盖
                    var modelKeyValue = mini.get('lookupCustTarget');
                    targetKey = modelKeyValue.getValue();

                }else if(type == '2'){ // 创建
                    var cateValue = mini.get('lookupCustCateTarget');
                    categoryId = cateValue.getValue();
                    categoryName = cateValue.getText();

                }

                var selectedSourceRow = mini.get('lookupCustSource').grid.getSelected();
                var data = {
                    sourceKey:$.trim(selectedSourceRow.code),
                    targetKey:targetKey,
                    categoryId:categoryId,
                    copyRange:fm.getData().copyRange
                };

                var copyMsg = type == '1'
                    ?('确定要将<span>【'+selectedSourceRow.code+'】</span>覆盖<span>【'+targetKey+'】</span>吗？')
                    :('确定要将表单<span>【'+selectedSourceRow.code+'】</span>创建在<span>【'+categoryName+'】</span>分类下面吗？');

                showConfirm(copyMsg, function (act) {
                    mask("正在拷贝数据...");
                    var url = basePath + "/flow/operation/prodDataSync/doCopyCustFormData";
                    $.POST({
                        url:url,
                        data:data,
                        async:true,

                        success:function (dt) {
                            unmask();
                            if(dt.code == 100){
                                showSucTips(dt.msg);
                            }else{
                                showErrTips(dt.msg);
                            }
                        },error:function () {
                            showErrTips("网络异常，请稍后再试");
                            unmask();
                        }
                    });
                });

            }, this);

            mini.get('jsDoCloseCustSource').on('click', function () {
                var lookup = mini.get("lookupCustSource");
                lookup.hidePopup();
            }, this);
            mini.get('jsDoCloseCustTarget').on('click', function () {
                var lookup = mini.get("lookupCustTarget");
                lookup.hidePopup();
            }, this);

            this.bindEventsBiz()
        },

        bindEventsBiz:function () {
            mini.get('jsDoSearchBizSource').on('click', function () {
                this.bizSourceGrid.load({
                    keyWord: this.bizSourceKeyText.value
                });
            }, this);

            mini.get('lookupBizSource').on('valuechanged', function(e){

                // 查询目标数据库是否存在
                $.POST({
                    url:basePath + '/flow/operation/prodDataSync/ajaxTargetBizList',
                    data:{modelKey:$.trim(e.value)},
                    success:function(dt){
                        if(dt.total > 0){
                            mini.get('bizTargetKey').set({
                                value:e.value,
                                text:e.source.data[0].showText,
                                inputStyle:'color:#6D6D6D'
                            });
                            mini.get('bizTargetKey').setValue(e.value);
                            mini.get('bizTargetKey').setText(e.source.data[0].showText);
                        }else{
                            mini.get('bizTargetKey').set({
                                value:e.value,
                                // visible:false
                                text:'目标数据库未找到对应的表单',
                                inputStyle:'color:red;'
                            });
                        }
                    }
                })
            }, this);

            this.bizSourceKeyText.on('enter', function () {
                this.bizSourceGrid.load({
                    keyWord: this.bizSourceKeyText.value
                });
            }, this);
            mini.get('jsDoClearBizBoxSource').on('click', function () {
                this.bizSourceKeyText.setValue('');
                this.bizSourceGrid.load({
                    keyWord: this.bizSourceKeyText.value
                });
            }, this);

            // 开始拷贝- 业务表单
            mini.get('doCopyBizBtn').on('click', function () {
                var fm = new mini.Form("#jsBizForm");
                fm.validate();
                if(!fm.isValid()){
                    return;
                }
                var selectedSourceRow = mini.get('lookupBizSource').grid.getSelected();
                var targetValue = mini.get('bizTargetKey').getValue(0);
                var data = {
                    sourceKey:$.trim(selectedSourceRow.modelKey),
                    targetKey:$.trim(targetValue),
                    copyRange:fm.getData().copyRange
                };
                if(data.sourceKey != data.targetKey){
                    showErrTips("源表单编码与目标表单编码不匹配，无法拷贝!");
                    return;
                }
                showConfirm("数据拷贝不可逆，确定要拷贝吗？", function (act) {
                    mask("正在拷贝数据...");
                    var url = basePath + "/flow/operation/prodDataSync/doCopyBizFormData";
                    $.POST({
                        url:url,
                        data:data,
                        async:true,

                        success:function (dt) {
                            unmask();
                            if(dt.code == 100){
                                showSucTips(dt.msg);
                            }else{
                                showErrTips(dt.msg);
                            }
                        },error:function () {
                            showErrTips("网络异常，请稍后再试");
                            unmask();
                        }
                    });
                });

            }, this);

            mini.get('jsDoCloseBizSource').on('click', function () {
                var lookup = mini.get("lookupBizSource");
                lookup.hidePopup();
            }, this);
        },
        onClearClick:function (e) {
            var lookupCust = mini.get("lookupCustSource");
            lookupCust.deselectAll();
        }
    },
    // 列表页面
    list: {
        grid:null,
        searchForm:null,
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
                        text:'查看流程图',  // 操作按钮名称 【必需设置】
                        //pms:1,       // 权限值  【可选】   不设置则默认显示
                        iconCls:'view',     // 按钮图标 【可选】
                        click:function(e){    // 点击事件 【必需设置】，如果不设置则此按钮无意义
                            _this.openImg(e.record.processInstanceId);
                        },
                        filter:function(e){             // 过滤按钮 【可选】 显示/隐藏 返回ture才显示
                            var row = e.record;

                            return true;
                        }
                    },
                    {
                        text:'审批记录',  // 操作按钮名称 【必需设置】
                        //pms:1,       // 权限值  【可选】   不设置则默认显示
                        iconCls:'view',     // 按钮图标 【可选】
                        click:function(e){    // 点击事件 【必需设置】，如果不设置则此按钮无意义
                            _this.viewApproves(e.record.processInstanceId);
                        },
                        filter:function(e){             // 过滤按钮 【可选】 显示/隐藏 返回ture才显示
                            var row = e.record;

                            return true;
                        }
                    }
                ]
            };
            // 初始化表格操作按钮
            initOptions(options);
        },
        openImg:function(id) {
            var _this = this;
            var title = "流程图";
            var url = basePath + "/flow/operation/process_inst/viewImg?id="+id;
            // 【弹窗模式】 弹窗添加修改页面
            mini.open({
                url: url,
                allowResize: true,
                title: title,
                width: 1000, height: 700,
                onload: function () {
                },
                ondestroy: function (action) {
                    _this.grid.reload();
                }
            });
        },
        viewApproves:function(id) {
            var _this = this;
            var title = "审批记录";
            var url = basePath + "/flow/operation/process_inst/viewApproves?id="+id;

            // 【弹窗模式】 弹窗添加修改页面
            mini.open({
                url: url,
                allowResize: true,
                title: title,
                width: 600, height: 500,
                onload: function () {
                },
                ondestroy: function (action) {
                    _this.grid.reload();
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
                        var authFlowKeysButton=mini.get("processDefinitionKey");
                        if(rows.length){
                            authFlowKeysButton.setValue(rows[0].modelKey)
                        }
                    }
                }
            });
        },
        // 绑定事件
        bindEvents: function () {
            var _this = this;
            // 重置
            $('#doResetBtn').click(function () {
                _this.grid.reload();
            });
            // 添加
            $('#jsAdd').click(function () {
                var node = _this.tree.getSelectedNode();
                if(node){
                    _this.openIpt();
                }else{
                    showErrTips("请选择类型");
                }
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
                                var url = basePath + '/flow/operation/process_inst/dels';
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

        },
        doSearch:function(){
            var formData=this.searchForm.getData();
            if(!formData.processDefinitionKey){
                showErrTips("请先选择流程模板");
            }
            formData.startTime=mini.formatDate(formData.startTime,'yyyy-MM-dd');
            formData.endTime=mini.formatDate(formData.endTime,'yyyy-MM-dd');
            this.grid.load(formData);
        },

    },

};