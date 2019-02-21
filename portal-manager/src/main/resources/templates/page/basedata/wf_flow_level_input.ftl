<#--<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
   <#include "/inc/include.ftl" />
</head>
<body>-->
<#--<script src="${basePath}/a/js/modules/basedata/wf_flow_level_list.js" type="text/javascript"></script>-->
<script>
    $(function () {
        // wfFlowLevel.input.init();
    });
</script>
<div id="editWindow" class="mini-window" title="Window" style="width:950px; height:500px;display:none;"
     showModal="true" allowResize="true" allowDrag="true">
<div id="jsFlowLevelInput" class="mini-panel mini-fit cust-panel"  showFooter="true" footerStyle="padding:5px;" showHeader="false" style="width:100%;height:100%;">
    <form id="jsMainForm">
        <input class="mini-hidden" type="hidden" name="id" id="id" />
        <table style="width:90%;padding:10px 25px 0px 0px;">
            <tr>
                <td align="right">发起部门：<span class="cred">*</span></td>
                <td>
                    <input class="mini-hidden" type="hidden" name="threeDeptId" id="threeDeptId" />
                    <input  class="mini-buttonedit" style="width: 100%" name="threeDeptName" id="threeDeptName" showClose="true" required="true" oncloseclick="wfFlowLevel.input.onCloseClick" allowInput="false" onbuttonclick="wfFlowLevel.input.orgSelector('threeDeptId','threeDeptName')"/>
                </td>
                <td align="right">序号：</td>
                <td>
                    <input  class="mini-textbox form" style="width: 100%" name="flowlevelCode" id="flowlevelCode"  emptyText="系统自动生成" readonly="true"/>
                </td>
            </tr>
            <tr>
                <td align="right">发起单位：<span class="cred">*</span></td>
                <td>
                    <input class="mini-hidden" type="hidden" name="startDeptId" id="startDeptId" />
                    <input  class="mini-buttonedit" style="width: 100%"  name="startDeptName" id="startDeptName" showClose="true" required="true" data-options="{orgType:2}" oncloseclick="wfFlowLevel.input.onCloseClick" allowInput="false"  onbuttonclick="wfFlowLevel.input.orgSelector('startDeptId','startDeptName')"/>
                </td>
                <td align="right">一级部门：</td>
                <td>
                    <input class="mini-hidden" type="hidden" name="oneDeptId" id="oneDeptId" />
                    <input  class="mini-buttonedit" style="width: 100%" name="oneDeptName" id="oneDeptName" allowInput="false" showClose="true"   oncloseclick="wfFlowLevel.input.onCloseClick" allowInput="false" onbuttonclick="wfFlowLevel.input.orgSelector('oneDeptId','oneDeptName')"/>
                </td>
            </tr>
            <tr>
                <td align="right">上级部门：</td>
                <td>
                    <input class="mini-hidden" type="hidden" name="twoDeptId" id="twoDeptId" />
                    <input  class="mini-buttonedit" style="width: 100%" name="twoDeptName" id="twoDeptName" allowInput="false"  showClose="true"  oncloseclick="wfFlowLevel.input.onCloseClick" onbuttonclick="wfFlowLevel.input.orgSelector('twoDeptId','twoDeptName')"/>
                </td>
                <td align="right">部门负责人：<span class="cred">*</span></td>
                <td>
                    <input class="mini-hidden" type="hidden" name="deptHeaderCode" id="deptHeaderCode" />
                    <input  class="mini-buttonedit" style="width: 100%" name="deptHeaderName" id="deptHeaderName" allowInput="false"  required="true" data-options="{multiSelect:true}" showClose="true" oncloseclick="wfFlowLevel.input.onCloseClick" onbuttonclick="wfFlowLevel.input.userSelector('deptHeaderCode','deptHeaderName')"/>
                </td>
            </tr>
            <tr>
                <td align="right">区域公司一级部门负责人：</td>
                <td>
                    <input class="mini-hidden" type="hidden" name="areaOneCode" id="areaOneCode" />
                    <input  class="mini-buttonedit" style="width: 100%" name="areaOneName" id="areaOneName" allowInput="false"  data-options="{multiSelect:true}" showClose="true" oncloseclick="wfFlowLevel.input.onCloseClick" onbuttonclick="wfFlowLevel.input.userSelector('areaOneCode','areaOneName')"/>
                </td>
                <td align="right">区域副总：</td>
                <td>
                    <input class="mini-hidden" type="hidden" name="areaDeputyCode" id="areaDeputyCode" />
                    <input  class="mini-buttonedit" style="width: 100%" name="areaDeputyName" id="areaDeputyName" allowInput="false"  data-options="{multiSelect:true}" showClose="true" oncloseclick="wfFlowLevel.input.onCloseClick" onbuttonclick="wfFlowLevel.input.userSelector('areaDeputyCode','areaDeputyName')"/>
                </td>
            </tr>
            <tr>
                <td align="right">区域总经理：</td>
                <td>
                    <input class="mini-hidden" type="hidden" name="areaHeaderCode" id="areaHeaderCode" />
                    <input  class="mini-buttonedit" style="width: 100%" name="areaHeaderName" id="areaHeaderName" allowInput="false"  data-options="{multiSelect:true}" showClose="true" oncloseclick="wfFlowLevel.input.onCloseClick"  onbuttonclick="wfFlowLevel.input.userSelector('areaHeaderCode','areaHeaderName')"/>
                </td>
                <td align="right">中心副总：</td>
                <td>
                    <input class="mini-hidden" type="hidden" name="centerdeputyHeaderCode" id="centerdeputyHeaderCode" />
                    <input  class="mini-buttonedit" style="width: 100%" name="centerdeputyHeaderName" id="centerdeputyHeaderName" allowInput="false"  data-options="{multiSelect:true}" showClose="true" oncloseclick="wfFlowLevel.input.onCloseClick"  onbuttonclick="wfFlowLevel.input.userSelector('centerdeputyHeaderCode','centerdeputyHeaderName')"/>
                </td>
            </tr>
            <tr>
                <td align="right">中心总经理：</td>
                <td>
                    <input class="mini-hidden" type="hidden" name="centerHeaderCode" id="centerHeaderCode" />
                    <input  class="mini-buttonedit" style="width: 100%" name="centerHeaderName" id="centerHeaderName" allowInput="false" showClose="true"  data-options="{multiSelect:true}" oncloseclick="wfFlowLevel.input.onCloseClick" onbuttonclick="wfFlowLevel.input.userSelector('centerHeaderCode','centerHeaderName')"/>
                </td>
                <td align="right">集团分管领导：</td>
                <td>
                    <input class="mini-hidden" type="hidden" name="groupLeaderCode" id="groupLeaderCode" />
                    <input  class="mini-buttonedit" style="width: 100%" name="groupLeaderName" id="groupLeaderName" allowInput="false"  showClose="true"  data-options="{multiSelect:true}" oncloseclick="wfFlowLevel.input.onCloseClick" onbuttonclick="wfFlowLevel.input.userSelector('groupLeaderCode','groupLeaderName')"/>
                </td>
            </tr>
            <tr>
                <td align="right">单位总经理：</td>
                <td>
                    <input class="mini-hidden" type="hidden" name="companyHeaderCode" id="companyHeaderCode" />
                    <input  class="mini-buttonedit" style="width: 100%" name="companyHeaderName" id="companyHeaderName" allowInput="false"  showClose="true" data-options="{multiSelect:true}" oncloseclick="wfFlowLevel.input.onCloseClick" onbuttonclick="wfFlowLevel.input.userSelector('companyHeaderCode','companyHeaderName')"/>
                </td>
            </tr>

        </table>
    </form>

    <!--footer-->
    <div property="footer" style="text-align:center;">
        <a class="mini-button blue" iconCls="fa fa-save" id="jsSave">确认</a>
        <a class="mini-button" iconCls="fa fa-close" id="jsCancel" >关闭</a>
    </div>
</div>
</div>
<#--
</body>
</html>
-->
