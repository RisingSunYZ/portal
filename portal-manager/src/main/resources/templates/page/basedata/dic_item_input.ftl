<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
   <#include "/inc/include.ftl" />
</head>
<body>
<script src="${basePath}/a/js/modules/basedata/dictionary_list.js"></script>
<script>
    $(function () {
        Dictionary.itemInput.init();
    });
</script>
<div class="mini-panel mini-fit cust-panel"  showFooter="true" footerStyle="padding:5px;" showHeader="false" style="width:100%;height:100%;">
    <form id="jsItemMainForm">
        <input class="mini-hidden" type="hidden" name="id" id="id" />
        <input class="mini-hidden" type="hidden" name="mainId" id="mainId" />
        <table style="width:90%;padding:10px 25px 0px 0px;">
            <tr>
                <td align="right">中文名称：<span class="cred">*</span></td>
                <td><input id="cname" name="cname" errorMode="border" class="mini-textbox form" required="true" requiredErrorText="名称不能为空！" emptyText="请输入名称" style="width:100%;" /></td>
            </tr>
            <tr>
                <td align="right">英文名称：<span class="cred">*</span></td>
                <td><input id="ename" name="ename" errorMode="border" class="mini-textbox form" required="true" requiredErrorText="名称不能为空！" emptyText="请输入名称" style="width:100%;" /></td>
            </tr>
            <tr>
                <td align="right">排序号：<span class="cred">*</span></td>
                <td><input id="orderNo" name="orderNo" errorMode="border" class="mini-textbox form" vtype="float" required="true" requiredErrorText="名称不能为空！" emptyText="请输入名称" style="width:100%;" /></td>
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
