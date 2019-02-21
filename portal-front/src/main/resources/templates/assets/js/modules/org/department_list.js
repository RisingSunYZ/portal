var Department = {
	list:{
		grid:null,
		tree:null,
		companyId:null,
		init:function(){
			mini.parse();
            this.searchForm = new mini.Form('jsSearchForm');
			this.grid = mini.get("jsTreeGrid");
			this.tree = mini.get("companyTree");
            this.bindEvent();
		},
		bindEvent:function(){
			var _this = this;
			$('#jsAdd').click(function(){
                var node = _this.tree.getSelectedNode();
                if(node == undefined){
                    showWarn("请选择公司！")
                    return ;
                }
				 _this.add();
			});
			
			$('#jsEdit').click(function(){
				_this.edit();
			});
			$('#jsSync').click(function(){
				_this.syncData();
			});
			$('#jsSpread').click(function(){
				_this.spreadItem();
			});
			$('#jsMerge').click(function(){
				_this.mergeItem();
			});
			
			$('#jsDel').click(function(){
                _this.remove();
            });


            // 查询
            $('#doSearchBtn').click(function () {
                _this.searchModule();
            });
            // 搜索框注册回车事件
            _this.searchForm.el.addEventListener('keypress', function (e) {
                // 回车键事件
                if(e.which == 13) {
                    _this.searchModule();
                }
            });

/*
            _this.searchForm.el.addEventListener('keypress', function (e) {
                // 回车键事件
                if(e.which == 13) {
                	alert("vbdshvbhj")
                    //_this.searchModule();
                }
            });


            var _keyText = mini.get("#jsKeyword");
            _keyText.on("enter", function (e) {
                var key = _keyText.getValue();
                _this.searchModule(key);
            }, this);
            $('#doSearchBtn').click(function(){
                var key = _keyText.getValue();
                _this.searchModule(key);
            });*/
		},

        searchModule:function(key){
            var _keyText = mini.get("#jsKeyword");
            key = _keyText.getValue();
            var _this = this;
            var selectedSystem = _this.tree.getSelectedNode();
            if(selectedSystem){
                var key = key.toLowerCase();
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
                }else{

                }
            }else{
                _this.doSearch()
			}
        },
		selectNode:function () {
            var node = this.tree.getSelectedNode();
            this.companyId = node.id;
            this.grid.load(basePath+"/org/department/ajaxList?companyId="+this.companyId);

        },
		openIpt:function(id,pid){
			var _this = this;
			var title = id?"编辑":"添加";
		    mini.open({
		        allowResize: false,
		        url: basePath+"/org/department/input?companyId="+this.companyId+"&pid="+pid,
		        allowResize:true,
		        title: title,
		        width: 550, height: 400,
		        onload: function () {
		        	if(id!=null || id!=undefined) {
                        var row = _this.grid.getRowById(id)
                        var iframe = this.getIFrameEl();
                        iframe.contentWindow.Department.input.form.setData(row);
                    }
		        },
		        ondestroy: function (action) {
		        	_this.grid.reload();
		        }
		    });
		},
		/**
		 * 添加
		 */
		add: function() {
		    this.openIpt();
		},
		add2:function (pid) {
            this.openIpt(null,pid);
        },
		/**
		 * 操作列格式化
		 * @returns {string}
		 */
        onOptRenderer:function (r) {
            var row = r.record;
            pid = "'"+row.id+"'";
            var html = '<span><i class="fa fa-plus" onclick="Department.list.add2('+pid+')"></i></span>';
            return html;
        },

        /**
         * 合并菜单
         */
        spreadItem:function(){
        	//var treeData = mini.get("#deptTreegrid");
            this.grid.expandAll ()
        },

       /**
        * 展开菜单
        */

        mergeItem:function(){
        	//var treeData = mini.get("#deptTreegrid");
           this.grid.collapseAll ()
        },
        /**
		 * 同步数据
		 */
		syncData:function(){
			var _this = this
			mini.confirm("同步数据？", "确定？",
			        function (action) {
			            if (action == "ok") {
			            	$.GET({
			            		url:basePath+"/org/department/sync",
			            		success:function(dt){
                                    _this.grid.reload();
			            			showSuc("同步成功！");
			            		}
			            	});
			            }
			        }
			    );
		},

		/**
		 * 批量删除
		 */
		remove:function(id) {
			var _this = this;
		    var ids = [];
		    if(id){
		        ids.push(id);
		    }else{
		        $.each(_this.grid.getSelecteds(), function (i, o) {
		            ids.push(o.id);
		        });
		    }

		    if(ids.length<=0){
		        showWarn("请选择！")
		        return;
		    }
		    mini.confirm("确定删除记录？", "确定？",
		        function (action) {
		            if (action == "ok") {
		            	//判断是否存在子模块
                        $.POST({
							url:basePath+"/org/department/ajaxList",
                            data:{pid:ids.join(',')},
                            success:function(data){
                                if(data.length ==0) {
                                    $.POST({
                                        url:basePath+"/org/department/dels",
                                        data:{ids:ids.join(',')},
                                        success:function(data){
                                            if(data.code == '100') {
                                                _this.grid.reload();
                                                showSucTips("成功！")
                                            }else {
                                                showError("有子部门，请确认！")
                                            }
                                        }
                                    });
                                }else {
                                    showError("有子部门，请确认！")
                                }
                            }
                        });
		            }
		        }
		    );
		},
		/**
		 * 编辑
		 */
		edit:function (id) {
		    if(!id){
		        id = this.grid.getSelecteds().length>0?this.grid.getSelecteds()[0].id:'';
		    }
		    if (id) {
		    	this.openIpt(id,null);
		    } else {
		        showWarn("请选择！");
		    }
		},
		refreshDg: function(dg){
		    mini.get(dg).reload();
		},
		// 搜索
		doSearch: function(){
		    var params = $('#jsSearchForm').serializeJson();
			this.grid.load(params);
		},
        uniqueCode:function (e) {
            //判断sn的唯一性
            id = mini.get("#id").getValue();
            code = mini.get("#code").getValue();
            if (code == "" || code == null) {
                e.errorText = "编码不能为空";
                e.isValid = false;
			}else {
                $.POST({
                    url: basePath+"/org/department/checkCode",
                    data: {id:id,code:code},
                    async:false,
                    success: function (data) {
                        if(data.code == '101') {
                            e.errorText = "编码不能重复";
                            e.isValid = false;
                        }
                    }});
            }
        }
	},
	input:{
		form:null,
		init:function(){
			mini.parse();
	        this.form = new mini.Form("jsInputForm");
            var cpid = getQueryString("companyId");
            mini.get('companyId').setValue(cpid);
            var pid = getQueryString("pid");
            mini.get('pid').setValue(pid);
	        this.bindEvent();
		},
		doSave:function(){
			var _this = this;
			var o = this.form.getData();
			this.form.validate();
            if (this.form.isValid() == false) return;
            mask('正在保存...');
            var url = o.id==""?basePath+"/org/department/insert":basePath+"/org/department/update";
            $.POST({
            	url: url,
                data: o,
                cache: false,
                success: function (text) {
                	_this.form.unmask();
                    _this.CloseWindow("save");
                },
                error: function (jqXHR, textStatus, errorThrown) {
                	_this.form.unmask();
                    showError("<b>网络异常</b> <br/>请稍后重试！")
                }
            });
		},
		CloseWindow:function(action) {
            if (action == "cancel" && this.form.isChanged()) {
                if (confirm("数据被修改了，是否先保存？")) {
                    return false;
                }
            }
            if (window.CloseOwnerWindow) return window.CloseOwnerWindow(action);
            else window.close();
        },
		bindEvent:function(){
			var _this = this;
			$('#jsSave').click(function(){
				_this.doSave();
			});
			$('#jsCancel').click(function(){
				_this.CloseWindow("cancel");
			});
		}
	}
};
