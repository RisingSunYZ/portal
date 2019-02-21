<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>数据字典管理</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <#include "/inc/include.ftl" />
</head>
<body >
<script src="${basePath}/a/js/modules/basedata/dic_type_list.js" type="text/javascript"></script>
<script>
    $(function () {
        dicType.list.init();
    });
</script>
<!-- 工具栏 -->
<div class="mini-toolbar">
    <a plain="true" class="permission-0  mini-button first" id="jsAdd" iconCls="fa fa-plus">添加</a>
    <a plain="true" class="permission-2  mini-button" iconCls="fa fa-pencil-square-o" id="jsEdit">编辑</a>
    <a plain="true" class="permission-3  mini-button last" iconCls="fa fa-trash-o" id="jsDel">删除</a>
    <a plain="true" class="mini-button" id="jsSpread" iconCls="fa-toggle-down">展开</a>
    <a plain="true" class="mini-button" id="jsMerge" iconCls="fa-toggle-up">合并</a>
</div>

<!-- 搜索栏 -->
<div class="search-box">
    <form id="jsSearchForm" onsubmit="return false;" >
        <div name="searchPanel" class="mini-splitter container-fluid search-panel" style="width:100%;height:44px;" handlerSize="0" allowResize="false" >
            <div style="border:none;" showCollapseButton="false" >
                <div class="row s-form-items">
                    <div class="col-sm-3">
                        <div class="search-item">
                            <input id="keyWord" name="keyWord" labelField="true" label="名称/编码" class="mini-textbox" emptyText="请输入名称/编码" style="width:100%"/>
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

<div class="mini-fit">
    <!--部门列表-->
    <div id="jsTreeGrid"
         ajaxOptions='{async:true}'
         class="mini-treegrid"
         style="width:100%;height:100%;"
         url="${basePath}/basedata/dic_type/ajaxList"
         showTreeIcon="true"
         allowAlternating="true"
         treeColumn="taskname"
         idField="id"
         parentField="pid"
         resultAsTree="false"
         pageSize="20"
         dataField="data"
         sizeList="[10,20,30,40,50,60]"
         showTreeLines="true" expandOnLoad="true">
        <div property="columns">
            <div type="indexcolumn" width="15"></div>
            <div field="opt" header="操作" name="opt" cellCls="tbl-columns-opt" readOnly="true" allowMove="false" headerAlign="center" width="60">操作</div>
            <div name="taskname" field="name" width="100">名称</div>
            <div field="code" width="100">编码</div>
            <div field="sort" width="80">排序号</div>
            <div field="updateTimeStr" width="80" dateFormat="yyyy-MM-dd">修改时间</div>
        </div>
    </div>


</div>



<script>

</script>
</body>
</html>