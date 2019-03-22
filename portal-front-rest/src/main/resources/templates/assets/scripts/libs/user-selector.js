/**
    标准模板：弹出选择面板
    注意，只需要修改搜索框和mini.DataGrid相关的列配置信息即可。
    人员选择器组件
*/
/** ===================================================================人员选择器      */
mini.ux.UserSelector = function (o) {
    mini.ux.UserSelector.superclass.constructor.call(this);
    var obj = {};
    if(o.attributes){
        $.each(o.attributes, function (i, o) {
            if(o.nodeName!='class'){
                obj[o.nodeName] = o.value;
            }
            if(o.nodeName == 'required'){
                obj[o.nodeName] = (o.value =="true");
            }
            if(o.nodeName =='allowinput'){
                obj['allowInput'] = o.value=='true';
            }
            if(o.nodeName =='enabled'){
                obj['enabled'] = o.value=='true';
            }
        });
        obj['o'] = o;
    }
    this.initControls(obj);
}

mini.extend(mini.ux.UserSelector, mini.ButtonEdit, {
    o:null,
    keyField: "key",
    emptyText:'请选择...',
    uiCls: "mini-userSelector",
    initControls: function (obj) {
        this.set(obj);
        var _this = this;
        this.addCls('selectorbox');
        var el = this.getEl();
        _this.setValue(this.value);
        _this.setText(this.text);
        this.on('buttonclick', function (e) {
            var win = new UserSelectWindow({
                multiSelect:_this.multiselect=="true",
                values:_this.value, // string   aaaaa,bbbbb,ccccc
                texts:_this.text,   // string   AAAAA,BBBBB,CCCCC
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

            // win.setData({value:_this.value, text:_this.text}, function (action) {
            //     if (action == "ok") {
            //         //获取数据
            //         var rows = win.getData();
            //
            //         if (rows) {
            //             var texts = [], values = [];
            //             for (var i =0; i< rows.length; i++){
            //                 texts.push(rows[i].name);
            //                 values.push(rows[i].no);
            //             }
            //             _this.setValue(values.join(','));
            //             _this.setText(texts.join(','));
            //         }
            //     }
            // });
        });
        mini.parse(el);
        this.render(this.o);
    }
});

mini.regClass(mini.ux.UserSelector, "mini-userSelector");




/** ===================================================================组织选择器      */
mini.ux.OrgSelector = function (o) {
    mini.ux.UserSelector.superclass.constructor.call(this);
    if(o.attributes){
        var obj = {};
        $.each(o.attributes, function (i, o) {
            if(o.nodeName!='class'){
                obj[o.nodeName] = o.value;
            }
            if(o.nodeName == 'required'){
                obj[o.nodeName] = (o.value =="true");
            }
            if(o.nodeName =='allowinput'){
                obj['allowInput'] = o.value=='true';
            }
            if(o.nodeName =='enabled'){
                obj['enabled'] = o.value=='true';
            }
            if(o.nodeName =='orgtype'){
                obj['orgType'] = o.value;
            }
        });

        this.set(obj);
    }
    this.set({
        o:o
    });
    this.initControls();
}

mini.extend(mini.ux.OrgSelector, mini.ButtonEdit, {
    o:null,
    keyField: "key",
    emptyText:'请选择...',
    uiCls: "mini-userSelector",
    initControls: function () {
        var _this = this;
        this.addCls('selectorbox');
        var el = this.getEl();

        _this.setValue(this.value);
        _this.setText(this.text);
        this.on('buttonclick', function (e) {
            var win = new OrgSelectWindow({
                multiSelect:_this.multiselect=="true",
                currentData:'',
                values:_this.value,
                texts:_this.text,
                orgType:_this.orgType,     // 1组织选择器，2公司选择器，3部门选择器
                // excludes:"1001K310000000027X08,1001K310000000027A0J",
                excludes:_this.excludes,
                onlyIncludes:"",
                success:function(action){
                    if (action == "ok") {
                        //获取数据
                        var rows = this.getData();
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
        });
        mini.parse(el);
        this.render(this.o);
    }
});

mini.regClass(mini.ux.OrgSelector, "mini-orgSelector");

setTimeout(function () {
    $('.mini-userSelector').each(function (i, o) {
        new mini.ux.UserSelector(o);
    });
    $('.mini-orgSelector').each(function (i, o) {
        new mini.ux.OrgSelector(o);
    });
    $('.mini-area').each(function (i, o) {
        new AreaSelector(o);
    });
    $('.mini-proSelector').each(function (i, o) {
        new ProSelectWindow(o);
    });
});
