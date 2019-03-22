/**
 标准模板：弹出选择面板
 注意，只需要修改搜索框和mini.DataGrid相关的列配置信息即可。
 人员选择器组件
 data-option="
    province:，默认选中的省编号,
    city:，默认选中的城市编号,
    area:默认选中的区域编号,
    address:地址默认值,
    areaLevel:province,city,area,address,选择器级别，通过这个字段显示选择器展示内容，
    url:异步获取数据连接地址，必填
    name:选择器name，如果有则成为省市区input的name的前缀，如：默认 province，provinceCode，city,cityCode,area,areaCode,address
                                                            name="area" areaProvince，areaProvinceCode，areaCity,areaCityCode,areaArea,areaAreaCode,areaAddress
    enabled:false表示禁用
 "
 */



AreaSelector = function (o) {
    AreaSelector.superclass.constructor.call(this);

    this.set({
        o:o
    });
    //解析data-options属性
    this.parseOptions();
    this.set({
        url:this.option.url ? this.option.url: "http://10.10.20.41:8080/common/getAreaChildren.do",
        enabled:typeof this.option.enabled!="undefined" ? this.option.enabled:true ,
    })
    this.initControls();
    this.initEvents();
    this.initEvents();
    this.initValue();
}

mini.extend(AreaSelector, mini.Control, {
    o:null,
    url: "",
    option:{},
    enabled:true,
    targetWindow: window,
    initControls: function () {
        var _this = this;
        var el = this.getEl();
        this.initProvince(el)
        if(!this.option.areaLevel
            || this.option.areaLevel=="city"
            ||this.option.areaLevel=="area"
            ||this.option.areaLevel=="address"){
            this.initCity(el)
        }
        if(!this.option.areaLevel
            || this.option.areaLevel=="area"
            ||this.option.areaLevel=="address"){
            this.initArea(el)
        }
        if(!this.option.areaLevel
            || this.option.areaLevel=="address"){
            this.initAddress(el);
        }
        /////////////////////////////////////////////////////

        //组件对象
        mini.parse(this.el);
        $(this.o).append(el);
    },
    initEvents: function () {
        var _this=this;
        this.provinceComb.on("valuechanged",function(e){
            $("input[name='"+_this.genName("province")+"']").val(e.selected.name);
           _this.cityComb && _this.cityComb.set({
                ajaxOptions:{dataType:"jsonp",jsonp:"callback",jsonpCallback:"callback"},
                url:_this.url+"?pcode="+e.value,
                enabled:true,
                value:"",
            });
            _this.areaComb && _this.areaComb.set({
                enabled:false,
                data:[],
                value:"",
            });
            $("input[name='"+_this.genName("city")+"'],input[name='"+_this.genName("area")+"']").val("");
        })
        this.cityComb && this.cityComb.on("valuechanged",function(e){
            $("input[name='"+_this.genName("city")+"']").val(e.selected.name);
           _this.areaComb && _this.areaComb.set({
                ajaxOptions:{dataType:"jsonp",jsonp:"callback",jsonpCallback:"callback"},
                url:_this.url+"?pcode="+e.value,
                enabled:true,
                value:"",
            });
            $("input[name='"+_this.genName("area")+"']").val("");
        })
        this.areaComb && this.areaComb.on("valuechanged",function(e){
            $("input[name='"+_this.genName("area")+"']").val(e.selected.name);
        })

    },
    initValue:function () {
        var _this=this;
        var temp=0;
        if(this.option.province){
            //设置interval为避免异步请求
            var intervalProvince = setInterval(function(){
                _this.provinceComb.set({value:_this.option.province});
                if(typeof _this.provinceComb.getSelected() =="undefined"){
                    _this.provinceComb.set({value:""});
                    temp++;
                    if(temp>40){
                        clearInterval(intervalProvince);
                    }
                    return;
                }
                clearInterval(intervalProvince);
                $("input[name='"+_this.genName("province")+"']").val(_this.provinceComb.getSelected().name);
                _this.cityComb && _this.cityComb.set({
                    ajaxOptions:{dataType:"jsonp"},
                    url:_this.url+"?pcode="+_this.option.province,
                    enabled:true,
                    value:"",
                });
                if(_this.option.city){
                    temp=0;
                    var intervalCity = setInterval(function(){
                        _this.cityComb.set({value:_this.option.city});
                        if(typeof _this.cityComb.getSelected() =="undefined"){
                            _this.cityComb.set({value:""});
                            temp++;
                            if(temp>30){
                                clearInterval(intervalCity);
                            }
                            return;
                        }
                        clearInterval(intervalCity);
                        $("input[name='"+_this.genName("city")+"']").val(_this.cityComb.getSelected().name);
                        _this.areaComb && _this.areaComb.set({
                            ajaxOptions:{ dataType:"jsonp"},
                            url:_this.url+"?pcode="+_this.option.city,
                            enabled:true,
                            value:"",
                        });
                        if(_this.option.area){
                            temp=0;
                            var intervalArea = setInterval(function(){
                                _this.areaComb.set({value:_this.option.area});
                                if(typeof _this.areaComb.getSelected() =="undefined"){
                                    _this.areaComb.set({value:""});
                                    temp++;
                                    if(temp>30){
                                        clearInterval(intervalProvince);
                                    }
                                    return;
                                }
                                clearInterval(intervalArea);
                                $("input[name='"+_this.genName("area")+"']").val(_this.areaComb.getSelected().name);
                                if(_this.option.address){
                                    _this.addrText.setValue(_this.option.address);
                                }
                            },10)
                        }
                    },10)
                }
            },10);




        }
    },
    initProvince:function(el){
        this.provinceComb = new mini.ComboBox();
        this.provinceComb.set({
            valueField: "code",
            textField: "name",
            ajaxOptions:{ dataType:"jsonp"},
            url:this.url,
            style:"margin-right:10px",
            name:this.genName("provinceCode")
        });
        this.provinceComb.render(el);
        $(this.o).append("<input name='"+this.genName("province")+"' type='hidden'/>");
    },
    initCity:function(el){
        this.cityComb = new mini.ComboBox();
        this.cityComb.set({
            valueField: "code",
            textField: "name",
            enabled:false,
            style:"margin-right:10px",
            name:this.genName("cityCode")
        });
        this.cityComb.render(el);
        $(this.o).append("<input name='"+this.genName("city")+"' type='hidden'/>");
    },
    initArea:function(el){
        this.areaComb = new mini.ComboBox();
        this.areaComb.set({
            valueField: "code",
            textField: "name",
            enabled:false,
            style:"margin-right:10px",
            name:this.genName("areaCode")
        });
        this.areaComb.render(el);
        $(this.o).append("<input name='"+this.genName("area")+"' type='hidden'/>");
    },
    initAddress:function(el){
        this.addrText= new mini.TextBox();
        this.addrText.render(el);
        this.addrText.set({
            name:this.genName("address"),
            inputStyle:"margin-right:10px;width:300px;",
            style:"width:300px;",
        });
    },
    genName:function(name){
        if(this.option.name){
            return this.option.name+name.slice(0,1).toUpperCase()+name.slice(1);
        }
        return name;
    },
    parseOptions:function () {
        if(this.o.dataset.options && this.o.dataset.options.length){
            try{
               this.option= eval("({"+this.o.dataset.options+"})");
            }catch (err){

            }
        }
    }
});

mini.regClass(AreaSelector, "mini-area");
