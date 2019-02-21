var managerIndex = {
    // 列表页面
    list:{
        grid:null,
        init:function(){
            mini.parse();
            this.bindEvent();
            this.getEarlyTime()
        },
        bindEvent:function(){
            var _this = this;
            //全量同步流程实例与流程任务
            $('#jsFullAdd').click(function(){
                _this.jsFullAddOpt();
            });
            //全量同步流程实例
            $('#jsGenIns').click(function(){
                _this.jsGenInsOpt();
            });
            //全量同步流程任务
            $('#jsGenTask').click(function(){
                _this.jsGenTaskOpt();
            });
            //增量生成
            $('#addIndex').click(function(){
                _this.addIndexOpt();
            });
            //根据businessKey重新生成实例与任务
            $('#addDocByKey').click(function(){
                _this.addDocByKeyOpt();
            });
            //根据businessKey删除生成实例与任务
            $('#delDocByKey').click(function(){
                _this.delDocByKeyOpt();
            });
            //根据流程实例id修改流程实例与任务状态
            $('#addDocByProcessInsId').click(function(){
                _this.addDocByProcessInsIdOpt();
            });
            //根据BusinessKey修改流程实例与任务状态
            $('#updateDocByKey').click(function(){
                _this.updateDocByKeyOpt();
            });
            //根据businessKey生成一条任务记录
            $('#createTaskDoc').click(function(){
                _this.createNewDocOpt();
            });
        },

        getEarlyTime:function(_type){
            $.GET({
                url:basePath+'/mongodb/mongodb_manager/get_early_time',
                data:{type:_type},
                dataType:"text",
                success:function(dt){
                    var t = mini.get("dumpTime");
                    t.setValue(dt);
                },

            });
        },
        getItemValue:function (e) {
            var select = mini.get("generatorType").getValue();

            this.getEarlyTime(select);

        },

        //全量
        jsFullAddOpt:function(){
            mini.confirm("确定要生成？", "确定？",
                function (action) {
                    if (action == "ok") {
                        mini.mask({
                            el: document.body,
                            cls: 'mini-mask-loading',
                            html: '全量生成中...'
                        });
                        $.GET({
                            url:basePath+'/mongodb/mongodb_manager/sync_all',
                            success:function(dt){
                                mini.unmask();
                                showSuc(dt.msg);
                            },
                            error: function (dt) {
                                mini.unmask();
                                showSuc(dt.msg)
                            }
                        });
                    }
                }
            );
        },

        //全量流程实例
        jsGenInsOpt:function(){
            mini.confirm("确定要生成？", "确定？",
                function (action) {
                    if (action == "ok") {
                        mini.mask({
                            el: document.body,
                            cls: 'mini-mask-loading',
                            html: '全量生成流程实例中...'
                        });
                        $.GET({
                            url:basePath+'/mongodb/mongodb_manager/sync_ins',
                            success:function(dt){
                                mini.unmask();
                                showSuc(dt.msg);
                            },
                            error: function (dt) {
                                mini.unmask();
                                showSuc(dt.msg);
                            }
                        });
                    }
                }
            );
        },

        //全量流程任务
        jsGenTaskOpt:function(){
            mini.confirm("确定要生成？", "确定？",
                function (action) {
                    if (action == "ok") {
                        mini.mask({
                            el: document.body,
                            cls: 'mini-mask-loading',
                            html: '全量生成流程任务中...'
                        });
                        $.GET({
                            url:basePath+'/mongodb/mongodb_manager/sync_task',
                            success:function(dt){
                                mini.unmask();
                                showSuc(dt.msg);
                            },
                            error: function (dt) {
                                mini.unmask();
                                showSuc(dt.msg);
                            }
                        });
                    }
                }
            );
        },
        //添加索引
        addIndexOpt:function(){
            mini.confirm("确定要生成？", "确定？",
                function (action) {
                    if (action == "ok") {
                        mini.mask({
                            el: document.body,
                            cls: 'mini-mask-loading',
                            html: '增量添加中...'
                        });
                        var params = $('#jsSearchForm').serializeJson();
                        $.GET({
                            url:basePath+'/mongodb/mongodb_manager/syncUpdateData',
                            data:params,
                            success:function(dt){
                                mini.unmask();
                                showSuc(dt.msg);
                            },
                            error: function (dt) {
                                mini.unmask();
                                showSuc(dt.msg);
                            }
                        });
                    }
                }
            );
        },
        //通过业务表单key生成文档
        addDocByKeyOpt:function(){
            var _form = new mini.Form('jsSearchEsForm');
            _form.validate();
            if (!_form.isValid()){
                return;
            }
            var params = $('#jsSearchEsForm').serializeJson();
            mini.confirm("确定要生成？", "确定？",
                function (action) {
                    if (action == "ok") {
                        mini.mask({
                            el: document.body,
                            cls: 'mini-mask-loading',
                            html: '根据表单key生成文档...'
                        });
                        $.GET({
                            url: basePath+'/mongodb/mongodb_manager/reCreateDocByBusinessKey',
                            data: params,
                            success: function (dt) {
                                mini.unmask();
                                showSuc(dt.msg);
                            },
                            error: function (dt) {
                                mini.unmask();
                                showSuc(dt.msg);
                            }
                        });
                    }
                }
            );

        },
        //通过业务表单key删除文档
        delDocByKeyOpt:function(){
            var _form = new mini.Form('jsSearchEsForm');
            _form.validate();
            if (!_form.isValid()){
                return;
            }
            var params = $('#jsSearchEsForm').serializeJson();
            mini.confirm("确定要删除？", "确定？",
                function (action) {
                    if (action == "ok") {
                        mini.mask({
                            el: document.body,
                            cls: 'mini-mask-loading',
                            html: '根据比表单key删除文档...'
                        });
                        $.GET({
                            url: basePath+'/mongodb/mongodb_manager/delDocByBusinessKey',
                            data: params,
                            success: function (dt) {
                                showSuc(dt.msg);
                                mini.unmask();
                            },
                            error: function (dt) {
                                showSuc(dt.msg);
                                mini.unmask();

                            }
                        });
                    }
                }
            );

        },
        addDocByProcessInsIdOpt:function(){
            var _form = new mini.Form('updateByInsIdForm');
            _form.validate();
            if (!_form.isValid()){
                return;
            }
            var params = $('#updateByInsIdForm').serializeJson();
            mini.confirm("确定要更新？", "确定？",
                function (action) {
                    if (action == "ok") {
                        mini.mask({
                            el: document.body,
                            cls: 'mini-mask-loading',
                            html: '根据流程实例Id更新状态...'
                        });
                        $.GET({
                            url: basePath+'/mongodb/mongodb_manager/updateProcessInsStatusByInsId',
                            data: params,
                            success: function (dt) {
                                showSuc(dt.msg);
                                mini.unmask();
                            },
                            error: function (dt) {
                                showSuc(dt.msg);
                                mini.unmask();

                            }
                        });
                    }
                }
            );
        },

        //通过流程实例ID生成一条任务记录
        createNewDocOpt:function(){
            var _form = new mini.Form('jsAddTaskForm');
            _form.validate();
            if (!_form.isValid()){
                return;
            }
            var params = $('#jsAddTaskForm').serializeJson();
            mini.confirm("确定要添加？", "确定？",
                function (action) {
                    if (action == "ok") {
                        mini.mask({
                            el: document.body,
                            cls: 'mini-mask-loading',
                            html: '添加一条任务成中...'
                        });
                        $.GET({
                            url: basePath+'/mongodb/mongodb_manager/insertTask',
                            data: params,
                            success: function (dt) {
                                showSuc(dt.msg);
                                mini.unmask();
                            },
                            error: function (dt) {
                                showSuc(dt.msg);
                                mini.unmask();

                            }
                        });
                    }
                }
            );

        },

        //通过业务表单key修改文档
        updateDocByKeyOpt:function(){
            var _form = new mini.Form('jsUpdateDocForm');
            _form.validate();
            if (!_form.isValid()){
                return;
            }
            var params = $('#jsUpdateDocForm').serializeJson();
            mini.confirm("确定要修改？", "确定？",
                function (action) {
                    if (action == "ok") {
                        mini.mask({
                            el: document.body,
                            cls: 'mini-mask-loading',
                            html: '根据表单key修改文档...'
                        });
                        $.GET({
                            url: basePath+'/mongodb/mongodb_manager/updateTaskByBusinessKey',
                            data: params,
                            success: function (dt) {
                                showSuc(dt.msg);
                                mini.unmask();

                            },
                            error: function (dt) {
                                showSuc(dt.msg);
                                mini.unmask();

                            }
                        });
                    }
                }
            );
        }
    }
};