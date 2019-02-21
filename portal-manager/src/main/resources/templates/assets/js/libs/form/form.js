!function (a) {
    a.extend(YS.Widget.prototype, {
        getEditViewWithLabel: function (b, c, t, f) {
            var d = a('<li class="widget-view"/>').addClass("fui_" + t + " x-grid-col-" + f),
                e = a('<div class="fl-label"/>').append(a('<span class="label-title"/>').text(b)).appendTo(d),
                g = a('<span class="label-notnull"/>').text("*").prependTo(e),
                f = a('<div class="fl-description"/>').appendTo(e);
            this._addDescription(f, c);
            this.options.fieldIsnull && g.hide(), a('<div class="fl-widget"/>').append(this.element).appendTo(d);
            var h = a('<div class="form-widget-mask"/>').appendTo(d);
            this.options.fieldIsdel && h.append(a('<i class="icon-widget-delete"/>').attr("title", "删除"));
            //!this.options.fieldName && h.append(a('<i class="icon-widget-copy"/>').attr("title", "复制"));
            return d
        }, getConfigItems: function (a, b, c) {
            return [{
                label: "标题",
                widget: this._createTitleConfig(a),
                splitLine: !0
            }, {label: "描述信息", disabled: !b, widget: this._createDescriptionConfig(b), splitLine: !0}, {
                label: "校验",
                widget: this._createNotNullConfig(a),
                splitLine: !0
            }, {
                widget: this._createEnableConfig(),
                splitLine: !0
            }, this._createWidgetLayoutConfig(c)]
        }, _createTitleConfig: function (a) {
            var b = this.options;
            b.labelName = a.text();
            return {
                type: "text", text: a.text(), onAfterEdit: function () {
                    b.labelName = this.getValue(), a.text(this.getValue())
                }, onStopEdit: function () {
                    b.labelName = this.getValue(), a.text(this.getValue())
                }
            }
        }, _createDescriptionConfig: function (a) {
            var b = this;
            return {
                type: "richtext",
                width: 240,
                minHeight: 120,
                value: a ? a.data("description") : null,
                onAfterEdit: function () {
                    var c = this.getValue();
                    b.options.fieldContent = c, b._addDescription(a, c)
                }
            }
        }, _addDescription: function (a, b) {
            a.empty().data("description", b), YS.Utils.isEmpty(b) || "<br>" == b ? a.removeClass("separator") : (a.addClass("separator"), a.append(b))
        }, _createNotNullConfig: function (a) {
            var b = this.options;
            return {
                type: "checkbox", text: "必填", value: b.fieldIsnull === !1, onStateChange: function (c) {
                    b.fieldIsnull = !c, c ? a.next().show() : a.next().hide()
                }
            }
        }, _createVisibleConfig: function () {
            var a = this.options;
            return {
                type: "checkbox",
                text: "可见",
                value: a.fieldIsshow,
                fieldEnable: a.isShowEditable,
                onStateChange: function (b) {
                    a.fieldIsshow = b
                }
            }
        }, _createEnableConfig: function () {
            var a = this.options;
            return {
                type: "checkbox",
                text: "可编辑",
                value: a.fieldEnable,
                fieldId: "fieldEnable",
                onStateChange: function (b) {
                    a.fieldEnable = b
                }
            }
        }, _createIsSubmitConfig: function () {
            var a = this.options, c = this;
            return {
                type: "checkbox",
                text: "是否是提交者",
                value: a.fieldIssubmit,
                fieldId: "fieldIssubmit",
                onBeforeClick: function (b) {
                    var items = YS.EditForm.collectItems(), hasFieldIsSubmit;
                    var ele = YS.EditForm.getConfigPane().getWidgetByName("fieldIssubmit");
                    $.each(items, function (i, item) {
                        if (item.fieldId != a.fieldId && item.fieldIssubmit) {
                            hasFieldIsSubmit = true;
                            YS.UI.showPopover({
                                position: "bottomLeft",
                                type: "warning",
                                anchor: ele.element.find("span"),
                                content: $("<div />").css({"max-width": 200}).text(item.labelName + "已设为提交者!")
                            });
                            setTimeout(function () {
                                YS.UI.closePopover();
                            }, 1000);
                            /*YS.Msg.toast({
                                type: "error",
                                dockPosition: "bottomright",
                                msg: item.labelName+"已选择!"
                            });*/
                        }
                    });
                    if (hasFieldIsSubmit) {
                        return false
                    }
                },
                onStateChange: function (b) {
                    a.fieldIssubmit = b
                }
            }
        }, _createIsSubmitDeptConfig: function () {
            var a = this.options, c = this;
            return {
                type: "checkbox",
                text: "是否提交部门",
                value: a.fieldIssubmitDept,
                fieldId: "fieldIssubmitDept",
                onBeforeClick: function (b) {
                    var items = YS.EditForm.collectItems(), hasFieldIsSubmitDept;
                    var ele = YS.EditForm.getConfigPane().getWidgetByName("fieldIssubmitDept");
                    $.each(items, function (i, item) {
                        if (item.fieldId != a.fieldId && item.fieldIssubmitDept) {
                            hasFieldIsSubmitDept = true;
                            YS.UI.showPopover({
                                position: "bottomLeft",
                                type: "warning",
                                anchor: ele.element.find("span"),
                                content: $("<div />").css({"max-width": 200}).text(item.labelName + "已设为提交部门!")
                            });
                            setTimeout(function () {
                                YS.UI.closePopover();
                            }, 1000);
                        }
                    });
                    if (hasFieldIsSubmitDept) {
                        return false
                    }
                },
                onStateChange: function (b) {
                    a.fieldIssubmitDept = b
                }
            }
        }, _createFlowConfig: function () {
            var a = this.options;
            return {
                type: "checkbox",
                text: "可在流程引擎中使用",
                value: a.fieldIswf,
                fieldEnable: true,
                fieldId: "fieldIswf",
                onStateChange: function (c) {
                    a.fieldIswf = c;
                    var d = YS.EditForm.getConfigPane();
                    if (c) {
                        d.getWidgetByName("setFlowPoint").setVisible(!0)
                    } else {
                        d.getWidgetByName("setFlowPoint").setVisible(!1)
                    }
                }
            }
        }, _selectFlowConfig: function () {
            var a = this.options, b = YS.EditForm.formDesign.config.flowItems, c = a.fieldName, d=this, item = [];
            $.each(b, function (i, v) {
                (!v.disabled || v.value == c) && item.push(v);
            });
            return {
                widget: {
                    fieldId: "setFlowPoint",
                    type: "text",
                    value: a.fieldName,
                    onAfterEdit: function () {
                        a.fieldName = this.getValue();
                        // d.setText(this.getValue()), a.value = this.getValue()
                    },
                    fieldIsshow: a.fieldIswf
                },
                splitLine: !0
            }
        }, _createIsOwnerConfig: function () {
            /*var a = this.options;
             return {
             type: "checkbox", text: "为流程拥有者", value: a.fieldIsOwer, fieldId: "fieldIsOwer", onStateChange: function (b) {
             a.fieldIsOwer = b
             }
             }*/
        }, _createIsTitleSuffix: function () {
            var a = this.options, b = YS.EditForm.getAllEntryList(), c = a.fieldIsname, _this = this;
            return {
                type: "checkbox",
                text: "为流程标题后缀",
                value: a.fieldIsname,
                fieldId: "fieldIsname",
                onStateChange: function (b) {
                    a.fieldIsname = b;
                    var d = YS.EditForm.titleSuffix;
                    if (b) {
                        d.push(a);
                    } else {
                        for (var i = 0; i < d.length; i++) {
                            if (d[i].fieldId == a.fieldId) {
                                d.splice(i, 1);
                                i--;
                            }
                        }
                    }
                    YS.EditForm.titleSuffix = d.sort(function (a, b) {
                        return parseInt(a.fieldOrderno) - parseInt(b.fieldOrderno)
                    });
                    _this._updateTitleSuffixList(d)
                }
            }
        }, _updateTitleSuffixList: function (b) {
            var c = YS.EditForm;
            c.formDesign.$suffix.empty();
            $.each(b, function (d, e) {
                c.formDesign.$suffix.append("<span style='padding: 0 6px'>+</span>");
                a('<span class="suffix-item">').text(e.labelName).appendTo(c.formDesign.$suffix);
            });
        }, _createAutoIncrementConfig: function () {
            var a = this, b = this.options;
            return {
                widget: {
                    type: "checkbox",
                    text: "可自增长",
                    value: a.fieldIsAutoIncrement,
                    fieldId: "fieldIsAutoIncrement",
                    onStateChange: function (c) {
                        var d = YS.EditForm.getConfigPane();//,e = d.getWidgetByName("defaultValue").getValue();
                        b.fieldIsAutoIncrement = c;
                        if (c) {
                            a.setText(""), b.value = "", d.getWidgetByName("defaultInput").setValue(""), d.getWidgetByName("defaultInput").setVisible(!c), d.getWidgetByName("formulaBtn").setVisible(!c)
                        } else {
                            /*switch (e) {
                             case"data-rely":
                             d.getWidgetByName("defaultInput").setVisible(!1), d.getWidgetByName("dataRely").setVisible(!0);
                             break;
                             default:*/
                            d.getWidgetByName("defaultInput").setVisible(!0), d.getWidgetByName("formulaBtn").setVisible(!1)
                            //}
                        }
                        //d.getWidgetByName("defaultValue").setVisible(!c);
                    }
                },
                splitLine: !0
            }
        }, _createFormulaButtonConfig: function (a) {
            var b = this.options, c = this;
            return {
                widget: {
                    fieldId: "formulaBtn",
                    type: "button",
                    fieldIsshow: c._getWidgetValueSourceOption() === YS.WidgetValueOption.FORMULA,
                    style: "white",
                    text: "编辑公式",
                    iconCls: "icon-function",
                    width: 240,
                    height: 30,
                    onClick: function () {
                        var entryList = YS.EditForm.getAllEntryList(), currentForm = YS.STATIC.ENTRYID;
                        if (b.fieldPid) {
                            var fields = entryList[0].fields;
                            $.each(fields, function (i, field) {
                                if (field.type == "subform" && field.name == b.fieldPid) {
                                    currentForm = b.fieldPid;
                                }
                            })
                        }
                        new YS.FieldFormulaPane({
                            hasRemind: !1,
                            text: b.labelName,
                            formula: b.formula || "",
                            currentForm: currentForm,
                            currentWidget: b.fieldId,
                            entryList: entryList,
                            labelMap: YS.EditForm.getFieldLabelMap(),
                            onAfterFormulaEdit: function (a) {
                                c._setRelyFormula(a)
                            }
                        })
                    }
                }, splitLine: !0
            }
        }, _setRelyFormula: function (e) {
            var t = this.options;
            e ? (t.formula = e, t.value = null) : t.formula = null
        }, rebuildWithoutVisibility: function () {
            var a = this.options.fieldIsshow, b = this.options.fieldEnable;
            this.options.fieldIsshow = !0, this.options.fieldEnable = !0, this.rebuild(), this.options.fieldIsshow = a, this.options.fieldEnable = b
        }, _compareDataType: function (a, b) {
            return YS.ValueTypeMap[a] === YS.ValueTypeMap[b]
        }, _createDefaultValue: function (e) {
            var a = this.getResults();
            d.items = a.items, e.rebuildWithoutVisibility(), e.value = a.value, e.setText(a.text);
            var b = d.items.length > 0 ? d.items[d.items.length - 1] : {};
            b.isOther && b.text === a.text && e.textOther.setVisible(!0)
        },
        _showRelyDialog: function () {
            var a = this, b = this.options, e = this.options.items,
                multi = a.options.type == "checkboxgroup" || a.options.type == "combocheck" ? !0 : !1;
            $.ajax({  //请求数据字典列表
                url: basePath+'/common/getDictionarys',
                dataType: "JSON",
                success: function (dt) {
                    dt = dt.data;
                    var o = new YS.ConfirmDialog({
                        title: "数据联动",
                        width: 600,
                        height: 400,
                        contentWidget: {
                            rowSize: [30, 225],
                            colSize: [80, 300],
                            hgap: 8,
                            vgap: 20,
                            padding: 15,
                            items: [[{type: "label", text: "数据字典", width: 80}, {
                                type: "combo",
                                fieldId: "fieldTree",
                                textField:'text',
                                valueField:'code',
                                items: dt,
                                width: 420,
                                value: b.ajaxurl,
                                onAfterItemSelect: function () {
                                    a._loadDictionaryItem(this.getValue(), o);
                                }
                            }], [{
                                type: "selectionpane",
                                width: "100%",
                                fieldId: "itemPane",
                                multi: multi,
                                items: a.options.items,
                                onAfterItemSelect: function (n) {
                                    var defaultVal = [];
                                    $.each(this.getResults(), function (i, v) {
                                        v.selected && defaultVal.push(v.code);
                                    });
                                    a.options.fieldDefaultValue = defaultVal.join(","), a.options.value = defaultVal.join(","), a.options.items = this.getResults();
                                }
                            }]]
                        },
                        onOk: function () {
                            a.rebuild();
                            return !1
                        },
                        onCancel: function () {
                            b.items = e;
                            return !1
                        }
                    });
                    a._loadDictionaryItem(b.ajaxurl, o);
                    o.show()
                }
            });
        },
        _showUserMsgDialog: function () {
            var a = this, b = this.options, e = b.ajaxurl, f = [], linkMap = {};
            var s = b.linkWidgets;
            $.each(b.linkWidgets, function (i, wd) {
                linkMap[wd.options.fieldName] = {code: wd.options.fieldName, text: wd.options.labelName};
            });
            var arrData = [{code: 'no', text: "工号", selected: linkMap["no"] ? true : false}
                , {code: 'name', text: "名称", selected: linkMap["name"] ? true : false}
                , {code: 'postname', text: "职务", selected: linkMap["postname"] ? true : false}
                //,{code:'no',text:"工号"}
                , {code: 'gender', text: "性别", selected: linkMap["gender"] ? true : false}
                , {code: 'idCard', text: "身份证号码", selected: linkMap["idCard"] ? true : false}
                , {code: 'birthday', text: "出生年月", selected: linkMap["birthday"] ? true : false}
                , {code: 'graduationTime', text: "毕业时间", selected: linkMap["graduationTime"] ? true : false}
                , {code: 'graduateSchoole', text: "毕业院校", selected: linkMap["graduateSchoole"] ? true : false}
                , {code: 'graduateMajor', text: "毕业专业", selected: linkMap["graduateMajor"] ? true : false}
                , {code: 'education', text: "全日制学历", selected: linkMap["education"] ? true : false}
                , {code: 'enterTime', text: "入职时间", selected: linkMap["enterTime"] ? true : false}
                , {code: 'deptName', text: "所属部门", selected: linkMap["deptName"] ? true : false}
                , {code: 'companyName', text: "所属单位", selected: linkMap["companyName"] ? true : false}
                , {code: 'parentDeptName', text: "上级部门", selected: linkMap["parentDeptName"] ? true : false}
                , {code: 'levelCode', text: "亚厦职级", selected: linkMap["levelCode"] ? true : false}
                //  亚厦职级字段在流程中心为 levelCode  ,取值是从positionName取值
            ];
            var o = new YS.ConfirmDialog({
                title: "人员信息查询",
                width: 500,
                height: 450,
                contentWidget: {
                    rowSize: [32],
                    colSize: [86, 320],
                    hgap: 8,
                    vgap: 20,
                    padding: 15,
                    items: [[
                        {type: "label", text: "人员信息拓展", width: 86},
                        // {type: "combo", text: "人员信息拓展", width: 86},
                        {
                            type: "checkboxgroup",
                            fieldId: "code",
                            textField: "text",
                            items: arrData
                        }
                    ]]
                },
                onOk: function () {
                    var t = this;
                    var i = o.getWidgetByName('code').getValue();
                    o._delSupUserMsgItemWidget(a);
                    o._createUserItemWidget(i, a, o);
                    return !1
                },
                onCancel: function () {
                    b.ajaxurl = e;
                    return !1
                }
            });
            o.show();
        },_showDeptAdminDialog: function () {
            var a = this, b = this.options, e = b.ajaxurl, f = [], linkMap = {};
            var s = b.linkWidgets;
            $.each(b.linkWidgets, function (i, wd) {
                linkMap[wd.options.fieldName] = {code: wd.options.fieldName, text: wd.options.labelName};
            })
            var arrData = [{code: 'dept_deptHeaderCode', text: "部门负责人", selected: linkMap["dept_deptHeaderCode"] ? true : false}
                , {code: 'dept_areaDeputyCode', text: "区域副总", selected: linkMap["dept_areaDeputyCode"] ? true : false}
                , {code: 'dept_areaHeaderCode', text: "区域负责人", selected: linkMap["dept_areaHeaderCode"] ? true : false}
                , {code: 'dept_centerdeputyHeaderCode', text: "中心副总", selected: linkMap["dept_centerdeputyHeaderCode"] ? true : false}
                , {code: 'dept_centerHeaderCode', text: "中心总经理", selected: linkMap["dept_centerHeaderCode"] ? true : false}
                , {code: 'dept_companyHeaderCode', text: "公司总经理", selected: linkMap["dept_companyHeaderCode"] ? true : false}
                , {code: 'dept_areaOneCode', text: "区域公司一级部门负责人", selected: linkMap["dept_areaOneCode"] ? true : false}
            ];
            var o = new YS.ConfirmDialog({
                title: "部门管理者信息查询",
                width: 500,
                height: 450,
                contentWidget: {
                    rowSize: [32],
                    colSize: [86, 320],
                    hgap: 8,
                    vgap: 20,
                    padding: 15,
                    items: [[{type: "label", text: "部门信息拓展", width: 86}, {
                        type: "checkboxgroup",
                        fieldId: "code",
                        textField: "name",
                        items: arrData
                    }]]
                },
                onOk: function () {
                    var t = this;
                    var i = o.getWidgetByName('code').getValue();
                    o._delSupDeptAdminItemWidget(a);
                    o._createDeptAdminItemWidget(i, a, o);
                    return !1
                },
                onCancel: function () {
                    b.ajaxurl = e;
                    return !1
                }
            });
            o.show();
        },_showProjectMsgDialog: function () {

            var a = this, b = this.options, e = b.ajaxurl, f = [], linkMap = {},d = YS.EditForm.collectItems();
            // var d = this, a = this.options, b = YS.EditForm.collectItems(), e = [];
            var s = b.linkWidgets;
            $.each(b.linkWidgets, function (i, wd) {
                linkMap[wd.options.fieldName] = {code: wd.options.fieldName, text: wd.options.labelName};
            })
            if(b.labelName == "装饰项目编码"){
                var arrData = [
                    {code: 'projBaseInfo', istitle:true, text: "项目基本信息",isTableShow:false,isFormShow:false, selected: linkMap["projBaseInfo"] ? true : false}
                    , {isPerson:false,code: 'zscode', text: "项目编码",isTableShow:false,isFormShow:false, selected: linkMap["zscode"] ? true : false}
                    , {isPerson:false,code: 'zsprojectName', text: "项目名称", isTableShow:true,isFormShow:false, selected: linkMap["zsprojectName"] ? true : false}
                    , {isPerson:false,code: 'zsprojectNature', text: "项目性质",isTableShow:true,isFormShow:false, selected: linkMap["zsprojectNature"] ? true : false}
                    , {isPerson:false,code: 'zsdepartment', text: "所属部门",isTableShow:false,isFormShow:false, selected: linkMap["zsdepartment"] ? true : false}
                    , {code: 'projPersonal',istitle:true, text: "项目人员(七大员)", selected: linkMap["projPersonal"] ? true : false}
                    , {isPerson:true,code: 'zsmainManager',name:"",isCode:true, text: "项目经理",isTableShow:false,isFormShow:false, selected: linkMap["zsmainManager"] ? true : false}
                    , {isPerson:true,code: 'zsvicePromanager',name:"",isCode:true, text:"项目副经理",isTableShow:false,isFormShow:false, selected: linkMap["zsvicePromanager"] ? true : false}
                    , {isPerson:true,code: 'zssecuritor',name:"",isCode:true, text: "安全员",isTableShow:false,isFormShow:false, selected: linkMap["zssecuritor"] ? true : false}
                    , {isPerson:true,code: 'zsbuildPerson',name:"",isCode:true, text: "安装施工员",isTableShow:false,isFormShow:false, selected: linkMap["zssecuritor"] ? true : false}
                    , {isPerson:true,code: 'zsmaterial',name:"",isCode:true, text: "材料员",isTableShow:false,isFormShow:false, selected: linkMap["zsmaterial"] ? true : false}
                    , {isPerson:true,code: 'zsproductor',name:"",isCode:true, text: "生产经理",isTableShow:false,isFormShow:false, selected: linkMap["zsproductor"] ? true : false}
                    , {isPerson:true,code: 'zsworker',name:"",isCode:true, text: "施工员",isTableShow:false,isFormShow:false, selected: linkMap["zsworker"] ? true : false}
                    , {isPerson:true,code: 'zsqualitor',name:"",isCode:true, text: "质量员",isTableShow:false,isFormShow:false, selected: linkMap["zsqualitor"] ? true : false}
                    , {isPerson:true,code: 'zsdator',name:"",isCode:true, text: "资料员",isTableShow:false,isFormShow:false, selected: linkMap["zsdator"] ? true : false}
                    , {code: 'projFunctionalOfficial',istitle:true, text: "项目职能人员",isTableShow:false,isFormShow:false, selected: linkMap["projFunctionalOfficial"] ? true : false}
                    , {isPerson:true,code: 'zsmaterialManager',name:"",isCode:true, text: "材料主管",isTableShow:false,isFormShow:false, selected: linkMap["zsmaterialManager"] ? true : false}
                    , {isPerson:true,code: 'zsmanagerCentertwo',name:"",isCode:true, text: "工管中心二级业务单位负责人",isTableShow:false,isFormShow:false, selected: linkMap["zsmanagerCentertwo"] ? true : false}
                    , {isPerson:true,code: 'zsworkCentermanager',name:"",isCode:true, text: "工管中心总经理",isTableShow:false,isFormShow:false, selected: linkMap["zsworkCentermanager"] ? true : false}
                    , {isPerson:true,code: 'zssupplierManager',name:"",isCode:true, text: "供应部经理",isTableShow:false,isFormShow:false, selected: linkMap["zssupplierManager"] ? true : false}
                    , {isPerson:true,code: 'zsproLeader',name:"",isCode:true, text: "项目分管领导",isTableShow:false,isFormShow:false, selected: linkMap["zsproLeader"] ? true : false}
                    , {isPerson:true,code: 'zsfinanceController',name:"",isCode:true, text: "财务专管员",isTableShow:false,isFormShow:false, selected: linkMap["zsfinanceController"] ? true : false}
                    , {isPerson:true,code: 'zsfinaceManager',name:"",isCode:true, text: "财务主管",isTableShow:false,isFormShow:false, selected: linkMap["zsfinaceManager"] ? true : false}
                    , {isPerson:true,code: 'zsaccountor',name:"",isCode:true, text: "核算员",isTableShow:false,isFormShow:false, selected: linkMap["zsaccountor"] ? true : false}
                    , {isPerson:true,code: 'zsaccountManager',name:"",isCode:true, text: "核算经理",isTableShow:false,isFormShow:false, selected: linkMap["zsaccountManager"] ? true : false}
                    , {isPerson:true,code: 'zswareHouse',name:"",isCode:true,text: "仓管员",isTableShow:false,isFormShow:false, selected: linkMap["zswareHouse"] ? true : false}
                    , {isPerson:true,code: 'zsmtrlPerson',name:"",isCode:true, text: "材料计划知会人",isTableShow:false,isFormShow:false, selected: linkMap["zsmtrlPerson"] ? true : false}
                    , {isPerson:true,code: 'zsplanner',name:"",isCode:true, text: "计划专员",isTableShow:false,isFormShow:false, selected: linkMap["zsplanner"] ? true : false}
                    , {isPerson:true,code: 'zsdeepeningDesigner',name:"",isCode:true, text: "深化设计师",isTableShow:false,isFormShow:false, selected: linkMap["zsdeepeningDesigner"] ? true : false}
                    , {isPerson:true,code: 'zstechnicalDirector',name:"",isCode:true, text: "现场技术负责人",isTableShow:false,isFormShow:false, selected: linkMap["zstechnicalDirector"] ? true : false}
                    , {isPerson:true,code: 'zsplanDept',name:"",isCode:true, text: "计划运营部",isTableShow:false,isFormShow:false, selected: linkMap["zsplanDept"] ? true : false}
                    , {isPerson:true,code: 'zsplanningManager',name:"",isCode:true, text: "计划经理",isTableShow:false,isFormShow:false, selected: linkMap["zsplanningManager"] ? true : false}

                ];
            }else if (b.labelName == "幕墙项目编码"){
                var arrData = [
                    {code: 'projBaseInfo', istitle:true, text: "项目基本信息",isTableShow:false,isFormShow:false, selected: linkMap["projBaseInfo"] ? true : false}
                    , {isPerson:false,code: 'mqcode',name:"", text: "项目编码",isTableShow:false,isFormShow:false, selected: linkMap["mqcode"] ? true : false}
                    , {isPerson:false,code: 'mqprojectName',name:"", text: "项目名称", isTableShow:true,isFormShow:false, selected: linkMap["mqprojectName"] ? true : false}
                    , {isPerson:false,code: 'mqprojectNature',name:"", text: "项目性质",isTableShow:true,isFormShow:false, selected: linkMap["mqprojectNature"] ? true : false}
                    , {isPerson:false,code: 'mqdepartment',name:"", text: "所属部门",isTableShow:false,isFormShow:false, selected: linkMap["mqdepartment"] ? true : false}

                    , {isPerson:true,isCode:true,code: 'projPersonal',istitle:true, text: "项目人员(七大员)", selected: linkMap["projPersonal"] ? true : false}
                    , {isPerson:true,isCode:true,code: 'mqsecuritor',name:"", text: "安全员",isTableShow:false,isFormShow:false, selected: linkMap["mqsecuritor"] ? true : false}
                    , {isPerson:true,isCode:true,code: 'mqmaterial',name:"", text: "材料员",isTableShow:false,isFormShow:false, selected: linkMap["mqmaterial"] ? true : false}
                    , {isPerson:true,isCode:true,code: 'mqproductor',name:"", text: "生产经理",isTableShow:false,isFormShow:false, selected: linkMap["mqproductor"] ? true : false}
                    , {isPerson:true,isCode:true,code: 'mqmainManager',name:"", text: "项目经理",isTableShow:false,isFormShow:false, selected: linkMap["mqmainManager"] ? true : false}
                    , {isPerson:true,isCode:true,code: 'mqworker',name:"", text: "施工员",isTableShow:false,isFormShow:false, selected: linkMap["mqworker"] ? true : false}
                    , {isPerson:true,isCode:true,code: 'mqqualitor',name:"", text: "质量员",isTableShow:false,isFormShow:false, selected: linkMap["mqqualitor"] ? true : false}
                    , {isPerson:true,isCode:true,code: 'mqdator',name:"", text: "资料员",isTableShow:false,isFormShow:false, selected: linkMap["mqdator"] ? true : false}
                    , {code: 'projFunctionalOfficial',istitle:true, text: "项目职能人员",isTableShow:false,isFormShow:false, selected: linkMap["projFunctionalOfficial"] ? true : false}
                    , {isPerson:true,isCode:true,code: 'mqdesigner',name:"", text: "设计师",isTableShow:false,isFormShow:false, selected: linkMap["mqdesigner"] ? true : false}
                    , {isPerson:true,isCode:true,code: 'mqmainDesigner',name:"", text: "项目主设计师",isTableShow:false,isFormShow:false, selected: linkMap["mqmainDesigner"] ? true : false}
                    , {isPerson:true,isCode:true,code: 'mqaccountor',name:"", text: "核算员",isTableShow:false,isFormShow:false, selected: linkMap["mqaccountor"] ? true : false}
                    , {isPerson:true,isCode:true,code: 'mqdesignerManager',name:"", text: "设计经理",isTableShow:false,isFormShow:false, selected: linkMap["mqdesignerManager"] ? true : false}
                    , {isPerson:true,isCode:true,code: 'mqfinalist',name:"", text: "决算员",isTableShow:false,isFormShow:false, selected: linkMap["mqfinalist"] ? true : false}
                    , {isPerson:true,isCode:true,code: 'mqtechnicalDirector',name:"", text: "现场技术负责人",isTableShow:false,isFormShow:false, selected: linkMap["mqtechnicalDirector"] ? true : false}
                    , {isPerson:true,isCode:true,code: 'mqplanner',name:"", text: "计划专员",isTableShow:false,isFormShow:false, selected: linkMap["mqplanner"] ? true : false}
                    , {isPerson:true,isCode:true,code: 'mqprocessingSupervisor',name:"", text: "加工主管",isTableShow:false,isFormShow:false, selected: linkMap["mqprocessingSupervisor"] ? true : false}
                    , {isPerson:true,isCode:true,code: 'mqpurchaseManage',name:"", text: "采购主管",isTableShow:false,isFormShow:false, selected: linkMap["mqpurchaseManage"] ? true : false}
                    , {isPerson:true,isCode:true,code: 'mqsettlementOfficer',name:"", text: "结算员",isTableShow:false,isFormShow:false, selected: linkMap["mqsettlementOfficer"] ? true : false}
                    , {isPerson:true,isCode:true,code: 'mqhrCommissioner',name:"", text: "人力资源部人力专员",isTableShow:false,isFormShow:false, selected: linkMap["mqhrCommissioner"] ? true : false}
                    , {isPerson:true,isCode:true,code: 'mqworkCentermanager',name:"", text: "工管公司总经理",isTableShow:false,isFormShow:false, selected: linkMap["mqworkCentermanager"] ? true : false}
                    , {isPerson:true,isCode:true,code: 'mqcoordinator',name:"", text: "统筹管理部人力专员",isTableShow:false,isFormShow:false, selected: linkMap["mqcoordinator"] ? true : false}
                ];
            }
            var o = new YS.ConfirmDialog({
                title: b.labelName,
                width: 500,
                height: 480,
                contentWidget: {
                    width: 500,
                    height: 400,
                    type: "projecttable",
                    padding: 15,
                    fieldId: "projecttable",
                    linkWidgets: arrData,
                    items: [[{
                        type: "projecttable",
                        fieldId: "projecttable",
                        items: arrData
                    }]],
                    itemLinkeds: b.itemLinkeds,
                    currentItem: b.value,

                },
                onOk: function () {
                    var dd = this.container.getCode();
                    o._delSupProjectMsgItemWidget(a);
                    var items = dd.reverse();
                    o._createProjectMsgItemWidget(items, a, o);
                    return !1
                },
                onCancel: function () {
                    b.ajaxurl = e;
                    return !1
                }
            });
            o.show();
        },setWidgetsMap: function (t) {
            var a = this.options, b = [];
            $.each(t, function (c, d) {
                b = b.concat(d);
            });
            a.itemLinkeds = b;
            /*for (var n = 0; n < a.items.length; n++) {
             a.items && a.items[n] && (a.items[n].itemLinkeds = t[n]);
             }*/
        },
        _showBisTableDialog: function () {
            var a = this, b = this.options, e = b.ajaxurl, f = [];
            $.ajax({
                url: basePath + '/oa/form/business_table_info/ajaxList.do?sessionId=' + _jsSessionId,
                dataType: "JSON",
                success: function (dt) {
                    var o = new YS.ConfirmDialog({
                        title: "业务底表",
                        width: 500,
                        height: 450,
                        contentWidget: {
                            rowSize: [30, 30, 200],
                            colSize: [80, 320],
                            hgap: 8,
                            vgap: 20,
                            padding: 15,
                            items: [
                                [{type: "label", text: "底表类型", width: 80}, {
                                    type: "combotree",
                                    fieldId: "bisTree",
                                    textField: "name",
                                    pIdField: "pid",
                                    items: dt.rows,
                                    width: 300,
                                    value: b.ajaxurl,
                                    parentEnable: !0,
                                    onAfterNodeClick: function (c) {
                                        b.ajaxurl = c.id;
                                        o._loadBisMapById(c.id, o);
                                    }
                                }], [{type: "label", text: "控件可见性", width: 80}, {
                                    type: "checkboxgroup",
                                    fieldId: "bisItemVisibility",
                                    onAfterItemSelect: function (a) {
                                        var b = this.getValue();
                                    }
                                }], [{
                                    type: "bistablepane",
                                    width: "100%",
                                    ajaxurl: b.ajaxurl,
                                    hasCheck: false,
                                    fieldId: "bisItemPane"
                                }]
                            ]
                        },
                        onOk: function () {
                            var i = o.getWidgetByName('bisItemPane');
                            o._delSupBisItemWidget(a);
                            o._createBisItemWidget(i.options.tableHead, a, o);
                            return !1
                        },
                        onCancel: function () {
                            b.ajaxurl = e;
                            return !1
                        }
                    });
                    o.show();
                    //o._loadBisMapById(b.ajaxurl, o);
                }
            });
        }, _loadDictionaryItem: function (a, o) {//加载数据字典内容
            var b = this, c = this.options, d = this.options.fieldDefaultValue.split(",");
            if (!YS.Utils.isEmpty(a)) {
                $.ajax({
                    url: basePath+'/common/getDictionaryItems',
                    data: {"mainId": a},
                    success: function (dt) {
                        dt = dt.data;
                        c.ajaxurl = a;
                        $.each(dt, function (i, v) {
                            $.each(d, function (j, k) {
                                v.code == k && (v.selected = !0);
                            })
                        })
                        c.items = dt;
                        var i = o.getWidgetByName('itemPane');
                        i.options.items = dt, i.rebuild();
                    }
                });
            }
        }, _loadBisMapById: function (a, o, d) {
            var b = this, c = this.options;
            if (!YS.Utils.isEmpty(a)) {
                $.ajax({
                    url: basePath + "/oa/form/business_table_field/getItemByInfoId.do?sessionId=" + _jsSessionId,
                    dataType: 'json',
                    data: {"businessTableId": a},
                    success: function (map) {
                        var ar = [];
                        $.each(map, function (i, itm) {
                            ar[i] = {};
                            ar[i].code = itm.businessTableField;
                            ar[i].text = itm.businessTableFieldName;
                        });
                        var visiblePane = o.getWidgetByName("bisItemVisibility");
                        visiblePane.options.items = ar;
                        visiblePane.rebuild();
                        var i = o.getWidgetByName('bisItemPane');
                        i.options.ajaxurl = a;
                        i.rebuild();
                        d && d(map);
                    }
                });
            }
        },_delSupBisItemWidget: function (a) {
            var b = YS.EditForm.formDesign, d = a ? a.options.linkWidgets : [];
            $.each(d, function (e, f) {
                var g = f.element.closest("li.widget-view");
                g[0] && b._doWidgetRemove(g);
            });
        },_delSupUserMsgItemWidget: function (a) {
            var d = a ? a.options.linkWidgets : [];
            var b = YS.EditForm.formDesign;
            $.each(d, function (e, f) {
                var g = f.element.closest("li.widget-view");
                g[0] && b._doWidgetRemove(g);
            });
        }, _createUserItemWidget: function (b, o, dialog) {
            var c = YS.EditForm.formDesign, bisWidget = o.element.closest("li.widget-view");
            var itms = dialog.getWidgetByName('code').getText();
            o.options.linkWidgets = [];
            $.each(b, function (d, e) {
                var w = {type: 'text', fieldEnable: !1};
                // if (e == "gender") {
                //     w.type = "combo", w.valueField = "code", w.items = [{code: "1", text: "男"}, {code: "2", text: "女"}]
                // }
                w.fieldType= "varchar",w.fieldLength= 64,
                    w.fieldIsshow = !0, w.fieldPid = o.options.fieldId,
                    w.labelName = itms[d], w.fieldName = e;
                w.isShowEditable = !0, w.fieldIsdel = !1;
                c._insertWidget(bisWidget, w);
            });
        },_delSupDeptAdminItemWidget: function (a) {
            var d = a ? a.options.linkWidgets : [];
            var b = YS.EditForm.formDesign;
            $.each(d, function (e, f) {
                var g = f.element.closest("li.widget-view");
                g[0] && b._doWidgetRemove(g);
            });
        }, _createDeptAdminItemWidget: function (b, o, dialog) {
            var c = YS.EditForm.formDesign, bisWidget = o.element.closest("li.widget-view");
            var itms = dialog.getWidgetByName('code').getText();
            o.options.linkWidgets = [];
            $.each(b, function (d, e) {
                var w = {type: 'user', fieldEnable: !1,fieldType:"varchar",fieldLength:10,isFlowConfigEnable:!0,isSubmitConfigEnable:!0};
                w.fieldIsshow = !1,  w.fieldPid = o.options.fieldId, w.labelName = itms[d], w.fieldName = e;
                w.isShowEnable = !0,
                w.isShowEditable = !0, w.fieldIsdel = !1;
                c._insertWidget(bisWidget, w);
            });
        },_delSupProjectMsgItemWidget: function (a) {
            var d = a ? a.options.linkWidgets : [];
            var b = YS.EditForm.formDesign;
            $.each(d, function (e, f) {
                var g = f.element.closest("li.widget-view");
                g[0] && b._doWidgetRemove(g);
            });
        },_createProjectMsgItemWidget: function (b, o, dialog) {
            var c = YS.EditForm.formDesign, bisWidget = o.element.closest("li.widget-view");
            var itms =  dialog.container.getText().reverse();
            o.options.linkWidgets = [];
            $.each(b, function (d, e) {
                if(e.isPerson){
                    var w = {type: 'user', fieldEnable: !1,fieldType:"varchar",fieldLength:10,isFlowConfigEnable:!0,isSubmitConfigEnable:!0};
                }else{
                    var w = {type: 'text', fieldEnable: !1,fieldType:"varchar",fieldLength:256,isFlowConfigEnable:!1,isSubmitConfigEnable:!1};
                }
                w.fieldPid = o.options.fieldId,w.isShowEnable = !1,w.labelName = itms[d], w.fieldName = e.code;
                w.isShowEditable = !0,w.fieldIsshow = !0,w.fieldIsdel = !1;
                c._insertWidget(bisWidget, w);
            });
        },
        _createBisItemWidget: function (b, o, dialog) {
            var selected = dialog.getWidgetByName("bisItemVisibility").getValue(), c = YS.EditForm.formDesign, w = {
                type: 'text',
                fieldEnable: !1
            }, bisWidget = o.element.closest("li.widget-view");
            o.options.linkWidgets = [];
            $.each(b, function (d, e) {
                if (e.businessTableField == selected) {
                    o.options.fieldName = e.businessTableField, o.options.isShowEditable = !1;
                    o.options.labelName = e.businessTableFieldName;
                    o.element.closest("li.widget-view").find(".label-title").text(e.businessTableFieldName);
                    o.rebuild();
                } else {
                    w.fieldIsshow = !1,
                        w.labelName = e.businessTableFieldName,
                        w.fieldName = e.businessTableField, w.fieldPid = o.options.fieldId,
                        w.isShowEditable = !1, w.fieldIsdel = !0;
                    c._insertWidget(bisWidget, w);
                }
                ;
            });
            var tm = bisWidget.data("widget");
        },
        _createWidgetLayoutConfig: function (b) {
            if (!b) return {};
            var d = this.options, c = YS.EditForm.getFormLayout();
            _this=this;
            return {
                label: "布局",
                tooltip: a("<span/>").text("打开表单属性 > 双列布局才可使用"),
                widget: {
                    rowSize: [30],
                    colSize: ["auto", 80],
                    vgap: 2,
                    type: "tablecontainer",
                    items: [[{type: "label", text: "控件宽度占整行的"}, {
                        type: "combo",
                        searchable: !1,
                        fieldIsnull: !1,
                        fieldEnable: c != "normal",
                        items: c == "grid-2" ? [{code: "6", text: "1/2"}, {
                            code: "12",
                            text: "全部"
                        }] : (c == "grid-3" ? [{code: "4", text: "1/3"}, {code: "8", text: "2/3"}, {
                            code: "12",
                            text: "全部"
                        }] : []),
                        fieldDefaultValue: c != "normal" ? "" + b.data("fieldLineWidth") : "12",
                        onStopEdit: function () {
                            d.fieldLineWidth = "" + this.getValue(), b.data("fieldLineWidth", "" + this.getValue());
                            _this.element.parent().parent().removeClass("x-grid-col-4").removeClass("x-grid-col-6").removeClass("x-grid-col-8").removeClass("x-grid-col-12").addClass("x-grid-col-" + this.getValue());
                            switch(this.getValue())
                            {
                                case "4":_this.element.css("width","200px");break;
                                case "6":_this.element.css("width","200px");break;
                                case "8":_this.element.css("width","85%");break;
                                case "12":_this.element.css("width","85%");break;
                                default:_this.element.css("width","200px");break;
                            }
                        }
                    }]]
                }
            }
        }, _getWidgetValueSourceOption: function () {
            var a = this.options;
            return a.formula ? YS.WidgetValueOption.FORMULA : YS.WidgetValueOption.CUSTOM
        }, getLinkFilterConfig: function (a, b, c) {
            var d = [], e = a.linkForm;
            YS.Utils.forEach(YS.EditForm.collectItems(), function (b, c) {

            });
            var f = new YS.ConfirmDialog({
                title: "关联条件限定",
                height: 440,
                width: 510,
                contentWidget: {
                    rowSize: [290],
                    colSize: [480],
                    padding: 15,
                    items: [[{
                        fieldId: "linkFilter",
                        type: "linkfilterpane",
                        items: a.linkFilter,
                        relyWidgets: d,
                        linkWidgets: b[e]
                    }]]
                },
                onOk: function () {
                    a.linkFilter = f.getWidgetByName("linkFilter").getValue();
                    var b = [];
                    return YS.Utils.forEach(a.linkFilter, function (a, c) {
                        b.push(c.rely)
                    }), a.rely = {widgets: b}, c && c(), !1
                }
            });
            f.show()
        }, _showLinkWidgetsDialog: function () {
            var d = this, a = this.options, b = YS.EditForm.collectItems(), e = [];
            $.each(b, function (f, t) {
                if (t.fieldId != a.fieldId) {
                    t && e.push({value: t.fieldId, text: t.labelName})
                }
            });
            if (a.items.length <= 0 && a.ajaxurl) {
                $.ajax({
                    url: basePath+'/common/getDictionaryItems',
                    data: {"mainId": a.ajaxurl},
                    success: function (b) {
                        a.items = b.data;
                        d._showItemsLinkedDialog(e);
                    },
                    error: function () {
                    }
                })
            } else {
                d._showItemsLinkedDialog(e);
            }
        }, _showItemsLinkedDialog: function (b) {
            var d = this, a = this.options;
            var c = new YS.ConfirmDialog({
                title: "选项关联控件",
                width: 570,
                height: 510,
                contentWidget: {
                    width: 570,
                    height: 400,
                    type: "itemlinkpane",
                    linkWidgets: b,
                    items: a.items,
                    itemLinkeds: a.itemLinkeds,
                    currentItem: a.value
                },
                onOk: function () {
                    d.setWidgetsMap(this.container.getValue());
                    return !1
                }
            });
            c.show();
        }, setWidgetsMap: function (t) {
            var a = this.options, b = [];
            $.each(t, function (c, d) {
                b = b.concat(d);
            });
            a.itemLinkeds = b;
            /*for (var n = 0; n < a.items.length; n++) {
                a.items && a.items[n] && (a.items[n].itemLinkeds = t[n]);
            }*/
        }
    }), a.extend(YS.TextEditor.prototype, {
        getConfigItems: function (a, b, c) {
            var d = this, e = this.options, f = this._getWidgetValueSourceOption(), g = YS.CONST.TEXT_TYPE_REGEXP;
            return [{
                label: "标题",
                widget: this._createTitleConfig(a),
                splitLine: !0
            }, {
                label: "描述信息", disabled: !b, widget: this._createDescriptionConfig(b), splitLine: !0
            }, {
                label: "格式",
                widget: {
                    type: "combo",
                    searchable: !1,
                    fieldIsnull: !1,
                    valueField: "value",
                    items: [{text: "无", value: ""}, {text: "手机号码", value: g.mobile}, {
                        text: "电话号码",
                        value: g.tel
                    }, {text: "邮政编码", value: g.zip}, {text: "身份证号码", value: g.ID}, {
                        text: "邮箱",
                        value: g.email
                    }, {text: "金额", value: g.money}],
                    onDataFilter: function (a) {
                        return e.fieldRegexl ? e.fieldRegexl == a.value && (a.selected = !0) : "" === a.value && (a.selected = !0), a
                    },
                    onAfterItemSelect: function () {
                        e.fieldRegexl = this.getValue(), e.fieldErrMsg = "请输入正确的" + this.getText();
                        var v = this.getText();
                        switch (v) {
                            case "身份证号码":
                            case "邮箱":
                                e.fieldLength = 32;
                                break;
                            case "手机号码":
                            case "电话号码":
                            case "邮政编码":
                                e.fieldLength = 16;
                                break;
                            case "金额":
                                e.fieldLength = 64;
                                break;
                            default :
                                e.fieldLength = 128;
                                e.fieldRegexl = "(^.{0,128}$)";
                        }
                        var a = YS.EditForm.getConfigPane().getWidgetByName("defaultInput");
                        a && (a.options.fieldRegexl = d.options.fieldRegexl)
                    }
                },
                splitLine: !0
            }, /*{
             label: "默认值",
             widget: {
             fieldId: "defaultInput",
             type: "text",
             value: e.value,
             fieldRegexl: e.fieldRegexl,
             onAfterEdit: function () {
             d.setText(this.getValue()), e.value = this.getValue()
             },
             fieldIsshow: f === YS.WidgetValueOption.CUSTOM
             }
             },*/ this._createWidgetDefaultValueConfig(), {
                widget: {
                    fieldId: "defaultInput",
                    type: "text",
                    value: e.value,
                    fieldRegexl: e.fieldRegexl,
                    onAfterEdit: function () {
                        d.setText(this.getValue()), e.value = this.getValue()
                    },
                    fieldIsshow: f === YS.WidgetValueOption.CUSTOM
                }
            }, this._createFormulaButtonConfig(), this._createAutoIncrementConfig(), {
                label: "校验",
                widget: this._createNotNullConfig(a),
                splitLine: !0
            }, {
                widget: this._createEnableConfig()
            }, {
                widget: this._createVisibleConfig(),
                splitLine: !0
            }, {
                label: "流程相关",
                widget: this._createIsOwnerConfig()
            }, {
                widget: this._createFlowConfig()
            }, {
                widget: this._createIsSubmitConfig()
            }, {
                widget: this._createIsTitleSuffix()
            }, this._selectFlowConfig(), this._createWidgetLayoutConfig(c)]
        }, _createWidgetDefaultValueConfig: function () {
            var a = this.options, b = this._getWidgetValueSourceOption();
            return {
                label: "默认值",
                widget: {
                    fieldId: "defaultValue",
                    type: "combo",
                    searchable: !1,
                    fieldIsnull: !1,
                    fieldIsshow: a.fieldIsAutoIncrement === !1,
                    valueField: "value",
                    items: [{
                        value: "custom",
                        text: "自定义",
                        selected: b === YS.WidgetValueOption.CUSTOM
                    }, {value: "formula", text: "公式编辑", selected: b === YS.WidgetValueOption.FORMULA}],
                    onAfterItemSelect: function () {
                        var b = this.getValue(), c = YS.EditForm.getConfigPane();
                        switch (b) {
                            case"formula":
                                c.getWidgetByName("defaultInput").setVisible(!1), c.getWidgetByName("formulaBtn").setVisible(!0), a.rely && (a.rely.widgets = []);
                                break;
                            default:
                                a.async && (a.async.url = null), a.rely = null, c.getWidgetByName("defaultInput").setVisible(!0), c.getWidgetByName("formulaBtn").setVisible(!1)
                        }
                    }
                }
            }
        }
    }), a.extend(YS.Number.prototype, {
        getConfigItems: function (a, b, c) {
            var d = this, e = this.options, f = this._getWidgetValueSourceOption();
            return [{
                label: "标题",
                widget: this._createTitleConfig(a),
                splitLine: !0
            }, {
                label: "描述信息",
                disabled: !b,
                widget: this._createDescriptionConfig(b),
                splitLine: !0
            }, this._createWidgetDefaultValueConfig(), {
                widget: {
                    fieldId: "defaultInput",
                    type: "text",
                    value: e.value,
                    fieldRegexl: e.fieldRegexl,
                    onAfterEdit: function () {
                        d.setText(this.getValue()), e.value = this.getValue()
                    },
                    fieldIsshow: f === YS.WidgetValueOption.CUSTOM
                }
            }, this._createFormulaButtonConfig(), this._createAutoIncrementConfig(), {
                label: "校验",
                widget: this._createNotNullConfig(a)
            }, {
                widget: {
                    type: "checkbox",
                    text: "允许小数",
                    value: this.options.fieldDecimalLength > 0 ? !0 : !1,
                    onStateChange: function (a) {
                        var l = YS.EditForm.getConfigPane().getWidgetByName("fieldDecimalLength");
                        if (a) {
                            e.fieldType = "double";
                            l.setVisible(!0);
                            l.element.find('input').attr('placeholder', '请输入小数位数');
                        } else {
                            e.fieldType = "int", e.fieldDecimalLength = 0;
                            l.setValue(""), l.setVisible(!1);
                        }
                        e.allowDecimals = a, e.value = d.getValue(), d.rebuildWithoutVisibility();
                        var b = YS.EditForm.getConfigPane().getWidgetByName("defaultInput");
                        b && (b.options.allowDecimals = a, b.options.value = b.getValue(), b.rebuild(), b.checkValidate())
                    }
                }
            }, {
                widget: {
                    fieldId: "fieldDecimalLength",
                    type: "number",
                    value: this.options.fieldDecimalLength,
                    fieldIsnull: !0,
                    fieldIsshow: this.options.fieldDecimalLength > 0 ? !0 : !1,
                    onAfterEdit: function () {
                        var val = this.getValue();
                        var m = YS.EditForm.getConfigPane().getWidgetByName("defaultInput");
                        e.fieldDecimalLength = val, m.options.fieldDecimalLength = val;
                        d.rebuildWithoutVisibility(), m.rebuild();
                    }
                }, splitLine: !0
            }, {
                widget: this._createEnableConfig()
            }, {
                widget: this._createVisibleConfig(),
                splitLine: !0
            }, {
                label: "流程相关",
                widget: this._createIsOwnerConfig()
            }, {
                widget: this._createFlowConfig()
            }, {
                widget: this._createIsSubmitConfig()
            }, {
                widget: this._createIsTitleSuffix()
            }, this._selectFlowConfig(), this._createWidgetLayoutConfig(c)]
        }
    }), a.extend(YS.TextArea.prototype, {
        getConfigItems: function (a, b, c) {
            var d = this, e = this.options;
            return [{
                label: "标题",
                widget: this._createTitleConfig(a),
                splitLine: !0
            }, {label: "描述信息", disabled: !b, widget: this._createDescriptionConfig(b), splitLine: !0}, {
                label: "默认值",
                widget: {
                    type: "textarea",
                    fieldId: "defaultValue",
                    value: this.options.value,
                    width: 240,
                    onAfterEdit: function () {
                        d.setText(this.getValue()), e.value = this.getValue()
                    }
                }
            }, {
                widget: {
                    type: "checkbox",
                    text: "可自增长",
                    value: e.fieldIsAutoIncrement,
                    fieldId: "fieldIsAutoIncrement",
                    onStateChange: function (f) {
                        var g = YS.EditForm.getConfigPane().getWidgetByName("defaultValue");
                        d.setText(""), e.fieldIsAutoIncrement = f, g.setValue(""), g.setVisible(!f);
                    }
                },
                splitLine: !0
            }, {
                label: "校验",
                widget: this._createNotNullConfig(a),
                splitLine: !0
            }, {
                widget: this._createEnableConfig()
            }, {
                widget: this._createVisibleConfig(),
                splitLine: !0
            }, {
                label: "流程相关",
                widget: this._createIsOwnerConfig()
            }, {
                widget: this._createFlowConfig()
            }, {
                widget: this._createIsSubmitConfig()
            }, {
                widget: this._createIsTitleSuffix()
            }, this._selectFlowConfig(), this._createWidgetLayoutConfig(c)]
        }
    }), a.extend(YS.ComboBox.prototype, {
        getConfigItems: function (a, b, c) {
            var d = this.options, e = this, f = e.element.closest(".fui_subform").length <= 0, g = function () {
                var a = this.getResults();
                d.items = a.items, e.rebuildWithoutVisibility(), e.value = a.value, e.setText(a.text);
                var b = d.items.length > 0 ? d.items[d.items.length - 1] : {};
                b.isOther && b.text === a.text && e.textOther.setVisible(!0)
            }, h = this._getWidgetValueSourceOption();
            return [{
                label: "标题",
                widget: this._createTitleConfig(a),
                splitLine: !0
            }, {
                label: "描述信息",
                disabled: !b,
                widget: this._createDescriptionConfig(b),
                splitLine: !0
            }, {
                label: "选择数据源",
                widget: {
                    type: "button",
                    fieldId: "ajaxurl",
                    onClick: function () {
                        e._showRelyDialog()
                    },
                    text: "数据字典",
                    style: "white",
                    width: 240,
                    height: 30
                }
            }, {
                widget: {
                    type: "button",
                    fieldId: "linkwidget",
                    onClick: function () {
                        e._showLinkWidgetsDialog()
                    },
                    text: "选项关联控件设置",
                    style: "white",
                    width: 240,
                    height: 30
                }
            }, {
                label: "校验", widget: this._createNotNullConfig(a),
                splitLine: !0
            }, {
                widget: this._createEnableConfig()
            }, {
                widget: this._createVisibleConfig(),
                splitLine: !0
            }, {
                label: "流程相关",
                widget: this._createIsOwnerConfig()
            }, {
                widget: this._createFlowConfig()
            }, {
                widget: this._createIsSubmitConfig()
            }, {
                widget: this._createIsTitleSuffix()
            }, this._selectFlowConfig(), this._createWidgetLayoutConfig(c)]
        }, _getWidgetValueSourceOption: function () {
            var a = this.options;
            return a.rely && a.rely.ref ? YS.WidgetValueOption.RELY : a.async ? YS.WidgetValueOption.ASYNC : YS.WidgetValueOption.CUSTOM
        }, _createWidgetDefaultValueConfig: function () {
            var a = this.options, b = this._getWidgetValueSourceOption();
            return {
                label: "选项",
                widget: {
                    type: "combo",
                    searchable: !1,
                    fieldIsnull: !1,
                    valueField: "value",
                    items: [{
                        value: 1,
                        text: "关联其他表单数据",
                        selected: b === YS.WidgetValueOption.ASYNC
                    }, {value: 2, text: "数据联动", selected: b === YS.WidgetValueOption.RELY}],
                    onAfterItemSelect: function () {
                        var b = YS.EditForm.getConfigPane();
                        switch (this.getValue()) {
                            case 1:
                                a.rely = null, b.getWidgetByName("itemPane").setVisible(!1), b.getWidgetByName("dataRely").setVisible(!1);
                                var c = b.getWidgetByName("fieldTree");
                                c.setValue(null), c.setVisible(!0);
                                break;
                            case 2:
                                b.getWidgetByName("itemPane").setVisible(!1), b.getWidgetByName("dataRely").setVisible(!0), b.getWidgetByName("fieldTree").setVisible(!1)
                        }
                    }
                }
            }
        }, _createComboTree: function () {
            var a = this.options, b = [];
            return {
                widget: {
                    type: "combotree",
                    fieldIsshow: this._getWidgetValueSourceOption() === YS.WidgetValueOption.ASYNC,
                    fieldId: "fieldTree",
                    items: b,
                    delimiter: "--",
                    onAfterNodeClick: function (b) {
                        var c = b.getParentNode();
                        a.async = {url: "/data/distinct", data: {formId: c.id, field: b.id}}
                    },
                    value: a.async ? [a.async.data.formId, a.async.data.field] : null
                }
            }
        }
    }), a.extend(YS.ComboCheckBox.prototype, {
        getConfigItems: function (a, b, c) {
            var no = this.options.fieldId.replace('_field_', '');
            var d = this.options, e = this, f = function () {
                var a = this.getResults();
                d.items = a.items, e.value = a.value, e.setText(a.text)
            };
            return [{
                label: "标题",
                widget: this._createTitleConfig(a),
                splitLine: !0
            }, {
                label: "描述信息",
                disabled: !b,
                widget: this._createDescriptionConfig(b),
                splitLine: !0
            }, {
                label: "数据来源",
                widget: {
                    type: "button",
                    fieldId: "ajaxurl",
                    onClick: function () {
                        e._showRelyDialog()
                    },
                    text: "选择数据源",
                    style: "white",
                    width: 240,
                    height: 30
                },
                splitLine: !0
            }, {
                label: "校验",
                widget: this._createNotNullConfig(a),
                splitLine: !0
            }, {
                widget: this._createEnableConfig()
            }, {
                widget: this._createVisibleConfig(),
                splitLine: !0
            }, {
                label: "流程相关",
                widget: this._createIsOwnerConfig()
            }, {
                widget: this._createFlowConfig()
            }, {
                widget: this._createIsSubmitConfig()
            }, {
                widget: this._createIsTitleSuffix()
            }, this._selectFlowConfig(), this._createWidgetLayoutConfig(c)]
        }
    }), a.extend(YS.DateTime.prototype, {
        getConfigItems: function (a, b, c) {
            var d = this, e = this.options, f = function (a, b) {
                e.value = a, d.setText(b)
            }, g = this._getWidgetValueSourceOption();
            return [{
                label: "标题",
                widget: this._createTitleConfig(a),
                splitLine: !0
            },
                {label: "描述信息", disabled: !b, widget: this._createDescriptionConfig(b), splitLine: !0},
                {
                    label: "类型",
                    widget: {
                        type: "combo",
                        searchable: !1,
                        fieldIsnull: !1,
                        valueField: "value",
                        items: [{text: "日期", value: "yyyy-MM-dd", selected: !0}, {
                            text: "日期时间",
                            value: "yyyy-MM-dd HH:mm:ss"
                        }],
                        onItemCreate: function (a) {
                            return e.fieldFormat === a.value && (a.selected = !0), !1
                        },
                        onAfterItemSelect: function () {
                            e.fieldFormat = this.getValue(), d.setValue(e.value);
                            var a = YS.EditForm.getConfigPane().getWidgetByName("customDate");
                            a.options.fieldFormat = this.getValue(), a.rebuild()
                        }
                    },
                    splitLine: !0
                }, {
                    label: "默认值",
                    widget: {
                        type: "combo",
                        fieldId: "dateCombo",
                        customCls: "date-type-combo",
                        valueField: "value",
                        searchable: !1,
                        fieldIsnull: !1,
                        items: [{value: "today", text: "填写当天", selected: "today" === e.value}, {
                            value: 1,
                            text: "自定义",
                            selected: g === YS.WidgetValueOption.CUSTOM && "today" !== e.value
                        }],
                        onAfterItemSelect: function (a, b) {
                            var c = this.getValue(), d = YS.EditForm.getConfigPane(),
                                g = d.getWidgetByName("customDate");
                            "today" === c ? (f("today", YS.Utils.date2Str(new Date, e.fieldFormat)), g.setVisible(!1), d.getWidgetByName("dataRely").setVisible(!1), e.rely = null) : 1 === c ? (f(g.getValue(), g.getText()), g.setVisible(!0), d.getWidgetByName("dataRely").setVisible(!1), e.rely = null) : (f(null, ""), g.setVisible(!1), d.getWidgetByName("dataRely").setVisible(!0), e.rely && (e.rely.formula = null, e.rely.widgets = []))
                        }
                    }
                }, {
                    widget: {
                        type: "datetime",
                        fieldId: "customDate",
                        fieldFormat: e.fieldFormat,
                        value: e.value,
                        fieldIsshow: g === YS.WidgetValueOption.CUSTOM && "today" !== e.value,
                        onAfterEdit: function () {
                            f(this.getValue(), this.getText())
                        }
                    }
                }, {
                    widget: {
                        type: "button",
                        fieldIsshow: g === YS.WidgetValueOption.RELY,
                        fieldId: "dataRely",
                        onClick: function () {
                            d._showRelyDialog()
                        },
                        text: "数据联动设置",
                        style: "white",
                        width: 240,
                        height: 30
                    }
                }, {
                    widget: {
                        type: "checkbox",
                        text: "可自增长",
                        value: e.fieldIsAutoIncrement,
                        fieldId: "fieldIsAutoIncrement",
                        onStateChange: function (h) {
                            var b = YS.EditForm.getConfigPane(), c = b.getWidgetByName("dateCombo").getValue(),
                                g = b.getWidgetByName("customDate");
                            e.fieldIsAutoIncrement = h;
                            if (h) {
                                d.setText(""), e.value = "", b.getWidgetByName("dateCombo").setVisible(!1), g.setVisible(!1), b.getWidgetByName("dataRely").setVisible(!1);
                            } else {
                                b.getWidgetByName("dateCombo").setVisible(!0)
                                "today" === c ? (f("today", YS.Utils.date2Str(new Date, e.fieldFormat)), g.setVisible(!1), b.getWidgetByName("dataRely").setVisible(!1), e.rely = null) : 1 === c ? (f(g.getValue(), g.getText()), g.setVisible(!0), b.getWidgetByName("dataRely").setVisible(!1), e.rely = null) : (f(null, ""), g.setVisible(!1), b.getWidgetByName("dataRely").setVisible(!0), e.rely && (e.rely.formula = null, e.rely.widgets = []))
                            }
                        }
                    },
                    splitLine: !0
                }, {
                    label: "校验",
                    widget: this._createNotNullConfig(a),
                    splitLine: !0
                }, {
                    widget: this._createEnableConfig()
                }, {
                    widget: this._createVisibleConfig(),
                    splitLine: !0
                }, {
                    label: "流程相关",
                    widget: this._createIsOwnerConfig()
                }, {
                    widget: this._createFlowConfig()
                }, {
                    widget: this._createIsSubmitConfig()
                }, {
                    widget: this._createIsTitleSuffix()
                }, this._selectFlowConfig(), this._createWidgetLayoutConfig(c)]
        }
    }), a.extend(YS.RadioGroup.prototype, {
        getConfigItems: function (a, b, c) {
            var d = this.options, e = this, f = function () {
                var a = this.getResults();
                d.items = a.items, e.rebuildWithoutVisibility()
            };
            return [{
                label: "标题",
                widget: this._createTitleConfig(a),
                splitLine: !0
            }, {label: "描述信息", disabled: !b, widget: this._createDescriptionConfig(b), splitLine: !0}, {
                label: "数据来源",
                widget: {
                    type: "button",
                    fieldId: "ajaxurl",
                    onClick: function () {
                        e._showRelyDialog()
                    },
                    text: "选择数据源",
                    style: "white",
                    width: 240,
                    height: 30
                },
                splitLine: !0
            }, {
                label: "校验",
                widget: this._createNotNullConfig(a),
                splitLine: !0
            }, {
                widget: this._createEnableConfig()
            }, {
                widget: this._createVisibleConfig(),
                splitLine: !0
            }, {
                label: "流程相关",
                widget: this._createIsOwnerConfig()
            }, {
                widget: this._createFlowConfig()
            }, {
                widget: this._createIsSubmitConfig()
            }, {
                widget: this._createIsTitleSuffix()
            }, this._selectFlowConfig(), this._createWidgetLayoutConfig(c)]
        }
    }), a.extend(YS.CheckBoxGroup.prototype, {
        getConfigItems: function (a, b, c) {
            var d = this.options, e = this, f = function () {
                var a = this.getResults();
                d.items = a.items, e.rebuildWithoutVisibility()
            };
            return [{
                label: "标题",
                widget: this._createTitleConfig(a),
                splitLine: !0
            }, {label: "描述信息", disabled: !b, widget: this._createDescriptionConfig(b), splitLine: !0}, {
                label: "数据来源",
                widget: {
                    type: "button",
                    fieldId: "ajaxurl",
                    onClick: function () {
                        e._showRelyDialog()
                    },
                    text: "选择数据源",
                    style: "white",
                    width: 240,
                    height: 30
                },
                splitLine: !0
            }, {
                label: "校验",
                widget: this._createNotNullConfig(a),
                splitLine: !0
            }, {
                widget: this._createEnableConfig()
            }, {
                widget: this._createVisibleConfig(),
                splitLine: !0
            }, {
                label: "流程相关",
                widget: this._createIsOwnerConfig()
            }, {
                widget: this._createFlowConfig()
            }, {
                widget: this._createIsSubmitConfig()
            }, {
                widget: this._createIsTitleSuffix()
            }, this._selectFlowConfig(), this._createWidgetLayoutConfig(c)]
        }
    }), a.extend(YS.Address.prototype, {
        getConfigItems: function (a, b, c) {
            var d = this.options, e = this;
            return [{
                label: "标题",
                widget: this._createTitleConfig(a),
                splitLine: !0
            }, {label: "描述信息", disabled: !b, widget: this._createDescriptionConfig(b), splitLine: !0}, {
                label: "校验",
                widget: this._createNotNullConfig(a)
            }, {
                widget: {
                    type: "checkbox", text: "显示详细地址", value: d.needDetail, onStateChange: function () {
                        d.needDetail = this.getValue(), e.rebuildWithoutVisibility()
                    }
                }, splitLine: !0
            }, {
                widget: this._createEnableConfig()
            }, {
                widget: this._createVisibleConfig(),
                splitLine: !0
            }, {
                label: "流程相关",
                widget: this._createIsOwnerConfig()
            }, {
                widget: this._createFlowConfig()
            }, {
                widget: this._createIsSubmitConfig()
            }, {
                widget: this._createIsTitleSuffix()
            }, this._selectFlowConfig()]
        }
    }), a.extend(YS.FileUpload.prototype, {
        getConfigItems: function (a, b, c) {
            var no = this.options.fieldId.replace('_field_', '');
            var d = this.options, e = this;
            return [{
                label: "标题",
                widget: this._createTitleConfig(a),
                splitLine: !0
            }, {label: "描述信息", disabled: !b, widget: this._createDescriptionConfig(b), splitLine: !0}, {
                label: "校验",
                widget: this._createNotNullConfig(a)
            }, {
                widget: {
                    type: "checkbox", text: "允许多文件上传", value: d.maxFileCount > 1, onStateChange: function () {
                        this.getValue() ? d.maxFileCount = 10 : d.maxFileCount = 1
                    }
                }, splitLine: !0
            }, {
                widget: this._createEnableConfig()
            }, {
                widget: this._createVisibleConfig(),
                splitLine: !0
            }, {
                label: "流程相关",
                widget: this._createIsOwnerConfig()
            }, {
                widget: this._createFlowConfig()
            }, {
                widget: this._createIsSubmitConfig()
            }, {
                widget: this._createIsTitleSuffix()
            }, this._selectFlowConfig(), this._createWidgetLayoutConfig(c)]
        }
    }), a.extend(YS.Separator.prototype, {
        getConfigItems: function (a, b) {
            var c = (this.options, this);
            return this.getOptions(), [{
                label: "标题",
                widget: this._createTitleConfig(a),
                splitLine: !0
            }, {
                label: "描述信息",
                widget: this._createDescriptionConfig(b),
                splitLine: !0
            }]
        }
    }), a.extend(YS.User.prototype, {
        _getLimit: function () {
            return this.options.fieldLimit
        }, _setLimit: function (a) {
            this.options.fieldLimit = a
        }, _getDeptWidgets: function () {
            var a = [];
            return YS.Utils.forEach(YS.EditForm.collectItems(), function (b, c) {
                c && c.widget && ("dept" !== c.widget.type && "deptgroup" !== c.widget.type || a.push({
                    value: c.widget.fieldId,
                    text: c.labelName
                }))
            }), a
        }, _setDefaultValue: function () {
            var a = this.options, b = this, c = new YS.ConfirmDialog({
                title: a.title,
                height: 550,
                width: 590,
                contentWidget: {
                    rowSize: [440],
                    colSize: [590],
                    items: [[{
                        fieldId: a.fieldId,
                        type: a.type,
                        editable: !0,
                        value: a.value,
                        fieldLimit: a.fieldLimit,
                        dynamicType: "set"
                    }]]
                },
                onOk: function () {
                    var d = c.getWidgetByName(a.fieldId);
                    return a.value = d.getValue(), b.value = a.value, a.fieldDefaultValueName = d.getText(), b.items = d.getItems(), b._initSelectPane(), !1
                }
            });
            c.show()
        }, _getAssignmentUrl: function () {
            var b = this, c = this.options;
            /*return {
             label: "赋值URL",
             widget: {
             type: "text",
             fieldId: "assignUrl",
             onStopEdit: function(){
             this.checkValidate();
             },
             onAfterValidate: function(val,bool){
             if(bool){
             c.assignmentUrl = val;
             }else{}
             }
             },
             splitLine: !0
             }*/
        }, _getLimitConfig: function () {
            var a = this, b = this.options;
            return {
                label: "可选范围",
                widget: {
                    type: "deptlimitpane",
                    items: [{value: "custom", text: "自定义"}],
                    fieldLimit: this._getLimit(),
                    rely: b.rely,
                    limitWidget: b.limitWidget,
                    title: b.title,
                    dynamicFields: b.dynamicFields,
                    onAfterLimitSet: function (b) {
                        a._setLimit(b)
                    },
                    onAfterTypeChange: function (c) {
                        switch (c) {
                            case"custom":
                                b.rely = null, b.limitWidget = null;
                                break;
                            case"rely":
                                b.fieldLimit = [], b.limitWidget = null, b.value = a.getNullValue();
                                break;
                            case"widgets":
                                b.rely = null, b.fieldLimit = [], b.value = a.getNullValue()
                        }
                    },
                    onBeforeWidgetsCreate: function () {
                        this.setDeptWidgets(a._getDeptWidgets())
                    },
                    onAfterWidgetSelect: function (a) {
                        b.limitWidget = a
                    },
                    onRelySet: function () {
                        a._showRelyDialog()
                    },
                    onSetDefaultValue: function () {
                        a._setDefaultValue()
                    }
                },
                splitLine: !0
            }
        }, getConfigItems: function (a, b, c) {
            return [{
                label: "标题",
                widget: this._createTitleConfig(a),
                splitLine: !0
            }, {
                label: "描述信息",
                disabled: !b,
                widget: this._createDescriptionConfig(b),
                splitLine: !0
            }, {
                label: "校验",
                widget: this._createNotNullConfig(a),
                splitLine: !0
            }, {
                widget: this._createEnableConfig()
            }, {
                widget: this._createVisibleConfig(),
                splitLine: !0
            }, {
                label: "流程相关",
                widget: this._createIsOwnerConfig()
            }, {
                widget: this._createFlowConfig()
            }, {
                widget: this._createIsSubmitConfig()
            }, {
                widget: this._createIsTitleSuffix()
            }, this._selectFlowConfig(), this._createWidgetLayoutConfig(c)]
        }
        //人员查询信息
    }),
        a.extend(YS.UserMsg.prototype, {
            _getLimit: function () {
                return this.options.fieldLimit
            }, _setLimit: function (a) {
                this.options.fieldLimit = a
            }, _getDeptWidgets: function () {
                var a = [];
                return YS.Utils.forEach(YS.EditForm.collectItems(), function (b, c) {
                    c && c.widget && ("dept" !== c.widget.type && "deptgroup" !== c.widget.type || a.push({
                        value: c.widget.fieldId,
                        text: c.labelName
                    }))
                }), a
            },
            _setDefaultValue: function () {
                var a = this, b = this.options, e = b.ajaxurl, f = [];
                var arrData = [{code: 'no', text: "工号"}
                    , {code: 'name', text: "姓名"}
                    //,{code:'no',text:"工号"}
                    , {code: 'gender', text: "性别"}
                    , {code: 'idCard', text: "身份证"}
                    , {code: 'education', text: "学历"}
                    , {code: 'graduationTime', text: "毕业时间"}
                    , {code: 'graduateSchoole', text: "毕业学校"}
                    , {code: 'graduateMajor', text: "专业"}
                    , {code: 'postname', text: "职位"}
                    , {code: 'classname', text: "班级"}
                    , {code: 'enterTime', text: "入司时间"}
                ];

                var o = new YS.ConfirmDialog({
                    title: "人员信息查询",
                    width: 500,
                    height: 450,
                    contentWidget: {
                        /*rowSize: [32],
                        colSize: [86, 320],
                        hgap: 8,
                        vgap: 20,
                        padding: 15,*/
                        items: [[{type: "label", text: "人员信息拓展", width: 86}, {
                            type: "textbox",
                            fieldId: "code",
                            textField: "text",
                            items: arrData
                        }]]
                    },
                    onOk: function () {
                        var t = this;
                        var i = o.getWidgetByName('code');
                        //o._delSupBisItemWidget(a);
                        o._createUserItemWidget(i.options, a, o);
                        return !1
                    },
                    onCancel: function () {
                        b.ajaxurl = e;
                        return !1
                    }
                });
                o.show();
            },
            _getAssignmentUrl: function () {
                var b = this, c = this.options;
                /*return {
                 label: "赋值URL",
                 widget: {
                 type: "text",
                 fieldId: "assignUrl",
                 onStopEdit: function(){
                 this.checkValidate();
                 },
                 onAfterValidate: function(val,bool){
                 if(bool){
                 c.assignmentUrl = val;
                 }else{}
                 }
                 },
                 splitLine: !0
                 }*/
            },
            _getLimitConfig: function () {
                var a = this, b = this.options;
                return {
                    label: "可选范围",
                    widget: {
                        type: "deptlimitpane",
                        items: [{value: "custom", text: "自定义"}],
                        fieldLimit: this._getLimit(),
                        rely: b.rely,
                        limitWidget: b.limitWidget,
                        title: b.title,
                        dynamicFields: b.dynamicFields,
                        onAfterLimitSet: function (b) {
                            a._setLimit(b)
                        },
                        onAfterTypeChange: function (c) {
                            switch (c) {
                                case"custom":
                                    b.rely = null, b.limitWidget = null;
                                    break;
                                case"rely":
                                    b.fieldLimit = [], b.limitWidget = null, b.value = a.getNullValue();
                                    break;
                                case"widgets":
                                    b.rely = null, b.fieldLimit = [], b.value = a.getNullValue()
                            }
                        },
                        onBeforeWidgetsCreate: function () {
                            this.setDeptWidgets(a._getDeptWidgets())
                        },
                        onAfterWidgetSelect: function (a) {
                            b.limitWidget = a
                        },
                        onRelySet: function () {
                            a._showRelyDialog()
                        },
                        onSetDefaultValue: function () {
                            a._setDefaultValue()
                        }
                    },
                    splitLine: !0
                }
            },
            getConfigItems: function (a, b, c) {
                var d = this.options, e = this;
                return [{
                    label: "标题",
                    widget: this._createTitleConfig(a),
                    splitLine: !0
                }, {
                    label: "描述信息",
                    disabled: !b,
                    widget: this._createDescriptionConfig(b),
                    splitLine: !0
                }, {
                    label: "校验",
                    widget: this._createNotNullConfig(a),
                    splitLine: !0
                }, {
                    label: "选择人员信息",
                    widget: {
                        type: "button",
                        fieldId: "bistable",
                        onClick: function () {
                            e._showUserMsgDialog()
                        },
                        text: "人员信息",
                        style: "white",
                        width: 240,
                        height: 30
                    }
                }, {
                    widget: this._createEnableConfig()
                }, {
                    widget: this._createVisibleConfig(),
                    splitLine: !0
                }, {
                    label: "流程相关",
                    widget: this._createIsOwnerConfig()
                }, {
                    widget: this._createFlowConfig()
                }, {
                    widget: this._createIsSubmitConfig()
                }, {
                    widget: this._createIsTitleSuffix()
                }, this._selectFlowConfig(), this._createWidgetLayoutConfig(c)]
            }
        }),
        a.extend(YS.ProjectMsg.prototype, {
            _getLimit: function () {
                return this.options.fieldLimit
            },
            _setLimit: function (a) {
                this.options.fieldLimit = a
            },
            _getDeptWidgets: function () {
                var a = [];
                return YS.Utils.forEach(YS.EditForm.collectItems(), function (b, c) {
                    c && c.widget && ("dept" !== c.widget.type && "deptgroup" !== c.widget.type || a.push({
                        value: c.widget.fieldId,
                        text: c.labelName
                    }))
                }), a
            },
            _setDefaultValue: function () {
                var a = this, b = this.options, e = b.ajaxurl, f = [];
                var o = new YS.ConfirmDialog({
                    title: "项目信息",
                    width: 500,
                    height: 450,
                    contentWidget: {
                        rowSize: [32],
                        colSize: [86, 320],
                        hgap: 8,
                        vgap: 20,
                        padding: 15,
                        items: []
                    },
                    onOk: function () {
                        var t = this;
                        var i = o.getWidgetByName('code');
                        //o._delSupBisItemWidget(a);
                        o._createProjectMsgItemWidget(i.options, a, o);
                        return !1
                    },
                    onCancel: function () {
                        b.ajaxurl = e;
                        return !1
                    }
                });
                o.show();
            },
            _getAssignmentUrl: function () {
                var b = this, c = this.options;
                /*return {
                 label: "赋值URL",
                 widget: {
                 type: "text",
                 fieldId: "assignUrl",
                 onStopEdit: function(){
                 this.checkValidate();
                 },
                 onAfterValidate: function(val,bool){
                 if(bool){
                 c.assignmentUrl = val;
                 }else{}
                 }
                 },
                 splitLine: !0
                 }*/
            },
            _getLimitConfig: function () {
                var a = this, b = this.options;
                return {
                    label: "可选范围",
                    widget: {
                        type: "deptlimitpane",
                        items: [{value: "custom", text: "自定义"}],
                        fieldLimit: this._getLimit(),
                        rely: b.rely,
                        limitWidget: b.limitWidget,
                        title: b.title,
                        dynamicFields: b.dynamicFields,
                        onAfterLimitSet: function (b) {
                            a._setLimit(b)
                        },
                        onAfterTypeChange: function (c) {
                            switch (c) {
                                case"custom":
                                    b.rely = null, b.limitWidget = null;
                                    break;
                                case"rely":
                                    b.fieldLimit = [], b.limitWidget = null, b.value = a.getNullValue();
                                    break;
                                case"widgets":
                                    b.rely = null, b.fieldLimit = [], b.value = a.getNullValue()
                            }
                        },
                        onBeforeWidgetsCreate: function () {
                            // this.setDeptWidgets(a._getDeptWidgets())
                        },
                        onAfterWidgetSelect: function (a) {
                            b.limitWidget = a
                        },
                        onRelySet: function () {
                            a._showRelyDialog()
                        },
                        onSetDefaultValue: function () {
                            a._setDefaultValue()
                        }
                    },
                    splitLine: !0
                }
            },
            getConfigItems: function (a, b, c) {
                var d = this.options, e = this;
                return [{
                    label: "标题",
                    widget: this._createTitleConfig(a),
                    splitLine: !0
                }, {
                    label: "描述信息",
                    disabled: !b,
                    widget: this._createDescriptionConfig(b),
                    splitLine: !0
                }, {
                    label: "校验",
                    widget: this._createNotNullConfig(a),
                    splitLine: !0
                }, {
                    label: "选择项目信息",
                    widget: {
                        type: "button",
                        fieldId: "bistable",
                        onClick: function () {
                            e._showProjectMsgDialog()
                        },
                        text: d.labelName,
                        style: "white",
                        width: 240,
                        height: 30
                    }
                }, {
                    widget: this._createEnableConfig()
                }, {
                    widget: this._createVisibleConfig(),
                    splitLine: !0
                }, {
                    label: "流程相关",
                    widget: this._createIsOwnerConfig()
                }, {
                    widget: this._createFlowConfig()
                }, {
                    widget: this._createIsSubmitConfig()
                }, {
                    widget: this._createIsTitleSuffix()
                }, this._selectFlowConfig(), this._createWidgetLayoutConfig(c)]
            }
        }),
        a.extend(YS.UserGroup.prototype, {
            getConfigItems: function (a, b, c) {
                return [{
                    label: "标题",
                    widget: this._createTitleConfig(a),
                    splitLine: !0
                }, {
                    label: "描述信息",
                    disabled: !b,
                    widget: this._createDescriptionConfig(b),
                    splitLine: !0
                }, {
                    label: "校验",
                    widget: this._createNotNullConfig(a),
                    splitLine: !0
                }, {
                    widget: this._createEnableConfig()
                }, {
                    widget: this._createVisibleConfig(),
                    splitLine: !0
                }, {
                    label: "流程相关",
                    widget: this._createIsOwnerConfig()
                }, {
                    widget: this._createFlowConfig()
                }, {
                    widget: this._createIsSubmitConfig()
                }, {
                    widget: this._createIsTitleSuffix()
                }, this._selectFlowConfig(), this._createWidgetLayoutConfig(c)]
            }
        }), a.extend(YS.BisTable.prototype, {
        _getDeptWidgets: function () {
            var a = [];
            return YS.Utils.forEach(YS.EditForm.collectItems(), function (b, c) {
                c && c.widget && ("dept" !== c.widget.type && "deptgroup" !== c.widget.type || a.push({
                    value: c.widget.fieldId,
                    text: c.labelName
                }))
            }), a
        },
        _setDefaultValue: function () {
            var a = this.options, b = this;
            c.show()
        },
        _getAssignmentUrl: function () {
            var b = this, c = this.options;
        },
        getConfigItems: function (a, b, c) {
            var d = this.options, e = this;
            return [{
                label: "标题",
                widget: this._createTitleConfig(a),
                splitLine: !0
            }, {
                label: "描述信息",
                disabled: !b,
                widget: this._createDescriptionConfig(b),
                splitLine: !0
            }, {
                label: "校验",
                widget: this._createNotNullConfig(a),
                splitLine: !0
            }, {
                widget: this._createEnableConfig()
            }, {
                widget: this._createVisibleConfig(),
                splitLine: !0
            }, {
                label: "选择底表类型",
                widget: {
                    type: "button",
                    fieldId: "bistable",
                    onClick: function () {
                        e._showBisTableDialog()
                    },
                    text: "底表类型",
                    style: "white",
                    width: 240,
                    height: 30
                }
            }, {
                label: "流程相关",
                widget: this._createIsOwnerConfig()
            }, {
                widget: this._createFlowConfig()
            }, {
                widget: this._createIsSubmitConfig()
            }, {
                widget: this._createIsTitleSuffix()
            }, this._selectFlowConfig(), this._createWidgetLayoutConfig(c)]
        }
    }), a.extend(YS.LinkData.prototype, {
        getConfigItems: function (a, b, c) {
            var d = this.options, e = this, f = [], g = {}, h = {}, i = d.linkForm, j = function () {
                e.rebuildWithoutVisibility()
            };
            var k = YS.EditForm.getEntryList(!0);
            return YS.Utils.forEach(k, function (a, b) {
                var c = b.entryId;
                c = [b.entryId].join(YS.CONST.FIELD.DELIMITER), f.push({
                    text: b.name,
                    value: c
                });
                var d = [], e = [];
                YS.Utils.forEach(b.fields, function (a, b) {
                    var c = {text: b.text, name: b.name, type: b.type, items: b.items, fieldFormat: b.fieldFormat};
                    d.push(c), YS.LimitFields.linkKey.indexOf(b.type) > -1 && e.push({
                        text: b.text,
                        type: b.type,
                        value: b.name
                    })
                }), h[c] = e, g[c] = d
            }), [{
                label: "标题",
                widget: this._createTitleConfig(a),
                splitLine: !0
            }, {label: "描述信息", disabled: !b, widget: this._createDescriptionConfig(b), splitLine: !0}, {
                label: "关联表",
                widget: {
                    type: "combo", fieldIsnull: !1, items: f, value: i, onAfterItemSelect: function () {
                        var a = this.getValue();
                        if (new RegExp(YS.CONST.FIELD.DELIMITER).test(a)) {
                            if ([d.linkForm].join(YS.CONST.FIELD.DELIMITER) === a) return;
                            var b = a.split(YS.CONST.FIELD.DELIMITER);
                            d.linkForm = b[0]
                        } else {
                            if (d.linkForm === a) return;
                            d.linkForm = a
                        }
                        d.linkFields = [], d.linkFilter = [];
                        var c = YS.EditForm.getConfigPane().getWidgetByName("linkFields");
                        c.options.availableFields = g[a], c.options.fields = d.linkFields, c.rebuild();
                        var e = YS.EditForm.getConfigPane().getWidgetByName("linkKey");
                        e.options.items = h[a], e.rebuild(), e.setValue(null)
                    }
                },
                splitLine: !0
            }, {
                widget: {
                    type: "link_field_edit",
                    title: "显示字段",
                    fieldId: "linkFields",
                    availableFields: g[i],
                    fields: d.linkFields,
                    onAfterFieldAdd: j,
                    onAfterFieldUpdate: j,
                    onAfterFieldRemove: j,
                    onAfterFieldSorted: j
                }, splitLine: !0
            }, {
                label: "主键字段",
                widget: {
                    fieldId: "linkKey",
                    type: "combo",
                    value: d.linkForm ? d.linkKey : null,
                    items: d.linkForm ? h[i] : [],
                    onAfterItemSelect: function (a, b) {
                        d.linkKey = this.getValue(), d.linkType = b ? b.type : "", j && j()
                    }
                },
                splitLine: !0
            }, {
                label: "关联字段条件限定",
                widget: {
                    type: "button", text: "添加关联条件", width: 240, height: 30, style: "white", onClick: function () {
                        e.getLinkFilterConfig(d, g, j)
                    }
                },
                splitLine: !0
            }, {
                label: "校验",
                widget: this._createNotNullConfig(a),
                splitLine: !0
            }, {
                widget: this._createEnableConfig()
            }, {
                widget: this._createVisibleConfig(),
                splitLine: !0
            }, this._createWidgetLayoutConfig(c)]
        }
    }), a.extend(YS.Dept.prototype, {
        _getLimit: function () {
            return this.options.fieldLimit
        }, _setLimit: function (a) {
            this.options.fieldLimit = a
        }, _setDefaultValue: function () {
            var a = this.options, b = this, c = new YS.ConfirmDialog({
                title: a.title,
                height: 550,
                width: 590,
                contentWidget: {
                    rowSize: [440],
                    colSize: [590],
                    items: [[{
                        fieldId: a.fieldId,
                        type: a.type,
                        editable: !0,
                        value: a.value,
                        fieldLimit: a.fieldLimit,
                        dynamicType: "set"
                    }]]
                },
                onOk: function () {
                    var d = c.getWidgetByName(a.fieldId);
                    return a.value = d.getValue(), b.value = a.value, b.items = d.getItems(), b._initSelectPane(), !1
                }
            });
            c.show()
        }, _getLimitConfig: function () {
            var a = this, b = this.options;
            return {
                label: "可选范围",
                widget: {
                    type: "deptlimitpane",
                    items: [{value: "custom", text: "自定义"}],
                    fieldLimit: this._getLimit(),
                    rely: b.rely,
                    title: b.title,
                    dynamicFields: [{id: YS.CONST.DEPT_ID.CURRENT, name: "当前用户所处部门"}],
                    onAfterLimitSet: function (b) {
                        a._setLimit(b)
                    },
                    onAfterTypeChange: function (c) {
                        "custom" === c ? b.rely = null : (b.fieldLimit = [], b.value = a.getNullValue())
                    },
                    onRelySet: function () {
                        a._showRelyDialog()
                    },
                    onSetDefaultValue: function () {
                        a._setDefaultValue()
                    }
                },
                splitLine: !0
            }
        }, _getOrgTypeConfig: function () {
            var a = this, b = this.options;
            return {
                label: "可选类型",
                widget: {
                    type: "combo",
                    searchable: !1,
                    fieldId: "orgTypeSelect",
                    valueField: "value",
                    items: [{value: "company", text: "公司"}, {value: "dept", text: "公司和部门"}],
                    value: b.type,
                    onAfterItemSelect: function () {
                        a.options.type = this.getValue();
                    }
                },
                splitLine: !0
            }
        }, getConfigItems: function (a, b, c) {
            return [{
                label: "标题",
                widget: this._createTitleConfig(a),
                splitLine: !0
            }, {
                label: "描述信息",
                disabled: !b,
                widget: this._createDescriptionConfig(b),
                splitLine: !0
            }, this._getOrgTypeConfig(), {
                label: "校验",
                widget: this._createNotNullConfig(a),
                splitLine: !0
            }, {
                widget: this._createEnableConfig()
            }, {
                widget: this._createVisibleConfig(),
                splitLine: !0
            }, {
                label: "流程相关",
                widget: this._createIsOwnerConfig()
            }, {
                widget: this._createFlowConfig()
            }, {
                widget: this._createIsSubmitDeptConfig()
            }, {
                widget: this._createIsTitleSuffix()
            }, this._selectFlowConfig(), this._createWidgetLayoutConfig(c)]
        }
    }), a.extend(YS.DeptGroup.prototype, {
        _getLimit: function () {
            return this.options.fieldLimit
        }, _setLimit: function (a) {
            this.options.fieldLimit = a
        }, _getOrgTypeConfig: function () {
            var a = this, b = this.options;
            return {
                label: "可选类型",
                widget: {
                    type: "combo",
                    searchable: !1,
                    fieldId: "orgTypeSelect",
                    valueField: "value",
                    items: [{value: "companygroup", text: "公司"}, {value: "deptgroup", text: "公司和部门"}],
                    value: b.type,
                    onAfterItemSelect: function () {
                        a.options.type = this.getValue();
                    }
                },
                splitLine: !0
            }
        }, getConfigItems: function (a, b, c) {
            return [{
                label: "标题",
                widget: this._createTitleConfig(a),
                splitLine: !0
            }, {
                label: "描述信息",
                disabled: !b,
                widget: this._createDescriptionConfig(b),
                splitLine: !0
            }, this._getOrgTypeConfig(), {
                label: "校验",
                widget: this._createNotNullConfig(a),
                splitLine: !0
            }, {
                widget: this._createEnableConfig()
            }, {
                widget: this._createVisibleConfig(),
                splitLine: !0
            }, {
                label: "流程相关",
                widget: this._createIsOwnerConfig()
            }, {
                widget: this._createFlowConfig()
            }, {
                widget: this._createIsTitleSuffix()
            }, this._selectFlowConfig(), this._createWidgetLayoutConfig(c)]
        }
    }), a.extend(YS.DeptAdmin.prototype, {
        _getLimit: function () {
            return this.options.fieldLimit
        }, _setLimit: function (a) {
            this.options.fieldLimit = a
        }, _setDefaultValue: function () {
            var a = this.options, b = this, c = new YS.ConfirmDialog({
                title: a.title,
                height: 550,
                width: 590,
                contentWidget: {
                    rowSize: [440],
                    colSize: [590],
                    items: [[{
                        fieldId: a.fieldId,
                        type: a.type,
                        linkWidgets: a.linkWidgets,
                        editable: !0,
                        value: a.value,
                        fieldLimit: a.fieldLimit,
                        dynamicType: "set"
                    }]]
                },
                onOk: function () {
                    var d = c.getWidgetByName(a.fieldId);
                    return a.value = d.getValue(), b.value = a.value, b.items = d.getItems(), b._initSelectPane(), !1
                }
            });
            c.show()
        }, _getLimitConfig: function () {
            var a = this, b = this.options;
            return {
                label: "可选范围",
                widget: {
                    type: "deptlimitpane",
                    items: [{value: "custom", text: "自定义"}],
                    fieldLimit: this._getLimit(),
                    rely: b.rely,
                    title: b.title,
                    dynamicFields: [{id: YS.CONST.DEPT_ID.CURRENT, name: "当前用户所处部门"}],
                    onAfterLimitSet: function (b) {
                        a._setLimit(b)
                    },
                    onAfterTypeChange: function (c) {
                        "custom" === c ? b.rely = null : (b.fieldLimit = [], b.value = a.getNullValue())
                    },
                    onRelySet: function () {
                        a._showRelyDialog()
                    },
                    onSetDefaultValue: function () {
                        a._setDefaultValue()
                    }
                },
                splitLine: !0
            }
        },getConfigItems: function (a, b, c) {
            var d = this.options, e = this;
            return [{
                label: "标题",
                widget: this._createTitleConfig(a),
                splitLine: !0
            }, {
                label: "描述信息",
                disabled: !b,
                widget: this._createDescriptionConfig(b),
                splitLine: !0
            }, {
                label: "校验",
                widget: this._createNotNullConfig(a),
                splitLine: !0
            },{
                label: "选择部门信息",
                widget: {
                    type: "button",
                    fieldId: "bistable",
                    onClick: function () {
                        e._showDeptAdminDialog()
                    },
                    text: "部门管理者信息",
                    style: "white",
                    width: 240,
                    height: 30
                }
            },  {
                widget: this._createEnableConfig()
            }, {
                widget: this._createVisibleConfig(),
                splitLine: !0
            }, {
                label: "流程相关",
                widget: this._createIsOwnerConfig()
            }, {
                widget: this._createFlowConfig()
            }, {
                widget: this._createIsSubmitDeptConfig()
            }, {
                widget: this._createIsTitleSuffix()
            }, this._selectFlowConfig(), this._createWidgetLayoutConfig(c)]
        }
    }), a.extend(YS.SubForm.prototype, {
        _getWidgetByIndex: function (a) {
            var b = this.$body.children("tr").eq(0), c = this.$head;
            if (b.length > 0) {
                var d = b.children("td").eq(a), e = d.data("widget");
                if (e) return {labelName: c.find(".form-cell").eq(a), widget: e}
            }
            return null
        }, getConfigItems: function (a, b) {
            var c = this.options, d = this;
            return this.getOptions(), [{
                label: "标题",
                widget: this._createTitleConfig(a),
                splitLine: !0
            }, {label: "描述信息", disabled: !b, widget: this._createDescriptionConfig(b), splitLine: !0}, {
                label: "字段",
                widget: {
                    type: "subformpane", items: c.items, onAfterItemAdd: function (a) {
                        c.items.push(a), d.rebuildWithoutVisibility()
                    }, onAfterItemRemove: function (a) {
                        c.items.splice(a, 1), d.rebuildWithoutVisibility()
                    }, onAfterItemSelect: function (b) {
                        var c = d._getWidgetByIndex(b);
                        YS.EditForm && YS.EditForm.showWidgetConfigPane(c.labelName, null, null, c.widget, a.closest(".widget-view"))
                    }, onAfterDrop: function () {
                        c.items = this.collectAllItems(), d.rebuildWithoutVisibility()
                    }
                },
                splitLine: !0
            }, {
                label: "默认值",
                widget: {
                    type: "button", text: "设置", width: 240, height: 30, style: "white", onClick: function () {
                        d._createDefaultValueConfig()
                    }
                },
                splitLine: !0
            }, {
                label: "校验",
                widget: this._createNotNullConfig(a),
                splitLine: !0
            }, {
                widget: this._createEnableConfig(),
                splitLine: !0
            }, {
                label: "流程相关",
                widget: this._createIsOwnerConfig()
            }, {
                widget: this._createFlowConfig()
            }, {
                widget: this._createIsSubmitConfig()
            }, {
                widget: this._createIsTitleSuffix()
            }, this._selectFlowConfig(), this._createWidgetLayoutConfig(d.element)]
        }, _createDefaultValueConfig: function () {
            var a = this, b = this.options, c = new YS.ConfirmDialog({
                title: "默认值",
                width: 682,
                height: 430,
                text4Ok: "完成",
                contentWidget: {
                    rowSize: [310],
                    colSize: [650],
                    padding: 16,
                    items: [[{
                        type: "subform",
                        fieldId: "defaultValueTable",
                        customCls: "dialog-subform",
                        noFieldText: "设置默认值",
                        ignoreOptAuth: !0,
                        items: b.items.slice(0),
                        value: b.value
                    }]]
                },
                onOk: function () {
                    var c = this.getWidgetByName("defaultValueTable").getValue();
                    return b.value = c, 0 === b.value.length && (b.value = null), a.rebuildWithoutVisibility(), !1
                }
            });
            c.show()
        }
    })
}(jQuery), function (a) {
    YS.FormUtils = YS.FormUtils || {}, a.extend(YS.FormUtils, {
        getAllEntryList: function (a) {
            var b = [];
            return YS.Utils.forEach(a.formItems, function (a, c) {
                var d = YS.Utils.getFieldAttr(c);
                d && b.push(d)
            }), [{formId: formInfoId, formName: title ? title : a.formName, type: "form", fields: b}]
        }
    })
}(jQuery), function (a) {
    YS.EditForm = YS.EditForm || {}, a.extend(YS.EditForm, {
        titleSuffix: [],
        CONSTS: {
            widgetTypeChangeList: {
                text: {text: "单行文本"},
                radiogroup: {text: "单选按钮组"},
                combo: {text: "下拉框"},
                checkboxgroup: {text: "复选框组"},
                combocheck: {text: "下拉复选框"},
                number: {text: "数字"},
                datetime: {text: "日期时间"},
                address: {text: "地址"},
                textarea: {text: "多行文本"},
                upload: {text: "文件上传"},
                subform: {text: "子表单"},
                separator: {text: "分割线"},
                user: {text: "成员单选"},
                usergroup: {text: "成员多选"},
                dept: {text: "部门单选"},
                deptgroup: {text: "部门多选"},
                bistable: {text: "底表数据"},
                usermsg: {text: "人员信息"},
                projectmsg: {text: "项目信息"}
            },
            subWidgetTypeChangeList: {
                text: {text: "单行文本"},
                combo: {text: "下拉框"},
                datetime: {text: "日期时间"},
                number: {text: "数字"},
                combocheck: {text: "下拉复选框"}
            }
        }, init: function (d) {
            YS.STATIC.ENTRYID = formInfoId, this.subWidgetMap = {};
            this.formConfig = new YS.FormConfig(), this.$factory = a("#fx-factory"), this.$oContent = a("#form-other-content"), this._initData(d), this._initRouter(), this._bindConfirmBeforeClose()
        }, _initData: function (c) {
            var a = this;
            if (c && c.length > 0) {
                for (var i = 0; i < c.length; i++) {
                    if (c[i].fieldIsname == 1) {
                        a.titleSuffix.push(c[i]);
                    }
                    if (c[i].fieldPid) {
                        a.subWidgetMap[c[i].fieldPid] ? a.subWidgetMap[c[i].fieldPid].push(c[i]) : (a.subWidgetMap[c[i].fieldPid] = [c[i]]);
                        c.splice(i, 1);
                        i--;
                    }
                }
                $.isEmptyObject(a.subWidgetMap) || $.each(c, function (d, e) {
                    if (a.subWidgetMap[e.fieldId]) {
                        switch (e.type) {
                            case "subform":
                                c[d].items = a.subWidgetMap[e.fieldId];
                                break;
                            case "deptadmin":
                            case "bistable":
                            case "usermsg":
                            case "projectmsg":
                                c = c.concat(a.subWidgetMap[e.fieldId]);
                                break;
                        }

                    }
                });
                c = c.sort(function (a, b) {
                    return a.fieldOrderno - b.fieldOrderno
                })
                a.formConfig.setConfig(c);
            }
        }, _initRouter: function () {
            var a = this, b = Router({
                "/": function () {
                    a._dealNaviEvent()
                }, "/:target": function (b) {
                    a._dealNaviEvent(b)
                }
            });
            b.init("/")
        }, _dealNaviEvent: function () {
            var c = this, d = a(".frame-edit-navibar");
            a(".design", d).addClass("active").siblings().removeClass("active"), this.$oContent.hide(), this.$factory.show(), this.formDesign ? this.formDesign.resetFormConfig() : this.formDesign = new YS.FormDesign(a.extend({
                titleSuffix: c.titleSuffix,
                onSave: function (a) {
                    c.formConfig.updateConfig(a)
                }
            }, this.formConfig.getConfig()), this.$factory);
        }, _bindConfirmBeforeClose: function () {
            var a = this;
            return void(window.onbeforeunload = function (b) {
                if (a.formDesign && !a.formDesign.compareFormItems()) return b = b || window.event, b && (b.returnValue = "当前页面未保存"), "当前页面未保存"
            })
        }, getAllEntryList: function () {
            var a = this.formConfig.getConfig(), b = this.formDesign.collectItems();
            return YS.FormUtils.getAllEntryList($.extend(a, {formItems: b}))
        }, getEntryList: function (a) {
            var b = this.formConfig.getConfig(), c = [].concat(b.entryList);
            return c
        }, getFormLayout: function () {
            if (this.formDesign) return this.formDesign.config.formLayout;
            var a = this.formConfig.getConfig();
            return a.formLayout
        }, getFormAttr: function () {
            var a = this.formConfig.getConfig();
            return a.formAttr
        }, collectItems: function (a) {
            return this.formDesign ? this.formDesign.collectItems(a) : []
        }, getConfigPane: function () {
            return this.formDesign ? this.formDesign.configPane : {}
        }, getNextItems: function (a) {
            return this.formDesign ? this.formDesign.getNextItems(a) : []
        }, getFieldLabelMap: function () {
            return this.formDesign ? this.formDesign.getFieldLabelMap() : {}
        }, showWidgetConfigPane: function (a, b, c, d, e) {
            this.formDesign && this.formDesign.showWidgetConfigPane(a, b, c, d, e)
        }, insertWidget: function (a, b, c, d, e) {
            this.formDesign && this.formDesign._insertWidget(a, b, c, d, e)
        }
    })
}(jQuery), function (a) {
    YS.FormConfig = function () {
        this.config = {}
    }, a.extend(YS.FormConfig.prototype, {
        setConfig: function (b) {
            a.extend(this.config, {
                formItems: b || [],
                widgetsMap: {},
                formLayout: b.length > 0 ? b[0].fieldLayout : "grid-2"
            })
        }, updateConfig: function (b) {
            a.extend(this.config, {formLayout: b.length > 0 ? b[0].fieldLayout : "grid-2", formItems: b})
        }, getConfig: function () {
            return this.config || {}
        }, setFormName: function (b) {
            a.extend(this.config, {formName: b})
        }
    })
}(jQuery), function (a) {
    YS.FormDesign = function (a, b) {
        this.$content = b, this.config = {
            flowItems: [],
            formItems: a.formItems,
            widgetsMap: a.widgetsMap,
            titleSuffix: a.titleSuffix,
            formLayout: a.formLayout || "grid-3",
            onSave: a.onSave
        }, this.showDesignView()
    }, a.extend(YS.FormDesign.prototype, {
        showDesignView: function () {
            this._renderContainer(), this._initWrapper(), this._initFormTitle(), this._initFormBtns(), this._initContent(), this._initFormConfig(), this.initLinkQuery(), this._bindEvent()
        }, initLinkQuery: function () {
            var a = this.config;
            $.each(a.widgetsMap, function (b, c) {
                var d = c.options;
                if (d.fieldPid && a.widgetsMap[d.fieldPid]) {
                    var opts = a.widgetsMap[d.fieldPid].options;
                    (opts.type == "bistable") && (c.options.isShowEditable = 1);
                    opts.linkWidgets && opts.linkWidgets.push(c);
                }
            });
        }, _renderContainer: function () {
            this.$content.append(this._getLeftContainer()).append(this._getRightContainer()).append(this._getCenterContainer())
        }, _getLeftContainer: function () {
            var b = [{type: "text", name: "单行文本"}, {type: "textarea", name: "多行文本"}, {
                type: "number",
                name: "数字"
            }, {type: "datetime", name: "日期时间"}, {type: "radiogroup", name: "单选按钮组"}, {
                type: "checkboxgroup",
                name: "复选框组"
            }, {type: "combo", name: "下拉框"}, {type: "combocheck", name: "下拉复选框"}, {
                type: "separator",
                name: "分割线"
            }], c = [{type: "address", name: "地址"}, {
                type: "upload",
                name: "文件上传"
            }, {type: "subform", name: "子表单"}], d = [{type: "user", name: "成员单选"}, {type: "usergroup", name: "成员多选"}, {
                type: "dept",
                name: "部门单选"
            }, {type: "deptgroup", name: "部门多选"}, {type: "deptadmin", name: "部门管理者信息"}, {
                type: "bistable",
                name: "底表数据"
            }, {type: "usermsg", name: "人员信息"},{type: "projectmsg", name: "幕墙项目编码"},{type: "projectmsg", name: "装饰项目编码"}

            ], e = '<div id ="fx-frame-west"><div class="frame-inner-list">';
            return e += this._getWidgetCateContent(b, "基础字段"), e += this._getWidgetCateContent(c, "增强字段"), e += this._getWidgetCateContent(d, "部门成员字段"), e += "</div></div>", a(e)
        }, _getWidgetCateContent: function (a, b) {
            var c = '<div class="widget-cate">' + b + "</div>";
            return c += "<ul>", YS.Utils.forEach(a, function (a, b) {
                c += '<li class="form-edit-widget-label" xtype="' + b.type + '"><a><i class="icon-widget-' + b.type + '"/><span>' + b.name + "</span></a></li>"
            }), c += "</ul>"
        }, _getRightContainer: function () {
            var b = '<div class="form-tab-select" id="fx-frame-east"><div class="config-tab"><div class="widget-tab">控件属性</div><div class="form-tab">表单属性</div></div><div class="config-content"><div id="widget-config-pane"/><div id="form-config-pane"/></div></div>';
            return a(b)
        }, _getCenterContainer: function () {
            var b = '<div class="fui-form" id="fx-frame-center"><div class="form-edit-title"/><form id="form-widget-list"><ul class="frame-inner-list"></ul><div class="form-empty"><div class="img"/><span>拖入左侧控件绘制表单</span></form></div></div>';
            return a(b)
        }, _initWrapper: function () {
            var b = this;
            this.$configPane = a("#widget-config-pane", this.$content), this.$widgetWrapper = a("#form-widget-list", this.$content).children("ul");
            var c = a("#fx-frame-west", this.$content).find("ul"), d = {};
            c.sortable({
                nested: !1,
                group: "no-drop",
                drop: !1,
                pullPlaceholder: !1,
                scroll: !0,
                exclude: ".subform-edit-widget-view",
                onDragStart: function (a, b, c, e) {
                    var f = a.offset(), g = b.rootGroup.pointer;
                    d = {
                        left: g.left - f.left,
                        top: g.top - f.top
                    }, b.options.drop || (a.clone().insertAfter(a), a.width(a.width()).appendTo("body")), c(a)
                },
                onDrag: function (a, b, c, e) {
                    a.hasClass("form-edit-widget-label") ? (b.left -= d.left, b.top -= d.top) : (b.left = 0, b.top -= d.top), c(a, b)
                },
                onDrop: function (a, c, d, e) {
                    if (d(a), a.hasClass("form-edit-widget-label")) {
                        if (c && c.options.drop) {
                            var f = 12, g = a.attr("xtype"), h = a.find("span").text();
                            "grid-2" === b.formLayout && b._isSupportGrid(g) && (f = 12),"grid-2" === b.formLayout ? (f = 6) : ("grid-3" === b.formLayout && (f = 4)),b._insertWidget(a, {
                                type: g,
                                labelName: h,
                                fieldContent: null,
                                fieldLineWidth: f
                            });

                        }
                        a.remove()
                    }
                },
                getScrollEl: function (a, b, c, d) {
                    return b.options.scroll ? null : b.el
                }
            }), this.$widgetWrapper.sortable({group: "no-drop"}), this.$widgetWrapper.click(function (c) {
                var d = a(c.target), e = d.closest("li");
                if (d.hasClass("icon-widget-delete")) {
                    var f = e.data("widget");
                    if (!YS.Utils.isValueWidget(f.getWidgetType())) return void b._doWidgetRemove(e);
                    YS.Msg.bubble({
                        anchor: d,
                        contentHTML: a('<div class="delete-confirm-info"/>').text("若删除该控件，其对应的表单数据也会被清除。确定删除？"),
                        dockPosition: "right",
                        type: "error",
                        text4Ok: "删除",
                        onOk: function () {
                            b._doWidgetRemove(e)
                        }
                    })
                } else if (d.hasClass("icon-widget-copy")) {
                    var g = a.extend(!0, {}, e.data("widget").getOptions());
                    g.fieldId = YS.Utils.createWidgetName(), g.labelName = e.find(".label-title").text(), g.fieldContent = e.find(".fl-description").data("description"), g.fieldLineWidth = e.data("fieldLineWidth");
                    "subform" === g.type && YS.Utils.forEach(g.items, function (a, b) {
                        b.fieldId = YS.Utils.createWidgetName()
                    });
                    b._insertWidget(e, g)
                } else e.length > 0 && b._setWidgetSelect(e)
            })
        }, _insertWidget: function (a, e) {
            var b = a.data("widget"), f = this._appendWidget(e), _this = this;
            f.hide().insertAfter(a).fadeIn();
            if (b && (b.options.type == "bistable" || b.options.type == "usermsg" || b.options.type == "projectmsg" || b.options.type == "deptadmin")) {
                b.options.linkWidgets.push(f.data("widget"));
                this._setWidgetSelect(a);
            }
            return f;
        }, _doWidgetRemove: function (b) {
            var c = this, opt = b.data("widget").options, items = c.collectItems();
            if (opt.linkWidgets && opt.linkWidgets.length > 0) {
                $.each(opt.linkWidgets, function (i, wg) {
                    var f = wg.element.closest("li.widget-view");
                    f[0] && c._doWidgetRemove(f);
                });
            }
            b.fadeOut(function () {
                if (c.$configPane.empty(), b.hasClass("widget-select")) {
                    var d = b.next();
                    if (d && d.length > 0) c._setWidgetSelect(d); else {
                        var e = b.prev();
                        e && e.length > 0 && c._setWidgetSelect(e)
                    }
                }
                a(this).remove()
            });
        }, _initFormTitle: function () {
            var b = a(".form-edit-title", this.$content), c = this, d = this.config;
            version = version || "1.0";
            c.config.formName = title ? title : "";
            var e = a("<div />").append("<span class='label-title'><em class='cred'>*</em>表单名称：</span>").appendTo(b);

            var f = a("<input class='form-name' type='text' value='" + title + "' />").appendTo(e).bind("blur", function () {
                c.config.formName = $(this).val();
            });


            c.$suffix = a('<div class="title-suffix-box" />');

            // 表单名称后缀
            e.after(c.$suffix);

            // c.$suffix = a('<div class="title-suffix-box" />').appendTo(e);
            if (d.titleSuffix && d.titleSuffix.length > 0) {
                $.each(d.titleSuffix, function (i, name) {
                    c.$suffix.append("<span style='padding: 0 6px'>+</span>");
                    a('<span class="suffix-item">').text(name.labelName).appendTo(c.$suffix);
                });
            }
            var g = a("<div class='title-version-box' />").append("<span class='label-title'><em class='cred'>*</em>版本：</span>").appendTo(b);
            var h = a("<input class='form-version' type='text' value=" + version + " />").appendTo(g).bind("blur", function () {
                version = $(this).val();
            });
        }, _initFormBtns: function () {
            var b = a(".form-edit-title", this.$content), c = this;
            new YS.Button({
                renderEl: a('<div class="btn-preview"/>').appendTo(b),
                style: "blue",
                iconCls: "fa fa-eye",
                text: "预览",
                width: 80,
                height: 30,
                onClick: function () {
                    c.doPreview()
                }
            }), new YS.Button({
                renderEl: a('<div class="btn-save"/>').appendTo(b),
                style: "green",
                iconCls: "fa fa-save",
                text: "保存",
                width: 80,
                height: 30,
                onClick: function () {
                    c.doSave(2)
                }
            }), new YS.Button({
                renderEl: a('<div class="btn-save-draft"/>').appendTo(b),
                iconCls: "fa fa-save",
                text: "保存草稿",
                width: 100,
                height: 30,
                onClick: function () {
                    c.doSave(1)
                }
            })
        }, compareFormItems: function () {
            var a = this.collectItems(), b = this.config, c = b.formItems || [];
            if (a.length !== c.length) return !1;
            var d = !0;
            return YS.Utils.forEach(a, function (a, b) {
                var e = JSON.stringify(b), f = JSON.stringify(c[a]);
                if (e.length !== f.length) return d = !1, !1
            }), d
        }, _initContent: function () {
            var b = this, c = this.config;
            this.formItems = a.extend(!0, [], c.formItems),
            c.formItems && $.each(c.formItems, function (g, d) {
                d.fieldIsnull = d.fieldIsnull == 1 ? !0 : !1,
                    d.fieldIsAutoIncrement = d.fieldIsAutoIncrement == 1 ? !0 : !1,
                    d.fieldIswf = d.fieldIswf == 1 ? !0 : !1,
                    d.fieldIsOwer = d.fieldIsOwer == 1 ? !0 : !1,
                    d.fieldIsshow = d.fieldIsshow == 1 ? !0 : !1,
                    d.fieldEnable = d.fieldEnable == 1 ? !0 : !1,
                    d.fieldIssubmit = d.fieldIssubmit == 1 ? !0 : !1,
                    d.fieldIssubmitDept = d.fieldIssubmitDept == 1 ? !0 : !1,
                    d.fieldIsdel = d.fieldIsdel == 1 ? !0 : !1;
                b.formLayout = d.fieldLayout || "grid-3";
                var e = a.extend(!0, {}, d), f = b._appendWidget(e);
                c.widgetsMap[d.fieldId] = f.data("widget"), f.appendTo(b.$widgetWrapper);
            }), this.$widgetWrapper.addClass("loaded")
        }, _initFormConfig: function () {
            var _this = this;
            var b = this.config, c = b.content, d = [];
            c == null || (d = c.validators);
            var e = this;
            this.$submitValidator = a('<ul class="form-submit-validator cfg_content"/>');
            var f = {};
            f[YS.InvisibleSubmitRules.KEEP] = "控件被隐藏时，不改变该字段的原有值", f[YS.InvisibleSubmitRules.NULL] = "控件被隐藏时，该字段提交空值", f[YS.InvisibleSubmitRules.ALWAYS] = "控件的计算、提交逻辑，与没有隐藏时保持一致";
            var g = new YS.ConfigPane({
                renderEl: a("<div/>").appendTo(a("#form-config-pane").empty()),
                items: [{
                    label: "表单布局",
                    widget: {
                        type: "segment",
                        items: [{value: "normal", text: "单列"}, {value: "grid-2", text: "双列"}, {
                            value: "grid-3",
                            text: "三列"
                        }],
                        value: b.formLayout,
                        onAfterItemSelect: function () {
                            b.formLayout = this.getValue(),
                                e.resetLineWidth(),e._setWidgetSelect(null),e.$configPane.empty(),_this.changeContent();
                        }
                    },
                    splitLine: !0
                }, {
                    label: "隐藏控件赋值",
                    tooltip: a("<span/>").text("对表单中需要隐藏的控件根据业务需要设置被隐藏控件的值的处理方式"),
                    widget: {
                        type: "combo",
                        searchable: !1,
                        fieldIsnull: !1,
                        valueField: "value",
                        items: [{value: YS.InvisibleSubmitRules.KEEP, text: "保持原值"}, {
                            value: YS.InvisibleSubmitRules.NULL,
                            text: "空值"
                        }, {value: YS.InvisibleSubmitRules.ALWAYS, text: "始终重新计算"}],
                        value: e.submitRule,
                        onAfterItemSelect: function () {
                            e.submitRule = this.getValue(), g.getWidgetByName("submitRuleTip").setValue(f[e.submitRule])
                        }
                    }
                }, {
                    widget: {
                        type: "label",
                        customCls: "submit-rules-tip",
                        fieldId: "submitRuleTip",
                        text: f[e.submitRule]
                    }
                }]
            })
        }, _bindEvent: function () {
            var b = this;
            this.$east = a("#fx-frame-east");
            var c = this.$east.find(".widget-tab"), d = this.$east.find(".form-tab");
            c.click(function () {
                b.tab2WidgetConfig()
            }), d.click(function () {
                b.tab2FormConfig()
            })
        }, tab2WidgetConfig: function () {
            this.$east.removeClass("form-tab-select")
        }, tab2FormConfig: function () {
            this.$east.addClass("form-tab-select")
        }, changeContent:function(){
                var b = this, c = this.config;
                var la = this.collectItems(!0);
                this.formItems = a.extend(!0, [], la),
                    $("ul.frame-inner-list").empty(),
                b.formItems && $.each(la, function (g, d) {
                    d.fieldIsnull = d.fieldIsnull == 1 ? !0 : !1,
                        d.fieldIsAutoIncrement = d.fieldIsAutoIncrement == 1 ? !0 : !1,
                        d.fieldIswf = d.fieldIswf == 1 ? !0 : !1,
                        d.fieldIsOwer = d.fieldIsOwer == 1 ? !0 : !1,
                        d.fieldIsshow = d.fieldIsshow == 1 ? !0 : !1,
                        d.fieldEnable = d.fieldEnable == 1 ? !0 : !1,
                        d.fieldIssubmit = d.fieldIssubmit == 1 ? !0 : !1,
                        d.fieldIssubmitDept = d.fieldIssubmitDept == 1 ? !0 : !1,
                        d.fieldIsdel = d.fieldIsdel == 1 ? !0 : !1;
                    b.formLayout = d.fieldLayout || "grid-2";
                    var e = a.extend(!0, {}, d), f = b._appendWidget(e);
                    c.widgetsMap[d.fieldId] = f.data("widget"), f.appendTo(b.$widgetWrapper);
                }), this.$widgetWrapper.addClass("loaded");
        }, doPreview: function () {
            var b = this.config,
                c = a('<div class="x-window-mask modal light"/>').css({"z-index": YS.STATIC.zIndex++}).appendTo("body").addClass("fadein"),
                d = this.collectItems(!0);
            new YS.Form({
                renderEl: a('<div class="x-shadow-content"/>').appendTo(c),
                title: b.formName,
                submitUrl: null,
                items: d,
                layout: b.formLayout,
                height: "100%",
                hasFooter: !1,
                formId: b.formId,
                mode: "preview",
                onAfterCancel: function () {
                    YS.UI.closePopover(), c.addClass("fadeout"), setTimeout(function () {
                        c.remove()
                    }, 150)
                }
            })
        },
        checkFieldName:function (arr){
            var obj = {}, repeat = '';
            for(var i = 0; i< arr.length; i++){
                if(!obj[arr[i]]){
                    obj[arr[i]] = 1;
                }else{
                    repeat = arr[i];
                    break;
                }
            }
            return repeat;
        },

        saveValidate:function(e, d){
            var validFlag = true;
            if (!e) {
                YS.Msg.toast({
                    type: "error",
                    msg: "表单名称不能为空!"
                });
                return;
            } else if (!version) {
                YS.Msg.toast({
                    type: "error",
                    msg: "版本号不能为空!"
                });
                return;
            }

            // 验证字段名的有效性
            var fieldNameArr = [];
            var fieldTextObj = {};
            var checkFieldNameFlag = true;
            // 将默认隐藏字段加入数组中
            $.each(defaultFieldArrs, function (i, o) {
                o.fieldName&&fieldNameArr.push(o.fieldName),fieldTextObj[''+o.fieldName+'']=o;
            });
            // 将页面显示的字段加入数组中
            $.each(d, function (i, o) {
                var reg2 = /(^_([a-zA-Z0-9]_?)*$)|(^[a-zA-Z](_?[a-zA-Z0-9])*_?$)/;
                if (!reg2.test(o.fieldName)){
                    checkFieldNameFlag = false;
                    var msg = "字段【"+o.labelName+"】：“"+o.fieldName+"”格式不正确；提示：【首位可以是字母以及下划线。首位之后可以是字母，数字以及下划线。下划线后不能接下划线】";
                    YS.Msg.toast({
                        type: "error",
                        msg: msg
                    });
                    validFlag = false;
                    return false;
                }
                o.fieldName&&fieldNameArr.push(o.fieldName),fieldTextObj[''+o.fieldName+'']=o;
            });
            // 判断字段全名规则是否正确
            if(!checkFieldNameFlag){
                return;
            }

            var fName = this.checkFieldName(fieldNameArr);

            if(fName){
                YS.Msg.toast({
                    type: "error",
                    msg: "字段【"+fieldTextObj[fName].labelName+"】的属性名【"+fName+"】重复，请修改！"
                });
                validFlag = false;
                return;
            }
            return validFlag;
        },

        doSave: function (formStatus) {
            var b = this, c = this.config, d = b.collectItems(!0), e = b.config.formName;
            var subformItems = [], subNumber = 0;
            $.each(d, function (i, item) {
                var itemValue = item.value;
                if (item.type == "subform" && item.items && item.items.length > 0) {
                    item.fieldOrderno = i + subformItems.length;
                    $.each(item.items, function (j, itm) {
                        itm.fieldType = "text";
                        !$.isEmptyObject(itemValue) && (item.items[j].fieldDefaultValue = itemValue[itm.fieldId]);
                        item.items[j].fieldOrderno = i + subformItems.length + j + 1;
                    });
                    delete item.fieldDefaultValue;
                    subformItems = subformItems.concat(item.items);
                } else {
                    item.value && (d[i].fieldDefaultValue = item.value);
                    item.fieldOrderno = i + subformItems.length;
                }
            });
            d = d.concat(subformItems);
            if(!this.saveValidate(e, d)){
                return;
            }

            mask();
            var url = basePath + '/flow/form/form_item/save?sessionId=' + _jsSessionId + "&id=" + formInfoId;
            $.ajax({
                url: url,
                type: "POST",
                data: {
                    "data": JSON.stringify(d),
                    "name": b.config.formName,
                    "categoryId": categoryId,
                    "version": version,
                    "formStatus": formStatus
                },
                dataType: "JSON",
                success: function (d) {
                    unmask();
                    var formMainTabs = parent.mini.get('jsFormMainTabs');
                    if (d.code == 100) {
                        YS.Msg.toast({
                            type: "success",
                            msg: "保存成功!"
                        }), YS.Utils.applyFunc(b, c.onSave, [d], !1), a.extend(c, {formItems: d.items});

                        formMainTabs.updateTab(formMainTabs.getTab(1), {
                            enabled:true
                        });
                        formMainTabs.updateTab(formMainTabs.getTab(2), {
                            enabled:true
                        });
                        var _opt = '';
                        formInfoId = d.data.formInfoId;

                        // 更新第二个页签，流程图编辑页面
                        formMainTabs.updateTab(formMainTabs.getTab(1), {
                            url : basePath + "/index.html#/editor/"+d.data.modelId+"?sessionId=" + _jsSessionId + "&formInfoId=" + d.data.formInfoId + "&modelId=" + d.data.modelId + "&opt=" + _opt,
                            enabled:(d.data.modelId)?true:false
                        });
                        // 更新第三个页签，流程基本信息
                        formMainTabs.updateTab(formMainTabs.getTab(2), {
                            url : basePath + "/flow/form/form_info/flowInfoUI?sessionId=" + _jsSessionId + "&formInfoId=" + d.data.formInfoId + "&modelId=" + d.data.modelId + "&name=" + d.data.modelName + "&formType=1"
                        });
                        if(title && title != b.config.formName){
                            // 判断是否修改的表单名称，如果修改了，刷新流程模板的页签
                            formMainTabs.reloadTab (formMainTabs.getTab(1));
                        }
                    } else {
                        YS.Msg.toast({
                            type: "error",
                            msg: d.msg
                        });
                    }
                }, error:function(e){
                    unmask();
                    YS.Msg.toast({
                        type: "error",
                        msg: '网络异常，请稍后重试！'
                    });
                }
            });
        }, _getSubmitValidator: function () {
            var b = [];
            return this.$submitValidator ? (YS.Utils.forEach(this.$submitValidator.children("li"), function (c, d) {
                var e = a(d).data("formula");
                YS.Utils.isEmpty(e) || b.push({formula: e, remind: a(d).data("remind")})
            }), b) : b
        }, collectItems: function (b) {
            var c = [], g = this;
            a.each(this.$widgetWrapper.children("li.widget-view"), function (d, e) {
                var f = a(e).data("widget"), i = f.getOptions();
                i.value && (i.fieldDefaultValue = i.value), i.fieldOrderno = d, i.fieldLayout = g.config.formLayout, c.push(b ? a.extend(!0, {}, i) : i);
            });
            return c
        }, resetLineWidth: function () {
            var b = this, c = 12, d = this.config;
            "grid-2" === d.formLayout ? (c = 6) : ("grid-3" === d.formLayout && (c = 4));
            YS.Utils.forEach(this.$widgetWrapper.children("li"), function (h, e) {
                var f = a(e).data("widget"), g = a(e).data("fieldLineWidth") != 12;
                f.options.fieldLayout = d.formLayout;
                f.options.fieldLineWidth = c;
                g && (a(e).data("fieldLineWidth", c), f.options.fieldLineWidth = c);
            })
        }, _isSupportGrid: function (a) {
            return "separator" !== a
        }, getNextItems: function (a) {
            var b, c = [];
            do {
                a = a.next(".widget-view", this.$widgetWrapper), b = a.data("widget");
                var d = a.find(".label-title").text();
                if (b) {
                    var e = b.getOptions();
                    c.push({widget: e, labelName: d})
                }
            } while (b);
            return c
        }, showWidgetConfigPane: function (b, c, d, e, f) {
            if (this.tab2WidgetConfig(), this.$configPane.empty(), e) {
                var g = a("<div/>").appendTo(this.$configPane);
                this.configPane = new YS.ConfigPane({
                    renderEl: g,
                    items: e.getConfigItems(b, c, d)
                }), f && f.length > 0 && (a('<div class="cfg_split"/>').prependTo(g), a('<div class="x-btn style-blue subconfig-back"/>').text("完成").click(function () {
                    f.click()
                }).prependTo(g)), g.show()
            }
        }, _setWidgetSelect: function (b) {
            if (a("li.widget-select", this.$widgetWrapper).removeClass("widget-select"), b && b.length > 0) {
                b.addClass("widget-select");
                var c = b.data("widget"), d = b.find(".label-title"), e = b.find(".fl-description");
                this.showWidgetConfigPane(d, e, b, c);
            }
        }, _getWidgetEditConfig: function (b) {
            var c = {fieldEnable: !0, fieldIsshow: !0};
            switch (b) {
                case"user":
                case"usergroup":
                case"dept":
                case"deptgroup":
                    a.extend(c, {dynamicType: "set"})
            }
            return c
        }, _appendWidget: function (e) {
            var f = e.fieldIsshow !== !1, g = e.fieldEnable !== !1,
                h = YS.createWidget(a.extend({}, e, this._getWidgetEditConfig(e.type)));
            h.options.fieldIsshow = f, h.options.fieldEnable = g;
            var i = h.getEditViewWithLabel(e.labelName, e.fieldContent, e.type ,e.fieldLineWidth);
            return i.data("widget", h), i.data("fieldLineWidth", e.fieldLineWidth), i
        }, getAllEntryList: function () {
            return YS.FormUtils.getAllEntryList(this.config)
        }, getFieldLabelMap: function () {
            return this.labelMap || (this.labelMap = {}), this._addFieldLabel2Map(this.getAllEntryList(), this.labelMap), this.labelMap
        }, _addFieldLabel2Map: function (e, t) {
            var i = this.config;
            YS.Utils.forEach(e, function (e, n) {
                YS.Utils.forEach(n.fields, function (e, i) {
                    if ("subform" === i.type) YS.Utils.forEach(i.items, function (e, n) {
                        var s = ["$", n.name, "#"].join("");
                        t[s] = i.text + "." + n.text
                    }); else {
                        var n = ["$", i.name, "#"].join("");
                        t[n] = i.text
                    }
                })
            })
        }, resetFormConfig: function () {
            this._initFormConfig(), this.tab2FormConfig()
        }
    })
}(jQuery);