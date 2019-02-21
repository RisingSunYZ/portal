<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>部门管理页面</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <#include "/inc/include.ftl" />
    <script src="${basePath}/a/js/modules/basedata/dic_type_list.js" type="text/javascript"></script>
    <script>
        $(function () {
            dicType.input.init();
        });
    </script>
</head>
<body>
<div class="mini-panel mini-fit cust-panel"  showFooter="true" footerStyle="padding:5px;" showHeader="false" style="width:100%;height:100%;">
    <form id="jsMainForm">
        <input class="mini-hidden" type="hidden" name="id" id="id" />
        <input class="mini-hidden" type="hidden" name="pid" id="pid" />
        <table style="width:90%;padding:10px 25px 0px 0px;">
            <tr>
                <td align="right">名称：<span class="cred">*</span></td>
                <td><input id="name" name="name" errorMode="border" class="mini-textbox form" required="true" requiredErrorText="名称不能为空！" emptyText="请输入名称" style="width:100%;" /></td>
            </tr>
            <tr>
                <td align="right">编码：<span class="cred">*</span></td>
                <td><input id="code" name="code" errorMode="border" class="mini-textbox form" required="true" emptyText="请输入编码" onvalidation="dicType.list.uniqueCode" style="width:100%;" /></td>
            </tr>
            <tr>
                <td align="right">排序号：</td>
                <td><input id="sort" name="sort" errorMode="border" class="mini-textbox form" vtype="int" emptyText="请输入排序号" style="width:100%;" /></td>
            </tr>
        </table>
    </form>

    <!--footer-->
    <div property="footer" style="text-align:center;">
        <a class="mini-button blue" iconCls="fa fa-save" id="jsSave">确认</a>
        <a class="mini-button" iconCls="fa fa-close" id="jsCancel" >关闭</a>
    </div>
</div>

</body>
</html>
