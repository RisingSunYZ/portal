<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
   <#include "/inc/include.ftl" />
</head>
<body>
<script src="${basePath}/a/js/modules/basedata/flow_system_list.js" type="text/javascript"></script>
<script>
    $(function () {
        flowSystem.input.init();
    });
</script>
<div class="mini-panel mini-fit cust-panel"  showFooter="true" footerStyle="padding:5px;" showHeader="false" style="width:100%;height:100%;">
    <form id="jsMainForm" method="post" enctype="multipart/form-data">
        <input class="mini-hidden" type="hidden" name="id" id="id" />
        <table style="width:90%;padding:10px 25px 0px 0px;">
            <tr>
                <td align="right">名称：<span class="cred">*</span></td>
                <td><input name="name" errorMode="border" class="mini-textbox form" required="true" requiredErrorText="名称不能为空！" emptyText="请输入名称" style="width:100%;" /></td>
            </tr>
           <#-- <tr>
                <td align="right">图标：<span class="cred">*</span></td>
                <td>
                    <div style="display: inline-block;vertical-align: top;">
                        <input id="jsImgFile" type="hidden" class="mini-hidden" value="" name="image" />
                        <span class="img-box" style="text-align: center;display: inline-block;width: 32px;height: 32px;background: #1c304f;margin-right: 4px;">
                            <img id="jsFaviconPreview" src="" style="width:24px;height:24px;margin-top: 4px;" />
                        </span>
                    </div>
                    <a class="mini-button blue" iconCls="fa fa-upload" id="jsUploadFavicon">上传</a>
                    <span style="color:orange">（提示：建议上传尺寸为24px*24px的图片）</span>

                </td>
            </tr>-->
            <tr>
                <td align="right">标识：<span class="cred">*</span></td>
                <td><input id="sn" name="sn" errorMode="border" class="mini-textbox form" required="true" onvalidation="flowSystem.list.uniqueCode" emptyText="请输入标识" style="width:100%;" /></td>
            </tr>
            <tr>
                <td align="right">URL：<span class="cred">*</span></td>
                <td><input name="url" errorMode="border" required="true" vtype="url" class="mini-textbox form" emptyText="请输入URL" style="width:100%;" /></td>
            </tr>
            <tr>
                <td align="right" style="vertical-align:top;padding-top:8px;">描述：</td>
                <td><input name="note" class="mini-textarea form"  style="width:100%;height:80px;" /></td>
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
