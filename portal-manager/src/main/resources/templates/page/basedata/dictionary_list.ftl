<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>部门管理页面</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
    <#include "/inc/include.ftl" />
    <script src="${basePath}/a/js/modules/basedata/dictionary_list.js"></script>
    <script>
        $(function () {
            Dictionary.list.init();
        });
    </script>
    <style>
        body {
            height: 100%;
            width: 100%;
            padding: 0;
            margin: 0;
        }

        .mini-splitter .title {
            height: 32px;
            line-height: 32px;
            border-bottom: 1px solid #ddd;
            margin: 0;
            color: #666;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-weight: bold;
            padding-left: 9px;
            font-family: 微软雅黑, 宋体, Arial, Helvetica, Verdana, sans-serif;
        }

    </style>
</head>
<body>
<div class="mini-fit">
    <div class="mini-splitter" style="width:100%;height:100%;">


        <div size="15%" showCollapseButton="true" style="border:none">
            <div class="mini-panel" title="数据字典类型列表" style="width:100%;height:100%;padding:5px;" >
                <ul id="DicTree" class="mini-tree" url="${basePath}/basedata/dic_type/getAll"
                    style="width:100%;padding:5px;"
                    showTreeIcon="false" allowAlternating="true" textField="name" idField="id" value="base"
                    expandOnDblClick="true"
                    resultAsTree="false" showTreeLines="true" expandOnLoad="true"
                    onnodeclick="Dictionary.list.selectNode()">
                </ul>
            </div>
        </div>

        <div showCollapseButton="true" style="border:none;" class="mini-splitter" >
            <div size="20%" showCollapseButton="true" style="padding:5px;">

                <div class="title">数据字典列表</div>
                <div class="mini-fit">

                    <div class="mini-toolbar">
                    <#--<a plain="true" class="mini-button" id="jsSync" iconCls="fa-refresh">同步数据</a>-->
                        <a plain="true" class="permission-0  mini-button first" id="jsDicAdd"
                           iconCls="fa fa-plus">添加</a>
                        <a plain="true" class="permission-2  mini-button" iconCls="fa fa-pencil-square-o"
                           id="jsDicEdit">编辑</a>
                        <a plain="true" class="permission-3  mini-button last" iconCls="fa fa-trash-o"
                           id="jsDicDel">删除</a>
                    </div>
                    <div class="search-box">
                        <form onsubmit="return false;" id="jsDicSearchForm">
                            <div name="searchPanel" class="mini-splitter container-fluid search-panel"
                                 style="width:100%;height:44px;" handlerSize="0" allowResize="false">
                                <div style="border:none;" showCollapseButton="false">
                                    <div class="row s-form-items">
                                        <div class="col-sm-8">
                                            <div class="search-item">
                                                <input id="keyWord" labelField="true" label="名称/编码" name="keyWord"
                                                       class="mini-textbox" emptyText="请输入名称/编码" style="width:100%"/>
                                            </div>
                                        </div>

                                        <div class="col-sm-4">
                                            <div class="s-btn-group">
                                                <a plain="" class="mini-button" iconCls="fa fa-search"
                                                   id="doDicSearchBtn">查询</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div cls="s-btn-box" style="border:none;" showCollapseButton="false" size="180">
                                    <!--<div class="s-btn-group">
                                        <a plain="" class="mini-button" iconCls="icon-search" id="doSearchBtn">查询</a>
                                        <a plain="true" class="mini-button" iconCls="icon-undo" id="doResetBtn">重置</a>
                                    </div>-->
                                    <a class="fold-btn more-btn" expand="0" href="javascript:void(0);"><i
                                            class="fa fa-caret-down"></i></a>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div class="mini-fit">
                        <!--字典列表-->
                        <div id="jsDicDataGrid"
                             ajaxOptions='{async:true}'
                             class="mini-datagrid"
                             style="width:100%;height:100%;"
                             url="${basePath}/basedata/dictionary/ajaxList"
                             allowUnselect="true"
                             allowAlternating="true"
                             idField="id"
                             pageSize="20"
                             sizeList="[10,20,30,40,50,60]"
                             showTreeLines="true" expandOnLoad="true">
                            <div property="columns">
                                <div type="indexcolumn" width="20"></div>
                                <div field="cname" width="200">名称</div>
                                <div field="ename" width="80">英文缩写</div>
                                <div field="code" width="80">编码</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div size="30%" showCollapseButton="true" style="padding:5px;">
                <div class="title">数据字典项列表</div>
                <div class="mini-fit">
                    <div class="mini-toolbar">
                    <#--<a plain="true" class="mini-button" id="jsSync" iconCls="fa-refresh">同步数据</a>-->
                        <a plain="true" class="permission-0  mini-button first" id="jsItemAdd"
                           iconCls="fa fa-plus">添加</a>
                        <a plain="true" class="permission-2  mini-button" iconCls="fa fa-pencil-square-o"
                           id="jsItemEdit">编辑</a>
                        <a plain="true" class="permission-3  mini-button last" iconCls="fa fa-trash-o"
                           id="jsItemDel">删除</a>
                    </div>
                    <div class="search-box">
                        <form onsubmit="return false;" id="jsItemSearchForm">
                            <div name="searchPanel" class="mini-splitter container-fluid search-panel"
                                 style="width:100%;height:44px;" handlerSize="0" allowResize="false">
                                <div style="border:none;" showCollapseButton="false">
                                    <div class="row s-form-items">
                                        <div class="col-sm-8">
                                            <div class="search-item">
                                                <input id="keyWord" labelField="true" label="名称/编码/英文名" name="keyWord"
                                                       class="mini-textbox" emptyText="请输入名称/编码/英文名" style="width:100%"/>
                                            </div>
                                        </div>

                                        <div class="col-sm-3">
                                            <div class="s-btn-group">
                                                <a plain="" class="mini-button" iconCls="fa fa-search"
                                                   id="doItemSearchBtn">查询</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div cls="s-btn-box" style="border:none;" showCollapseButton="false" size="180">
                                    <!--<div class="s-btn-group">
                                        <a plain="" class="mini-button" iconCls="icon-search" id="doSearchBtn">查询</a>
                                        <a plain="true" class="mini-button" iconCls="icon-undo" id="doResetBtn">重置</a>
                                    </div>-->
                                    <a class="fold-btn more-btn" expand="0" href="javascript:void(0);"><i
                                            class="fa fa-caret-down"></i></a>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div class="mini-fit">
                        <!--部门列表-->
                        <div id="jsItemDataGrid"
                             ajaxOptions='{async:true}'
                             class="mini-datagrid"
                             multiSelect="true"
                             allowUnselect="true"
                             allowAlternating="true"
                             style="width:100%;height:100%;"
                             url="${basePath}/basedata/dic_item/ajaxList"
                             allowAlternating="true"
                             idField="id"
                             pageSize="20"
                             sizeList="[10,20,30,40,50,60]"
                             showTreeLines="true" expandOnLoad="true">
                            <div property="columns">
                                <div type="indexcolumn" width="15"></div>
                                <div field="cname" width="200">名称</div>
                                <div field="ename" width="80">英文缩写</div>
                                <div field="code" width="80">code</div>
                                <div field="orderNo" width="50">排序号</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>