<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>流程底表管理页面</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <#include "/inc/include.ftl" />
</head>
<body >
<script src="${basePath}/a/js/modules/basedata/wf_flow_level_list.js" type="text/javascript"></script>
<script>
    $(function () {
        wfFlowLevel.list.init();
        wfFlowLevel.input.init();
    });
</script>
<!-- 工具栏 -->
<div class="mini-toolbar" >
<#--    <a plain="true" class="mini-button" iconCls="fa-refresh" id="jsSync" >同步数据</a>-->
    <a plain="true" class="mini-button" id="jsAdd" iconCls="fa fa-plus" >添加</a>
    <a plain="true" class="mini-button" iconCls="fa fa-pencil-square-o" id="jsEdit" >编辑</a>
    <a plain="true" class="mini-button" iconCls="fa fa-trash-o" id="jsDel" >删除</a>
    <a plain="true" class="mini-button" iconCls="fa-toggle-off" id="jsPause" >禁用</a>
    <a plain="true" class="mini-button" iconCls="fa-toggle-on" id="jsPlay" >启用</a>
    <a plain="true" class="mini-button" iconCls="fa fa-download" id="jsExport" >导出</a>
</div>

<!-- 搜索栏 -->
<div class="search-box">
    <form id="jsSearchForm" onsubmit="return false;" >
        <div name="searchPanel" class="mini-splitter container-fluid search-panel" style="width:100%;height:44px;" handlerSize="0" allowResize="false" >
            <div style="border:none;" showCollapseButton="false" >
                <div class="row s-form-items">
                    <div class="col-sm-3">
                        <div class="search-item">
                            <input width="100%" class="mini-buttonedit" id="startDeptId" name="startDeptId" emptyText="提交单位" showClose="true" oncloseclick="wfFlowLevel.list.onCloseClick" allowInput="false"
                                   data-options='{orgType:2,multiSelect:false}'
                                   onbuttonclick="OrgSelectorWindow"
                            />
                        </div>
                    </div>

                    <div class="col-sm-3">
                        <div class="search-item">
                            <input width="100%" class="mini-buttonedit" id="deptIdsWorld" name="deptIdsWorld" emptyText="部门" showClose="true" oncloseclick="wfFlowLevel.list.onCloseClick" allowInput="false"
                                   data-options='{orgType:3,multiSelect:true}'
                                   onbuttonclick="OrgSelectorWindow"
                            />
                        </div>
                    </div>

                    <div class="col-sm-3">
                        <div class="search-item">
                            <input id="personWorld" name="personWorld" labelField="true" label="部门负责人" class="mini-textbox" emptyText="部门负责人" style="width:100%"/>
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
         showTreeIcon="true"
         url="${basePath}/basedata/wf_flow_level/ajaxList"
         pageSize="20"
         sizeList="[10,20,30,40,50,60]"
         dataField="data">
        <div property="columns">
            <div type="indexcolumn"  width="30"></div>
            <div type="checkcolumn" width="30"></div>
            <div field="opt" header="操作" name="opt" cellCls="tbl-columns-opt" readOnly="true" allowMove="false" headerAlign="center" width="50">操作</div>
            <div field="status" width="80" renderer="wfFlowLevel.list.onOptRenderer" align="center" headerAlign="center">状态</div>
            <div field="flowlevelCode" width="150">序号</div>
            <div field="startDeptName" width="150">单位名称</div>
            <div field="oneDeptName" width="150">一级部门</div>
            <div field="twoDeptName" width="150">上级部门</div>
            <div field="threeDeptName" width="150">提交部门</div>
            <div field="deptHeaderName" width="150">部门负责人</div>
            <div field="areaOneName" width="150">区域公司一级部门负责人</div>
            <div field="areaDeputyName" width="150">区域副总</div>
            <div field="areaHeaderName" width="150">区域总经理</div>
            <div field="centerdeputyHeaderName" width="150">中心副总</div>
            <div field="centerHeaderName" width="150">中心总经理</div>
            <div field="companyHeaderName" width="150">单位总经理</div>
            <div field="groupLeaderName" width="150">集团分管领导</div>
            <div field="createTime" dateFormat="yyyy-MM-dd" width="150">添加时间</div>
            <div field="updateTime" dateFormat="yyyy-MM-dd" width="150">更新时间</div>
            <div field="updator" width="150">更新人</div>
        </div>
    </div>
</div>



<!-- 输入页面 -->

<#include  'wf_flow_level_input.ftl'/>


<script>

</script>
</body>
</html>