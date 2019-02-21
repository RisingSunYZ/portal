<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>公司管理页面</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <#include "/inc/include.ftl" />
</head>
<body >
<script src="${basePath}/a/js/modules/basedata/flow_system_list.js" type="text/javascript"></script>
<script>
    $(function () {
        flowSystem.list.init();
    });
</script>
<!-- 工具栏 -->
<div class="mini-toolbar" >
    <a plain="true" class="mini-button" iconCls="fa-refresh" id="jsSync" >同步数据</a>
    <a plain="true" class="mini-button" id="jsAdd" iconCls="fa fa-plus" >添加</a>
    <a plain="true" class="mini-button" iconCls="fa fa-pencil-square-o" id="jsEdit" >编辑</a>
    <a plain="true" class="mini-button" iconCls="fa fa-trash-o" id="jsDel" >删除</a>
</div>

<!-- 搜索栏 -->
<div class="search-box">
    <form id="jsSearchForm" onsubmit="return false;" >
        <div name="searchPanel" class="mini-splitter container-fluid search-panel" style="width:100%;height:44px;" handlerSize="0" allowResize="false" >
            <div style="border:none;" showCollapseButton="false" >
                <div class="row s-form-items">
                    <div class="col-sm-3">
                        <div class="search-item">
                            <input id="keyWord" name="keyWord" labelField="true" label="名称/标识" class="mini-textbox" emptyText="请输入名称/标识" style="width:100%"/>
                        </div>
                    </div>

                    <div class="col-sm-3">
                        <div class="s-btn-group">
                            <a id="doSearchBtn" class="mini-button" iconCls="fa fa-search" >查询</a>
                            <!--<a class="mini-button" iconCls="fa fa-rotate-left" id="doResetBtn">重置</a>-->
                        </div>
                    </div>
                </div>
            </div>
            <div cls="s-btn-box" style="border:none;" showCollapseButton="false" size="180">
                <!--<div class="s-btn-group">
                    <a class="mini-button" iconCls="fa fa-search" id="doSearchBtn">查询</a>
                    <a class="mini-button" iconCls="fa fa-rotate-left" id="doResetBtn">重置</a>
                </div>-->
                <a class="fold-btn more-btn" expand="0" href="javascript:void(0);"><i class="fa fa-caret-down"></i></a>
            </div>
        </div>
    </form>
</div>


<!--撑满页面-->
<div class="mini-fit" style="height:100px;" >
    <div id="jsDataGrid" class="mini-datagrid" style="width:100%;height:100%;border:none;"
         multiSelect="true"
         idField="id"
         url="${basePath}/basedata/flow_system/ajaxList"
         pageSize="20"
         sizeList="[10,20,30,40,50,60]"
         dataField="data">
        <div property="columns">
            <div type="indexcolumn"  width="8"></div>
            <div type="checkcolumn" width="8"></div>
            <div field="opt" header="操作" name="opt" cellCls="tbl-columns-opt" readOnly="true" allowMove="false" headerAlign="center" width="50">操作</div>
            <#--<div field="image" renderer="flowSystem.list.imageRender" width="30" >图标</div>-->
            <div field="name" width="80" >名称</div>
            <div field="sn" width="60">标识</div>
            <div field="url" allowSort="true">url</div>
            <div field="note" allowSort="true">备注</div>
        </div>
    </div>
</div>

<script>

</script>
</body>
</html>