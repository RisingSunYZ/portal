<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>列表页面</title>
    <#include "/inc/include.ftl" />
    <script src="${basePath}/a/js/modules/basedata/area.js" type="text/javascript"></script>
    <script>
        $(function () {
        Area.list.init();
        });
    </script>
</head>
<body>
<div class="search-box">
    <form id="jsSearchForm" onsubmit="return false">
        <div name="searchPanel" class="mini-splitter container-fluid" style="width:100%;height:44px;" handlerSize="0"
             allowResize="false">
            <div style="border:none;" showCollapseButton="false">
                <div class="row s-form-items">
                    <!-- 搜索条件 -->
                    <div class="col-sm-5">
                        <div class="search-item">
                            <input id="jsKeyword" name="keyWord" labelField="true" label="名称/标识" class="mini-textbox" emptyText="关键字"
                                   style="width:100%"/>
                        </div>
                    </div>
                    <!-- 搜索按钮 -->
                    <div class="col-sm-3">
                        <div class="s-btn-group">
                            <a class="mini-button" iconCls="fa fa-search" id="doSearchBtn">查询</a>
                           <#-- <a class="mini-button do-reset-btn" iconCls="fa fa-rotate-left" id="doResetBtn">重置</a>-->
                        </div>
                    </div>
                </div>
            </div>
            <div cls="s-btn-box" style="border:none;" showCollapseButton="false" size="180"></div>
        </div>
    </form>
</div>
<div class="mini-fit">
    <div id="jsTreeGrid" class="mini-treegrid" style="height:100%;"
         url="${basePath}/flow/basedata/area/ajaxList" showTreeIcon="true"
         treeColumn="name" idField="code" parentField="pcode" resultAsTree="false"
         allowResize="false" expandOnLoad="false"
    >
        <div property="columns">
            <div name="name" field="name" width="120" headerAlign="left"
                 align="left">名称</div>
            <div field="code" width="120" headerAlign="left"
            align="left">编码</div>
            <div field="pcode" width="120" headerAlign="left"
            align="left">父编码</div>
        </div>
    </div>



</div>
</body>
</html>